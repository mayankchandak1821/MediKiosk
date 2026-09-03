import React from 'react';
import { Smile, Frown, AlertCircle } from 'lucide-react';

export default function VisualPainScale({ value, onChange }) {
  const painLevels = [
    { level: 0, emoji: '😃', label: 'No Pain', desc: 'Feeling completely comfortable', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { level: 2, emoji: '😊', label: 'Mild Pain', desc: 'Noticeable, but easily ignored', color: 'border-emerald-400 bg-emerald-400/10 text-emerald-300' },
    { level: 4, emoji: '😐', label: 'Moderate Pain', desc: 'Interferes with task concentration', color: 'border-amber-400 bg-amber-400/10 text-amber-300' },
    { level: 6, emoji: '😣', label: 'Severe Pain', desc: 'Difficult to ignore, affects breathing', color: 'border-orange-500 bg-orange-500/10 text-orange-300' },
    { level: 8, emoji: '😫', label: 'Very Severe', desc: 'Disabling pain, intense distress', color: 'border-rose-500 bg-rose-500/10 text-rose-300' },
    { level: 10, emoji: '🤬', label: 'Worst Possible', desc: 'Unbearable, requires emergency care', color: 'border-red-600 bg-red-600/20 text-rose-400 animate-pulse' }
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            Pictorial Pain & Discomfort Scale (Wong-Baker Visual Standard)
          </h4>
          <p className="text-xs text-slate-400">Select the face or rating slider that best describes your current pain level.</p>
        </div>
        <span className="font-mono text-sm font-extrabold text-teal-400 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-xl">
          Rating: {value} / 10
        </span>
      </div>

      {/* Pictorial Emoji Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {painLevels.map((p) => {
          const isSelected = value >= p.level && (value < p.level + 2 || p.level === 10);
          return (
            <button
              key={p.level}
              onClick={() => onChange(p.level)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between h-32 ${
                isSelected
                  ? `border-2 shadow-xl ${p.color} scale-105 z-10`
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <span className="text-3xl my-1 select-none">{p.emoji}</span>
              <div>
                <span className="font-bold text-xs block text-slate-200">{p.label}</span>
                <span className="text-[10px] text-slate-400 block line-clamp-1">{p.desc}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">Level {p.level}</span>
            </button>
          );
        })}
      </div>

      {/* Touch Pain Slider */}
      <div className="pt-2">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 rounded-lg cursor-pointer accent-teal-400 shadow-inner"
        />
      </div>
    </div>
  );
}
