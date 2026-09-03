import time
import json
import urllib.request

# Try importing serial for hardware connection
try:
    import serial
    import serial.tools.list_ports
    HAS_SERIAL = True
except ImportError:
    HAS_SERIAL = False

BACKEND_URL = "http://localhost:5000/api/vitals"

def post_vitals_to_backend(temp_c, hr_bpm, spo2_pct, source_label="USB Serial Hardware"):
    payload = {
        "temperature_c": temp_c,
        "heart_rate_bpm": hr_bpm,
        "spo2_percent": spo2_pct,
        "source": source_label
    }
    
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(BACKEND_URL, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            print(f"[{time.strftime('%H:%M:%S')}] Posted vitals: Temp={temp_c}°C, HR={hr_bpm} BPM, SpO2={spo2_pct}%")
    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] Failed to post to backend ({BACKEND_URL}): {e}")

def run_hardware_listener(port_name="COM3", baud_rate=9600):
    if not HAS_SERIAL:
        print("pyserial is not installed. Install with 'pip install pyserial' to connect real USB serial sensors.")
        return

    print(f"Listening on serial port {port_name} at {baud_rate} baud...")
    try:
        ser = serial.Serial(port_name, baud_rate, timeout=1)
        while True:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if line:
                try:
                    # Expecting CSV line: "37.2,84,98" (Temp, HR, SpO2) or JSON
                    if line.startswith('{'):
                        data = json.loads(line)
                        post_vitals_to_backend(
                            data.get('temp', 37.0),
                            data.get('hr', 72),
                            data.get('spo2', 98),
                            "USB Sensor (JSON)"
                        )
                    elif ',' in line:
                        parts = [float(x) for x in line.split(',')]
                        if len(parts) >= 3:
                            post_vitals_to_backend(parts[0], int(parts[1]), int(parts[2]), "USB Sensor (CSV)")
                except Exception as parse_err:
                    print("Parse error on line:", line, parse_err)
    except Exception as err:
        print(f"Serial port error: {err}")

if __name__ == '__main__':
    print("=== MediKiosk Hardware Serial Bridge ===")
    if HAS_SERIAL:
        ports = [p.device for p in serial.tools.list_ports.comports()]
        print("Available COM Ports:", ports)
        if ports:
            run_hardware_listener(ports[0])
        else:
            print("No active COM ports detected. Running dummy test loop...")
            while True:
                post_vitals_to_backend(37.4, 78, 98, "Dummy Test Bridge")
                time.sleep(3)
    else:
        print("Running fallback loop without pyserial...")
