import React, { useState } from 'react';
import { Heart, Brain, Activity, User, ShieldAlert, Sparkles, AlertCircle, ZoomIn, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function VisualBodyMap({ selectedSite, onSelectSite, onSelectCategory }) {
  const [viewAngle, setViewAngle] = useState('front'); // 'front' | 'back'

  const bodyZones = [
    {
      id: 'head_forehead',
      label: 'Head & Brain',
      subtext: 'Headache, Dizziness, Migraine',
      category: 'headache',
      x: 50, y: 12,
      zoomClass: 'scale-[1.8] translate-y-[22%]',
      icon: 'Brain',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'throat_neck',
      label: 'Throat & Neck',
      subtext: 'Sore throat, Thyroid, Cervical',
      category: 'respiratory',
      x: 50, y: 22,
      zoomClass: 'scale-[1.7] translate-y-[14%]',
      icon: 'Activity',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'chest_center',
      label: 'Center of Chest / Heart',
      subtext: 'Pressure, Squeezing, Cardiac',
      category: 'chest_pain',
      x: 50, y: 34,
      zoomClass: 'scale-[1.75] translate-y-[2%]',
      icon: 'Heart',
      isRedFlagZone: true,
      color: 'from-rose-500 to-red-600'
    },
    {
      id: 'chest_left',
      label: 'Left Chest & Arm',
      subtext: 'Cardiovascular Radiation',
      category: 'chest_pain',
      x: 62, y: 36,
      zoomClass: 'scale-[1.75] translate-y-[2%]',
      icon: 'Heart',
      isRedFlagZone: true,
      color: 'from-rose-500 to-red-500'
    },
    {
      id: 'chest_right',
      label: 'Right Chest / Lungs',
      subtext: 'Respiration, Pleuritic Pain',
      category: 'respiratory',
      x: 38, y: 36,
      zoomClass: 'scale-[1.75] translate-y-[2%]',
      icon: 'Activity',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      id: 'abdomen_upper',
      label: 'Upper Abdomen / Stomach',
      subtext: 'Stomach, Liver, Acidity',
      category: 'abdominal',
      x: 50, y: 48,
      zoomClass: 'scale-[1.7] translate-y-[-10%]',
      icon: 'Activity',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'abdomen_lower',
      label: 'Lower Abdomen / Pelvis',
      subtext: 'Intestines, Urinary, Cramps',
      category: 'abdominal',
      x: 50, y: 60,
      zoomClass: 'scale-[1.7] translate-y-[-20%]',
      icon: 'Activity',
      color: 'from-amber-600 to-yellow-500'
    },
    {
      id: 'joints_limbs',
      label: 'Joints, Arms & Knees',
      subtext: 'Arthritis, Muscle Stiffness',
      category: 'routine_checkup',
      x: 25, y: 78,
      zoomClass: 'scale-[1.5] translate-y-[-32%]',
      icon: 'User',
      color: 'from-blue-500 to-teal-400'
    },
    {
      id: 'back_lumbar',
      label: 'Spine & Lower Back',
      subtext: 'Lumbar, Sciatica, Kidney',
      category: 'routine_checkup',
      x: 50, y: 52,
      zoomClass: 'scale-[1.7] translate-y-[-12%]',
      isBackOnly: true,
      icon: 'User',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const activeZone = bodyZones.find(z => z.id === selectedSite);
  const filteredZones = bodyZones.filter(z => viewAngle === 'back' ? (z.isBackOnly || z.id === 'head_forehead' || z.id === 'joints_limbs') : !z.isBackOnly);

  const handleZoneClick = (zone) => {
    if (selectedSite === zone.id) {
      onSelectSite('');
    } else {
      onSelectSite(zone.id);
      if (onSelectCategory && zone.category) {
        onSelectCategory(zone.category);
      }
    }
  };

  return (
    <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              Pictorial Anatomical Body Map & Graphical Zoom
              {activeZone && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] uppercase border border-teal-500/40 animate-pulse">
                  🔍 ZOOMED: {activeZone.label.toUpperCase()}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">
              Tap any body region to zoom in and launch target decision cards below
            </p>
          </div>
        </div>

        {/* View Angle & Reset Controls */}
        <div className="flex items-center gap-2">
          {selectedSite && (
            <button
              onClick={() => onSelectSite('')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Zoom
            </button>
          )}

          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewAngle('front')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewAngle === 'front' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setViewAngle('back')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewAngle === 'back' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Back View
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Graphic Human Body SVG Diagram with Smooth Zoom Animation (5 Cols) */}
        <div className="md:col-span-5 relative flex items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden min-h-[380px] shadow-2xl">
          {/* Zoom Overlay Status Badge */}
          {activeZone && (
            <div className="absolute top-3 left-3 z-30 px-3 py-1 bg-slate-950/90 border border-teal-500/50 rounded-xl text-[11px] font-bold text-teal-300 shadow-xl flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-teal-400 animate-spin" />
              <span>Target Region: {activeZone.label}</span>
            </div>
          )}

          {/* Silhouette Container with CSS Zoom Transform */}
          <div className={`relative w-60 h-[360px] flex items-center justify-center transition-all duration-700 ease-out origin-center ${
            activeZone ? activeZone.zoomClass : 'scale-100 translate-y-0'
          }`}>
            {/* Human Body SVG Outline */}
            <svg viewBox="0 0 200 400" className="w-full h-full text-slate-800 stroke-slate-700 fill-slate-900/90 drop-shadow-2xl">
              {/* Head */}
              <circle cx="100" cy="50" r="32" strokeWidth="2.5" className={selectedSite?.startsWith('head') ? 'fill-indigo-950/80 stroke-teal-400' : ''} />
              {/* Neck */}
              <path d="M 88 80 L 112 80 L 115 95 L 85 95 Z" strokeWidth="2" className={selectedSite?.startsWith('throat') ? 'fill-cyan-950/80 stroke-teal-400' : ''} />
              {/* Torso & Chest */}
              <path d="M 50 110 L 85 95 L 115 95 L 150 110 L 140 240 L 60 240 Z" strokeWidth="2.5" className={selectedSite?.startsWith('chest') ? 'fill-rose-950/80 stroke-rose-400' : selectedSite?.startsWith('abdomen') ? 'fill-amber-950/80 stroke-amber-400' : ''} />
              {/* Arms */}
              <path d="M 50 110 L 25 210 L 35 215 L 60 140" strokeWidth="2" />
              <path d="M 150 110 L 175 210 L 165 215 L 140 140" strokeWidth="2" />
              {/* Pelvis & Legs */}
              <path d="M 60 240 L 140 240 L 130 370 L 110 370 L 100 270 L 90 370 L 70 370 Z" strokeWidth="2.5" className={selectedSite?.startsWith('joints') ? 'fill-blue-950/80 stroke-teal-400' : ''} />
            </svg>

            {/* Interactive Anatomical Click Nodes */}
            {filteredZones.map((zone) => {
              const isSelected = selectedSite === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
                  }`}
                  title={`${zone.label} - ${zone.subtext}`}
                >
                  {/* Pulse Ring if Selected */}
                  {isSelected && (
                    <span className="absolute inset-0 -m-3 rounded-full bg-teal-400/50 animate-ping" />
                  )}

                  {/* Node Button Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr from-teal-400 to-cyan-400 border-white text-slate-950 shadow-teal-500/80'
                        : zone.isRedFlagZone
                        ? 'bg-rose-500/20 border-rose-500/70 text-rose-400 hover:bg-rose-500/40'
                        : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-teal-400'
                    }`}
                  >
                    {zone.icon === 'Heart' && <Heart className="w-5 h-5 fill-current" />}
                    {zone.icon === 'Brain' && <Brain className="w-5 h-5" />}
                    {zone.icon === 'Activity' && <Activity className="w-5 h-5" />}
                    {zone.icon === 'User' && <User className="w-5 h-5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Graphical Anatomical Region Selector Cards (7 Cols) */}
        <div className="md:col-span-7 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tap Region to Focus Zoom & Launch Decision Cards:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {filteredZones.map((zone) => {
              const isSelected = selectedSite === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-500/30 via-slate-900 to-cyan-500/20 border-teal-400 shadow-xl shadow-teal-500/20 ring-2 ring-teal-400/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${zone.color} text-slate-950 font-bold shadow-lg`}>
                      {zone.icon === 'Heart' && <Heart className="w-5 h-5 stroke-[2.5]" />}
                      {zone.icon === 'Brain' && <Brain className="w-5 h-5 stroke-[2.5]" />}
                      {zone.icon === 'Activity' && <Activity className="w-5 h-5 stroke-[2.5]" />}
                      {zone.icon === 'User' && <User className="w-5 h-5 stroke-[2.5]" />}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-100">{zone.label}</h5>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{zone.subtext}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="px-2 py-1 rounded-lg bg-teal-400 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" /> ZOOMED
                    </span>
                  ) : (
                    zone.isRedFlagZone && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold">
                        RED FLAG
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
