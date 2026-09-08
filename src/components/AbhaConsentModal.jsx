import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, X, FileText } from 'lucide-react';

export default function AbhaConsentModal({ isOpen, onClose, onAccept, aadhaarNumber }) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedShare, setAgreedShare] = useState(false);

  if (!isOpen) return null;

  const canProceed = agreedTerms && agreedShare;

  const content = {
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
  };

  const handleConfirm = () => {
    if (canProceed) {
      onAccept({
        code: "abha-enrollment",
        version: "1.4",
        timestamp: new Date().toISOString(),
        language: "en"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-[#E2DCBE] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#FFFDF1] border-b border-[#E2DCBE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#59C749]/15 border border-[#59C749]/30 flex items-center justify-center text-[#2B8A1E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#142618] flex items-center gap-2">
                {content.title}
                <span className="px-2 py-0.5 rounded bg-[#59C749]/15 text-[#2B8A1E] text-[10px] font-mono font-bold border border-[#59C749]/30">
                  NHA v1.4
                </span>
              </h3>
              <p className="text-xs text-[#526857]">{content.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#526857] hover:text-[#142618] hover:bg-[#F7F4E1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Regulatory Badges */}
          <div className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-between text-[#142618]">
            <span className="flex items-center gap-2 font-mono text-[#2B8A1E]">
              <Lock className="w-3.5 h-3.5" /> {content.regulation}
            </span>
            <span className="font-mono text-[#526857]">
              Aadhaar: <strong className="text-[#142618]">{content.maskedAadhaar}</strong>
            </span>
          </div>

          {/* Consent Clauses */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-1">
              <h4 className="font-bold text-[#142618] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#59C749]" />
                1. {content.point1_title}
              </h4>
              <p className="text-[#526857] leading-relaxed pl-6">{content.point1_desc}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-1">
              <h4 className="font-bold text-[#142618] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#59C749]" />
                2. {content.point2_title}
              </h4>
              <p className="text-[#526857] leading-relaxed pl-6">{content.point2_desc}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-1">
              <h4 className="font-bold text-[#142618] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#59C749]" />
                3. {content.point3_title}
              </h4>
              <p className="text-[#526857] leading-relaxed pl-6">{content.point3_desc}</p>
            </div>
          </div>

          {/* Explicit Confirmation Checkboxes */}
          <div className="pt-3 border-t border-[#E2DCBE] space-y-3">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#DED7BD] text-[#59C749] focus:ring-[#59C749]"
              />
              <span className="text-[#142618] leading-tight">
                {content.term1}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreedShare}
                onChange={e => setAgreedShare(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#DED7BD] text-[#59C749] focus:ring-[#59C749]"
              />
              <span className="text-[#142618] leading-tight">
                {content.term2}
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FFFDF1] border-t border-[#E2DCBE] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E2DCBE] bg-white hover:bg-[#F7F4E1] text-[#526857] hover:text-[#142618] text-xs font-semibold transition-colors cursor-pointer"
          >
            {content.declineBtn}
          </button>

          <button
            type="button"
            disabled={!canProceed}
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              canProceed
                ? 'bg-[#59C749] hover:bg-[#4EBD3E] text-white shadow-xs cursor-pointer'
                : 'bg-[#E2DCBE] text-[#8C9B8E] cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {content.acceptBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
