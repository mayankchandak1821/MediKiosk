import React, { useState } from 'react';
import { User, Stethoscope, ShieldCheck, ArrowRight, Lock, Activity, CheckCircle2, Key, Phone, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LoginPage({ onLogin, language = 'hi' }) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [abhaOrPhone, setAbhaOrPhone] = useState('91-8840-2910-4491');
  const [docId, setDocId] = useState('DOC-AIIA-48291');
  const [adminPass, setAdminPass] = useState('admin123');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'patient') {
      onLogin('patient', { name: 'Rajesh Verma', abha_id: abhaOrPhone || '91-8840-2910-4491', role: 'Patient' });
    } else if (selectedRole === 'doctor') {
      onLogin('doctor', { name: 'Dr. R. K. Sharma', doc_id: docId || 'DOC-48291', role: 'OPD Doctor' });
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
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
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
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
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
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
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
            <div className="border-b border-slate-800 pb-4 mb-6">
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

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {selectedRole === 'patient' && (
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
              )}

              {selectedRole === 'doctor' && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">
                    {t('login.usernameLabel')}
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
                {t('login.submitBtn')} <ArrowRight className="w-4 h-4" />
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
