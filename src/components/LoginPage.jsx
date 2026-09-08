import React, { useState } from 'react';
import { User, Stethoscope, ShieldCheck, ArrowRight, Activity, CheckCircle2, Key, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LoginPage({ onLogin, language = 'en' }) {
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
      <div className="bg-white border border-[#E2DCBE] rounded-3xl w-full max-w-4xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Branding & Role Highlights (5 Cols) */}
        <div className="md:col-span-5 bg-[#FBF8E6] p-8 flex flex-col justify-between border-r border-[#E2DCBE] space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#59C749] flex items-center justify-center text-white font-bold shadow-md shadow-[#59C749]/20">
              <Activity className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#142618]">MediKiosk EMR</h2>
              <p className="text-xs text-[#2B8A1E] font-medium mt-1">
                {t('login.title')}
              </p>
            </div>
            <p className="text-xs text-[#526857] leading-relaxed">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Quick Role Selection Cards */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold text-[#526857] uppercase tracking-wider block">
              {t('login.enterDetails')}
            </span>
            
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                selectedRole === 'patient'
                  ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618] font-bold shadow-xs'
                  : 'bg-white border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50 hover:text-[#142618]'
              }`}
            >
              <User className="w-4 h-4 text-[#59C749]" />
              <div>
                <span className="font-bold block text-[#142618]">{t('login.patient.title')}</span>
                <span className="text-[10px] text-[#526857]">{t('login.patient.subtitle')}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                selectedRole === 'doctor'
                  ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618] font-bold shadow-xs'
                  : 'bg-white border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50 hover:text-[#142618]'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-[#59C749]" />
              <div>
                <span className="font-bold block text-[#142618]">{t('login.doctor.title')}</span>
                <span className="text-[10px] text-[#526857]">{t('login.doctor.subtitle')}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618] font-bold shadow-xs'
                  : 'bg-white border-[#E2DCBE] text-[#526857] hover:border-[#59C749]/50 hover:text-[#142618]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#59C749]" />
              <div>
                <span className="font-bold block text-[#142618]">{t('login.admin.title')}</span>
                <span className="text-[10px] text-[#526857]">{t('login.admin.subtitle')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Login Form (7 Cols) */}
        <div className="md:col-span-7 p-8 space-y-6 flex flex-col justify-between bg-white text-[#142618]">
          <div>
            <div className="border-b border-[#E2DCBE] pb-4 mb-6">
              <h3 className="text-lg font-bold text-[#142618] flex items-center gap-2">
                {selectedRole === 'patient' && <User className="w-5 h-5 text-[#59C749]" />}
                {selectedRole === 'doctor' && <Stethoscope className="w-5 h-5 text-[#59C749]" />}
                {selectedRole === 'admin' && <ShieldCheck className="w-5 h-5 text-[#59C749]" />}
                {selectedRole === 'patient' 
                  ? t('login.patient.title')
                  : selectedRole === 'doctor' 
                  ? t('login.doctor.title') 
                  : t('login.admin.title')}
              </h3>
              <p className="text-xs text-[#526857] mt-1">
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
                  <label className="text-[#142618] font-bold block">
                    {t('login.usernameLabel')}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#526857] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={abhaOrPhone}
                      onChange={(e) => setAbhaOrPhone(e.target.value)}
                      placeholder={t('login.usernamePlaceholder')}
                      className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl pl-9 pr-3 py-2.5 text-[#142618] font-mono focus:outline-none focus:border-[#59C749] focus:ring-1 focus:ring-[#59C749]"
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'doctor' && (
                <div className="space-y-1.5">
                  <label className="text-[#142618] font-bold block">
                    {t('login.usernameLabel')}
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-[#526857] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={docId}
                      onChange={(e) => setDocId(e.target.value)}
                      placeholder="DOC-AIIA-48291"
                      className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl pl-9 pr-3 py-2.5 text-[#142618] font-mono focus:outline-none focus:border-[#59C749] focus:ring-1 focus:ring-[#59C749]"
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="space-y-1.5">
                  <label className="text-[#142618] font-bold block">
                    {t('login.passwordLabel')}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#526857] absolute left-3 top-3" />
                    <input
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      className="w-full bg-[#FFFDF1] border border-[#DED7BD] rounded-xl pl-9 pr-3 py-2.5 text-[#142618] font-mono focus:outline-none focus:border-[#59C749] focus:ring-1 focus:ring-[#59C749]"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {t('login.submitBtn')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[#E2DCBE] text-[11px] text-[#526857] flex items-center justify-between">
            <span>{t('app.title')}</span>
            <span className="flex items-center gap-1 text-[#2B8A1E] font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> ABDM Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
