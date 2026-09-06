import React from 'react';
import { Activity, Stethoscope, Globe, ShieldCheck, Sliders, User, LogOut, Key } from 'lucide-react';

export default function Header({ 
  activeRole, 
  currentUser,
  language, 
  setLanguage, 
  currentVitals,
  openHardwareModal,
  onOpenLogin
}) {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'mr', name: 'मরাठी (Marathi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' }
  ];

  const getRoleBadge = () => {
    if (activeRole === 'login') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-full">
          <Key className="w-3.5 h-3.5" /> Portal Sign In
        </span>
      );
    }
    if (activeRole === 'patient') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-full">
          <User className="w-3.5 h-3.5" /> Patient: {currentUser?.name || 'Rajesh Verma'}
        </span>
      );
    }
    if (activeRole === 'doctor') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-full">
          <Stethoscope className="w-3.5 h-3.5" /> Doctor OPD Portal
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-full">
        <ShieldCheck className="w-3.5 h-3.5" /> System Admin Portal
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
              MediKiosk
            </h1>
            {getRoleBadge()}
          </div>
          <p className="text-xs text-slate-400 font-medium">AI Clinical Intake & Vitals Platform (Ministry of Ayush / AIIA)</p>
        </div>
      </div>

      {/* Right Controls: Vitals Bar, Language, Vitals Modal, Login / Switch Role Button */}
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

        {/* Vitals Modal Trigger Button */}
        <button
          onClick={openHardwareModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-full hover:bg-teal-500/20 transition-all cursor-pointer"
          title="Customize Vitals Parameters"
        >
          <Sliders className="w-3.5 h-3.5" />
          Vitals
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

        {/* Switch Role / Login Portal Button */}
        {activeRole !== 'login' && (
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors shadow"
          >
            <LogOut className="w-3.5 h-3.5 text-teal-400" />
            <span>Switch Role / Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
