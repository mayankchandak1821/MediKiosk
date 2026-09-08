import React, { useState } from 'react';
import { Heart, Brain, Activity, User, ShieldAlert, Sparkles, AlertCircle, ZoomIn, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VisualBodyMap({ selectedSite, onSelectSite, onSelectCategory, language = 'en' }) {
  const { t } = useTranslation();
  const [viewAngle, setViewAngle] = useState('front'); // 'front' | 'back'

  const bodyZones = [
    {
      id: 'head_forehead',
      label: 'Head & Brain',
      subtext: 'Headache, Dizziness, Migraine',
      category: 'headache',
      x: 50, y: 12,
      zoomClass: 'scale-[1.8] translate-y-[22%]',
      icon: 'Brain'
    },
    {
      id: 'throat_neck',
      label: 'Throat & Neck',
      subtext: 'Sore throat, Thyroid, Cervical',
      category: 'respiratory',
      x: 50, y: 22,
      zoomClass: 'scale-[1.7] translate-y-[14%]',
      icon: 'Activity'
    },
    {
      id: 'chest_center',
      label: 'Center of Chest / Heart',
      subtext: 'Pressure, Squeezing, Cardiac',
      category: 'chest_pain',
      x: 50, y: 34,
      zoomClass: 'scale-[1.75] translate-y-[2%]',
      icon: 'Heart',
      isRedFlagZone: true
    },
    {
      id: 'chest_left',
      label: 'Left Chest & Arm',
      subtext: 'Cardiovascular Radiation',
      category: 'chest_pain',
      x: 62, y: 36,
      zoomClass: 'scale-[1.75] translate-y-[2%]',
      icon: 'Heart',
      isRedFlagZone: true
    },
    {
      id: 'chest_right',
      label: 'Right Chest / Lungs',
      subtext: 'Respiration, Pleuritic Pain',
      category: 'respiratory',
      x: 38, y: 36,
      zoomClass: 'scale-[1.75] translate-y-[2%]',
      icon: 'Activity'
    },
    {
      id: 'abdomen_upper',
      label: 'Upper Abdomen / Stomach',
      subtext: 'Stomach, Liver, Acidity',
      category: 'abdominal',
      x: 50, y: 48,
      zoomClass: 'scale-[1.7] translate-y-[-10%]',
      icon: 'Activity'
    },
    {
      id: 'abdomen_lower',
      label: 'Lower Abdomen / Pelvis',
      subtext: 'Intestines, Urinary, Cramps',
      category: 'abdominal',
      x: 50, y: 60,
      zoomClass: 'scale-[1.7] translate-y-[-20%]',
      icon: 'Activity'
    },
    {
      id: 'joints_limbs',
      label: 'Joints, Arms & Knees',
      subtext: 'Arthritis, Muscle Stiffness',
      category: 'routine_checkup',
      x: 25, y: 78,
      zoomClass: 'scale-[1.5] translate-y-[-32%]',
      icon: 'User'
    },
    {
      id: 'back_lumbar',
      label: 'Spine & Lower Back',
      subtext: 'Lumbar, Sciatica, Kidney',
      category: 'routine_checkup',
      x: 50, y: 52,
      zoomClass: 'scale-[1.7] translate-y-[-12%]',
      isBackOnly: true,
      icon: 'User'
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
    <div className="bg-white border border-[#E2DCBE] rounded-3xl p-5 shadow-xs space-y-4">
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DCBE] pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#59C749]/15 text-[#2B8A1E]">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-[#142618] flex items-center gap-2">
              {t('bodyMap.title')}
              {activeZone && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#59C749]/15 text-[#142618] font-mono text-[10px] uppercase border border-[#59C749]/40">
                  🔍 ZOOMED: {activeZone.label.toUpperCase()}
                </span>
              )}
            </h4>
            <p className="text-xs text-[#526857]">
              {t('bodyMap.subtitle')}
            </p>
          </div>
        </div>

        {/* View Angle & Reset Controls */}
        <div className="flex items-center gap-2">
          {selectedSite && (
            <button
              onClick={() => onSelectSite('')}
              className="px-3 py-1.5 rounded-xl bg-[#FFFDF1] hover:bg-[#F7F4E1] text-[#142618] text-xs font-bold transition-all border border-[#E2DCBE] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset View
            </button>
          )}

          <div className="flex items-center p-1 bg-[#FFFDF1] rounded-xl border border-[#E2DCBE] text-xs">
            <button
              onClick={() => setViewAngle('front')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewAngle === 'front' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setViewAngle('back')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewAngle === 'back' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
              }`}
            >
              Back View
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Graphic Human Body SVG Diagram with Smooth Zoom Animation (5 Cols) */}
        <div className="md:col-span-5 relative flex items-center justify-center p-4 bg-[#FFFDF1] rounded-2xl border border-[#E2DCBE] overflow-hidden min-h-[380px] shadow-xs">
          {/* Zoom Overlay Status Badge */}
          {activeZone && (
            <div className="absolute top-3 left-3 z-30 px-3 py-1 bg-white/95 border border-[#E2DCBE] rounded-xl text-[11px] font-bold text-[#142618] shadow-xs flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-[#59C749]" />
              <span>Target Region: {activeZone.label}</span>
            </div>
          )}

          {/* Silhouette Container with CSS Zoom Transform */}
          <div className={`relative w-60 h-[360px] flex items-center justify-center transition-all duration-700 ease-out origin-center ${
            activeZone ? activeZone.zoomClass : 'scale-100 translate-y-0'
          }`}>
            {/* Human Body SVG Outline */}
            <svg viewBox="0 0 200 400" className="w-full h-full stroke-[#DED7BD] fill-[#F7F4E1]">
              {/* Head */}
              <circle cx="100" cy="50" r="32" strokeWidth="2.5" className={selectedSite?.startsWith('head') ? 'fill-[#59C749]/20 stroke-[#59C749]' : ''} />
              {/* Neck */}
              <path d="M 88 80 L 112 80 L 115 95 L 85 95 Z" strokeWidth="2" className={selectedSite?.startsWith('throat') ? 'fill-[#59C749]/20 stroke-[#59C749]' : ''} />
              {/* Torso & Chest */}
              <path d="M 50 110 L 85 95 L 115 95 L 150 110 L 140 240 L 60 240 Z" strokeWidth="2.5" className={selectedSite?.startsWith('chest') ? 'fill-rose-100 stroke-rose-400' : selectedSite?.startsWith('abdomen') ? 'fill-amber-100 stroke-amber-400' : ''} />
              {/* Arms */}
              <path d="M 50 110 L 25 210 L 35 215 L 60 140" strokeWidth="2" />
              <path d="M 150 110 L 175 210 L 165 215 L 140 140" strokeWidth="2" />
              {/* Pelvis & Legs */}
              <path d="M 60 240 L 140 240 L 130 370 L 110 370 L 100 270 L 90 370 L 70 370 Z" strokeWidth="2.5" className={selectedSite?.startsWith('joints') ? 'fill-[#59C749]/20 stroke-[#59C749]' : ''} />
            </svg>

            {/* Interactive Anatomical Click Nodes */}
            {filteredZones.map((zone) => {
              const isSelected = selectedSite === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 cursor-pointer ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
                  }`}
                  title={`${zone.label} - ${zone.subtext}`}
                >
                  {/* Node Button Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                      isSelected
                        ? 'bg-[#59C749] border-white text-white shadow-md'
                        : zone.isRedFlagZone
                        ? 'bg-rose-50 border-rose-400 text-rose-700 hover:bg-rose-100'
                        : 'bg-white border-[#DED7BD] text-[#526857] hover:border-[#59C749]'
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
          <span className="text-xs font-bold text-[#526857] uppercase tracking-wider block mb-1">
            Tap Region to Focus Zoom & Launch Decision Cards:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {filteredZones.map((zone) => {
              const isSelected = selectedSite === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#59C749]/15 border-[#59C749] shadow-xs ring-1 ring-[#59C749]'
                      : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#59C749] text-white font-bold shadow-xs">
                      {zone.icon === 'Heart' && <Heart className="w-5 h-5 stroke-[2.5]" />}
                      {zone.icon === 'Brain' && <Brain className="w-5 h-5 stroke-[2.5]" />}
                      {zone.icon === 'Activity' && <Activity className="w-5 h-5 stroke-[2.5]" />}
                      {zone.icon === 'User' && <User className="w-5 h-5 stroke-[2.5]" />}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-[#142618]">{zone.label}</h5>
                      <p className="text-[11px] text-[#526857] leading-tight mt-0.5">{zone.subtext}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="px-2 py-1 rounded-lg bg-[#59C749] text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" /> ZOOMED
                    </span>
                  ) : (
                    zone.isRedFlagZone && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[9px] font-mono font-bold">
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
