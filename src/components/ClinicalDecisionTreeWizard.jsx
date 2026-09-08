import React, { useState } from 'react';
import { 
  Heart, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, 
  Sparkles, Activity, Wind, Flame, User, RefreshCw, Zap, Stethoscope
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DECISION_TREES, decisionTreeEngine, getOptionLabel, getStepTitle, getStepSubtitle } from '../services/decisionTreeEngine';

export default function ClinicalDecisionTreeWizard({ 
  category = 'chest_pain', 
  vitals = {}, 
  treeAnswers = {}, 
  onTreeAnswersChange, 
  onCompleteTree,
  language = 'hi'
}) {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.language || language || 'en';
  const isHindi = activeLang === 'hi';
  const treeConfig = DECISION_TREES[category] || DECISION_TREES.chest_pain;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const currentStep = treeConfig.steps[currentStepIdx] || treeConfig.steps[0];
  const totalSteps = treeConfig.steps.length;

  // Calculate live differential diagnosis & triage evaluation for selected category
  const evaluation = decisionTreeEngine.evaluateTree(category, treeAnswers, vitals);

  // Handle Option Select for current step
  const handleSelectOption = (optionId, isMultiSelect = false) => {
    if (isMultiSelect) {
      const currentList = treeAnswers[currentStep.id] || [];
      const updated = currentList.includes(optionId)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId];
      
      const newAnswers = { ...treeAnswers, [currentStep.id]: updated };
      onTreeAnswersChange(newAnswers);
    } else {
      const newAnswers = { ...treeAnswers, [currentStep.id]: optionId };
      onTreeAnswersChange(newAnswers);
    }
  };

  const isStepAnswered = () => {
    const ans = treeAnswers[currentStep.id];
    if (currentStep.isMultiSelect) return true; // Optional multi-select
    return Boolean(ans);
  };

  const handleNextStep = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else if (onCompleteTree) {
      onCompleteTree(evaluation);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  return (
    <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl space-y-6">
      {/* Wizard Header & Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 text-base">
                {isHindi ? `αñ¿αÑêαñªαñ╛αñ¿αñ┐αñò αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖: ${treeConfig.name_hi || treeConfig.name}` : `Clinical Decision Tree: ${treeConfig.name}`}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
                {isHindi ? 'αñíαñ╛αñ»αñ¿αñ╛αñ«αñ┐αñò αñ╢αñ╛αñûαñ╛αñÅαñé' : 'DYNAMIC BRANCHING'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isHindi ? 'αñ▓αñòαÑìαñ╖αñúαÑïαñé αñÅαñ╡αñé αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñÜαÑçαññαñ╛αñ╡αñ¿αÑÇ αñòαñ╛ αñ«αÑéαñ▓αÑìαñ»αñ╛αñéαñòαñ¿ αñòαñ░αñ¿αÑç αñ╡αñ╛αñ▓αñ╛ αñçαñéαñƒαñ░αÑêαñòαÑìαñƒαñ┐αñ╡ αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖' : 'Interactive clinical decision tree evaluating ischemic patterns & red flags'}
            </p>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2">
          {treeConfig.steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentStepIdx
                  ? 'w-10 bg-teal-400 shadow shadow-teal-400/50'
                  : treeAnswers[s.id]
                  ? 'w-5 bg-teal-500/50'
                  : 'w-4 bg-slate-800'
              }`}
              title={`${isHindi ? 'αñÜαñ░αñú' : 'Step'} ${idx + 1}: ${isHindi ? (s.title_hi || s.title) : s.title}`}
            />
          ))}
          <span className="text-xs font-mono text-slate-400 ml-2 font-bold">
            {isHindi ? `αñÜαñ░αñú ${currentStepIdx + 1} αñòαÑüαñ▓ ${totalSteps} αñ«αÑçαñé αñ╕αÑç` : `Step ${currentStepIdx + 1} of ${totalSteps}`}
          </span>
        </div>
      </div>

      {/* EMERGENCY RED-FLAG REALTIME ALERT BANNER */}
      {evaluation.isRedFlag && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/50 text-rose-200 space-y-2 shadow-xl shadow-rose-500/10 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-rose-400 text-sm uppercase">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              {isHindi 
                ? `≡ƒÜ¿ αñùαñéαñ¡αÑÇαñ░ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñÜαÑçαññαñ╛αñ╡αñ¿αÑÇ αñªαñ░αÑìαñ£ (${evaluation.riskPercentage}% αñ╣αÑâαñªαñ» αñ£αÑïαñûαñ┐αñ«)`
                : `CRITICAL ISCHEMIC RED FLAG DETECTED (${evaluation.riskPercentage}% CARDIAC RISK)`}
            </div>
            <span className="px-2.5 py-0.5 rounded bg-rose-500 text-slate-950 font-black text-[10px] uppercase">
              {isHindi ? 'αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ¬αÑìαñ░αñ╛αñÑαñ«αñ┐αñòαññαñ╛' : 'PRIORITY TRIAGE'}
            </span>
          </div>
          <p className="text-xs text-rose-200/90 font-medium">
            {evaluation.recommendation}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {evaluation.redFlags.map((flag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-[10px] font-mono font-bold text-rose-300">
                ≡ƒÜ¿ {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Decision Tree Question Step (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div>
            <span className="text-[11px] font-bold font-mono text-teal-400 uppercase tracking-widest block mb-1">
              {isHindi ? `αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖ αñÜαñ░αñú ${currentStepIdx + 1} / ${totalSteps}` : `DECISION TREE STEP ${currentStepIdx + 1} / ${totalSteps}`}
            </span>
            <h4 className="font-extrabold text-slate-100 text-base">
              {getStepTitle(currentStep, activeLang)}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {getStepSubtitle(currentStep, activeLang)}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentStep.options.map((opt) => {
              const isSelected = currentStep.isMultiSelect
                ? (treeAnswers[currentStep.id] || []).includes(opt.id)
                : treeAnswers[currentStep.id] === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, currentStep.isMultiSelect)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isRedFlag
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-lg shadow-rose-500/10'
                        : 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow-lg shadow-teal-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl border ${
                      isSelected 
                        ? opt.isRedFlag ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {opt.icon === 'Heart' && <Heart className="w-4 h-4" />}
                      {opt.icon === 'ShieldAlert' && <ShieldAlert className="w-4 h-4" />}
                      {opt.icon === 'AlertTriangle' && <AlertTriangle className="w-4 h-4" />}
                      {opt.icon === 'Activity' && <Activity className="w-4 h-4" />}
                      {opt.icon === 'Wind' && <Wind className="w-4 h-4" />}
                      {opt.icon === 'Flame' && <Flame className="w-4 h-4" />}
                      {opt.icon === 'User' && <User className="w-4 h-4" />}
                      {(!opt.icon || opt.icon === 'CheckCircle2') && <CheckCircle2 className="w-4 h-4" />}
                    </span>
                    <span className="text-xs font-semibold">
                      {getOptionLabel(opt, activeLang)}
                    </span>
                  </div>

                  {opt.isRedFlag && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold shrink-0">
                      {isHindi ? 'αñûαññαñ░αÑç αñòαÑÇ αñÜαÑçαññαñ╛αñ╡αñ¿αÑÇ' : 'RED FLAG'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                currentStepIdx === 0
                  ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> {t('decisionTree.prevStep')}
            </button>

            <button
              onClick={handleNextStep}
              disabled={!isStepAnswered()}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isStepAnswered()
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-lg hover:brightness-110'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {currentStepIdx === totalSteps - 1 
                ? t('decisionTree.finishTree') 
                : t('decisionTree.nextStep')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Realtime Differential Diagnosis Probability Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Stethoscope className="w-4 h-4" />
              </span>
              <h4 className="font-extrabold text-sm text-slate-100">
                {isHindi ? 'αñ¿αÑêαñªαñ╛αñ¿αñ┐αñò αñ╡αñ┐αñ¡αÑçαñªαñò αñ¿αñ┐αñªαñ╛αñ¿' : 'Clinical Differential Diagnosis'}
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
              {isHindi ? 'αñÅαñåαñê αñ╡αñ┐αñ╢αÑìαñ▓αÑçαñ╖αñú' : 'REALTIME AI PATHWAYS'}
            </span>
          </div>

          {/* Differential Diagnosis Probabilities */}
          <div className="space-y-3">
            {evaluation.differentials.map((diff, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{diff.name}</span>
                  <span className={`font-mono font-black ${
                    diff.probability >= 50 ? 'text-rose-400' : diff.probability >= 25 ? 'text-amber-400' : 'text-teal-400'
                  }`}>
                    {diff.probability}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      diff.probability >= 50
                        ? 'bg-gradient-to-r from-rose-500 to-red-400 shadow shadow-rose-500/30'
                        : diff.probability >= 25
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-400'
                    }`}
                    style={{ width: `${diff.probability}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>{isHindi ? 'αñòαñ╛αñ░αÑìαñ░αñ╡αñ╛αñê:' : 'Action:'} {diff.action}</span>
                  <span className="font-bold text-slate-300">{diff.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-teal-300 block">
              {isHindi ? 'αñÅαñåαñê αñƒαÑìαñ░αñ╛αñçαñÅαñ£ αñ╕αñ╛αñ░αñ╛αñéαñ╢' : 'AI Triage Summary'}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isHindi 
                ? 'αñÜαñ»αñ¿αñ┐αññ αñ╡αñ┐αñòαñ▓αÑìαñ¬ αñÅαñ╕αÑÇαñ╕αÑÇ/αñÅαñÅαñÜαñÅ αñªαñ┐αñ╢αñ╛αñ¿αñ┐αñ░αÑìαñªαÑçαñ╢αÑïαñé αñòαÑç αñåαñºαñ╛αñ░ αñ¬αñ░ αñ¿αÑêαñªαñ╛αñ¿αñ┐αñò αñ¿αñ┐αñ░αÑìαñúαñ» αñòαñ╛ αñ«αÑéαñ▓αÑìαñ»αñ╛αñéαñòαñ¿ αñòαñ░αññαÑç αñ╣αÑêαñéαÑñ'
                : 'Selected options trigger clinical decision pathways based on ACC/AHA guidelines for chest pain evaluation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
