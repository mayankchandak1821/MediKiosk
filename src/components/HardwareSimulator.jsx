import React, { useState } from 'react';
import { X, Activity, Sliders, Play, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { hardwareAdapter } from '../services/hardwareAdapter';

export default function HardwareSimulator({ isOpen, onClose, currentVitals }) {
  const [tempInput, setTempInput] = useState(currentVitals.temperature_c);
  const [spo2Input, setSpo2Input] = useState(currentVitals.spo2_percent);
  const [hrInput, setHrInput] = useState(currentVitals.heart_rate_bpm);

  if (!isOpen) return null;

  const handleApplySliders = () => {
    hardwareAdapter.stopPolling();
    hardwareAdapter.setConnectionState('simulating', 'manual_slider');
    hardwareAdapter.updateVitals({
      temperature_c: parseFloat(tempInput),
      spo2_percent: parseInt(spo2Input, 10),
      heart_rate_bpm: parseInt(hrInput, 10),
      source: 'Customized Vitals'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-[#E2DCBE] text-[#142618] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2DCBE] flex items-center justify-between bg-[#FFFDF1]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#59C749]/15 text-[#2B8A1E]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#142618]">Customize Patient Vitals</h2>
              <p className="text-xs text-[#526857]">Adjust temperature, oxygen (SpO2), and heart rate parameters for intake evaluation.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#526857] hover:text-[#142618] hover:bg-[#F7F4E1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Current Live Vitals Display */}
          <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-between">
            <span className="text-xs text-[#526857] uppercase font-bold">Live Vitals Readout</span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-[#526857] block">Temperature</span>
                <span className="text-amber-800 font-bold text-sm">{currentVitals.temperature_c}°C</span>
              </div>
              <div className="text-right">
                <span className="text-[#526857] block">SpO2</span>
                <span className="text-[#2B8A1E] font-bold text-sm">{currentVitals.spo2_percent}%</span>
              </div>
              <div className="text-right">
                <span className="text-[#526857] block">Heart Rate</span>
                <span className="text-rose-700 font-bold text-sm">{currentVitals.heart_rate_bpm} BPM</span>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <h3 className="text-xs font-bold text-[#526857] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#59C749]" /> Instant Vitals Presets
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => hardwareAdapter.injectPreset('NORMAL')}
                className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] hover:border-[#59C749] text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[#2B8A1E] font-bold text-xs mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal
                </div>
                <p className="text-[11px] text-[#526857]">36.8°C | 99% | 72 BPM</p>
              </button>

              <button
                onClick={() => hardwareAdapter.injectPreset('HIGH_FEVER')}
                className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] hover:border-amber-400 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Fever
                </div>
                <p className="text-[11px] text-[#526857]">39.4°C | 110 BPM</p>
              </button>

              <button
                onClick={() => hardwareAdapter.injectPreset('HYPOXIA_RED_FLAG')}
                className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] hover:border-rose-400 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Hypoxia
                </div>
                <p className="text-[11px] text-[#526857]">87% SpO2 | 124 BPM</p>
              </button>

              <button
                onClick={() => hardwareAdapter.injectPreset('TACHYCARDIA')}
                className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] hover:border-purple-400 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs mb-1">
                  <Zap className="w-3.5 h-3.5" /> Tachycardia
                </div>
                <p className="text-[11px] text-[#526857]">145 BPM | 37.2°C</p>
              </button>
            </div>
          </div>

          {/* Sliders Customizer */}
          <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#142618] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#59C749]" /> Custom Vitals Controls
              </h4>
              <button
                onClick={handleApplySliders}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#59C749] hover:bg-[#4EBD3E] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Apply Vitals
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#526857]">Body Temp</span>
                  <span className="font-mono text-amber-800 font-bold">{tempInput}°C</span>
                </div>
                <input
                  type="range"
                  min="35.0"
                  max="42.0"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  className="w-full accent-[#59C749] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#526857]">Oxygen (SpO2)</span>
                  <span className="font-mono text-[#2B8A1E] font-bold">{spo2Input}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="100"
                  step="1"
                  value={spo2Input}
                  onChange={(e) => setSpo2Input(e.target.value)}
                  className="w-full accent-[#59C749] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#526857]">Heart Rate</span>
                  <span className="font-mono text-rose-700 font-bold">{hrInput} BPM</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  step="1"
                  value={hrInput}
                  onChange={(e) => setHrInput(e.target.value)}
                  className="w-full accent-[#59C749] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E2DCBE] bg-[#FFFDF1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-[#F7F4E1] text-[#142618] border border-[#E2DCBE] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
