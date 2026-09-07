import React from 'react';
import { Activity, Stethoscope, Globe, ShieldCheck, Sliders, User, LogOut, Key, Home } from 'lucide-react';

export default function Header({ 
  activeRole, 
  currentUser,
  language, 
  setLanguage, 
  currentVitals,
  openHardwareModal,
  onOpenLogin,
  onNavigate
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
        <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-2 font-medium">
          <Key className="w-3.5 h-3.5 text-teal-400" /> Portal Sign In
        </span>
      );
    }
    if (activeRole === 'patient') {
      return (
        <span className="text-xs text-slate-300 flex items-center gap-1.5 ml-2 font-medium">
          <User className="w-3.5 h-3.5 text-emerald-400" /> Patient: {currentUser?.name || 'Rajesh Verma'}
        </span>
      );
    }
    if (activeRole === 'doctor') {
      return (
        <span className="text-xs text-slate-300 flex items-center gap-1.5 ml-2 font-medium">
          <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> Doctor OPD Portal
        </span>
      );
    }
    return (
      <span className="text-xs text-slate-300 flex items-center gap-1.5 ml-2 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> System Admin
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Brand Identity (Clickable to return to Landing Page) */}
      <div 
        onClick={() => onNavigate ? onNavigate('/') : setActiveRole('landing')}
        className="flex items-center gap-3 cursor-pointer group"
        title="Return to MediKiosk Landing Page"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#59C749] to-teal-400 flex items-center justify-center shadow-lg shadow-[#59C749]/20 text-slate-950 font-bold group-hover:scale-105 transition-transform">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-teal-300 transition-colors">
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
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              import('i18next').then(i18nModule => {
                i18nModule.default.changeLanguage(newLang);
              });
            }}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation between Doctor OPD and Patient Kiosk */}
        {activeRole === 'patient' && (
          <button
            onClick={() => onNavigate ? onNavigate('/doctor') : setActiveRole('doctor')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#59C749]" />
            <span>Doctor OPD Queue</span>
          </button>
        )}

        {activeRole === 'doctor' && (
          <button
            onClick={() => onNavigate ? onNavigate('/patient') : setActiveRole('patient')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-[#59C749]" />
            <span>Patient Intake</span>
          </button>
        )}

        {/* Return to Portal Home Button */}
        <button
          onClick={() => onNavigate ? onNavigate('/') : setActiveRole('landing')}
          className="px-3 py-1.5 bg-[#59C749]/10 hover:bg-[#59C749]/20 text-[#59C749] text-xs font-semibold rounded-lg border border-[#59C749]/30 flex items-center gap-1.5 transition-colors"
          title="Return to Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Portal Home</span>
        </button>
      </div>
    </header>
  );
}
