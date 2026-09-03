import React from 'react';
import { Activity, Stethoscope, Cpu, Globe, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  activeView, 
  setActiveView, 
  language, 
  setLanguage, 
  connectionState, 
  activeSource, 
  currentVitals,
  openHardwareModal
}) {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' }
  ];

  const getStatusBadge = () => {
    if (connectionState === 'connected') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Hardware: {activeSource.toUpperCase()}
        </span>
      );
    }
    if (connectionState === 'simulating') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full">
          <Cpu className="w-3.5 h-3.5" />
          Hardware: SIMULATOR
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
        <Activity className="w-3.5 h-3.5" />
        Hardware: STANDBY
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-bold">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              MediKiosk <span className="text-teal-400 text-xs px-2 py-0.5 rounded border border-teal-500/30 bg-teal-500/10">SIH26047</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">AI Clinical Intake & Vitals Platform (Ministry of Ayush / AIIA)</p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setActiveView('kiosk')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeView === 'kiosk'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Patient Kiosk Interface
        </button>
        <button
          onClick={() => setActiveView('doctor')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeView === 'doctor'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Doctor OPD Dashboard
        </button>
      </div>

      {/* Right Controls: Vitals Bar, Language, Hardware Toggle */}
      <div className="flex items-center gap-3">
        {/* Quick Vitals Readout */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <span className="text-rose-400 flex items-center gap-1">
            ❤️ {currentVitals.heart_rate_bpm} <span className="text-[10px] text-slate-500">BPM</span>
          </span>
          <span className="text-cyan-400 flex items-center gap-1">
            🫁 {currentVitals.spo2_percent}% <span className="text-[10px] text-slate-500">SpO2</span>
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            🌡️ {currentVitals.temperature_c}°C <span className="text-[10px] text-slate-500">Temp</span>
          </span>
        </div>

        {/* Hardware Status Button */}
        <button
          onClick={openHardwareModal}
          className="hover:opacity-90 transition-opacity cursor-pointer"
          title="Configure Hardware Connection & Sensor Simulation"
        >
          {getStatusBadge()}
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
