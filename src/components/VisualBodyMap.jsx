import React, { useState } from 'react';
import { Heart, Brain, Activity, User, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export default function VisualBodyMap({ selectedSite, onSelectSite }) {
  const [viewAngle, setViewAngle] = useState('front'); // 'front' | 'back'

  const bodyZones = [
    {
      id: 'head_forehead',
      label: 'Head & Brain',
      subtext: 'Headache, Dizziness, Migraine',
      category: 'Neurological',
      x: 50, y: 12,
      icon: 'Brain',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'throat_neck',
      label: 'Throat & Neck',
      subtext: 'Sore throat, Thyroid, Cervical',
      category: 'ENT / Neck',
      x: 50, y: 22,
      icon: 'Activity',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'chest_center',
      label: 'Center of Chest',
      subtext: 'Pressure, Squeezing, Heart',
      category: 'Cardiovascular',
      x: 50, y: 34,
      icon: 'Heart',
      isRedFlagZone: true,
      color: 'from-rose-500 to-red-600'
    },
    {
      id: 'chest_left',
      label: 'Left Chest & Arm',
      subtext: 'Cardiovascular Radiation',
      category: 'Cardiovascular',
      x: 62, y: 36,
      icon: 'Heart',
      isRedFlagZone: true,
      color: 'from-rose-500 to-red-500'
    },
    {
      id: 'chest_right',
      label: 'Right Chest / Lungs',
      subtext: 'Respiration, Pleuritic Pain',
      category: 'Respiratory',
      x: 38, y: 36,
      icon: 'Activity',
      color: 'from-teal-500 to-emerald-500'
    },
    {
      id: 'abdomen_upper',
      label: 'Upper Abdomen',
      subtext: 'Stomach, Liver, Acidity',
      category: 'Gastrointestinal',
      x: 50, y: 48,
      icon: 'Activity',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'abdomen_lower',
      label: 'Lower Abdomen / Pelvis',
      subtext: 'Intestines, Urinary, Cramps',
      category: 'Abdominal',
      x: 50, y: 60,
      icon: 'Activity',
      color: 'from-amber-600 to-yellow-500'
    },
    {
      id: 'joints_limbs',
      label: 'Joints, Arms & Knees',
      subtext: 'Arthritis, Muscle Stiffness',
      category: 'Musculoskeletal',
      x: 25, y: 78,
      icon: 'User',
      color: 'from-blue-500 to-teal-400'
    },
    {
      id: 'back_lumbar',
      label: 'Spine & Lower Back',
      subtext: 'Lumbar, Sciatica, Kidney',
      category: 'Spinal',
      x: 50, y: 52,
      isBackOnly: true,
      icon: 'User',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const filteredZones = bodyZones.filter(z => viewAngle === 'back' ? (z.isBackOnly || z.id === 'head_forehead' || z.id === 'joints_limbs') : !z.isBackOnly);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Pictorial Interactive Body Map</h4>
            <p className="text-xs text-slate-400">Tap your anatomical region directly on the body diagram</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewAngle('front')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewAngle === 'front' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anterior (Front View)
          </button>
          <button
            onClick={() => setViewAngle('back')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewAngle === 'back' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Posterior (Back View)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Graphic Human Silhouette SVG Diagram (5 Cols) */}
        <div className="md:col-span-5 relative flex items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 min-h-[360px]">
          {/* Silhouette Container */}
          <div className="relative w-56 h-[340px] flex items-center justify-center">
            {/* Human Body SVG Outline */}
            <svg viewBox="0 0 200 400" className="w-full h-full text-slate-800 stroke-slate-700 fill-slate-900/90 drop-shadow-2xl">
              {/* Head */}
              <circle cx="100" cy="50" r="32" strokeWidth="2.5" />
              {/* Neck */}
              <path d="M 88 80 L 112 80 L 115 95 L 85 95 Z" strokeWidth="2" />
              {/* Torso & Shoulders */}
              <path d="M 50 110 L 85 95 L 115 95 L 150 110 L 140 240 L 60 240 Z" strokeWidth="2.5" />
              {/* Arms */}
              <path d="M 50 110 L 25 210 L 35 215 L 60 140" strokeWidth="2" />
              <path d="M 150 110 L 175 210 L 165 215 L 140 140" strokeWidth="2" />
              {/* Pelvis & Legs */}
              <path d="M 60 240 L 140 240 L 130 370 L 110 370 L 100 270 L 90 370 L 70 370 Z" strokeWidth="2.5" />
            </svg>

            {/* Interactive Anatomical Click Nodes */}
            {filteredZones.map((zone) => {
              const isSelected = selectedSite === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => onSelectSite(selectedSite === zone.id ? '' : zone.id)}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                  title={`${zone.label} - ${zone.subtext}`}
                >
                  {/* Pulse Ring if Selected */}
                  {isSelected && (
                    <span className="absolute inset-0 -m-2 rounded-full bg-teal-400/40 animate-ping" />
                  )}

                  {/* Node Button Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-tr from-teal-400 to-cyan-400 border-white text-slate-950 shadow-teal-500/50'
                        : zone.isRedFlagZone
                        ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 hover:bg-rose-500/40'
                        : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-teal-400'
                    }`}
                  >
                    {zone.icon === 'Heart' && <Heart className="w-4 h-4 fill-current" />}
                    {zone.icon === 'Brain' && <Brain className="w-4 h-4" />}
                    {zone.icon === 'Activity' && <Activity className="w-4 h-4" />}
                    {zone.icon === 'User' && <User className="w-4 h-4" />}
                  </div>

                  {/* Tooltip on Hover */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-10 hidden group-hover:block whitespace-nowrap bg-slate-950 border border-slate-800 text-slate-100 text-[10px] font-bold px-2 py-1 rounded shadow-xl z-40 pointer-events-none">
                    {zone.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Pictorial Zone Cards Selector (7 Cols) */}
        <div className="md:col-span-7 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tap Region to Target Questionnaire:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
            {filteredZones.map((zone) => {
              const isSelected = selectedSite === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => onSelectSite(selectedSite === zone.id ? '' : zone.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-500/20 via-slate-900 to-cyan-500/10 border-teal-400 shadow-xl shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg bg-gradient-to-tr ${zone.color} text-slate-950 font-bold shadow-md`}>
                        {zone.icon === 'Heart' && <Heart className="w-4 h-4 stroke-[2.5]" />}
                        {zone.icon === 'Brain' && <Brain className="w-4 h-4 stroke-[2.5]" />}
                        {zone.icon === 'Activity' && <Activity className="w-4 h-4 stroke-[2.5]" />}
                        {zone.icon === 'User' && <User className="w-4 h-4 stroke-[2.5]" />}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-100">{zone.label}</h5>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{zone.subtext}</p>
                      </div>
                    </div>
                  </div>

                  {zone.isRedFlagZone && (
                    <div className="mt-2 text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> High Sensitivity Clinical Zone
                    </div>
                  )}

                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
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
