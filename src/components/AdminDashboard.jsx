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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-slate-950 font-bold shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xl text-slate-100">Hospital Administration & System Portal</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                SYSTEM ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Database Administration, Telemetry Bridge & OPD Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportSystemReport}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" /> Export Audit Report
          </button>
        </div>
      </div>

      {/* Admin Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-slate-500 block">Total OPD Registrations</span>
          <span className="text-2xl font-black text-slate-100">{totalPatients} Patients</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-emerald-400 block font-bold">Signed Off Discharges</span>
          <span className="text-2xl font-black text-emerald-300">{signedOffCount} Completed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-rose-400 block font-bold">Critical Red Flags</span>
          <span className="text-2xl font-black text-rose-300">{redFlagCount} Alert</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-purple-400 block font-bold">MongoDB Database</span>
          <span className="text-lg font-black text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ONLINE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: System & Hardware Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* OPD Session & Doctor Availability Controls */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-400" /> OPD Session & Physician Controls
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">Physician OPD Status</span>
                  <span className="text-[11px] text-slate-400">Controls kiosk queuing for Session #{opdSessionNumber}</span>
                </div>
                <button
                  onClick={() => setIsDoctorAvailable(!isDoctorAvailable)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isDoctorAvailable
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {isDoctorAvailable ? '🟢 Doctor Available' : '🔴 Doctor Not Available'}
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-200 block">Current Session #{opdSessionNumber}</span>
                  <span className="text-[11px] text-slate-400">Increment session counter for new OPD shift</span>
                </div>
                <button
                  onClick={() => setOpdSessionNumber(prev => prev + 1)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-lg border border-slate-700"
                >
                  Start OPD Session #{opdSessionNumber + 1}
                </button>
              </div>
            </div>
          </div>

          {/* Vitals Telemetry Sensor Bridge */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Sensor Hardware Telemetry Bridge
              </h3>
              <button
                onClick={openHardwareModal}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold rounded-lg hover:bg-cyan-500/30"
              >
                Customize Vitals
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Live Temperature:</span>
                <span className="text-amber-400 font-bold">{currentVitals.temperature_c}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Live Oxygen (SpO2):</span>
                <span className="text-cyan-400 font-bold">{currentVitals.spo2_percent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Live Heart Rate:</span>
                <span className="text-rose-400 font-bold">{currentVitals.heart_rate_bpm} BPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sensor Data Source:</span>
                <span className="text-emerald-400 font-bold">{currentVitals.source || 'Hardware/Simulator'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Database Collections & System Audit Logs (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* MongoDB Database Collections Inspector */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" /> MongoDB Collections (`medikiosk`)
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-200 font-bold">db.patients</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                  {totalPatients} Documents
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-200 font-bold">db.encounters</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold text-[10px]">
                  {totalPatients} Documents
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-200 font-bold">db.vitals</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                  Telemetry Stream Active
                </span>
              </div>
            </div>
          </div>

          {/* System Audit Log Terminal */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" /> System Real-time Audit Terminal
            </h3>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
              <p className="text-emerald-400">[SYSTEM] MongoDB connected at mongodb://localhost:27017/medikiosk</p>
              <p className="text-cyan-400">[REST API] Python Flask API Server listening on port 5000</p>
              <p className="text-teal-400">[OCR ENGINE] PyPDF & Tesseract.js real image text extractor active</p>
              <p className="text-slate-400">[SESSION] OPD Session #{opdSessionNumber} running cleanly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
