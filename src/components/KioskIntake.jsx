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

export default function KioskIntake({ currentVitals, onEncounterSubmit, language, isDoctorAvailable = true, opdSessionNumber = 1 }) {
  // Step State: 1 = Patient Auth / Sign Up, 2 = Multimodal Voice & Touch Intake, 3 = Medical Document OCR, 4 = Review & Submit
  const [step, setStep] = useState(1);

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

  // Voice AI Recognition State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [aiSpeechPrompt, setAiSpeechPrompt] = useState('Welcome. Select Routine Checkup or tap your symptom category below.');

  // Document OCR State
  const [scannedDoc, setScannedDoc] = useState(SAMPLE_OCR_TEMPLATES[0].extracted);

  // Evaluate Triage Realtime
  const triage = clinicalEngine.evaluateTriage(answers, currentVitals);

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
    alert(`Success! Account created & ABHA Health Card generated:\nABHA ID: ${newAbhaId}`);
    setAuthTab('login');
    setStep(2);
  };

  // Voice Speech Recognition setup
  useEffect(() => {
    let recognition = null;
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event) => {
        let transcriptStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptStr += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcriptStr);

        const lower = transcriptStr.toLowerCase();
        if (lower.includes('routine') || lower.includes('checkup') || lower.includes('सामान्य')) {
          applyRoutineCheckupDefaults();
        } else if (lower.includes('chest') || lower.includes('heart') || lower.includes('सीने')) {
          handleCategorySelect('chest_pain');
        } else if (lower.includes('fever') || lower.includes('बुखार')) {
          handleCategorySelect('fever');
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };
    }

    if (isListening && recognition) {
      try { recognition.start(); } catch (e) {}
    } else if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }

    return () => {
      if (recognition) try { recognition.stop(); } catch (e) {}
    };
  }, [isListening, language]);

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm border border-teal-500/30">
              {step}
            </span>
            <div>
              <h2 className="font-bold text-slate-100 text-sm">
                {step === 1 && 'Step 1: Patient Sign Up & ABHA Authentication'}
                {step === 2 && 'Step 2: Pictorial Intake & Clinical Questionnaire'}
                {step === 3 && 'Step 3: Medical Document OCR Scanner'}
                {step === 4 && 'Step 4: Final OPD Review & Doctor Routing'}
              </h2>
              <p className="text-xs text-slate-400">Self-service digital intake kiosk for Primary Health Centers & Hospital OPDs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-8 bg-teal-400' : s < step ? 'w-4 bg-teal-500/50' : 'w-4 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Availability Status Banner */}
      {!isDoctorAvailable && (
        <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-2xl p-4 text-amber-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs uppercase">
              PAUSED
            </div>
            <div>
              <h4 className="font-extrabold text-amber-300 text-sm">OPD Physician Currently Unavailable / On Break</h4>
              <p className="text-xs text-amber-200/80">Your intake will be priority queued for OPD Session #{opdSessionNumber + 1}.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/20 rounded-lg border border-amber-500/30">
            SLOT: SESSION #{opdSessionNumber + 1}
          </span>
        </div>
      )}
      {triage.isRedFlag && (
        <div className="bg-rose-500/10 border-2 border-rose-500/50 rounded-2xl p-4 text-rose-200 flex items-start gap-4 animate-pulse shadow-lg shadow-rose-500/10">
          <div className="p-2 bg-rose-500 text-slate-950 rounded-xl font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-rose-400 text-base uppercase tracking-wider">
                Emergency Priority Triage Flagged (Red Flag Alert)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-slate-950 font-black text-xs">CRITICAL</span>
            </div>
            <p className="text-xs text-rose-200/90 mt-1 font-medium">
              High-priority physiological or clinical indicators detected. Encounter will skip routine queueing for immediate nursing triage.
            </p>
            <ul className="mt-2 text-xs font-mono space-y-1 text-rose-300">
              {triage.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* STEP 1: PATIENT IDENTITY, LOGIN & NEW PATIENT SIGN UP (KEY ADDITION) */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Header & Auth Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> ABHA Digital Health Account Portal
              </h3>
              <p className="text-xs text-slate-400">Sign up as a new patient or login with existing ABHA ID.</p>
            </div>

            {/* Auth Tab Switcher */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  authTab === 'login' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" /> Existing Patient Login
              </button>
              <button
                onClick={() => setAuthTab('signup')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  authTab === 'signup' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
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
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" /> Official ABHA Health Card
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                    VERIFIED ABDM
                  </span>
                </div>
                <div>
                  <p className="text-xl font-mono font-bold text-slate-100 tracking-wider">{patient.abha_id}</p>
                  <h4 className="text-base font-bold text-slate-200 mt-1">{patient.full_name}</h4>
                  <p className="text-xs text-slate-400">{patient.age} Yrs | {patient.gender} | Ph: {patient.phone}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Facility: AIIA Government Hospital OPD</span>
                  <span className="text-teal-400 font-semibold">Ready for Checkup</span>
                </div>
              </div>

              {/* Patient Quick Details & Care Mode */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Select Care Specialty</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCareMode('allopathy')}
                      className={`p-3 rounded-xl border text-xs text-left font-bold transition-all ${
                        careMode === 'allopathy'
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      🏥 Allopathy (Modern Medicine)
                    </button>
                    <button
                      onClick={() => setCareMode('ayush')}
                      className={`p-3 rounded-xl border text-xs text-left font-bold transition-all ${
                        careMode === 'ayush'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      🌿 AYUSH (Ayurveda OPD)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Full Patient Name</label>
                  <input
                    type="text"
                    value={patient.full_name}
                    onChange={e => setPatient({ ...patient, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DPDP Act 2023 Compliant: Encrypted identity authentication active.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: NEW PATIENT REGISTRATION / SIGN UP FORM (KEY ADDITION) */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> New Patient ABHA Registration
                </span>
                <span>Instant National Health ID Creation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block font-bold mb-1">Full Name (As per Aadhaar)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={signUpForm.full_name}
                    onChange={e => setSignUpForm({ ...signUpForm, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">Mobile Number (Aadhaar Linked)</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={signUpForm.phone}
                    onChange={e => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">Age (Years)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35"
                    value={signUpForm.age}
                    onChange={e => setSignUpForm({ ...signUpForm, age: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">Gender</label>
                  <select
                    value={signUpForm.gender}
                    onChange={e => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">Aadhaar Number (Last 4 digits optional)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4829"
                    value={signUpForm.aadhaar}
                    onChange={e => setSignUpForm({ ...signUpForm, aadhaar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">Preferred Kiosk Language</label>
                  <select
                    value={signUpForm.preferred_language}
                    onChange={e => setSignUpForm({ ...signUpForm, preferred_language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2 text-xs"
                >
                  <UserPlus className="w-4 h-4" /> Create ABHA ID & Start Intake
                </button>
              </div>
            </form>
          )}

          {authTab === 'login' && (
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setStep(2);
                  applyRoutineCheckupDefaults();
                  speakPrompt('Welcome to MediKiosk. Please select Routine Checkup or tap your symptoms below.');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
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
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-3.5 rounded-full font-bold transition-all shadow-lg flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                    : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'
                }`}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">Bhashini Multilingual Voice Capture</span>
                  {isListening && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 font-mono">LISTENING LIVE</span>}
                </div>
                <p className="text-xs text-slate-400 italic">
                  {voiceTranscript ? `"${voiceTranscript}"` : 'Speak naturally or tap Routine Checkup / symptom options on screen.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => speakPrompt(aiSpeechPrompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4 text-teal-400" /> Read Prompt Aloud
            </button>
          </div>

          {/* CATEGORY SELECTOR CARDS (ROUTINE CHECKUP VS FEVER VS CHEST PAIN VS AYUSH) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Intake Visit Type
              </span>
              <button
                onClick={applyRoutineCheckupDefaults}
                className="text-xs text-teal-400 hover:underline font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset to Routine Checkup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Option 1: ROUTINE CHECKUP (GREEN - NO RED FLAGS) */}
              <button
                onClick={() => handleCategorySelect('routine_checkup')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCategory === 'routine_checkup'
                    ? 'bg-gradient-to-br from-emerald-500/20 via-slate-900 to-teal-500/10 border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-100">Routine OPD Checkup</h4>
                </div>
                <p className="text-[11px] text-slate-400">General wellness, BP, Sugar & Routine Physical Evaluation.</p>
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono font-bold rounded">
                  ROUTINE QUEUE
                </span>
              </button>

              {/* Option 2: AYUSH WELLNESS */}
              <button
                onClick={() => handleCategorySelect('ayush_wellness')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCategory === 'ayush_wellness'
                    ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-yellow-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Feather className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-100">AYUSH Wellness</h4>
                </div>
                <p className="text-[11px] text-slate-400">Prakriti assessment, Agni evaluation & Ayurvedic counseling.</p>
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 font-mono font-bold rounded">
                  AYUSH OPD
                </span>
              </button>

              {/* Option 3: FEVER */}
              <button
                onClick={() => handleCategorySelect('fever')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCategory === 'fever'
                    ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-orange-500/10 border-amber-400 shadow-lg'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Thermometer className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-100">Fever & Infection</h4>
                </div>
                <p className="text-[11px] text-slate-400">High temperature, flu-like symptoms & chills.</p>
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-300 font-mono font-bold rounded">
                  INFLAMMATION
                </span>
              </button>

              {/* Option 4: CHEST PAIN / EMERGENCY */}
              <button
                onClick={() => handleCategorySelect('chest_pain')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCategory === 'chest_pain'
                    ? 'bg-gradient-to-br from-rose-500/20 via-slate-900 to-red-500/10 border-rose-500 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <Heart className="w-4 h-4 fill-current" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-100">Chest Pain / Emergency</h4>
                </div>
                <p className="text-[11px] text-slate-400">Squeezing pressure, breathlessness or pain radiating to arm.</p>
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono font-bold rounded">
                  RED FLAG TRIAGE
                </span>
              </button>
            </div>
          </div>

          {/* Vitals Telemetry Gauges with Live Triage Risk Score */}
          <VisualVitalsGauges vitals={currentVitals} answers={answers} activeSource="Peripheral Sensors" />

          {/* Anatomical Body Map */}
          <VisualBodyMap
            selectedSite={answers.site}
            onSelectSite={(siteId) => setAnswers({ ...answers, site: siteId })}
          />

          {/* Wong-Baker Pain Scale */}
          <VisualPainScale
            value={answers.severity}
            onChange={(rating) => setAnswers({ ...answers, severity: rating })}
          />

          {/* Branching Symptom Options */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                Symptom Details ({selectedCategory.toUpperCase()})
              </h3>
              <span className="text-[11px] text-slate-400 italic">Tap any selected option to deselect / toggle off</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Discomfort Character (Tap to toggle)
                </label>
                <div className="space-y-2">
                  {SOCRATES_QUESTIONS.character.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, character: answers.character === opt.id ? '' : opt.id })}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${
                        answers.character === opt.id
                          ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label} {answers.character === opt.id && '(Selected - Tap to Deselect)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Pain Radiation (Does it spread? Tap to toggle)
                </label>
                <div className="space-y-2">
                  {SOCRATES_QUESTIONS.radiation.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, radiation: answers.radiation === opt.id ? 'none' : opt.id })}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${
                        answers.radiation === opt.id
                          ? opt.isRedFlag
                            ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow'
                            : 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label} {answers.radiation === opt.id && '(Selected - Tap to Deselect)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Associated Symptoms Multi-Select Toggle */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
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
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
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
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Auth
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
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
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Questionnaire
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
            >
              Review & Submit to Doctor Queue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL REVIEW & SUBMIT */}
      {step === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" /> Final Summary Confirmation
            </h3>
            <p className="text-xs text-slate-400">Review your structured clinical intake summary before submitting to the OPD Doctor screen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Details & Vitals</h4>
              <div>
                <p className="font-bold text-sm text-slate-200">{patient.full_name}</p>
                <p className="text-xs text-slate-400">ABHA: {patient.abha_id}</p>
                <p className="text-xs text-slate-400">{patient.age} Yrs | {patient.gender}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-xs">
                <p className="text-amber-400">Temperature: {currentVitals.temperature_c}°C</p>
                <p className="text-cyan-400">SpO2: {currentVitals.spo2_percent}%</p>
                <p className="text-rose-400">Heart Rate: {currentVitals.heart_rate_bpm} BPM</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SOCRATES / AYUSH Intake Summary</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-bold uppercase">{careMode}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Symptom Location:</span>
                  <span className="font-bold text-slate-200">{answers.site}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pain Character:</span>
                  <span className="font-bold text-slate-200">{answers.character}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Radiation:</span>
                  <span className="font-bold text-slate-200">{answers.radiation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pain Severity:</span>
                  <span className="font-bold text-amber-400">{answers.severity} / 10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Scanner
            </button>
            <button
              onClick={handleSubmitIntake}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl hover:brightness-110 transition-all"
            >
              Submit to Doctor OPD Queue & Sync ABHA <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
