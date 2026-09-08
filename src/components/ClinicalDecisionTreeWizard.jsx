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
  language = 'en'
}) {
  const { t } = useTranslation();
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
    <div className="bg-white border border-[#E2DCBE] rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
      {/* Wizard Header & Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DCBE] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[#142618] text-base">
                Clinical Decision Tree: {treeConfig.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#59C749]/15 text-[#142618] font-mono text-xs font-bold border border-[#59C749]/30">
                DYNAMIC BRANCHING
              </span>
            </div>
            <p className="text-xs text-[#526857]">
              Interactive clinical decision tree evaluating ischemic patterns & red flags
            </p>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2">
          {treeConfig.steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentStepIdx
                  ? 'w-10 bg-[#59C749] shadow-xs'
                  : treeAnswers[s.id]
                  ? 'w-5 bg-[#59C749]/50'
                  : 'w-4 bg-[#E2DCBE]'
              }`}
              title={`Step ${idx + 1}: ${s.title}`}
            />
          ))}
          <span className="text-xs font-mono text-[#526857] ml-2 font-bold">
            Step {currentStepIdx + 1} of {totalSteps}
          </span>
        </div>
      </div>

      {/* EMERGENCY RED-FLAG REALTIME ALERT BANNER */}
      {evaluation.isRedFlag && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-rose-700 text-sm uppercase">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              CRITICAL ISCHEMIC RED FLAG DETECTED ({evaluation.riskPercentage}% CARDIAC RISK)
            </div>
            <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] uppercase">
              PRIORITY TRIAGE
            </span>
          </div>
          <p className="text-xs text-rose-900 font-medium">
            {evaluation.recommendation}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {evaluation.redFlags.map((flag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white border border-rose-300 text-[10px] font-mono font-bold text-rose-700">
                🚨 {flag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Decision Tree Question Step (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF1] border border-[#E2DCBE] rounded-2xl p-5 space-y-5 shadow-xs">
          <div>
            <span className="text-[11px] font-bold font-mono text-[#2B8A1E] uppercase tracking-widest block mb-1">
              DECISION TREE STEP {currentStepIdx + 1} / {totalSteps}
            </span>
            <h4 className="font-extrabold text-[#142618] text-base">
              {getStepTitle(currentStep, 'en')}
            </h4>
            <p className="text-xs text-[#526857] mt-0.5">
              {getStepSubtitle(currentStep, 'en')}
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
                        ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : 'bg-[#59C749]/15 border-[#59C749] text-[#142618] font-bold shadow-xs'
                      : 'bg-white border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50 hover:text-[#142618]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl border ${
                      isSelected 
                        ? opt.isRedFlag ? 'bg-rose-200 text-rose-800 border-rose-300' : 'bg-[#59C749]/20 text-[#2B8A1E] border-[#59C749]/30'
                        : 'bg-[#FFFDF1] text-[#526857] border-[#E2DCBE]'
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
                      {getOptionLabel(opt, 'en')}
                    </span>
                  </div>

                  {opt.isRedFlag && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[9px] font-mono font-bold shrink-0">
                      RED FLAG
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2DCBE]">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                currentStepIdx === 0
                  ? 'bg-white border-[#E2DCBE] text-[#A0AFA2] cursor-not-allowed'
                  : 'bg-white border-[#E2DCBE] text-[#142618] hover:bg-[#F7F4E1]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> {t('decisionTree.prevStep')}
            </button>

            <button
              onClick={handleNextStep}
              disabled={!isStepAnswered()}
              className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isStepAnswered()
                  ? 'bg-[#59C749] hover:bg-[#4EBD3E] text-white shadow-xs'
                  : 'bg-[#FFFDF1] border border-[#E2DCBE] text-[#A0AFA2] cursor-not-allowed'
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
        <div className="lg:col-span-5 bg-[#FFFDF1] border border-[#E2DCBE] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#59C749]/15 text-[#2B8A1E]">
                <Stethoscope className="w-4 h-4" />
              </span>
              <h4 className="font-extrabold text-sm text-[#142618]">
                Clinical Differential Diagnosis
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#59C749]/15 border border-[#59C749]/30 text-[#142618] font-bold">
              REALTIME AI PATHWAYS
            </span>
          </div>

          {/* Differential Diagnosis Probabilities */}
          <div className="space-y-3">
            {evaluation.differentials.map((diff, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white border border-[#E2DCBE] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#142618]">{diff.name}</span>
                  <span className={`font-mono font-black ${
                    diff.probability >= 50 ? 'text-rose-700' : diff.probability >= 25 ? 'text-amber-800' : 'text-[#2B8A1E]'
                  }`}>
                    {diff.probability}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#E2DCBE] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      diff.probability >= 50
                        ? 'bg-rose-600'
                        : diff.probability >= 25
                        ? 'bg-amber-500'
                        : 'bg-[#59C749]'
                    }`}
                    style={{ width: `${diff.probability}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#526857] font-mono pt-1">
                  <span>Action: {diff.action}</span>
                  <span className="font-bold text-[#142618]">{diff.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2DCBE] text-xs text-[#526857] space-y-1">
            <span className="font-bold text-[#2B8A1E] block">
              AI Triage Summary
            </span>
            <p className="text-[11px] leading-relaxed">
              Selected options trigger clinical decision pathways based on ACC/AHA guidelines for chest pain evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
