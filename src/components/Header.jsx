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
        <span className="text-xs text-[#526857] flex items-center gap-1.5 ml-2 font-medium">
          <Key className="w-3.5 h-3.5 text-[#59C749]" /> Portal Sign In
        </span>
      );
    }
    if (activeRole === 'patient') {
      return (
        <span className="text-xs text-[#2C5B32] flex items-center gap-1.5 ml-2 font-medium">
          <User className="w-3.5 h-3.5 text-[#59C749]" /> Patient: {currentUser?.name || 'Rajesh Verma'}
        </span>
      );
    }
    if (activeRole === 'doctor') {
      return (
        <span className="text-xs text-[#2C5B32] flex items-center gap-1.5 ml-2 font-medium">
          <Stethoscope className="w-3.5 h-3.5 text-[#59C749]" /> Doctor OPD Portal
        </span>
      );
    }
    return (
      <span className="text-xs text-[#2C5B32] flex items-center gap-1.5 ml-2 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> System Admin
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF1]/95 backdrop-blur-md border-b border-[#E7E2CE] text-[#142618] px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      {/* Brand Identity (Clickable to return to Landing Page) */}
      <div 
        onClick={() => onNavigate ? onNavigate('/') : setActiveRole('landing')}
        className="flex items-center gap-3 cursor-pointer group"
        title="Return to MediKiosk Landing Page"
      >
        <div className="w-10 h-10 rounded-xl bg-[#59C749] flex items-center justify-center shadow-sm text-white font-bold transition-transform">
          <Activity className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight text-[#142618] transition-colors">
              MediKiosk
            </h1>
            {getRoleBadge()}
          </div>
          <p className="text-xs text-[#526857] font-medium">AI Clinical Intake & Vitals Platform (Ministry of Ayush / AIIA)</p>
        </div>
      </div>

      {/* Right Controls: Vitals Bar, Language, Vitals Modal, Login / Switch Role Button */}
      <div className="flex items-center gap-3">
        {/* Quick Vitals Readout */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white border border-[#E2DCBE] text-xs font-mono shadow-xs">
          <span className="text-rose-600 flex items-center gap-1">
            ❤️ {currentVitals.heart_rate_bpm} <span className="text-[10px] text-[#697E6D]">BPM</span>
          </span>
          <span className="text-teal-700 flex items-center gap-1">
            🫁 {currentVitals.spo2_percent}% <span className="text-[10px] text-[#697E6D]">SpO2</span>
          </span>
          <span className="text-amber-700 flex items-center gap-1">
            🌡️ {currentVitals.temperature_c}°C <span className="text-[10px] text-[#697E6D]">Temp</span>
          </span>
        </div>

        {/* Vitals Modal Trigger Button */}
        <button
          onClick={openHardwareModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F7F4E1] border border-[#DED7BD] text-[#142618] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          title="Customize Vitals Parameters"
        >
          <Sliders className="w-3.5 h-3.5 text-[#59C749]" />
          Vitals
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-[#E2DCBE] rounded-xl px-2.5 py-1 text-xs shadow-xs">
          <Globe className="w-3.5 h-3.5 text-[#59C749]" />
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              import('i18next').then(i18nModule => {
                i18nModule.default.changeLanguage(newLang);
              });
            }}
            className="bg-transparent text-[#142618] font-medium focus:outline-none cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} className="bg-white text-[#142618]">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation between Doctor OPD and Patient Kiosk */}
        {activeRole === 'patient' && (
          <button
            onClick={() => onNavigate ? onNavigate('/doctor') : setActiveRole('doctor')}
            className="px-3 py-1.5 bg-[#142618] hover:bg-[#223B28] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#59C749]" />
            <span>Doctor OPD Queue</span>
          </button>
        )}

        {activeRole === 'doctor' && (
          <button
            onClick={() => onNavigate ? onNavigate('/patient') : setActiveRole('patient')}
            className="px-3 py-1.5 bg-[#59C749] hover:bg-[#4EBD3E] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-white" />
            <span>Patient Intake</span>
          </button>
        )}

        {/* Return to Portal Home Button */}
        <button
          onClick={() => onNavigate ? onNavigate('/') : setActiveRole('landing')}
          className="px-3 py-1.5 bg-[#59C749]/15 hover:bg-[#59C749]/25 text-[#2C5B32] text-xs font-bold rounded-xl border border-[#59C749]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Return to Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Portal Home</span>
        </button>
      </div>
    </header>
  );
}
