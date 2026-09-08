import React, { useState, useEffect } from 'react';
import { 
  User, Mic, MicOff, Volume2, FileText, CheckCircle2, AlertTriangle, 
  ChevronRight, Heart, Brain, Wind, Activity, Feather, Upload, ShieldCheck, 
  Sparkles, RefreshCw, QrCode, ArrowLeft, Thermometer, Eye, UserPlus, LogIn,
  Stethoscope, Shield, Phone, Calendar
} from 'lucide-react';
import { SYMPTOM_CATEGORIES, SOCRATES_QUESTIONS, AYUSH_QUESTIONS, clinicalEngine } from '../services/clinicalEngine';
import { SAMPLE_OCR_TEMPLATES, ocrEngine } from '../services/ocrEngine';
import VisualBodyMap from './VisualBodyMap';
import VisualPainScale from './VisualPainScale';
import VisualVitalsGauges from './VisualVitalsGauges';
import VisualDocumentScanner from './VisualDocumentScanner';
import ClinicalDecisionTreeWizard from './ClinicalDecisionTreeWizard';
import { decisionTreeEngine } from '../services/decisionTreeEngine';

export default function KioskIntake({ currentVitals, onEncounterSubmit, language, isDoctorAvailable = true, opdSessionNumber = 1, initialStep = 2 }) {
  const isHindi = language === 'hi';
  // Step State: 1 = Patient Auth / Sign Up, 2 = Multimodal Voice & Touch Intake, 3 = Medical Document OCR, 4 = Review & Submit
  const [step, setStep] = useState(initialStep);

  // Auth Mode: 'login' | 'signup'
  const [authTab, setAuthTab] = useState('login');

  // Patient Info State
  const [patient, setPatient] = useState({
    abha_id: '91-8840-2910-4491',
    full_name: 'Rajesh Verma',
    age: 52,
    gender: 'Male',
    phone: '9876543210',
    preferred_language: language || 'en',
    aadhaar_last4: '4829'
  });

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    full_name: '',
    phone: '',
    age: '',
    gender: 'Male',
    aadhaar: '',
    preferred_language: language || 'en'
  });

  // Clinical Intake Mode: 'allopathy' | 'ayush'
  const [careMode, setCareMode] = useState('allopathy');

  // Intake Questionnaire State (DEFAULT TO ROUTINE CHECKUP - NO RED FLAGS)
  const [selectedCategory, setSelectedCategory] = useState('routine_checkup');
  const [answers, setAnswers] = useState({
    site: 'head_forehead',
    onset: 'gradual_hours',
    character: 'dull_aching',
    radiation: 'none',
    associations: [],
    severity: 2,
    // AYUSH
    prakriti: 'pitta',
    agni: 'samagni',
    koshtha: 'madhyama',
    ahara_vihara: ['regular_diet']
  });

  // Clinical Decision Tree State
  const [treeAnswers, setTreeAnswers] = useState({
    chest_character: 'crushing_pressure',
    chest_radiation: 'rad_arm_jaw_neck',
    chest_triggers: 'trig_exertion',
    chest_associated: ['assoc_sweating', 'assoc_dyspnea'],
    chest_risk_history: ['hx_cad', 'hx_htn']
  });

  // Voice AI Recognition State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [aiSpeechPrompt, setAiSpeechPrompt] = useState('Welcome. Select Routine Checkup or tap your symptom category below.');

  // Document OCR State
  const [scannedDoc, setScannedDoc] = useState(SAMPLE_OCR_TEMPLATES[0].extracted);

  // Evaluate Decision Tree & Triage Realtime
  const decisionTreeEval = decisionTreeEngine.evaluateChestPainTree(treeAnswers, currentVitals);
  const triage = selectedCategory === 'chest_pain' && decisionTreeEval.isRedFlag
    ? { priority: decisionTreeEval.priority, isRedFlag: true, riskPercentage: decisionTreeEval.riskPercentage, riskLevel: 'HIGH_CRITICAL', redFlags: decisionTreeEval.redFlags }
    : clinicalEngine.evaluateTriage(answers, currentVitals);

  // Reset to Routine Checkup Defaults
  const applyRoutineCheckupDefaults = () => {
    setSelectedCategory('routine_checkup');
    setAnswers({
      site: 'head_forehead',
      onset: 'gradual_hours',
      character: 'dull_aching',
      radiation: 'none',
      associations: [],
      severity: 2,
      prakriti: 'pitta',
      agni: 'samagni',
      koshtha: 'madhyama',
      ahara_vihara: ['regular_diet']
    });
  };

  // Switch Category & Clean State
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'routine_checkup') {
      applyRoutineCheckupDefaults();
    } else if (catId === 'chest_pain') {
      setAnswers(prev => ({
        ...prev,
        site: 'chest_center',
        character: 'pressure_squeezing',
        radiation: 'to_arm_jaw',
        associations: ['shortness_of_breath'],
        severity: 8
      }));
    } else if (catId === 'fever') {
      setAnswers(prev => ({
        ...prev,
        site: 'head_forehead',
        character: 'burning_heat',
        radiation: 'none',
        associations: ['chills_sweats'],
        severity: 5
      }));
    }
  };

  // Handle New Patient Sign Up
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpForm.full_name || !signUpForm.phone) {
      alert('Please fill in your Full Name and Mobile Number.');
      return;
    }

    const newAbhaId = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const registeredPatient = {
      abha_id: newAbhaId,
      full_name: signUpForm.full_name,
      age: parseInt(signUpForm.age, 10) || 30,
      gender: signUpForm.gender,
      phone: signUpForm.phone,
      preferred_language: signUpForm.preferred_language,
      aadhaar_last4: signUpForm.aadhaar.slice(-4) || '9999'
    };

    setPatient(registeredPatient);
    alert(`Account Registered! New ABHA Health ID created: ${newAbhaId}`);
    setAuthTab('login');
  };

  const speakPrompt = (text) => {
    setAiSpeechPrompt(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitIntake = async () => {
    const fhirPayload = clinicalEngine.generateFHIRPayload(
      patient,
      { id: `ENC-${Date.now().toString().slice(-4)}`, category: selectedCategory },
      { ...answers, symptom_category_name: SYMPTOM_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Routine Checkup' },
      currentVitals,
      triage,
      scannedDoc
    );

    const encounterRecord = {
      id: `ENC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patient,
      careMode,
      symptomCategory: selectedCategory === 'routine_checkup' ? 'Routine OPD General Checkup' : SYMPTOM_CATEGORIES.find(c => c.id === selectedCategory)?.name,
      answers,
      treeAnswers,
      decisionTreeEval,
      vitals: currentVitals,
      triage,
      scannedDoc,
      fhirPayload,
      status: triage.isRedFlag ? 'PRIORITY_ALERT' : 'QUEUED'
    };

    try {
      await fetch('http://localhost:5000/api/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encounterRecord)
      });
    } catch (err) {
      console.warn('Backend encounter sync failed:', err);
    }

    onEncounterSubmit(encounterRecord);
    alert('Intake completed! Your summary & FHIR record have been pushed to the OPD Doctor Dashboard.');
    setStep(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Journey Stepper */}
      <div className="bg-white border border-[#E2DCBE] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#59C749]/15 text-[#142618] font-bold flex items-center justify-center text-sm border border-[#59C749]/40">
              {step}
            </span>
            <div>
              <h2 className="font-bold text-[#142618] text-sm">
                {step === 1 && 'Step 1: Patient Registration & Health Account Authentication'}
                {step === 2 && 'Step 2: Visual Intake & Clinical Questionnaire'}
                {step === 3 && 'Step 3: Medical Document OCR Scanner'}
                {step === 4 && 'Step 4: Final Clinical Review & Doctor Queue Routing'}
              </h2>
              <p className="text-xs text-[#526857]">
                Self-service digital intake kiosk for Primary Health Centers & Hospital OPDs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-8 bg-[#59C749]' : s < step ? 'w-4 bg-[#59C749]/50' : 'w-4 bg-[#E2DCBE]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Availability Status Banner */}
      {!isDoctorAvailable && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div>
            <h4 className="font-bold text-amber-950 text-sm">OPD Physician Currently On Break</h4>
            <p className="text-xs text-amber-800">Your intake will be automatically queued for OPD Session #{opdSessionNumber + 1}.</p>
          </div>
          <span className="text-xs text-amber-900 font-semibold">
            Next Slot: Session #{opdSessionNumber + 1}
          </span>
        </div>
      )}
      {triage.isRedFlag && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-rose-950 flex items-start gap-3.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-rose-950 text-sm">
                Emergency Priority Triage Flagged
              </h3>
              <span className="text-xs text-rose-700 font-bold">Priority Red Flag</span>
            </div>
            <p className="text-xs text-rose-800 mt-1">
              High-priority clinical indicators detected. Encounter will be routed for immediate medical officer evaluation.
            </p>
            <ul className="mt-2 text-xs space-y-1 text-rose-900">
              {triage.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span>• {flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* STEP 1: PATIENT IDENTITY, LOGIN & NEW PATIENT SIGN UP */}
      {step === 1 && (
        <div className="bg-white border border-[#E2DCBE] rounded-2xl p-6 space-y-6 shadow-xs">
          {/* Header & Auth Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DCBE] pb-4">
            <div>
              <h3 className="font-bold text-lg text-[#142618] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#59C749]" /> ABHA Digital Health Account Portal
              </h3>
              <p className="text-xs text-[#526857]">Sign up as a new patient or login with existing ABHA ID.</p>
            </div>

            {/* Auth Tab Switcher */}
            <div className="flex items-center p-1 bg-[#FFFDF1] rounded-xl border border-[#E2DCBE]">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authTab === 'login' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
                }`}
              >
                <LogIn className="w-4 h-4" /> Existing Patient Login
              </button>
              <button
                onClick={() => setAuthTab('signup')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authTab === 'signup' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
                }`}
              >
                <UserPlus className="w-4 h-4" /> New Patient Sign Up
              </button>
            </div>
          </div>

          {/* TAB A: EXISTING PATIENT LOGIN */}
          {authTab === 'login' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Digital ABHA Card */}
              <div className="p-6 rounded-2xl bg-[#FFFDF1] border border-[#E2DCBE] flex flex-col justify-between space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142618] uppercase tracking-widest flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#59C749]" /> Official ABHA Health Card
                  </span>
                  <span className="text-xs text-[#2B8A1E] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified ABDM
                  </span>
                </div>
                <div>
                  <p className="text-xl font-mono font-bold text-[#142618] tracking-wider">{patient.abha_id}</p>
                  <h4 className="text-base font-bold text-[#142618] mt-1">{patient.full_name}</h4>
                  <p className="text-xs text-[#526857]">{patient.age} Yrs | {patient.gender} | Ph: {patient.phone}</p>
                </div>
                <div className="pt-3 border-t border-[#E2DCBE] flex items-center justify-between text-xs text-[#526857]">
                  <span>Facility: AIIA Government Hospital OPD</span>
                  <span className="text-[#2B8A1E] font-semibold">Ready for Checkup</span>
                </div>
              </div>

              {/* Patient Quick Details & Care Mode */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#526857] block mb-1">Select Care Specialty</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCareMode('allopathy')}
                      className={`p-3 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer ${
                        careMode === 'allopathy'
                          ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618] shadow-xs'
                          : 'bg-[#FFFDF1] border-[#E2DCBE] text-[#526857]'
                      }`}
                    >
                      🏥 Allopathy (Modern Medicine)
                    </button>
                    <button
                      onClick={() => setCareMode('ayush')}
                      className={`p-3 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer ${
                        careMode === 'ayush'
                          ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
                          : 'bg-[#FFFDF1] border-[#E2DCBE] text-[#526857]'
                      }`}
                    >
                      🌿 AYUSH (Ayurveda OPD)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#526857] block mb-1">Full Patient Name</label>
                  <input
                    type="text"
                    value={patient.full_name}
                    onChange={e => setPatient({ ...patient, full_name: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl px-3.5 py-2.5 text-sm text-[#142618] focus:outline-none focus:border-[#59C749] focus:ring-1 focus:ring-[#59C749]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] text-xs text-[#526857] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59C749] shrink-0" />
                  <span>DPDP Act 2023 Compliant: Encrypted identity authentication active.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: NEW PATIENT REGISTRATION / SIGN UP FORM */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#59C749]/10 border border-[#59C749]/30 text-[#142618] text-xs flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#59C749]" /> New Patient ABHA Registration
                </span>
                <span className="text-[#526857]">Instant National Health ID Creation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#142618] block font-bold mb-1">Full Name (As per Aadhaar)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={signUpForm.full_name}
                    onChange={e => setSignUpForm({ ...signUpForm, full_name: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl p-3 text-[#142618] focus:border-[#59C749] focus:outline-none focus:ring-1 focus:ring-[#59C749]"
                  />
                </div>

                <div>
                  <label className="text-[#142618] block font-bold mb-1">Mobile Number (Aadhaar Linked)</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={signUpForm.phone}
                    onChange={e => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl p-3 text-[#142618] focus:border-[#59C749] focus:outline-none focus:ring-1 focus:ring-[#59C749]"
                  />
                </div>

                <div>
                  <label className="text-[#142618] block font-bold mb-1">Age (Years)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={signUpForm.age}
                    onChange={e => setSignUpForm({ ...signUpForm, age: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl p-3 text-[#142618] focus:border-[#59C749] focus:outline-none focus:ring-1 focus:ring-[#59C749]"
                  />
                </div>

                <div>
                  <label className="text-[#142618] block font-bold mb-1">Gender</label>
                  <select
                    value={signUpForm.gender}
                    onChange={e => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl p-3 text-[#142618] focus:border-[#59C749] focus:outline-none focus:ring-1 focus:ring-[#59C749]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#142618] block font-bold mb-1">Aadhaar Number (Last 4 digits optional)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4829"
                    value={signUpForm.aadhaar}
                    onChange={e => setSignUpForm({ ...signUpForm, aadhaar: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl p-3 text-[#142618] focus:border-[#59C749] focus:outline-none focus:ring-1 focus:ring-[#59C749]"
                  />
                </div>

                <div>
                  <label className="text-[#142618] block font-bold mb-1">Preferred Kiosk Language</label>
                  <select
                    value={signUpForm.preferred_language}
                    onChange={e => setSignUpForm({ ...signUpForm, preferred_language: e.target.value })}
                    className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl p-3 text-[#142618] focus:border-[#59C749] focus:outline-none focus:ring-1 focus:ring-[#59C749]"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="mr">Marathi</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Create ABHA ID & Start Intake
                </button>
              </div>
            </form>
          )}

          {authTab === 'login' && (
            <div className="flex justify-end pt-4 border-t border-[#E2DCBE]">
              <button
                onClick={() => {
                  setStep(2);
                  applyRoutineCheckupDefaults();
                  speakPrompt('Welcome to MediKiosk. Please select Routine Checkup or tap your symptoms below.');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Proceed to Clinical Intake <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: MULTIMODAL VOICE & TOUCH INTAKE WITH CATEGORY SELECTOR */}
      {step === 2 && (
        <div className="space-y-6">
          {/* AI Voice Assistant Bar */}
          <div className="bg-white border border-[#E2DCBE] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-3.5 rounded-full font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-[#59C749] text-white hover:bg-[#4EBD3E]'
                }`}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#142618]">Multilingual Voice Capture</span>
                  {isListening && <span className="text-xs text-rose-600 font-semibold">• Listening</span>}
                </div>
                <p className="text-xs text-[#526857] italic">
                  {voiceTranscript ? `"${voiceTranscript}"` : 'Speak naturally or tap Routine Checkup / symptom options on screen.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => speakPrompt(aiSpeechPrompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF1] hover:bg-[#F7F4E1] text-[#142618] border border-[#E2DCBE] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#59C749]" /> Read Prompt Aloud
            </button>
          </div>

          {/* CATEGORY SELECTOR CARDS */}
          <div className="bg-white border border-[#E2DCBE] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-2">
              <span className="text-xs font-bold text-[#526857] uppercase tracking-wider block">
                Select Intake Visit Type
              </span>
              <button
                onClick={applyRoutineCheckupDefaults}
                className="text-xs text-[#2B8A1E] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset to Routine Checkup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Option 1: ROUTINE CHECKUP */}
              <button
                onClick={() => handleCategorySelect('routine_checkup')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCategory === 'routine_checkup'
                    ? 'bg-[#59C749]/15 border-[#59C749] shadow-xs'
                    : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-[#59C749]/20 text-[#2B8A1E]">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs text-[#142618]">Routine OPD Checkup</h4>
                </div>
                <p className="text-xs text-[#526857]">General wellness, BP, Sugar & Routine Physical Evaluation.</p>
              </button>

              {/* Option 2: AYUSH WELLNESS */}
              <button
                onClick={() => handleCategorySelect('ayush_wellness')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCategory === 'ayush_wellness'
                    ? 'bg-amber-100 border-amber-400 shadow-xs'
                    : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-amber-200 text-amber-900">
                    <Feather className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs text-[#142618]">AYUSH Wellness</h4>
                </div>
                <p className="text-xs text-[#526857]">Prakriti assessment, Agni evaluation & Ayurvedic counseling.</p>
              </button>

              {/* Option 3: FEVER */}
              <button
                onClick={() => handleCategorySelect('fever')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCategory === 'fever'
                    ? 'bg-amber-100 border-amber-400 shadow-xs'
                    : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-amber-200 text-amber-900">
                    <Thermometer className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs text-[#142618]">Fever & Infection</h4>
                </div>
                <p className="text-xs text-[#526857]">High temperature, flu-like symptoms & chills.</p>
              </button>

              {/* Option 4: CHEST PAIN / EMERGENCY */}
              <button
                onClick={() => handleCategorySelect('chest_pain')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCategory === 'chest_pain'
                    ? 'bg-rose-100 border-rose-400 shadow-xs'
                    : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-rose-200 text-rose-800">
                    <Heart className="w-4 h-4 fill-current" />
                  </span>
                  <h4 className="font-bold text-xs text-[#142618]">Chest Pain / Emergency</h4>
                </div>
                <p className="text-xs text-[#526857]">Squeezing pressure, breathlessness or pain radiating to arm.</p>
              </button>
            </div>
          </div>

          {/* 1. Pictorial Zoomable Anatomical Body Map */}
          <VisualBodyMap
            selectedSite={answers.site}
            onSelectSite={(siteId) => setAnswers({ ...answers, site: siteId })}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />

          {/* 2. DYNAMIC DECISION TREE QUESTIONNAIRE CARDS */}
          <ClinicalDecisionTreeWizard
            category={selectedCategory}
            vitals={currentVitals}
            treeAnswers={treeAnswers}
            onTreeAnswersChange={(updatedTreeAnswers) => setTreeAnswers(updatedTreeAnswers)}
            language="en"
          />

          {/* Vitals Telemetry Gauges with Live Triage Risk Score */}
          <VisualVitalsGauges vitals={currentVitals} answers={answers} activeSource="Peripheral Sensors" />

          {/* Wong-Baker Pain Scale */}
          <VisualPainScale
            value={answers.severity}
            onChange={(rating) => setAnswers({ ...answers, severity: rating })}
          />

          {/* Branching Symptom Options */}
          <div className="bg-white border border-[#E2DCBE] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#142618] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#59C749]" />
                Symptom Details ({selectedCategory.toUpperCase()})
              </h3>
              <span className="text-[11px] text-[#526857] italic">Tap any selected option to deselect / toggle off</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#526857] uppercase tracking-wider block mb-2">
                  Discomfort Character (Tap to toggle)
                </label>
                <div className="space-y-2">
                  {SOCRATES_QUESTIONS.character.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, character: answers.character === opt.id ? '' : opt.id })}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        answers.character === opt.id
                          ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618] font-bold shadow-xs'
                          : 'bg-[#FFFDF1] border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50'
                      }`}
                    >
                      {opt.label} {answers.character === opt.id && '(Selected - Tap to Deselect)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#526857] uppercase tracking-wider block mb-2">
                  Pain Radiation (Does it spread? Tap to toggle)
                </label>
                <div className="space-y-2">
                  {SOCRATES_QUESTIONS.radiation.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, radiation: answers.radiation === opt.id ? 'none' : opt.id })}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        answers.radiation === opt.id
                          ? opt.isRedFlag
                            ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold shadow-xs'
                            : 'bg-[#59C749]/15 border-[#59C749] text-[#142618] font-bold shadow-xs'
                          : 'bg-[#FFFDF1] border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50'
                      }`}
                    >
                      {opt.label} {answers.radiation === opt.id && '(Selected - Tap to Deselect)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Associated Symptoms Multi-Select Toggle */}
            <div className="pt-2 border-t border-[#E2DCBE]">
              <label className="text-xs font-bold text-[#526857] uppercase tracking-wider block mb-2">
                Associated Symptoms (Multi-Select / Tap to Toggle On or Off)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'shortness_of_breath', label: '🫁 Shortness of Breath' },
                  { id: 'cold_sweats', label: '💦 Cold Sweats' },
                  { id: 'nausea_dizziness', label: '🤢 Nausea / Dizziness' },
                  { id: 'fever_chills', label: '🌡️ Fever / Chills' },
                  { id: 'fatigue', label: '😴 Muscle Fatigue' },
                  { id: 'cough', label: '🗣️ Dry Cough' }
                ].map(assoc => {
                  const isSelected = answers.associations?.includes(assoc.id);
                  return (
                    <button
                      key={assoc.id}
                      onClick={() => {
                        const current = answers.associations || [];
                        const updated = isSelected
                          ? current.filter(item => item !== assoc.id)
                          : [...current, assoc.id];
                        setAnswers({ ...answers, associations: updated });
                      }}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#59C749]/20 border-[#59C749] text-[#142618] font-bold shadow-xs'
                          : 'bg-[#FFFDF1] border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50'
                      }`}
                    >
                      {assoc.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2DCBE] hover:bg-[#F7F4E1] text-[#142618] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Auth
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Proceed to Document Scanner <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MEDICAL DOCUMENT OCR CAMERA SCANNER */}
      {step === 3 && (
        <div className="space-y-6">
          <VisualDocumentScanner
            scannedDoc={scannedDoc}
            onDocScan={(data) => setScannedDoc(data)}
          />

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2DCBE] hover:bg-[#F7F4E1] text-[#142618] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Questionnaire
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-3 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Review & Submit to Doctor Queue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL REVIEW & SUBMIT */}
      {step === 4 && (
        <div className="bg-white border border-[#E2DCBE] rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-[#E2DCBE] pb-4">
            <h3 className="font-bold text-lg text-[#142618] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#59C749]" /> Final Summary Confirmation
            </h3>
            <p className="text-xs text-[#526857]">Review your structured clinical intake summary before submitting to the OPD Doctor screen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-3">
              <h4 className="text-xs font-bold text-[#526857] uppercase tracking-wider">Patient Details & Vitals</h4>
              <div>
                <p className="font-bold text-sm text-[#142618]">{patient.full_name}</p>
                <p className="text-xs text-[#526857]">ABHA: {patient.abha_id}</p>
                <p className="text-xs text-[#526857]">{patient.age} Yrs | {patient.gender}</p>
              </div>
              <div className="pt-2 border-t border-[#E2DCBE] space-y-1 font-mono text-xs">
                <p className="text-amber-800">Temperature: {currentVitals.temperature_c}°C</p>
                <p className="text-[#2B8A1E]">SpO2: {currentVitals.spo2_percent}%</p>
                <p className="text-rose-700">Heart Rate: {currentVitals.heart_rate_bpm} BPM</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#526857] uppercase tracking-wider">SOCRATES / AYUSH Intake Summary</h4>
                <span className="text-xs text-[#2B8A1E] font-medium capitalize">{careMode} Care Mode</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#526857] block">Symptom Location:</span>
                  <span className="font-bold text-[#142618]">{answers.site}</span>
                </div>
                <div>
                  <span className="text-[#526857] block">Pain Character:</span>
                  <span className="font-bold text-[#142618]">{answers.character}</span>
                </div>
                <div>
                  <span className="text-[#526857] block">Radiation:</span>
                  <span className="font-bold text-[#142618]">{answers.radiation}</span>
                </div>
                <div>
                  <span className="text-[#526857] block">Pain Severity:</span>
                  <span className="font-bold text-amber-800">{answers.severity} / 10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#E2DCBE]">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2DCBE] hover:bg-[#F7F4E1] text-[#142618] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Scanner
            </button>
            <button
              onClick={handleSubmitIntake}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              Submit to Doctor OPD Queue & Sync ABHA <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
