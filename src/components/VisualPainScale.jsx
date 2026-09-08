import React from 'react';
import { Smile, Frown, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function VisualPainScale({ value, onChange, language = 'en' }) {
  const { t } = useTranslation();

  const painLevels = [
    { level: 0, emoji: '😃', labelKey: 'painScale.ratings.0' },
    { level: 2, emoji: '😊', labelKey: 'painScale.ratings.2' },
    { level: 4, emoji: '😐', labelKey: 'painScale.ratings.4' },
    { level: 6, emoji: '😣', labelKey: 'painScale.ratings.6' },
    { level: 8, emoji: '😫', labelKey: 'painScale.ratings.8' },
    { level: 10, emoji: '🤬', labelKey: 'painScale.ratings.10' }
  ];

  return (
    <div className="bg-white border border-[#E2DCBE] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3">
        <div>
          <h4 className="font-bold text-sm text-[#142618] flex items-center gap-2">
            {t('painScale.title')}
          </h4>
          <p className="text-xs text-[#526857]">
            {t('painScale.subtitle')}
          </p>
        </div>
        <span className="font-mono text-sm font-bold text-[#142618] px-3 py-1 bg-[#59C749]/15 border border-[#59C749]/30 rounded-xl">
          {t('painScale.selected')}: {value} / 10
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
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between h-32 cursor-pointer ${
                isSelected
                  ? 'border-2 border-[#59C749] bg-[#59C749]/15 shadow-sm scale-105 z-10 text-[#142618]'
                  : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50 text-[#526857]'
              }`}
            >
              <span className="text-3xl my-1 select-none">{p.emoji}</span>
              <div>
                <span className="font-bold text-xs block text-[#142618]">
                  {t(p.labelKey)}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#526857] mt-1">
                Level {p.level}
              </span>
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
          className="w-full h-3 bg-gradient-to-r from-[#59C749] via-amber-400 to-rose-600 rounded-lg cursor-pointer accent-[#59C749] shadow-inner"
        />
      </div>
    </div>
  );
}
