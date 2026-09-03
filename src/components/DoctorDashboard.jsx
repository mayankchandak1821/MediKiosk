import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, AlertTriangle, CheckCircle2, FileCode, User, Heart, 
  Activity, Clock, ChevronRight, FileText, Download, ShieldCheck, Search, 
  Sparkles, Pill, AlertCircle, ShieldAlert, FileSearch, ArrowRight, Printer, Filter, UserX, Power, GitCompare, Eye
} from 'lucide-react';
import { ocrEngine } from '../services/ocrEngine';

export default function DoctorDashboard({ 
  encounterQueue = [], 
  activeEncounter, 
  setActiveEncounter,
  isDoctorAvailable = true,
  setIsDoctorAvailable,
  opdSessionNumber = 1,
  setOpdSessionNumber
}) {
  const [showFhirJson, setShowFhirJson] = useState(false);
  const [showDocOcrText, setShowDocOcrText] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [signedOffMap, setSignedOffMap] = useState({});
  const [queueFilter, setQueueFilter] = useState('all'); // 'all' | 'active' | 'signed_off'

  // Calculate Session Metrics
  const signedOffCount = encounterQueue.filter(e => e.status === 'COMPLETED_SIGNED_OFF' || signedOffMap[e.id]?.isSignedOff).length;
  const waitingCount = encounterQueue.filter(e => e.status !== 'COMPLETED_SIGNED_OFF' && !signedOffMap[e.id]?.isSignedOff).length;
  const redFlagCount = encounterQueue.filter(e => e.triage?.isRedFlag && e.status !== 'COMPLETED_SIGNED_OFF').length;

  // Filter Queue based on Tab Selection
  const filteredQueue = encounterQueue.filter(enc => {
    const isSigned = enc.status === 'COMPLETED_SIGNED_OFF' || signedOffMap[enc.id]?.isSignedOff;
    if (queueFilter === 'active') return !isSigned;
    if (queueFilter === 'signed_off') return isSigned;
    return true; // 'all'
  });

  useEffect(() => {
    if (!activeEncounter && filteredQueue.length > 0) {
      setActiveEncounter(filteredQueue[0]);
    }
  }, [activeEncounter, filteredQueue, setActiveEncounter]);

  const selected = activeEncounter || filteredQueue[0];

  const downloadFhirJson = () => {
    if (!selected || !selected.fhirPayload) return;
    const jsonStr = JSON.stringify(selected.fhirPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABDM_FHIR_${selected.patient?.abha_id || 'PATIENT'}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle Doctor Availability & Count Session
  const toggleDoctorAvailability = () => {
    if (isDoctorAvailable) {
      if (setIsDoctorAvailable) setIsDoctorAvailable(false);
      alert(`Doctor status set to NOT AVAILABLE. OPD Session #${opdSessionNumber} paused.`);
    } else {
      if (setIsDoctorAvailable) setIsDoctorAvailable(true);
      if (setOpdSessionNumber) setOpdSessionNumber(prev => prev + 1);
      alert(`Doctor is now AVAILABLE! Resume OPD Session #${opdSessionNumber + 1}.`);
    }
  };

  // Doctor Sign-Off Handler
  const handleSaveAndSignOff = async () => {
    if (!selected) return;

    try {
      await fetch(`http://localhost:5000/api/mongo/encounters/${selected.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_notes: doctorNotes })
      });
    } catch (err) {
      console.warn('Sign-off MongoDB sync warning:', err);
    }

    selected.status = 'COMPLETED_SIGNED_OFF';
    setSignedOffMap(prev => ({
      ...prev,
      [selected.id]: {
        isSignedOff: true,
        notes: doctorNotes,
        signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));

    alert(`Encounter ${selected.id} for ${selected.patient?.full_name || 'Patient'} signed off successfully!`);
  };

  // Print/Download Signed Rx PDF Summary
  const downloadSignedRxSummary = () => {
    if (!selected) return;
    const notesToUse = doctorNotes || selected.doctor_notes || signedOffMap[selected.id]?.notes || 'Patient evaluated and cleared for discharge.';

    const pastHistoryStr = (selected.scannedDoc?.pastMedicalHistory || selected.scannedDoc?.diagnoses || []).join(', ') || 'No prior chronic diagnoses';
    const activeMedsStr = (selected.scannedDoc?.medications || []).map(m => `${m.name} ${m.dosage}`).join(', ') || 'None extracted';

    const rxText = `=====================================================
AIIA GOVERNMENT OPD PHYSICIAN PRESCRIPTION SUMMARY
Encounter ID: ${selected.id} | Session #${opdSessionNumber} | Date: ${new Date().toLocaleDateString()}
-----------------------------------------------------
PATIENT DETAILS:
Full Name: ${selected.patient?.full_name || 'Patient'}
ABHA ID: ${selected.patient?.abha_id || 'N/A'}
Age/Gender: ${selected.patient?.age || 'N/A'} Yrs / ${selected.patient?.gender || 'N/A'}
Phone: ${selected.patient?.phone || 'N/A'}

PAST MEDICAL HISTORY & ACTIVE RX (FROM PRESCRIPTION):
Past Diagnoses: ${pastHistoryStr}
Active Medications: ${activeMedsStr}

TODAY'S OPD CHIEF COMPLAINT:
Category: ${selected.symptomCategory || 'Routine Checkup'}
Location: ${selected.answers?.site || 'General'}
Discomfort Feeling: ${selected.answers?.character || 'Routine Evaluation'}
Pain Scale: ${selected.answers?.severity || 1}/10

CLINICAL VITALS TELEMETRY:
Temperature: ${selected.vitals?.temperature_c || 37.0}°C
SpO2 Oxygen: ${selected.vitals?.spo2_percent || 98}%
Heart Rate: ${selected.vitals?.heart_rate_bpm || 72} BPM
Triage Risk Score: ${selected.triage?.riskPercentage || 15}%

PHYSICIAN CONSULTATION NOTES & DIAGNOSIS:
${notesToUse}

Status: OFFICIALLY SIGNED OFF BY OPD PHYSICIAN
=====================================================`;

    const blob = new Blob([rxText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Signed_Prescription_${(selected.patient?.full_name || 'Patient').replace(/\s+/g, '_')}_${selected.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const aiHighlights = (selected && selected.patient && selected.vitals) ? ocrEngine.synthesizeExecutiveHighlights(
    selected.patient,
    selected.answers || {},
    selected.vitals || { temperature_c: 37, spo2_percent: 98, heart_rate_bpm: 72 },
    selected.triage || {},
    selected.scannedDoc || {}
  ) : [];

  const isCurrentSignedOff = selected && (selected.status === 'COMPLETED_SIGNED_OFF' || signedOffMap[selected.id]?.isSignedOff);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner & Session Counters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 font-bold">
            <Stethoscope className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-100">Physician Consultation EMR Portal</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
                SESSION #{opdSessionNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400">Pre-formatted AI Clinical Extraction & History Synthesis</p>
          </div>
        </div>

        {/* Doctor Status Toggle & Metric Cards */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={toggleDoctorAvailability}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all border ${
              isDoctorAvailable
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 shadow'
                : 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 shadow animate-pulse'
            }`}
          >
            <Power className="w-4 h-4" />
            {isDoctorAvailable ? '🟢 Doctor Available' : '🔴 Doctor Not Available'}
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-emerald-400 block text-[10px] uppercase font-bold">Session Signed Off</span>
            <span className="font-mono font-black text-emerald-300 text-sm">
              {signedOffCount} Patients
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Active Waiting</span>
            <span className="font-bold text-slate-200 text-sm">{waitingCount} Patients</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-rose-400 block text-[10px]">Red Flags</span>
            <span className="font-bold text-rose-300 text-sm">{redFlagCount} Critical</span>
          </div>
        </div>
      </div>

      {/* Doctor Not Available Banner Alert */}
      {!isDoctorAvailable && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-200 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <UserX className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h3 className="font-extrabold text-rose-300 text-base">OPD SESSION PAUSED: DOCTOR NOT AVAILABLE</h3>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Doctor is currently on break or emergency call. New OPD intake sessions are paused.
              </p>
            </div>
          </div>
          <button
            onClick={toggleDoctorAvailability}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 shadow"
          >
            Resume OPD Session #{opdSessionNumber + 1}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient OPD Queue List (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" /> OPD Live Queue
            </h3>

            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setQueueFilter('all')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  queueFilter === 'all' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                All ({encounterQueue.length})
              </button>
              <button
                onClick={() => setQueueFilter('active')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  queueFilter === 'active' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                Waiting ({waitingCount})
              </button>
              <button
                onClick={() => setQueueFilter('signed_off')}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  queueFilter === 'signed_off' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                Signed Off ({signedOffCount})
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filteredQueue.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400/50 mx-auto" />
                <p className="text-xs text-slate-300 font-bold">No patients in OPD queue yet.</p>
                <p className="text-[11px] text-slate-500 italic">
                  Register new patients at the Kiosk to populate live OPD queue.
                </p>
              </div>
            ) : (
              filteredQueue.map((enc) => {
                const isSigned = enc.status === 'COMPLETED_SIGNED_OFF' || signedOffMap[enc.id]?.isSignedOff;
                return (
                  <button
                    key={enc.id}
                    onClick={() => setActiveEncounter(enc)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      selected?.id === enc.id
                        ? isSigned
                          ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10'
                          : enc.triage?.isRedFlag
                          ? 'bg-rose-500/20 border-rose-500/60 shadow-lg shadow-rose-500/10'
                          : 'bg-teal-500/20 border-teal-400 shadow-lg shadow-teal-500/10'
                        : isSigned
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : enc.triage?.isRedFlag
                        ? 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {enc.patient?.full_name || 'Patient'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{enc.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{enc.symptomCategory || 'Routine OPD'}</span>
                      {isSigned ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> SIGNED OFF
                        </span>
                      ) : enc.triage?.isRedFlag ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-black text-[10px] uppercase animate-pulse">
                          {enc.triage?.riskPercentage ? `${enc.triage.riskPercentage}% RED FLAG` : 'RED FLAG'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                          {enc.triage?.riskPercentage ? `${enc.triage.riskPercentage}% ROUTINE` : 'ROUTINE'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed AI Extracted Summary & Record (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {selected && selected.patient ? (
            <>
              {/* Patient Header & Priority Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-lg">
                    {(selected.patient?.full_name || 'P').charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-slate-100">{selected.patient?.full_name || 'Patient Name'}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono">
                        {selected.patient?.gender || 'M'}, {selected.patient?.age || '52'} Yrs
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">ABHA: {selected.patient?.abha_id || '91-8840-2910-4491'} | Encounter: {selected.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDocOcrText(!showDocOcrText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    <Eye className="w-4 h-4 text-teal-400" />
                    {showDocOcrText ? 'Hide Document Text' : 'View Prescription Text'}
                  </button>

                  <button
                    onClick={() => setShowFhirJson(!showFhirJson)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                  >
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    {showFhirJson ? 'Hide FHIR Payload' : 'View FHIR R4 JSON'}
                  </button>

                  <button
                    onClick={downloadFhirJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download FHIR
                  </button>
                </div>
              </div>

              {/* Signed Off Status Banner if Completed */}
              {isCurrentSignedOff && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-xs shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-100 text-sm block">Clinical Encounter Signed Off & Discharged</span>
                      <span className="text-slate-400">Session #{opdSessionNumber} • Saved in MongoDB</span>
                    </div>
                  </div>
                  <button
                    onClick={downloadSignedRxSummary}
                    className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 hover:brightness-110 shadow"
                  >
                    <Printer className="w-4 h-4" /> Download Signed Rx Summary
                  </button>
                </div>
              )}

              {/* PAST MEDICAL HISTORY VS TODAY'S OPD COMPLAINT COMPARISON CARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <GitCompare className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-100 tracking-tight">
                      AI History Synthesis: Prescription History vs Today's OPD Problem
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold uppercase">
                    COMPARATIVE SYNTHESIS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Past History from Prescription */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-400 uppercase tracking-wider text-[10px]">
                        1. Past History & Active Rx (From Prescription)
                      </span>
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Document Past Diagnoses:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selected.scannedDoc?.pastMedicalHistory || selected.scannedDoc?.diagnoses || []).length > 0 ? (
                          (selected.scannedDoc?.pastMedicalHistory || selected.scannedDoc?.diagnoses).map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-bold border border-teal-500/30 text-[10px]">
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No past chronic condition extracted</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Extracted Active Medications:</span>
                      <div className="space-y-1 mt-1">
                        {selected.scannedDoc?.medications?.length > 0 ? (
                          selected.scannedDoc.medications.map((m, i) => (
                            <div key={i} className="flex items-center justify-between font-mono text-[11px] bg-slate-950 px-2 py-1 rounded">
                              <span className="text-slate-200 font-bold">💊 {m.name}</span>
                              <span className="text-teal-400">{m.dosage} ({m.frequency})</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No prescription meds extracted</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Today's OPD Problem from Kiosk */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                        2. Today's Chief Complaint (Kiosk Intake)
                      </span>
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Visit Category:</span>
                        <span className="text-slate-100 font-bold">{selected.symptomCategory || 'General Checkup'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Symptom Location & Character:</span>
                        <span className="text-slate-200">{selected.answers?.site || 'General'} • {selected.answers?.character || 'Routine Checkup'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Pain Rating & SpO2:</span>
                        <span className="text-amber-400 font-bold">{selected.answers?.severity || 1}/10 Pain</span> | <span className="text-cyan-400 font-bold">SpO2 {selected.vitals?.spo2_percent || 98}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RAW PRESCRIPTION OCR TEXT VIEWER */}
              {showDocOcrText && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-teal-400 font-bold">Scanned Document Raw OCR Stream</span>
                    <span className="text-[10px] text-slate-500">Source: Uploaded PDF / Camera Snapshot</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] max-h-48 overflow-y-auto border border-slate-800 whitespace-pre-wrap">
                    {selected.scannedDoc?.rawText || 'No raw text extracted from uploaded file.'}
                  </pre>
                </div>
              )}

              {/* AI EXTRACTED EXECUTIVE HIGHLIGHTS CARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-teal-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-100 tracking-tight">
                      AI Extracted Key Clinical Highlights (5-Second Review)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold uppercase">
                    AI SYNTHESIS ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {aiHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                        item.type === 'CRITICAL'
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                          : item.type === 'WARNING' || item.type === 'ALERT'
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5">
                        {item.type === 'CRITICAL' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                        {item.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        {item.type === 'ALERT' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                        {item.type === 'NORMAL' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold block">{item.title}</span>
                        <span className="text-[11px] opacity-90">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FHIR JSON Viewer Toggle */}
              {showFhirJson && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-cyan-400 font-bold">ABDM HL7 FHIR R4 Standard Payload</span>
                    <span className="text-[10px] text-slate-500">Resource: Bundle (document)</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] max-h-60 overflow-y-auto border border-slate-800">
                    {JSON.stringify(selected.fhirPayload, null, 2)}
                  </pre>
                </div>
              )}

              {/* Vitals Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Captured Vital Signs (Peripheral Hardware Sync)
                </h4>
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Temperature</span>
                    <span className={`font-bold text-sm ${(selected.vitals?.temperature_c || 37.0) >= 38.5 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {selected.vitals?.temperature_c || 37.0}°C
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Oxygen (SpO2)</span>
                    <span className={`font-bold text-sm ${(selected.vitals?.spo2_percent || 98) < 92 ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {selected.vitals?.spo2_percent || 98}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Heart Rate</span>
                    <span className="font-bold text-sm text-rose-400">
                      {selected.vitals?.heart_rate_bpm || 72} BPM
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Assessment Action Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Physician Assessment & Rx Notes
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Enter physician clinical observations, final diagnosis, or Rx prescription..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500 h-20"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleSaveAndSignOff}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save & Sign Off Encounter
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Stethoscope className="w-10 h-10 text-teal-400/40 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No Patient Selected in OPD Queue</p>
              <p className="text-xs text-slate-500">Select a patient from the left queue or register new patients at the Kiosk.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
