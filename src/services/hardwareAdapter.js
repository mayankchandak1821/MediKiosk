/**
 * MediKiosk Hardware Abstraction Layer (HAL)
 * 
 * Supports:
 * 1. Native WebSerial API (for USB Serial sensors like Arduino, ESP32, USB Thermometers)
 * 2. Native WebHID API (for USB HID medical devices)
 * 3. Local REST / WebSocket Service Polling (for background Python/Node hardware scripts)
 * 4. Live Simulation Engine (for hackathon demo without physical hardware)
 */

class HardwareAdapter {
  constructor() {
    this.listeners = new Set();
    this.connectionState = 'disconnected'; // 'disconnected' | 'connecting' | 'connected' | 'simulating'
    this.activeSource = 'none'; // 'webserial' | 'webhid' | 'rest' | 'simulator'
    
    this.currentVitals = {
      temperature_c: 37.0,
      heart_rate_bpm: 72,
      spo2_percent: 98,
      respiratory_rate: 16,
      timestamp: new Date().toISOString(),
      source: 'Default'
    };

    this.serialPort = null;
    this.restPollInterval = null;
  }

  // Subscribe to real-time vitals updates
  subscribe(callback) {
    this.listeners.add(callback);
    // Send current vitals immediately
    callback(this.currentVitals, this.connectionState, this.activeSource);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const callback of this.listeners) {
      callback({ ...this.currentVitals, timestamp: new Date().toISOString() }, this.connectionState, this.activeSource);
    }
  }

  // Set Connection State
  setConnectionState(state, source) {
    this.connectionState = state;
    this.activeSource = source;
    this.notify();
  }

  // 1. Connect via WebSerial (USB Serial)
  async connectWebSerial() {
    if (!('serial' in navigator)) {
      throw new Error('WebSerial is not supported in this browser. Use Chrome or MS Edge.');
    }

    try {
      this.setConnectionState('connecting', 'webserial');
      this.serialPort = await navigator.serial.requestPort();
      await this.serialPort.open({ baudRate: 9600 });
      this.setConnectionState('connected', 'webserial');

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.serialPort.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      let buffer = '';
      (async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep partial line

            for (const line of lines) {
              this.parseSensorData(line);
            }
          }
        } catch (err) {
          console.error('WebSerial Read Error:', err);
        } finally {
          reader.releaseLock();
        }
      })();
    } catch (err) {
      this.setConnectionState('disconnected', 'none');
      throw err;
    }
  }

  // 2. Connect via WebHID (USB HID)
  async connectWebHID() {
    if (!('hid' in navigator)) {
      throw new Error('WebHID is not supported in this browser. Use Chrome or MS Edge.');
    }

    try {
      this.setConnectionState('connecting', 'webhid');
      const devices = await navigator.hid.requestDevice({ filters: [] });
      if (devices.length === 0) {
        this.setConnectionState('disconnected', 'none');
        return;
      }

      const device = devices[0];
      await device.open();
      this.setConnectionState('connected', 'webhid');

      device.addEventListener('inputreport', (event) => {
        const { data } = event;
        // Example buffer decoding for USB oximeter/thermometer
        const view = new DataView(data.buffer);
        if (data.byteLength >= 4) {
          const temp = view.getUint16(0, true) / 100.0;
          const heartRate = view.getUint8(2);
          const spo2 = view.getUint8(3);
          this.updateVitals({
            temperature_c: temp > 30 && temp < 45 ? temp : this.currentVitals.temperature_c,
            heart_rate_bpm: heartRate > 30 && heartRate < 220 ? heartRate : this.currentVitals.heart_rate_bpm,
            spo2_percent: spo2 > 50 && spo2 <= 100 ? spo2 : this.currentVitals.spo2_percent,
            source: 'WebHID Sensor'
          });
        }
      });
    } catch (err) {
      this.setConnectionState('disconnected', 'none');
      throw err;
    }
  }

  // 3. Connect via Local REST Service (e.g. http://localhost:5000/api/vitals)
  startLocalRestServicePolling(endpointUrl = 'http://localhost:5000/api/vitals', intervalMs = 2000) {
    this.stopPolling();
    this.setConnectionState('connecting', 'rest');

    const poll = async () => {
      try {
        const res = await fetch(endpointUrl);
        if (res.ok) {
          const data = await res.json();
          this.setConnectionState('connected', 'rest');
          this.updateVitals({
            temperature_c: data.temp_c || data.temperature_c || this.currentVitals.temperature_c,
            heart_rate_bpm: data.hr || data.heart_rate_bpm || this.currentVitals.heart_rate_bpm,
            spo2_percent: data.spo2 || data.spo2_percent || this.currentVitals.spo2_percent,
            source: 'Local Hardware REST API'
          });
        }
      } catch (err) {
        console.warn('Local REST polling failed:', err);
      }
    };

    poll();
    this.restPollInterval = setInterval(poll, intervalMs);
  }

  stopPolling() {
    if (this.restPollInterval) {
      clearInterval(this.restPollInterval);
      this.restPollInterval = null;
    }
  }

  // 4. Parse incoming CSV or JSON strings from hardware serial line
  parseSensorData(line) {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      if (trimmed.startsWith('{')) {
        const json = JSON.parse(trimmed);
        this.updateVitals({
          temperature_c: json.temp_c || json.temp || this.currentVitals.temperature_c,
          heart_rate_bpm: json.hr || json.heart_rate || this.currentVitals.heart_rate_bpm,
          spo2_percent: json.spo2 || json.spo2_percent || this.currentVitals.spo2_percent,
          source: 'USB Serial (JSON)'
        });
      } else if (trimmed.includes(',')) {
        // Format: TEMP,HR,SPO2 (e.g. "37.5,88,97")
        const parts = trimmed.split(',').map(p => parseFloat(p.trim()));
        if (parts.length >= 3) {
          this.updateVitals({
            temperature_c: parts[0],
            heart_rate_bpm: parts[1],
            spo2_percent: parts[2],
            source: 'USB Serial (CSV)'
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse serial line:', line, e);
    }
  }

  // Update vitals directly
  updateVitals(newVitals) {
    this.currentVitals = {
      ...this.currentVitals,
      ...newVitals,
      timestamp: new Date().toISOString()
    };
    this.notify();
  }

  // Preset Vitals Injection for Hackathon Demonstration
  injectPreset(presetName) {
    this.stopPolling();
    this.setConnectionState('simulating', 'simulator');

    switch (presetName) {
      case 'NORMAL':
        this.updateVitals({
          temperature_c: 36.8,
          heart_rate_bpm: 72,
          spo2_percent: 99,
          respiratory_rate: 16,
          source: 'Simulator (Normal Vitals)'
        });
        break;
      case 'HIGH_FEVER':
        this.updateVitals({
          temperature_c: 39.4,
          heart_rate_bpm: 110,
          spo2_percent: 96,
          respiratory_rate: 22,
          source: 'Simulator (High Fever Alert)'
        });
        break;
      case 'HYPOXIA_RED_FLAG':
        this.updateVitals({
          temperature_c: 38.1,
          heart_rate_bpm: 124,
          spo2_percent: 87, // Red flag!
          respiratory_rate: 28,
          source: 'Simulator (Hypoxia Red-Flag Critical)'
        });
        break;
      case 'TACHYCARDIA':
        this.updateVitals({
          temperature_c: 37.2,
          heart_rate_bpm: 145,
          spo2_percent: 95,
          respiratory_rate: 20,
          source: 'Simulator (Tachycardia)'
        });
        break;
      default:
        break;
    }
  }
}

export const hardwareAdapter = new HardwareAdapter();
