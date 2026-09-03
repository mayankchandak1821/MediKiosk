import React, { useState } from 'react';
import { X, Cpu, Usb, Radio, Zap, AlertTriangle, CheckCircle2, Sliders, Play } from 'lucide-react';
import { hardwareAdapter } from '../services/hardwareAdapter';

export default function HardwareSimulator({ isOpen, onClose, connectionState, activeSource, currentVitals }) {
  const [tempInput, setTempInput] = useState(currentVitals.temperature_c);
  const [spo2Input, setSpo2Input] = useState(currentVitals.spo2_percent);
  const [hrInput, setHrInput] = useState(currentVitals.heart_rate_bpm);
  const [restUrl, setRestUrl] = useState('http://localhost:5000/api/vitals');

  if (!isOpen) return null;

  const handleWebSerial = async () => {
    try {
      await hardwareAdapter.connectWebSerial();
    } catch (e) {
      alert(`WebSerial Connection Error: ${e.message}`);
    }
  };

  const handleWebHID = async () => {
    try {
      await hardwareAdapter.connectWebHID();
    } catch (e) {
      alert(`WebHID Connection Error: ${e.message}`);
    }
  };

  const handleRestConnect = () => {
    hardwareAdapter.startLocalRestServicePolling(restUrl);
  };

  const handleApplySliders = () => {
    hardwareAdapter.stopPolling();
    hardwareAdapter.setConnectionState('simulating', 'manual_slider');
    hardwareAdapter.updateVitals({
      temperature_c: parseFloat(tempInput),
      spo2_percent: parseInt(spo2Input, 10),
      heart_rate_bpm: parseInt(hrInput, 10),
      source: 'Custom Hardware Slider'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">Hardware Abstraction & Sensor Bridge</h2>
              <p className="text-xs text-slate-400">Attach real USB/Serial sensors or run live simulations for demonstration.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Status Header */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Active Hardware Mode</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${connectionState === 'connected' ? 'bg-emerald-400 animate-ping' : connectionState === 'simulating' ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                <span className="font-bold text-sm text-slate-200">
                  {connectionState === 'connected' ? `Connected (${activeSource.toUpperCase()})` : connectionState === 'simulating' ? `Simulator Active (${activeSource})` : 'Standby Mode'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-slate-500 block">Temperature</span>
                <span className="text-amber-400 font-bold text-sm">{currentVitals.temperature_c}°C</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">SpO2</span>
                <span className="text-cyan-400 font-bold text-sm">{currentVitals.spo2_percent}%</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Heart Rate</span>
                <span className="text-rose-400 font-bold text-sm">{currentVitals.heart_rate_bpm} BPM</span>
              </div>
            </div>
          </div>

          {/* Section 1: Real Hardware Attachment */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Usb className="w-4 h-4 text-teal-400" /> Option 1: Attach Physical Hardware Peripherals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleWebSerial}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-teal-500/50 hover:bg-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-200 group-hover:text-teal-300">WebSerial (USB COM Port)</span>
                  <Usb className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
                </div>
                <p className="text-xs text-slate-400">Connect Arduino, ESP32, or USB Serial medical sensor (9600 baud).</p>
              </button>

              <button
                onClick={handleWebHID}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-teal-500/50 hover:bg-slate-800 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-200 group-hover:text-teal-300">WebHID (USB Medical HID)</span>
                  <Radio className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
                </div>
                <p className="text-xs text-slate-400">Connect plug-and-play USB HID oximeter or thermometer.</p>
              </button>
            </div>

            {/* REST Service Polling */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-slate-400 font-medium block mb-1">Local Python/Node Driver REST Endpoint</label>
                <input
                  type="text"
                  value={restUrl}
                  onChange={(e) => setRestUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>
              <button
                onClick={handleRestConnect}
                className="self-end px-4 py-2 bg-teal-500/20 border border-teal-500/40 hover:bg-teal-500/30 text-teal-300 text-xs font-bold rounded-lg transition-colors"
              >
                Start Polling REST API
              </button>
            </div>
          </div>

          {/* Section 2: Hackathon Presets Injection */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Option 2: Live Hackathon Presets (Instant Simulation)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => hardwareAdapter.injectPreset('NORMAL')}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal Vitals
                </div>
                <p className="text-[11px] text-slate-400">36.8°C | 99% SpO2 | 72 BPM</p>
              </button>

              <button
                onClick={() => hardwareAdapter.injectPreset('HIGH_FEVER')}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Fever
                </div>
                <p className="text-[11px] text-slate-400">39.4°C (103°F) | 110 BPM</p>
              </button>

              <button
                onClick={() => hardwareAdapter.injectPreset('HYPOXIA_RED_FLAG')}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Hypoxia Red-Flag
                </div>
                <p className="text-[11px] text-slate-400">87% SpO2 (Critical) | 124 BPM</p>
              </button>

              <button
                onClick={() => hardwareAdapter.injectPreset('TACHYCARDIA')}
                className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs mb-1">
                  <Zap className="w-3.5 h-3.5" /> Tachycardia
                </div>
                <p className="text-[11px] text-slate-400">145 BPM | 37.2°C</p>
              </button>
            </div>
          </div>

          {/* Section 3: Fine-tuned Sliders */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Manual Custom Vitals Sliders
              </h4>
              <button
                onClick={handleApplySliders}
                className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-cyan-400 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Apply Sliders
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Body Temp</span>
                  <span className="font-mono text-amber-400 font-bold">{tempInput}°C</span>
                </div>
                <input
                  type="range"
                  min="35.0"
                  max="42.0"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Oxygen (SpO2)</span>
                  <span className="font-mono text-cyan-400 font-bold">{spo2Input}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="100"
                  step="1"
                  value={spo2Input}
                  onChange={(e) => setSpo2Input(e.target.value)}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Heart Rate</span>
                  <span className="font-mono text-rose-400 font-bold">{hrInput} BPM</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  step="1"
                  value={hrInput}
                  onChange={(e) => setHrInput(e.target.value)}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
