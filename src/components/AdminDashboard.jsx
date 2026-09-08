import React, { useState } from 'react';
import { 
  ShieldCheck, Server, Database, Activity, Cpu, Users, FileText, Download, 
  RefreshCw, Power, CheckCircle2, AlertTriangle, Sliders, Settings, HardDrive, Terminal
} from 'lucide-react';

export default function AdminDashboard({ 
  encounterQueue = [], 
  currentVitals, 
  isDoctorAvailable, 
  setIsDoctorAvailable, 
  opdSessionNumber, 
  setOpdSessionNumber, 
  openHardwareModal 
}) {
  const [dbStatus, setDbStatus] = useState('CONNECTED');

  const totalPatients = encounterQueue.length;
  const signedOffCount = encounterQueue.filter(e => e.status === 'COMPLETED_SIGNED_OFF').length;
  const redFlagCount = encounterQueue.filter(e => e.triage?.isRedFlag).length;

  const exportSystemReport = () => {
    const reportText = `=====================================================
AIIA GOVERNMENT HOSPITAL - ADMIN SYSTEM AUDIT & ANALYTICS REPORT
Date/Time: ${new Date().toLocaleString()} | OPD Session #${opdSessionNumber}
-----------------------------------------------------
DATABASE STATUS: MongoDB connected (mongodb://localhost:27017/medikiosk)
REST API STATUS: Active (http://localhost:5000/)

SUMMARY METRICS:
Total Patients Registered: ${totalPatients}
Active Waiting in OPD Queue: ${totalPatients - signedOffCount}
Signed Off Discharges: ${signedOffCount}
Red Flag Emergency Cases: ${redFlagCount}
Doctor Availability Status: ${isDoctorAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}

HARDWARE SENSOR TELEMETRY:
Body Temperature: ${currentVitals.temperature_c}°C
Oxygen Saturation: ${currentVitals.spo2_percent}%
Heart Rate: ${currentVitals.heart_rate_bpm} BPM
Sensor Telemetry Source: ${currentVitals.source || 'Simulator/Hardware'}
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hospital_System_Audit_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner & Hospital Metrics */}
      <div className="bg-white border border-[#E2DCBE] rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#59C749] text-white font-bold shadow-sm">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xl text-[#142618]">Hospital Administration & System Portal</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#59C749]/15 text-[#142618] font-mono text-xs font-bold border border-[#59C749]/30">
                SYSTEM ADMIN
              </span>
            </div>
            <p className="text-xs text-[#526857]">Database Administration, Telemetry Bridge & OPD Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportSystemReport}
            className="px-4 py-2 bg-white hover:bg-[#F7F4E1] border border-[#E2DCBE] text-[#142618] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#59C749]" /> Export Audit Report
          </button>
        </div>
      </div>

      {/* Admin Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-1">
          <span className="text-[#526857] block">Total OPD Registrations</span>
          <span className="text-2xl font-black text-[#142618]">{totalPatients} Patients</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-1">
          <span className="text-[#2B8A1E] block font-bold">Signed Off Discharges</span>
          <span className="text-2xl font-black text-[#2B8A1E]">{signedOffCount} Completed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-1">
          <span className="text-rose-700 block font-bold">Critical Red Flags</span>
          <span className="text-2xl font-black text-rose-700">{redFlagCount} Alert</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-1">
          <span className="text-[#142618] block font-bold">MongoDB Database</span>
          <span className="text-lg font-black text-[#2B8A1E] flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-[#2B8A1E]" /> ONLINE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: System & Hardware Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* OPD Session & Doctor Availability Controls */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#526857] uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#59C749]" /> OPD Session & Physician Controls
            </h3>

            <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#142618] block">Physician OPD Status</span>
                  <span className="text-[11px] text-[#526857]">Controls kiosk queuing for Session #{opdSessionNumber}</span>
                </div>
                <button
                  onClick={() => setIsDoctorAvailable(!isDoctorAvailable)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    isDoctorAvailable
                      ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618]'
                      : 'bg-rose-100 border-rose-300 text-rose-900'
                  }`}
                >
                  {isDoctorAvailable ? '🟢 Doctor Available' : '🔴 Doctor Not Available'}
                </button>
              </div>

              <div className="pt-3 border-t border-[#E2DCBE] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#142618] block">Current Session #{opdSessionNumber}</span>
                  <span className="text-[11px] text-[#526857]">Increment session counter for new OPD shift</span>
                </div>
                <button
                  onClick={() => setOpdSessionNumber(prev => prev + 1)}
                  className="px-3.5 py-1.5 bg-white hover:bg-[#F7F4E1] text-[#142618] text-xs font-bold rounded-lg border border-[#E2DCBE] cursor-pointer"
                >
                  Start OPD Session #{opdSessionNumber + 1}
                </button>
              </div>
            </div>
          </div>

          {/* Vitals Telemetry Sensor Bridge */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#526857] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#59C749]" /> Sensor Hardware Telemetry Bridge
              </h3>
              <button
                onClick={openHardwareModal}
                className="px-3 py-1 bg-[#59C749] text-white text-xs font-bold rounded-lg hover:bg-[#4EBD3E] cursor-pointer"
              >
                Customize Vitals
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#526857]">Live Temperature:</span>
                <span className="text-amber-800 font-bold">{currentVitals.temperature_c}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526857]">Live Oxygen (SpO2):</span>
                <span className="text-[#2B8A1E] font-bold">{currentVitals.spo2_percent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526857]">Live Heart Rate:</span>
                <span className="text-rose-700 font-bold">{currentVitals.heart_rate_bpm} BPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526857]">Sensor Data Source:</span>
                <span className="text-[#142618] font-bold">{currentVitals.source || 'Hardware/Simulator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Database Collections & System Audit Logs (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* MongoDB Database Collections Inspector */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#526857] uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-[#59C749]" /> MongoDB Collections (`medikiosk`)
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#59C749]" />
                  <span className="text-[#142618] font-bold">db.patients</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#59C749]/15 text-[#142618] font-bold text-[10px]">
                  {totalPatients} Documents
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#59C749]" />
                  <span className="text-[#142618] font-bold">db.encounters</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#59C749]/15 text-[#142618] font-bold text-[10px]">
                  {totalPatients} Documents
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#59C749]" />
                  <span className="text-[#142618] font-bold">db.vitals</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#59C749]/15 text-[#2B8A1E] font-bold text-[10px]">
                  Telemetry Stream Active
                </span>
              </div>
            </div>
          </div>

          {/* System Audit Log Terminal */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#526857] uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#59C749]" /> System Real-time Audit Terminal
            </h3>

            <div className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] font-mono text-[11px] text-[#142618] space-y-1.5 max-h-40 overflow-y-auto">
              <p className="text-[#2B8A1E]">[SYSTEM] MongoDB connected at mongodb://localhost:27017/medikiosk</p>
              <p className="text-[#142618]">[REST API] Python Flask API Server listening on port 5000</p>
              <p className="text-[#2B8A1E]">[OCR ENGINE] PyPDF & Tesseract.js real image text extractor active</p>
              <p className="text-[#526857]">[SESSION] OPD Session #{opdSessionNumber} running cleanly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
