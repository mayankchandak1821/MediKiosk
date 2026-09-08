import React from 'react';
import { Heart, Activity, Thermometer, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { clinicalEngine } from '../services/clinicalEngine';

export default function VisualVitalsGauges({ vitals, answers = {}, activeSource }) {
  const { temperature_c, heart_rate_bpm, spo2_percent } = vitals;

  // Evaluate Triage with Quantitative Risk Percentage Score
  const triage = clinicalEngine.evaluateTriage(answers, vitals);
  const { riskPercentage, isRedFlag, priority, redFlags } = triage;

  const isFever = temperature_c >= 38.0;
  const isHypoxia = spo2_percent < 90;
  const isTachycardia = heart_rate_bpm > 120;

  return (
    <div className="bg-white border border-[#E2DCBE] rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Risk Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DCBE] pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#59C749]/15 text-[#2B8A1E]">
            <Activity className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-sm text-[#142618]">Pictorial Telemetry & Triage Risk Index</h4>
            <p className="text-xs text-[#526857]">Live stream connected via {activeSource || 'Peripheral Sensors'}</p>
          </div>
        </div>

        {/* Quantitative Triage Risk Index Pill */}
        <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
          riskPercentage >= 60
            ? 'bg-rose-100 border-rose-400 text-rose-950 shadow-xs'
            : riskPercentage >= 30
            ? 'bg-amber-100 border-amber-400 text-amber-950'
            : 'bg-[#59C749]/15 border-[#59C749] text-[#142618]'
        }`}>
          <span>TRIAGE RISK INDEX:</span>
          <span className="text-sm font-extrabold">{riskPercentage}%</span>
          <span>
            {riskPercentage >= 60 ? '🚨 HIGH RED FLAG' : riskPercentage >= 30 ? '🟡 MODERATE' : '🟢 ROUTINE'}
          </span>
        </div>
      </div>

      {/* 4 Pictorial Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gauge 0: Quantitative Triage Risk Percentage Meter */}
        <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
          riskPercentage >= 60
            ? 'bg-rose-50 border-rose-300'
            : riskPercentage >= 30
            ? 'bg-amber-50 border-amber-300'
            : 'bg-[#FFFDF1] border-[#E2DCBE]'
        }`}>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#526857] font-semibold mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Clinical Risk Score
            </div>
            <div className={`font-mono text-2xl font-black ${
              riskPercentage >= 60 ? 'text-rose-700' : riskPercentage >= 30 ? 'text-amber-800' : 'text-[#2B8A1E]'
            }`}>
              {riskPercentage}%
            </div>
            <span className="text-[10px] text-[#526857] block font-mono mt-0.5">
              {riskPercentage >= 60 ? '⚠️ EMERGENCY TRIAGE' : riskPercentage >= 30 ? '• URGENT EVAL' : '• ROUTINE OPD'}
            </span>
          </div>

          {/* Radial Risk Score Progress Arc */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-[#E7E2CE] stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  riskPercentage >= 60 ? 'text-rose-600' : riskPercentage >= 30 ? 'text-amber-500' : 'text-[#59C749]'
                } stroke-current transition-all duration-700`}
                strokeDasharray={`${riskPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute text-[10px] font-mono font-bold ${
              riskPercentage >= 60 ? 'text-rose-700' : riskPercentage >= 30 ? 'text-amber-800' : 'text-[#142618]'
            }`}>
              {riskPercentage}%
            </span>
          </div>
        </div>

        {/* Gauge 1: Body Temperature */}
        <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
          isFever ? 'bg-amber-50 border-amber-300' : 'bg-[#FFFDF1] border-[#E2DCBE]'
        }`}>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#526857] font-semibold mb-1">
              <Thermometer className="w-4 h-4 text-amber-700" /> Body Temp
            </div>
            <div className="font-mono text-2xl font-black text-amber-800">
              {temperature_c}°C
            </div>
            <span className="text-[10px] text-[#526857] block font-mono mt-0.5">
              {((temperature_c * 9/5) + 32).toFixed(1)}°F {isFever ? '• FEVER ALERT' : '• NORMAL'}
            </span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-[#E7E2CE] stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-600 stroke-current transition-all duration-500"
                strokeDasharray={`${Math.min(100, Math.max(0, (temperature_c - 35) * 14))}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-amber-800">
              {temperature_c}°
            </span>
          </div>
        </div>

        {/* Gauge 2: SpO2 Pulse Oximetry */}
        <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
          isHypoxia ? 'bg-rose-50 border-rose-300' : 'bg-[#FFFDF1] border-[#E2DCBE]'
        }`}>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#526857] font-semibold mb-1">
              <Activity className="w-4 h-4 text-[#59C749]" /> Blood SpO2
            </div>
            <div className={`font-mono text-2xl font-black ${isHypoxia ? 'text-rose-700' : 'text-[#2B8A1E]'}`}>
              {spo2_percent}%
            </div>
            <span className="text-[10px] text-[#526857] block font-mono mt-0.5">
              {isHypoxia ? '⚠️ HYPOXIA CRITICAL' : '• NORMAL SATURATION'}
            </span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-[#E7E2CE] stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${isHypoxia ? 'text-rose-600' : 'text-[#59C749]'} stroke-current transition-all duration-500`}
                strokeDasharray={`${spo2_percent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute text-[10px] font-mono font-bold ${isHypoxia ? 'text-rose-700' : 'text-[#142618]'}`}>
              {spo2_percent}%
            </span>
          </div>
        </div>

        {/* Gauge 3: Heart Rate */}
        <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
          isTachycardia ? 'bg-amber-50 border-amber-300' : 'bg-[#FFFDF1] border-[#E2DCBE]'
        }`}>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#526857] font-semibold mb-1">
              <Heart className="w-4 h-4 text-rose-600 fill-current" /> Heart Rate
            </div>
            <div className="font-mono text-2xl font-black text-rose-700">
              {heart_rate_bpm} <span className="text-xs font-normal text-[#526857]">BPM</span>
            </div>
            <span className="text-[10px] text-[#526857] block font-mono mt-0.5">
              {isTachycardia ? '• TACHYCARDIA' : '• NORMAL RHYTHM'}
            </span>
          </div>

          <div className="p-3 rounded-full bg-rose-50 border border-rose-200 text-rose-600">
            <Heart className="w-6 h-6 stroke-[2.5] fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
