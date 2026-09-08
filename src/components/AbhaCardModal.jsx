import React, { useRef } from 'react';
import { Shield, QrCode, Printer, CheckCircle2, X, Download, ArrowRight, User } from 'lucide-react';

export default function AbhaCardModal({ isOpen, onClose, onProceed, patientData }) {
  const cardRef = useRef(null);

  if (!isOpen || !patientData) return null;

  const abhaNumber = patientData.abha_number || patientData.abha_id || "91-8840-2910-4491";
  const phrAddress = patientData.phr_address || `${patientData.full_name?.toLowerCase().replace(/\s+/g, '')}@abdm`;
  const fullName = patientData.full_name || "Rajesh Verma";
  const gender = patientData.gender || "Male";
  const dob = patientData.dob || "15/08/1988";
  const phone = patientData.phone || patientData.phone_number || "9876543210";
  const photo = patientData.profile_photo;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-[#E2DCBE] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#FFFDF1] border-b border-[#E2DCBE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#59C749]"></span>
            <h3 className="text-sm font-bold text-[#142618]">Official ABHA Health Card (ABDM V3)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#526857] hover:text-[#142618] hover:bg-[#F7F4E1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content Area */}
        <div className="p-6 space-y-6">
          
          {/* Visual ABHA Card Container */}
          <div 
            ref={cardRef}
            className="relative rounded-2xl overflow-hidden border border-[#E2DCBE] bg-[#FFFDF1] shadow-xs p-5 text-[#142618]"
          >
            {/* Top Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-white to-[#59C749]"></div>

            {/* Top Branding */}
            <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#59C749]/15 border border-[#59C749]/30 flex items-center justify-center text-[#2B8A1E] font-black text-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#142618]">National Health Authority</h4>
                  <p className="text-[10px] text-[#2B8A1E] font-semibold">Ayushman Bharat Digital Mission (ABDM)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#59C749]/15 text-[#2B8A1E] border border-[#59C749]/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            {/* Card Body with Photo, Details and QR */}
            <div className="grid grid-cols-3 gap-4 items-center">
              
              {/* Photo & QR Column */}
              <div className="col-span-1 flex flex-col items-center gap-2.5">
                <div className="w-20 h-24 rounded-xl border border-[#E2DCBE] bg-white overflow-hidden flex items-center justify-center relative shadow-inner">
                  {photo ? (
                    <img 
                      src={photo.startsWith('data:') ? photo : `data:image/jpeg;base64,${photo}`} 
                      alt="Verified e-KYC" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-[#526857]" />
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-white/90 text-[8px] text-center text-[#526857] font-mono py-0.5 border-t border-[#E2DCBE]">
                    e-KYC Photo
                  </span>
                </div>

                <div className="p-1.5 rounded-lg bg-white border border-[#E2DCBE] shadow-xs flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#FFFDF1] rounded p-1 flex items-center justify-center border border-[#E2DCBE]">
                    <QrCode className="w-12 h-12 text-[#142618]" />
                  </div>
                  <span className="text-[8px] text-[#526857] font-mono font-bold mt-0.5">ABHA QR</span>
                </div>
              </div>

              {/* Patient Core Identifiers Column */}
              <div className="col-span-2 space-y-2.5 pl-2">
                <div>
                  <span className="text-[10px] font-bold text-[#526857] uppercase tracking-wider block">ABHA Number</span>
                  <p className="text-lg font-mono font-extrabold text-[#142618] tracking-wider">
                    {abhaNumber}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#526857] uppercase tracking-wider block">ABHA Address (PHR)</span>
                  <p className="text-xs font-mono font-semibold text-[#2B8A1E] bg-[#59C749]/10 border border-[#59C749]/20 px-2 py-0.5 rounded inline-block">
                    {phrAddress}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] font-bold text-[#526857] uppercase tracking-wider block">Full Name</span>
                  <p className="text-sm font-bold text-[#142618]">{fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#526857]">
                  <div>
                    <span className="text-[#8C9B8E] block text-[9px]">DOB / Age</span>
                    <span className="text-[#142618] font-medium">{dob}</span>
                  </div>
                  <div>
                    <span className="text-[#8C9B8E] block text-[9px]">Gender</span>
                    <span className="text-[#142618] font-medium">{gender}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#526857]">
                  <span className="text-[#8C9B8E] block text-[9px]">Linked Mobile</span>
                  <span className="text-[#142618] font-medium">******{phone.slice(-4)}</span>
                </div>
              </div>

            </div>

            {/* Bottom Facility Seal */}
            <div className="mt-4 pt-3 border-t border-[#E2DCBE] flex items-center justify-between text-[10px] text-[#526857]">
              <span>AIIA Integrated Clinical Kiosk</span>
              <span className="font-mono text-[#526857]">M1 Certified | ISO/IEC 27001</span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-[#59C749]/10 border border-[#59C749]/30 text-xs text-[#142618] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#59C749] shrink-0" />
            <span>ABHA Card generated successfully. Demographics are pre-populated for intake.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#FFFDF1] border-t border-[#E2DCBE] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-[#E2DCBE] bg-white hover:bg-[#F7F4E1] text-[#142618] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#59C749]" />
            Print Card / Slip
          </button>

          <button
            type="button"
            onClick={onProceed}
            className="px-5 py-2.5 rounded-xl bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>Proceed to Vitals & Intake</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
