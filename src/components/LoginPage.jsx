import React, { useState, useEffect } from 'react';
import { User, Stethoscope, ShieldCheck, ArrowRight, Lock, Activity, CheckCircle2, Key, Phone, Sparkles, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { patientStore } from '../services/patientStore';

export default function LoginPage({ onLogin, language = 'hi' }) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [patientMode, setPatientMode] = useState('login'); // 'login' | 'signup'
  const [savedPatients, setSavedPatients] = useState([]);
  const [abhaOrPhone, setAbhaOrPhone] = useState('91-8840-2910-4491');
  const [docId, setDocId] = useState('DOC-AIIA-48291');
  const [docSpecialty, setDocSpecialty] = useState('ayush'); // 'allopathy' | 'ayush'
  const [patientCareMode, setPatientCareMode] = useState('ayush'); // 'ayush' | 'allopathy'
  const [adminPass, setAdminPass] = useState('admin123');

  // Load saved patient accounts on mount
  useEffect(() => {
    setSavedPatients(patientStore.getPatients());
  }, []);

  // Sign Up Form State for Fake ABHA Creation
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
    aadhaar: ''
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'patient') {
      if (patientMode === 'signup') {
        const fakeAbhaId = patientStore.generateAbhaId();
        const patientRecord = {
          name: signUpForm.fullName || 'New Patient',
          full_name: signUpForm.fullName || 'New Patient',
          abha_id: fakeAbhaId,
          age: parseInt(signUpForm.age || '35', 10),
          gender: signUpForm.gender || 'Male',
          phone: signUpForm.phone || '9876543210',
          aadhaar_last4: signUpForm.aadhaar.slice(-4) || '4829',
          careMode: patientCareMode,
          role: 'Patient'
        };
        patientStore.savePatient(patientRecord);
        setSavedPatients(patientStore.getPatients());
        alert(`🎉 ABHA Account Created Successfully!\n\nYour ABHA ID: ${fakeAbhaId}\nPatient Name: ${patientRecord.name}\nTreatment System: ${patientCareMode === 'ayush' ? '🌿 AYUSH Ayurvedic OPD' : '🩺 Allopathic OPD'}\n\nPlease save your ABHA ID or Mobile Number. You can use it to log in again anytime!`);
        onLogin('patient', patientRecord);
      } else {
        const found = patientStore.findPatient(abhaOrPhone);
        if (found) {
          onLogin('patient', { ...found, careMode: patientCareMode, role: 'Patient' });
        } else {
          const isPhone = /^\d{10}$/.test(abhaOrPhone.replace(/\D/g, ''));
          const generatedAbha = abhaOrPhone.includes('91-') ? abhaOrPhone : patientStore.generateAbhaId();
          const newRecord = {
            name: abhaOrPhone.includes('91-') ? 'Patient User' : abhaOrPhone,
            full_name: abhaOrPhone.includes('91-') ? 'Patient User' : abhaOrPhone,
            abha_id: generatedAbha,
            phone: isPhone ? abhaOrPhone : '9876543210',
            age: 35,
            gender: 'Male',
            careMode: patientCareMode,
            role: 'Patient'
          };
          patientStore.savePatient(newRecord);
          setSavedPatients(patientStore.getPatients());
          onLogin('patient', newRecord);
        }
      }
    } else if (selectedRole === 'doctor') {
      const isAyush = docSpecialty === 'ayush';
      onLogin('doctor', {
        name: isAyush ? 'Vaidya Suresh Sharma' : 'Dr. R. K. Sharma',
        doc_id: docId || (isAyush ? 'DOC-AYUSH-8821' : 'DOC-AIIA-48291'),
        specialty: docSpecialty,
        role: isAyush ? 'AYUSH Ayurvedic Vaidya' : 'Allopathic OPD Physician'
      });
    } else if (selectedRole === 'admin') {
      onLogin('admin', { name: 'Hospital System Administrator', role: 'System Admin' });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Branding & Role Highlights (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-8 flex flex-col justify-between border-r border-slate-800 space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <Activity className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100">MediKiosk EMR</h2>
              <p className="text-xs text-teal-400 font-mono mt-1">
                {t('login.title')}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Quick Role Selection Cards */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('login.enterDetails')}
            </span>
            
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                selectedRole === 'patient'
                  ? 'bg-teal-500/20 border-teal-400 text-slate-100 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4 text-teal-400" />
              <div>
                <span className="font-bold block">{t('login.patient.title')}</span>
                <span className="text-[10px] opacity-75">{t('login.patient.subtitle')}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                selectedRole === 'doctor'
                  ? 'bg-teal-500/20 border-teal-400 text-slate-100 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold block">{t('login.doctor.title')}</span>
                <span className="text-[10px] opacity-75">{t('login.doctor.subtitle')}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-teal-500/20 border-teal-400 text-slate-100 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-bold block">{t('login.admin.title')}</span>
                <span className="text-[10px] opacity-75">{t('login.admin.subtitle')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Login Form (7 Cols) */}
        <div className="md:col-span-7 p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {selectedRole === 'patient' && <User className="w-5 h-5 text-teal-400" />}
                {selectedRole === 'doctor' && <Stethoscope className="w-5 h-5 text-cyan-400" />}
                {selectedRole === 'admin' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
                {selectedRole === 'patient' 
                  ? t('login.patient.title')
                  : selectedRole === 'doctor' 
                  ? t('login.doctor.title') 
                  : t('login.admin.title')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedRole === 'patient'
                  ? t('login.patient.subtitle')
                  : selectedRole === 'doctor'
                  ? t('login.doctor.subtitle')
                  : t('login.admin.subtitle')}
              </p>
            </div>

            {/* Sub-Tabs for Patient Mode (Sign In vs Create ABHA) */}
            {selectedRole === 'patient' && (
              <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => setPatientMode('login')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    patientMode === 'login' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Existing ABHA Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setPatientMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    patientMode === 'signup' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Create ABHA ID (Sign Up)
                </button>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              {selectedRole === 'patient' && patientMode === 'login' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">
                      {t('login.usernameLabel')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={abhaOrPhone}
                        onChange={(e) => setAbhaOrPhone(e.target.value)}
                        placeholder={t('login.usernamePlaceholder')}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>

                  {savedPatients.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Select Saved ABHA Account:
                      </span>
                      <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {savedPatients.map((p) => (
                          <button
                            type="button"
                            key={p.abha_id}
                            onClick={() => {
                              setAbhaOrPhone(p.abha_id);
                              onLogin('patient', { ...p, role: 'Patient' });
                            }}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              abhaOrPhone === p.abha_id
                                ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <QrCode className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <div>
                                <span className="font-bold text-xs block text-slate-100">{p.name || p.full_name}</span>
                                <span className="text-[10px] font-mono text-teal-300">{p.abha_id}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{p.age} Yrs | {p.gender}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedRole === 'patient' && patientMode === 'signup' && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Instant ABHA Health ID Generator
                    </span>
                    <span className="font-mono text-[10px] bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/40">ABDM Compliant</span>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Patient Name (As per Aadhaar)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={signUpForm.phone}
                        onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Aadhaar Last 4 Digits</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 5921"
                        value={signUpForm.aadhaar}
                        onChange={(e) => setSignUpForm({ ...signUpForm, aadhaar: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Age (Years)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 32"
                        value={signUpForm.age}
                        onChange={(e) => setSignUpForm({ ...signUpForm, age: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Gender</label>
                      <select
                        value={signUpForm.gender}
                        onChange={(e) => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'patient' && (
                <div className="mb-3 space-y-1.5">
                  <label className="text-slate-300 font-bold block text-xs">
                    Select Preferred Treatment System (चिकित्सा पद्धति)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPatientCareMode('ayush')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        patientCareMode === 'ayush'
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold block text-slate-100">🌿 AYUSH Ayurvedic OPD</span>
                      <span className="text-[10px] opacity-80 font-mono">Routes to Vaidya Doctor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPatientCareMode('allopathy')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        patientCareMode === 'allopathy'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold block text-slate-100">🩺 Allopathic OPD</span>
                      <span className="text-[10px] opacity-80 font-mono">Routes to MBBS Physician</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedRole === 'doctor' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">
                      Select Doctor Specialization / OPD Department
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setDocSpecialty('ayush');
                          setDocId('DOC-AYUSH-8821');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          docSpecialty === 'ayush'
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-bold block text-slate-100">🌿 AYUSH Ayurvedic OPD</span>
                        <span className="text-[10px] opacity-80">Vaidya Suresh Sharma (BAMS/MD)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDocSpecialty('allopathy');
                          setDocId('DOC-AIIA-48291');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          docSpecialty === 'allopathy'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-bold block text-slate-100">🩺 Allopathic OPD</span>
                        <span className="text-[10px] opacity-80">Dr. R. K. Sharma (MBBS/MD)</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">
                      Doctor License / Registration ID
                    </label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={docId}
                        onChange={(e) => setDocId(e.target.value)}
                        placeholder="DOC-AIIA-48291"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">
                    {t('login.passwordLabel')}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {selectedRole === 'patient' && patientMode === 'signup' 
                  ? '✨ Generate ABHA ID & Sign Up' 
                  : t('login.submitBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{t('app.title')}</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono"><CheckCircle2 className="w-3.5 h-3.5" /> ABDM Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
