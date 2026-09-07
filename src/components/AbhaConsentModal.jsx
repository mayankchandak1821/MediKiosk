import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, X, Globe, FileText } from 'lucide-react';

export default function AbhaConsentModal({ isOpen, onClose, onAccept, aadhaarNumber }) {
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedShare, setAgreedShare] = useState(false);

  if (!isOpen) return null;

  const canProceed = agreedTerms && agreedShare;

  const content = {
    en: {
      title: "ABDM Citizen Consent & Authorization",
      subtitle: "Ayushman Bharat Digital Mission (ABDM)",
      regulation: "Compliant with DPDP Act 2023 & ABDM Consent Version 1.4",
      scope: "Consent Scope: abha-enrollment (v1.4)",
      point1_title: "Voluntary Aadhaar Authentication",
      point1_desc: "I hereby voluntarily give my explicit consent to use my Aadhaar Number / Virtual ID to authenticate with UIDAI and ABDM for the purpose of creating or retrieving my 14-digit ABHA ID.",
      point2_title: "Creation of Digital Health Account",
      point2_desc: "I understand that my demographic details (Name, Gender, Date of Birth, Address, and Photo) will be fetched securely from UIDAI and linked to my Ayushman Bharat Health Account (ABHA).",
      point3_title: "Clinical OPD Intake at AIIA MediKiosk",
      point3_desc: "I authorize the MediKiosk platform to link my generated ABHA ID with my current OPD clinical encounter and generate an HL7 FHIR electronic health record bundle.",
      term1: "I confirm that the Aadhaar details provided belong to me and I consent to OTP verification on my registered mobile number.",
      term2: "I agree to the National Health Authority (NHA) privacy policy and consent framework version 1.4.",
      declineBtn: "Decline & Cancel",
      acceptBtn: "I Agree & Request Aadhaar OTP",
      maskedAadhaar: aadhaarNumber ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : "XXXX-XXXX-XXXX"
    },
    hi: {
      title: "आयुष्मान भारत (ABDM) नागरिक सहमति एवं प्राधिकार",
      subtitle: "भारत सरकार - राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA)",
      regulation: "डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 एवं सहमति v1.4 अनुसार",
      scope: "सहमति कोड: abha-enrollment (v1.4)",
      point1_title: "स्वैच्छिक आधार प्रमाणीकरण",
      point1_desc: "मैं स्वेच्छा से 14-अंकीय आभा (ABHA) आईडी बनाने/प्राप्त करने हेतु यूआईडीएआई (UIDAI) और एबीडीएम के माध्यम से अपने आधार विवरण के प्रमाणीकरण की सहमति देता/देती हूँ।",
      point2_title: "डिजिटल स्वास्थ्य खाता निर्माण",
      point2_desc: "मैं समझता/समझती हूँ कि मेरा जनसांख्यिकीय विवरण (नाम, लिंग, जन्मतिथि, पता और फोटो) यूआईडीएआई से सुरक्षित रूप से प्राप्त कर मेरे आभा खाते से जोड़ा जाएगा।",
      point3_title: "एम्स/अखिल भारतीय आयुर्वेद संस्थान कियोस्क ओपीडी परामर्श",
      point3_desc: "मैं मेडीकियोस्क को अपनी ओपीडी पर्ची और डिजिटल एफएचआईआर (FHIR) स्वास्थ्य रिकॉर्ड के निर्माण हेतु अपनी आभा आईडी लिंक करने के लिए अधिकृत करता/करती हूँ।",
      term1: "मैं पुष्टि करता/करती हूँ कि दिया गया आधार मेरा है और मैं पंजीकृत मोबाइल पर ओटीपी सत्यापन की अनुमति देता/देती हूँ।",
      term2: "मैं राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) की गोपनीयता नीति और सहमति फ्रेमवर्क v1.4 से सहमत हूँ।",
      declineBtn: "अस्वीकार करें",
      acceptBtn: "सहमति दें एवं आधार OTP भेजें",
      maskedAadhaar: aadhaarNumber ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : "XXXX-XXXX-XXXX"
    }
  };

  const t = content[lang];

  const handleConfirm = () => {
    if (canProceed) {
      onAccept({
        code: "abha-enrollment",
        version: "1.4",
        timestamp: new Date().toISOString(),
        language: lang
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-teal-950/80 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {t.title}
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold border border-teal-500/30">
                  NHA v1.4
                </span>
              </h3>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bilingual Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'हिन्दी में पढ़ें' : 'Read in English'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Regulatory Badges */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 font-mono text-emerald-400">
              <Lock className="w-3.5 h-3.5" /> {t.regulation}
            </span>
            <span className="font-mono text-slate-400">
              Aadhaar: <strong className="text-slate-200">{t.maskedAadhaar}</strong>
            </span>
          </div>

          {/* Consent Clauses */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-teal-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                1. {t.point1_title}
              </h4>
              <p className="text-slate-400 leading-relaxed pl-6">{t.point1_desc}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-teal-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                2. {t.point2_title}
              </h4>
              <p className="text-slate-400 leading-relaxed pl-6">{t.point2_desc}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-teal-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                3. {t.point3_title}
              </h4>
              <p className="text-slate-400 leading-relaxed pl-6">{t.point3_desc}</p>
            </div>
          </div>

          {/* Explicit Confirmation Checkboxes */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500"
              />
              <span className="text-slate-300 group-hover:text-white leading-tight">
                {t.term1}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreedShare}
                onChange={e => setAgreedShare(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500"
              />
              <span className="text-slate-300 group-hover:text-white leading-tight">
                {t.term2}
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            {t.declineBtn}
          </button>

          <button
            type="button"
            disabled={!canProceed}
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.acceptBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
