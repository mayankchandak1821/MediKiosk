import React, { useState } from 'react';
import { 
  Activity, ArrowRight, Stethoscope, User, Heart, 
  ShieldCheck, CheckCircle2, ChevronDown, Lock, Phone, 
  FileText, Thermometer, Clock, Sparkles
} from 'lucide-react';

export default function LandingPage({ onLaunchKiosk, onLaunchDoctor }) {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const accordionItems = [
    {
      id: 0,
      title: "Zero Waiting Room Bottlenecks",
      subtitle: "Reduces patient intake duration from 20 minutes to under 90 seconds.",
      desc: "By combining contactless vital screening with structured digital questionnaires, patients complete preliminary registration and triage before entering the physician's examination room."
    },
    {
      id: 1,
      title: "ABHA Health Account Integration & DPDP Compliance",
      subtitle: "Secure digital health identity verification with explicit patient consent.",
      desc: "Supports instantaneous 14-digit ABHA ID generation via Aadhaar OTP, mobile OTP authentication, and digital health records exchange fully compliant with the Digital Personal Data Protection Act 2023."
    },
    {
      id: 2,
      title: "Dual Clinical Decision Support (Allopathy & Ayush)",
      subtitle: "Integration of standard SOCRATES triage and Dashavidha Pariksha.",
      desc: "Simultaneously evaluates emergency cardiovascular and respiratory red flags alongside traditional Ayurvedic clinical parameters including Prakriti, Agni, and Koshtha profiling."
    },
    {
      id: 3,
      title: "Reliable Offline Operation for Remote Health Centers",
      subtitle: "Continuous clinical operation regardless of intermittent network connectivity.",
      desc: "Engineered with local caching and offline-first database synchronization, ensuring seamless patient intake even in rural clinics with limited broadband."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF1] text-[#142618] font-sans antialiased selection:bg-[#59C749] selection:text-white">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVBAR (CLEAN, PROFESSIONAL, WITH TOP-SIDE LOGIN)       */}
      {/* ------------------------------------------------------------- */}
      <nav className="sticky top-0 z-50 bg-[#FFFDF1]/95 backdrop-blur-md border-b border-[#E7E2CE] px-6 lg:px-16 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-[#59C749] flex items-center justify-center shadow-sm text-white">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#142618]">MediKiosk</span>
              <span className="text-xs text-[#526857] block font-medium">Clinical Intake & OPD System</span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#526857]">
            <a href="#features" className="hover:text-[#142618] transition-colors">Key Features</a>
            <a href="#preview" className="hover:text-[#142618] transition-colors">Clinical Dashboard</a>
            <a href="#workflow" className="hover:text-[#142618] transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-[#142618] transition-colors">Clinical Specifications</a>
          </div>

          {/* TOP RIGHT ACTION BUTTONS: PATIENT LOGIN & DOCTOR LOGIN */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchKiosk}
              className="px-4 py-2 rounded-xl bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>

            <button
              onClick={onLaunchDoctor}
              className="px-4 py-2 rounded-xl bg-[#142618] hover:bg-[#223B28] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#59C749]" />
              <span>Login as Doctor</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-16 pb-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#59C749]/10 border border-[#59C749]/25 text-[#245229] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#59C749]" />
                <span>Next-Generation Healthcare Intake & Triage Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#142618] leading-[1.12]">
                Intelligent Patient Intake and Live OPD Management
              </h1>
            </div>

            <div className="lg:col-span-5 space-y-6 lg:pt-3">
              <p className="text-base text-[#4E6552] leading-relaxed">
                Streamline registration, contactless vitals capture, Allopathy & Ayush triage, and electronic health record generation on a single unified clinical kiosk.
              </p>
              
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={onLaunchKiosk}
                  className="px-6 py-3 rounded-xl bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Patient Intake Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onLaunchDoctor}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-[#F7F4E1] text-[#142618] font-bold text-sm border border-[#DED7BD] shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-[#59C749]" />
                  <span>Doctor OPD Queue</span>
                </button>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* REALISTIC CLINICAL PLATFORM PREVIEW (NOT VIBECODED)         */}
          {/* ----------------------------------------------------------- */}
          <div id="preview" className="rounded-2xl bg-white border border-[#E2DCBE] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#F5F1DC]/60 border-b border-[#E2DCBE] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#142618]">
                <Activity className="w-4 h-4 text-[#59C749]" />
                <span>MediKiosk Clinical Telemetry & Triage Console</span>
              </div>
              <div className="flex items-center gap-4 text-[#526857]">
                <span>Status: <strong>Active Kiosk Station</strong></span>
                <span>Security: <strong>256-bit Encrypted</strong></span>
              </div>
            </div>

            <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Panel 1: Live Patient Vitals */}
              <div className="p-5 rounded-xl bg-[#FFFDF1] border border-[#E7E2CE] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E2CE] pb-2.5">
                  <span className="font-bold text-xs text-[#142618] uppercase tracking-wider">
                    Vitals Screening
                  </span>
                  <span className="text-xs text-[#59C749] font-semibold">Sensor Synced</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-[#EAE6D2]">
                    <span className="text-[#697E6D] block">Heart Rate</span>
                    <strong className="text-lg text-[#142618]">72 BPM</strong>
                    <span className="text-[11px] text-[#59C749] block mt-0.5">Normal Rhythm</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#EAE6D2]">
                    <span className="text-[#697E6D] block">Oxygen (SpO2)</span>
                    <strong className="text-lg text-[#142618]">98%</strong>
                    <span className="text-[11px] text-[#59C749] block mt-0.5">Optimal Saturation</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#EAE6D2]">
                    <span className="text-[#697E6D] block">Temperature</span>
                    <strong className="text-lg text-[#142618]">37.0°C</strong>
                    <span className="text-[11px] text-[#59C749] block mt-0.5">Afebrile</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#EAE6D2]">
                    <span className="text-[#697E6D] block">Blood Pressure</span>
                    <strong className="text-lg text-[#142618]">120/80</strong>
                    <span className="text-[11px] text-[#59C749] block mt-0.5">Normotensive</span>
                  </div>
                </div>
              </div>

              {/* Panel 2: Clinical Intake Evaluation */}
              <div className="p-5 rounded-xl bg-[#FFFDF1] border border-[#E7E2CE] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E2CE] pb-2.5">
                  <span className="font-bold text-xs text-[#142618] uppercase tracking-wider">
                    Symptom Analysis
                  </span>
                  <span className="text-xs text-[#2C5B32] font-semibold">SOCRATES Framework</span>
                </div>

                <div className="space-y-2.5 text-xs text-[#3E5242]">
                  <div className="p-2.5 rounded-lg bg-white border border-[#EAE6D2] space-y-1">
                    <span className="text-[#697E6D] block text-[11px]">Chief Complaint</span>
                    <strong className="text-[#142618]">Chest Tightness with Exertion</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#EAE6D2] flex justify-between">
                    <span className="text-[#697E6D]">Radiation:</span>
                    <strong className="text-[#142618]">Left Shoulder & Arm</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#EAE6D2] flex justify-between">
                    <span className="text-[#697E6D]">Severity Score:</span>
                    <strong className="text-amber-700">8 / 10 Pain Scale</strong>
                  </div>
                </div>
              </div>

              {/* Panel 3: Triage & Electronic Record */}
              <div className="p-5 rounded-xl bg-[#FFFDF1] border border-[#E7E2CE] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E7E2CE] pb-2.5">
                    <span className="font-bold text-xs text-[#142618] uppercase tracking-wider">
                      OPD Routing Status
                    </span>
                    <span className="text-xs text-rose-700 font-bold">Priority Triage</span>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <span className="font-bold block">Cardiovascular Red Flag Detected</span>
                    <p className="text-[11px] leading-relaxed">
                      Encounter flagged for priority physician evaluation. Bypasses general waiting queue.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#EAE6D2] text-xs space-y-1 text-[#3E5242]">
                    <div className="flex justify-between">
                      <span className="text-[#697E6D]">Health ID:</span>
                      <strong className="font-mono text-[#142618]">91-8840-2910-4491</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#697E6D]">Record Format:</span>
                      <strong className="text-[#142618]">HL7 FHIR R4 Bundle</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLaunchDoctor}
                  className="w-full py-2.5 rounded-lg bg-[#142618] hover:bg-[#223B28] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#59C749]" />
                  <span>Review in Doctor Dashboard</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. CORE CAPABILITIES (CLEAN 3-COLUMN CARDS)                  */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-20 px-6 lg:px-16 border-t border-[#E7E2CE] bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-[#2C5B32] uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-[#142618] tracking-tight">
              Standardized Clinical Workflows for Modern OPDs
            </h2>
            <p className="text-sm text-[#4E6552] leading-relaxed">
              MediKiosk unifies vital signs measurement, symptom recording, and physician queues into a coherent digital experience designed for high patient volumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="rounded-2xl bg-[#FFFDF1] border border-[#E7E2CE] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#59C749]/15 text-[#2C5B32] flex items-center justify-center">
                  <Thermometer className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#142618]">
                  Peripheral Vitals Telemetry
                </h3>
                <p className="text-xs text-[#4E6552] leading-relaxed">
                  Automatic readings for pulse rate, oxygen saturation (SpO2), infrared body temperature, and automated blood pressure directly streamed via USB and WebSerial.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE6D2] text-xs font-semibold text-[#2C5B32]">
                Instant Non-Contact Telemetry
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-[#FFFDF1] border border-[#E7E2CE] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#59C749]/15 text-[#2C5B32] flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#142618]">
                  Standardized Clinical Triage
                </h3>
                <p className="text-xs text-[#4E6552] leading-relaxed">
                  SOCRATES symptom evaluation and Dashavidha Pariksha clinical profiling work in tandem with automated acute red-flag alerts to prioritize emergency cases.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE6D2] text-xs font-semibold text-[#2C5B32]">
                Automated Red-Flag Detection
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-[#FFFDF1] border border-[#E7E2CE] p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#59C749]/15 text-[#2C5B32] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#142618]">
                  Digital Health Accounts & Records
                </h3>
                <p className="text-xs text-[#4E6552] leading-relaxed">
                  Secure patient identification using 14-digit ABHA numbers, explicit digital consent logging compliant with DPDP Act 2023, and HL7 FHIR record synchronization.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE6D2] text-xs font-semibold text-[#2C5B32]">
                DPDP 2023 & FHIR Compliant
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. CLINICAL WORKFLOW: 4 CLEAR STEPS                           */}
      {/* ------------------------------------------------------------- */}
      <section id="workflow" className="py-20 px-6 lg:px-16 border-t border-[#E7E2CE]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#2C5B32] uppercase tracking-wider">
              Clinical Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-[#142618] tracking-tight">
              From Arrival to Examination in Four Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-[#E2DCBE] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#59C749] text-white font-bold flex items-center justify-center text-xs">
                01
              </div>
              <h4 className="font-bold text-sm text-[#142618]">Patient Identification</h4>
              <p className="text-xs text-[#4E6552] leading-relaxed">
                Patient signs in with an existing 14-digit ABHA ID or creates a verified health account via mobile/Aadhaar OTP.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2DCBE] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#59C749] text-white font-bold flex items-center justify-center text-xs">
                02
              </div>
              <h4 className="font-bold text-sm text-[#142618]">Contactless Vitals Scan</h4>
              <p className="text-xs text-[#4E6552] leading-relaxed">
                Peripheral sensors stream body temperature, oxygen saturation, and heart rate directly into the clinical intake profile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2DCBE] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#59C749] text-white font-bold flex items-center justify-center text-xs">
                03
              </div>
              <h4 className="font-bold text-sm text-[#142618]">Symptom Intake</h4>
              <p className="text-xs text-[#4E6552] leading-relaxed">
                Patient inputs complaints via visual anatomical body map or voice assistant, and scans prior paper prescriptions via camera OCR.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E2DCBE] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#59C749] text-white font-bold flex items-center justify-center text-xs">
                04
              </div>
              <h4 className="font-bold text-sm text-[#142618]">Doctor OPD Review</h4>
              <p className="text-xs text-[#4E6552] leading-relaxed">
                Physician receives prioritized queue entry with synthesized clinical summary, red-flag indicators, and digital prescription sign-off.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. SPECIFICATIONS & FAQ COLLAPSIBLE                           */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="py-20 px-6 lg:px-16 border-t border-[#E7E2CE] bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-[#2C5B32] uppercase tracking-wider">
              Technical Specifications
            </span>
            <h2 className="text-3xl font-extrabold text-[#142618] tracking-tight">
              Built for High Reliability in Healthcare Facilities
            </h2>
            <p className="text-sm text-[#4E6552] leading-relaxed">
              Designed to meet strict clinical safety protocols, data privacy regulations, and inter-facility health data exchange standards.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {accordionItems.map((item, index) => {
              const isOpen = activeAccordion === index;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all cursor-pointer ${
                    isOpen ? 'bg-[#FFFDF1] border-[#59C749]' : 'bg-white border-[#E2DCBE] hover:border-[#59C749]/50'
                  }`}
                  onClick={() => setActiveAccordion(isOpen ? -1 : index)}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#142618]">{item.title}</h4>
                      <p className="text-xs text-[#697E6D] mt-0.5">{item.subtitle}</p>
                    </div>
                    <div className={`p-1.5 rounded-lg transition-transform ${isOpen ? 'rotate-180 text-[#59C749]' : 'text-[#697E6D]'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#4E6552] leading-relaxed border-t border-[#EAE6D2] pt-3">
                      {item.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. CALL TO ACTION BANNER                                      */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#142618] text-white p-10 lg:p-14 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Ready to Streamline Your Clinical Intake?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the interactive kiosk intake system with simulated hardware vitals or access the physician OPD consultation queue.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 pt-2">
            <button
              onClick={onLaunchKiosk}
              className="px-6 py-3 rounded-xl bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
            >
              Open Patient Intake
            </button>
            <button
              onClick={onLaunchDoctor}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-[#59C749]" />
              <span>Login as Doctor</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. REFINED PLATFORM FOOTER                                    */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-[#101F13] text-slate-400 py-12 px-6 lg:px-16 border-t border-[#233A29] text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#59C749] flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-white">MediKiosk</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                Integrated Clinical Intake & Vitals Platform designed for primary health centers and hospital outpatient departments.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Navigation</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={onLaunchKiosk} className="hover:text-white transition-colors cursor-pointer">Patient Intake Portal</button></li>
                <li><button onClick={onLaunchDoctor} className="hover:text-white transition-colors cursor-pointer">Doctor OPD Consultation</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Regulatory Standards</h5>
              <ul className="space-y-1.5 text-slate-400">
                <li>Digital Personal Data Protection Act 2023</li>
                <li>HL7 FHIR R4 Health Records Exchange</li>
                <li>Ayushman Bharat Digital Mission (ABDM)</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#233A29] flex flex-wrap items-center justify-between gap-3 text-slate-500">
            <span>© 2026 MediKiosk Platform. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security Standards</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
