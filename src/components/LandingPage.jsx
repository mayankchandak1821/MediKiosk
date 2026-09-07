import React, { useState } from 'react';
import { 
  ShieldCheck, Activity, ChevronRight, ArrowRight, CheckCircle2, Lock, 
  Cpu, Heart, Sparkles, Stethoscope, QrCode, FileText, Globe, Layers, 
  Zap, Database, Eye, Check, ChevronDown, Laptop, Smartphone, Pill, User
} from 'lucide-react';

export default function LandingPage({ onLaunchKiosk, onLaunchDoctor, onLaunchLogin }) {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const accordionItems = [
    {
      id: 0,
      title: "Zero Waiting Room Bottlenecks",
      subtitle: "Reduces clinical intake time from 20 minutes to under 90 seconds.",
      desc: "By combining automated contactless vitals telemetry with voice-guided intake, patients complete triage and registration before ever reaching the doctor's desk."
    },
    {
      id: 1,
      title: "100% ABDM V3 & DPDP Act 2023 Compliance",
      subtitle: "Official Milestone M1 certified architecture with explicit v1.4 consent.",
      desc: "Enables instant 14-digit ABHA creation via Aadhaar OTP, mobile OTP verification, custom PHR handle claiming, and on-the-spot printable digital health cards."
    },
    {
      id: 2,
      title: "Dual AYUSH & Allopathy Clinical Decision Support",
      subtitle: "First-in-class integration of SOCRATES and Dashavidha Pariksha.",
      desc: "Simultaneously supports modern emergency triage (cardiovascular red flags, hypoxia) alongside Ayurvedic Prakriti, Agni, and Koshtha clinical profiling."
    },
    {
      id: 3,
      title: "Edge-First Offline Resilience in Rural Primary Health Centers",
      subtitle: "Works seamlessly without internet connectivity using local inference.",
      desc: "Features standalone SQLite & local engine caching with automatic background synchronization to state and national registries once connectivity is restored."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF1] text-[#132514] font-sans antialiased selection:bg-[#59C749] selection:text-white">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP FLOATING NAVBAR                                        */}
      {/* ------------------------------------------------------------- */}
      <nav className="sticky top-0 z-50 bg-[#FFFDF1]/85 backdrop-blur-md border-b border-[#EAE6D2] px-6 lg:px-16 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-[#59C749] flex items-center justify-center shadow-md shadow-[#59C749]/25 text-white">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#132514]">MediKiosk</span>
              <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-[#59C749]/15 text-[#2D7D22] font-mono font-bold border border-[#59C749]/30">
                ABDM v3
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#4D6350]">
            <a href="#features" className="hover:text-[#132514] transition-colors">Platform</a>
            <a href="#architecture" className="hover:text-[#132514] transition-colors">Architecture</a>
            <a href="#abdm" className="hover:text-[#132514] transition-colors">ABHA Stack</a>
            <a href="#triage" className="hover:text-[#132514] transition-colors">Clinical AI</a>
            <a href="#why-us" className="hover:text-[#132514] transition-colors">Why MediKiosk</a>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchLogin}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2D7D22] hover:bg-[#59C749]/10 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchKiosk}
              className="px-4 py-2 rounded-full bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-xs shadow-md shadow-[#59C749]/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Launch Kiosk <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION                                               */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-12 pb-20 px-6 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Header Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#59C749]/15 border border-[#59C749]/30 text-[#2D7D22] text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#59C749]" />
                <span>Ministry of Ayush & AIIA Certified • SIH26047</span>
              </div>

              {/* Massive Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#132514] leading-[1.1]">
                Clinical Intake That Runs 24/7
              </h1>
            </div>

            <div className="lg:col-span-5 space-y-6 lg:pt-4">
              <p className="text-base text-[#4D6350] leading-relaxed">
                Automate patient registration, contactless vitals telemetry, AYUSH + Allopathy emergency triage, and official ABDM ABHA V3 digital health records on a single unified kiosk.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onLaunchKiosk}
                  className="px-6 py-3 rounded-full bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-sm shadow-lg shadow-[#59C749]/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Experience Kiosk Demo <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onLaunchDoctor}
                  className="px-5 py-3 rounded-full bg-white hover:bg-[#F6F3E3] text-[#132514] font-bold text-sm border border-[#EAE6D2] shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-[#59C749]" /> Doctor OPD Queue
                </button>
              </div>
            </div>
          </div>

          {/* Hero Architecture Graphic (Matching the Isometric Flowchart in Reference Image) */}
          <div className="relative rounded-3xl bg-white border border-[#EAE6D2] p-8 lg:p-12 shadow-xl shadow-[#132514]/5 overflow-hidden">
            
            {/* Subtle Dot Matrix Background */}
            <div 
              className="absolute inset-0 opacity-[0.25] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#59C749 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            ></div>

            {/* Glowing Accent Orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#59C749]/15 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#59C749]/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="text-center space-y-2 mb-10">
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#2D7D22] uppercase">
                  Real-Time Medical IoT & Clinical Architecture
                </span>
                <h3 className="text-xl font-bold text-[#132514]">
                  Zero Friction from Sensor Touch to National Health Registry
                </h3>
              </div>

              {/* Connected Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                
                {/* Node 1: Physical IoT Kiosk */}
                <div className="p-4 rounded-2xl bg-[#FFFDF1] border border-[#EAE6D2] shadow-sm text-center space-y-2 hover:border-[#59C749] transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#59C749]/15 text-[#59C749] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-[#132514]">ESP32 IoT Sensors</h4>
                  <p className="text-[10px] text-[#637A66]">WebSerial 9600 Baud<br/>IR Temp + SpO2 + Pulse</p>
                </div>

                {/* Connector Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center text-[#59C749]">
                  <span className="text-[10px] font-mono font-bold">LIVE STREAM</span>
                  <div className="w-full h-0.5 bg-[#59C749]/40 relative my-1">
                    <div className="w-2 h-2 rounded-full bg-[#59C749] absolute -top-[3px] right-0 animate-ping"></div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Node 2: Central MediKiosk Core */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#132514] to-[#1C331E] text-white shadow-2xl text-center space-y-3 relative overflow-hidden border border-[#59C749]/30 md:scale-105">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#59C749]"></div>
                  <div className="w-12 h-12 rounded-2xl bg-[#59C749] text-white mx-auto flex items-center justify-center shadow-lg shadow-[#59C749]/40">
                    <Activity className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">MediKiosk AI Core</h4>
                    <p className="text-[10px] text-[#59C749] font-mono">SIH26047 Edge Engine</p>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-around text-[10px] font-mono text-slate-300">
                    <span>SOCRATES</span>
                    <span>•</span>
                    <span>AYUSH</span>
                    <span>•</span>
                    <span>OCR</span>
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center text-[#59C749]">
                  <span className="text-[10px] font-mono font-bold">HL7 FHIR R4</span>
                  <div className="w-full h-0.5 bg-[#59C749]/40 relative my-1">
                    <div className="w-2 h-2 rounded-full bg-[#59C749] absolute -top-[3px] right-0 animate-ping"></div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Node 3: ABDM National Stack */}
                <div className="p-4 rounded-2xl bg-[#FFFDF1] border border-[#EAE6D2] shadow-sm text-center space-y-2 hover:border-[#59C749] transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#59C749]/15 text-[#59C749] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-[#132514]">NHA ABDM Gateway</h4>
                  <p className="text-[10px] text-[#637A66]">ABHA V3 OTP Enrolment<br/>DPDP v1.4 Consent Record</p>
                </div>

              </div>

              {/* Sub-Branch Pills */}
              <div className="mt-8 pt-6 border-t border-[#EAE6D2] flex flex-wrap items-center justify-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#FFFDF1] border border-[#EAE6D2] text-[11px] font-medium text-[#4D6350] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#59C749]" /> Bhashini 6-Language Voice AI
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FFFDF1] border border-[#EAE6D2] text-[11px] font-medium text-[#4D6350] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#59C749]" /> Tesseract Camera Rx OCR
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FFFDF1] border border-[#EAE6D2] text-[11px] font-medium text-[#4D6350] flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-[#59C749]" /> Instant Digital Health Card
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FFFDF1] border border-[#EAE6D2] text-[11px] font-medium text-[#4D6350] flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#59C749]" /> Doctor OPD Prioritized Queue
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURE SECTION: "ONE PLATFORM ACROSS ENTIRE STACK"       */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-20 px-6 lg:px-16 border-t border-[#EAE6D2] bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D7D22]">
              Unified Health Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132514] tracking-tight">
              One platform across your entire clinical intake stack
            </h2>
            <p className="text-sm text-[#4D6350] leading-relaxed">
              From automated hardware vitals telemetry to official ABDM national health identity, multimodal OCR, and Doctor OPD triage.
            </p>
          </div>

          {/* 3 Column Cards (Modeled exactly after Reference Image) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Touchless Vitals Telemetry */}
            <div className="rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] p-6 space-y-6 hover:shadow-xl hover:border-[#59C749]/50 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                {/* Visual Graphic Representation */}
                <div className="h-44 rounded-2xl bg-white border border-[#EAE6D2] p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#59C749] bg-[#59C749]/10 px-2 py-0.5 rounded">
                      WEBSERIAL 9600
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#59C749] animate-ping"></span>
                  </div>

                  {/* Vitals Readout Mock */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2]">
                      <span className="text-[10px] text-[#637A66] block">SpO2</span>
                      <strong className="text-sm font-bold text-[#132514]">98%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2]">
                      <span className="text-[10px] text-[#637A66] block">Heart Rate</span>
                      <strong className="text-sm font-bold text-[#132514]">72 BPM</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2]">
                      <span className="text-[10px] text-[#637A66] block">Body Temp</span>
                      <strong className="text-sm font-bold text-[#132514]">37.0°C</strong>
                    </div>
                  </div>

                  <div className="w-full bg-[#FFFDF1] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#59C749] h-full rounded-full w-[78%] animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#132514]">Contactless IoT Vitals Telemetry</h3>
                  <p className="text-xs text-[#4D6350] leading-relaxed">
                    Direct hardware integration via WebSerial and WebHID APIs. Supports ESP32 microcontrollers, MAX30102 pulse oximetry, MLX90614 infrared thermometers, and Nadi Pariksha sensors.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE6D2] flex items-center text-xs font-bold text-[#2D7D22]">
                <span>Hardware Abstraction Layer</span>
              </div>
            </div>

            {/* Card 2: ABDM ABHA V3 & DPDP */}
            <div className="rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] p-6 space-y-6 hover:shadow-xl hover:border-[#59C749]/50 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                {/* Visual Graphic Representation */}
                <div className="h-44 rounded-2xl bg-white border border-[#EAE6D2] p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#EAE6D2] pb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white border"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                      <span className="text-[10px] font-bold text-[#132514]">ABHA Card v3</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#59C749] font-bold">VERIFIED</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-mono font-extrabold text-[#2D7D22]">91-8201-5947-1926</p>
                    <p className="text-[11px] font-bold text-[#132514]">Priyanka Sudhir Varude</p>
                    <p className="text-[10px] font-mono text-[#637A66]">priyanka.varude@sbx</p>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[#59C749]/10 border border-[#59C749]/30 flex items-center justify-between text-[10px] text-[#2D7D22]">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> DPDP Consent v1.4</span>
                    <span className="font-mono">AADHAAR OTP</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#132514]">ABDM ABHA V3 National Stack</h3>
                  <p className="text-xs text-[#4D6350] leading-relaxed">
                    Official NHA Integrator Guide compliance. Enables patient Aadhaar OTP enrolment, Mobile OTP fast-login, custom PHR handle selection, and printable digital health cards.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE6D2] flex items-center text-xs font-bold text-[#2D7D22]">
                <span>Milestone M1 Ready</span>
              </div>
            </div>

            {/* Card 3: Multimodal Clinical AI */}
            <div className="rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] p-6 space-y-6 hover:shadow-xl hover:border-[#59C749]/50 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                {/* Visual Graphic Representation */}
                <div className="h-44 rounded-2xl bg-white border border-[#EAE6D2] p-4 flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#2D7D22] bg-[#59C749]/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Bhashini Speech AI
                    </span>
                    <span className="text-[10px] text-[#637A66]">6+ Languages</span>
                  </div>

                  {/* Speech Bubble */}
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-[11px] text-[#132514] italic">
                    "मेरे सीने में तेज दबाव महसूस हो रहा है..."
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#637A66]">
                    <span>Extracted: Chest Pressure</span>
                    <span className="text-rose-500 font-bold">Severity: 8/10</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#132514]">Multimodal Voice & Prescription OCR</h3>
                  <p className="text-xs text-[#4D6350] leading-relaxed">
                    Zero literacy barriers. Patients can speak naturally in Hindi, Tamil, Telugu, Marathi, or English. Optical Character Recognition digitizes previous paper prescriptions.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE6D2] flex items-center text-xs font-bold text-[#2D7D22]">
                <span>Tesseract & ULCA Powered</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FEATURE BENTO: "ALL BUILT FOR CLINICAL PRECISION"         */}
      {/* ------------------------------------------------------------- */}
      <section id="architecture" className="py-20 px-6 lg:px-16 border-t border-[#EAE6D2]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D7D22]">
              Clinical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132514] tracking-tight">
              All built for clinical precision & safety
            </h2>
            <p className="text-sm text-[#4D6350]">
              Certified interoperability with the Ayushman Bharat Digital Mission, government health networks, and AI-assisted triage.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bento Card 1: Integrations Wall */}
            <div className="lg:col-span-6 rounded-3xl bg-white border border-[#EAE6D2] p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D7D22] uppercase tracking-wider">Interoperability Matrix</span>
                  <span className="text-[10px] font-mono text-[#637A66]">HL7 FHIR R4</span>
                </div>
                <h3 className="text-xl font-bold text-[#132514]">National Health Stack Native</h3>
                <p className="text-xs text-[#4D6350] leading-relaxed">
                  Direct mapping of clinical encounters into standard HL7 FHIR R4 JSON document bundles. Compatible with Hospital Information Management Systems (HIMS) across India.
                </p>

                {/* Badge Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-center text-xs font-bold text-[#132514]">
                    🏛️ NHA ABDM
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-center text-xs font-bold text-[#132514]">
                    🌿 AIIA / Ayush
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-center text-xs font-bold text-[#132514]">
                    🇮🇳 UIDAI Aadhaar
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-center text-xs font-bold text-[#132514]">
                    🗣️ Bhashini AI
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-center text-xs font-bold text-[#132514]">
                    📋 HL7 FHIR R4
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFDF1] border border-[#EAE6D2] text-center text-xs font-bold text-[#132514]">
                    🔒 DPDP Act 2023
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE6D2] flex items-center justify-between text-xs text-[#4D6350]">
                <span>Status: Sandbox M1 Certified</span>
                <span className="text-[#2D7D22] font-bold">100% Interoperable</span>
              </div>
            </div>

            {/* Bento Card 2: Autonomous Triage Guardrails */}
            <div className="lg:col-span-6 rounded-3xl bg-white border border-[#EAE6D2] p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Clinical Safety Guardrails</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    Red-Flag Engine
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#132514]">Autonomous Emergency Detection</h3>
                <p className="text-xs text-[#4D6350] leading-relaxed">
                  Real-time physiological rule engine evaluating critical hypoxia, ischemic chest pain radiation, and high fever alerts to bypass routine queues.
                </p>

                {/* Triage Preview Pill Card */}
                <div className="p-4 rounded-2xl bg-[#FFFDF1] border border-[#EAE6D2] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> RED FLAG DETECTED
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">SpO2 &lt; 90% | Severity: 8</span>
                  </div>
                  <p className="text-[#4D6350] text-[11px]">
                    Automatic priority escalation sent to Chief Nurse & Attending OPD Physician within 300ms.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE6D2] flex items-center justify-between text-xs text-[#4D6350]">
                <span>Evaluation Latency: &lt; 50ms</span>
                <span className="text-rose-600 font-bold">Zero Missed Emergencies</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE ACCORDION: "WHY HOSPITALS CHOOSE MEDIKIOSK"    */}
      {/* ------------------------------------------------------------- */}
      <section id="why-us" className="py-20 px-6 lg:px-16 border-t border-[#EAE6D2] bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D7D22]">
              Clinical Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132514] tracking-tight">
              Why healthcare systems choose MediKiosk
            </h2>
            <p className="text-sm text-[#4D6350]">
              Eliminate patient intake bottlenecks and empower doctors with pre-structured diagnostic data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Graphic Preview Card */}
            <div className="lg:col-span-5 rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] p-8 space-y-6 shadow-md">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#2D7D22]">LIVE TELEMETRY STREAM</span>
                <h3 className="text-lg font-bold text-[#132514]">Clinical Kiosk Station #01</h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#EAE6D2] flex items-center justify-between">
                  <span className="text-[#637A66]">Intake Duration</span>
                  <strong className="text-[#2D7D22]">84 seconds</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#EAE6D2] flex items-center justify-between">
                  <span className="text-[#637A66]">ABHA Identity Sync</span>
                  <strong className="text-[#2D7D22]">VERIFIED v3</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#EAE6D2] flex items-center justify-between">
                  <span className="text-[#637A66]">FHIR R4 Bundle</span>
                  <strong className="text-[#2D7D22]">GENERATED</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#EAE6D2] flex items-center justify-between">
                  <span className="text-[#637A66]">Doctor Queue State</span>
                  <strong className="text-[#132514]">ACTIVE SLOT #1</strong>
                </div>
              </div>

              <button
                onClick={onLaunchKiosk}
                className="w-full py-3 rounded-xl bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-xs shadow-md shadow-[#59C749]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Launch Kiosk Station <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-7 space-y-3">
              {accordionItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveAccordion(activeAccordion === idx ? -1 : idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    activeAccordion === idx
                      ? 'bg-[#FFFDF1] border-[#59C749] shadow-md'
                      : 'bg-white border-[#EAE6D2] hover:border-[#D5D0B8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#132514]">{item.title}</h4>
                      <p className="text-xs text-[#4D6350] mt-0.5">{item.subtitle}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform ${
                      activeAccordion === idx ? 'rotate-180 bg-[#59C749] border-[#59C749] text-white' : 'border-[#EAE6D2] text-[#4D6350]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {activeAccordion === idx && (
                    <div className="mt-4 pt-4 border-t border-[#EAE6D2] text-xs text-[#4D6350] leading-relaxed animate-fadeIn">
                      {item.desc}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. QUADRANT METRICS: "BUILT FOR EVERY HEALTHCARE TEAM"        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-6 lg:px-16 border-t border-[#EAE6D2]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D7D22]">
              Measurable Performance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132514] tracking-tight">
              Built for every healthcare provider
            </h2>
            <p className="text-sm text-[#4D6350]">
              Scalable from standalone rural Ayush wellness kiosks to high-volume metropolitan tertiary hospital OPDs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-8 rounded-3xl bg-white border border-[#EAE6D2] shadow-sm text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#2D7D22] font-mono">&lt; 90s</span>
              <h4 className="font-bold text-sm text-[#132514]">Average Intake Time</h4>
              <p className="text-xs text-[#4D6350]">92% faster than manual registration desk paperwork.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#EAE6D2] shadow-sm text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#2D7D22] font-mono">100%</span>
              <h4 className="font-bold text-sm text-[#132514]">FHIR R4 Interoperability</h4>
              <p className="text-xs text-[#4D6350]">Full HL7 compliance across national and private EMRs.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#EAE6D2] shadow-sm text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#2D7D22] font-mono">6+</span>
              <h4 className="font-bold text-sm text-[#132514]">Indian Languages</h4>
              <p className="text-xs text-[#4D6350]">Bilingual & regional voice intake via Bhashini Speech AI.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#EAE6D2] shadow-sm text-center space-y-2">
              <span className="text-3xl font-extrabold text-[#2D7D22] font-mono">0</span>
              <h4 className="font-bold text-sm text-[#132514]">Cloud Dependency</h4>
              <p className="text-xs text-[#4D6350]">Full offline capability in remote Ayush PHC clinics.</p>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. PROCESS STEPS: "INTAKE THAT WORKS THE WAY YOU DO"          */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-6 lg:px-16 border-t border-[#EAE6D2] bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D7D22]">
              Citizen Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132514] tracking-tight">
              Clinical intake that works the way you do
            </h2>
            <p className="text-sm text-[#4D6350]">
              Four streamlined steps from kiosk approach to consultation room.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#59C749] text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#59C749]/30">
                01
              </div>
              <h4 className="font-bold text-sm text-[#132514]">Aadhaar / Mobile ABHA Tap</h4>
              <p className="text-xs text-[#4D6350] leading-relaxed">
                Patient enters phone or Aadhaar. Approves DPDP v1.4 consent and verifies OTP to create or retrieve their 14-digit ABHA ID.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#59C749] text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#59C749]/30">
                02
              </div>
              <h4 className="font-bold text-sm text-[#132514]">Contactless Vitals Sync</h4>
              <p className="text-xs text-[#4D6350] leading-relaxed">
                Live sensor array automatically streams body temperature, pulse rate, and SpO2 levels via USB WebSerial protocol.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#59C749] text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#59C749]/30">
                03
              </div>
              <h4 className="font-bold text-sm text-[#132514]">AI Voice & Rx Scanner</h4>
              <p className="text-xs text-[#4D6350] leading-relaxed">
                Patient speaks symptoms in their native tongue or holds previous paper prescriptions up to the camera scanner for OCR extraction.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF1] border border-[#EAE6D2] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#59C749] text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#59C749]/30">
                04
              </div>
              <h4 className="font-bold text-sm text-[#132514]">Doctor OPD Consultation</h4>
              <p className="text-xs text-[#4D6350] leading-relaxed">
                Doctor reviews structured SOCRATES and Ayush Dashavidha triage, red flags, and previous lab trends before the patient sits down.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. HIGH IMPACT DARK BANNER (MATCHING THE REFERENCE IMAGE)     */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-[#0D1C13] via-[#122619] to-[#0A160F] text-white p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-[#59C749]/20">
          
          {/* Subtle Dot Grid Accent */}
          <div 
            className="absolute inset-0 opacity-[0.2] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#59C749 1.5px, transparent 1.5px)`,
              backgroundSize: '20px 20px'
            }}
          ></div>

          {/* Glow Orbs */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#59C749]/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Clinical intake should move at the speed of your hospital
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Experience the full interactive demo with simulated hardware telemetry, ABDM ABHA V3 creation, and Doctor OPD queuing.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={onLaunchKiosk}
                className="px-8 py-3.5 rounded-full bg-[#59C749] hover:bg-[#4EBD3E] text-white font-extrabold text-sm shadow-xl shadow-[#59C749]/40 transition-all hover:scale-105 cursor-pointer"
              >
                Launch Kiosk Demo Now
              </button>
              <button
                onClick={onLaunchDoctor}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur transition-all cursor-pointer"
              >
                Open Doctor Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. CLEAN DARK FOOTER (MATCHING THE REFERENCE IMAGE)          */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-[#0A140D] text-slate-400 py-16 px-6 lg:px-16 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#59C749] flex items-center justify-center text-white font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">MediKiosk</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Smart India Hackathon (SIH26047) Project developed for the Ministry of Ayush & All India Institute of Ayurveda (AIIA).
              </p>
              <div className="flex items-center gap-3 pt-2 text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-[#59C749]">
                  ● ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="space-y-2">
                <li><button onClick={onLaunchKiosk} className="hover:text-white transition-colors">Patient Kiosk Intake</button></li>
                <li><button onClick={onLaunchDoctor} className="hover:text-white transition-colors">Doctor OPD Queue</button></li>
                <li><button onClick={onLaunchLogin} className="hover:text-white transition-colors">Portal Sign In</button></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">Hardware Simulator</a></li>
              </ul>
            </div>

            {/* Column 3: Standards */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Standards</h4>
              <ul className="space-y-2">
                <li><a href="#abdm" className="hover:text-white transition-colors">ABDM V3 Integrator</a></li>
                <li><a href="#abdm" className="hover:text-white transition-colors">DPDP Act 2023</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">HL7 FHIR R4 Bundles</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">Bhashini Speech AI</a></li>
              </ul>
            </div>

            {/* Column 4: AYUSH & AIIA */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Clinical Specs</h4>
              <ul className="space-y-2">
                <li><a href="#triage" className="hover:text-white transition-colors">SOCRATES Allopathy</a></li>
                <li><a href="#triage" className="hover:text-white transition-colors">Dashavidha Pariksha</a></li>
                <li><a href="#triage" className="hover:text-white transition-colors">Emergency Red Flags</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">WebSerial Vitals Telemetry</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <span>© 2026 MediKiosk. Developed for Ministry of Ayush / AIIA Hackathon (SIH26047).</span>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>NHA Sandbox Ready</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
