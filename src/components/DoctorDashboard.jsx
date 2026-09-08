import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, AlertTriangle, CheckCircle2, User, Heart, 
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
      <div className="bg-white border border-[#E2DCBE] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#59C749] text-white font-bold shadow-sm">
            <Stethoscope className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-[#142618]">Physician Consultation EMR Portal</h2>
              <span className="text-xs text-[#2B8A1E] font-bold">
                Session #{opdSessionNumber}
              </span>
            </div>
            <p className="text-xs text-[#526857]">Pre-formatted AI Clinical Extraction & History Synthesis</p>
          </div>
        </div>

        {/* Doctor Status Toggle & Metric Cards */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={toggleDoctorAvailability}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all border cursor-pointer ${
              isDoctorAvailable
                ? 'bg-[#59C749]/15 border-[#59C749] text-[#142618] hover:bg-[#59C749]/25 shadow-xs'
                : 'bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200 shadow-xs'
            }`}
          >
            <Power className="w-4 h-4" />
            {isDoctorAvailable ? '🟢 Doctor Available' : '🔴 Doctor Not Available'}
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-[#59C749]/10 border border-[#59C749]/30">
            <span className="text-[#2B8A1E] block text-[10px] uppercase font-bold">Session Signed Off</span>
            <span className="font-mono font-black text-[#142618] text-sm">
              {signedOffCount} Patients
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE]">
            <span className="text-[#526857] block text-[10px]">Active Waiting</span>
            <span className="font-bold text-[#142618] text-sm">{waitingCount} Patients</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-rose-700 block text-[10px] font-bold">Red Flags</span>
            <span className="font-bold text-rose-950 text-sm">{redFlagCount} Critical</span>
          </div>
        </div>
      </div>

      {/* Doctor Not Available Banner Alert */}
      {!isDoctorAvailable && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <UserX className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-rose-950 text-base">OPD SESSION PAUSED: DOCTOR NOT AVAILABLE</h3>
              <p className="text-xs text-rose-800 mt-0.5">
                Doctor is currently on break or emergency call. New OPD intake sessions are paused.
              </p>
            </div>
          </div>
          <button
            onClick={toggleDoctorAvailability}
            className="px-4 py-2 bg-[#59C749] text-white font-bold rounded-xl text-xs hover:bg-[#4EBD3E] shadow-sm cursor-pointer"
          >
            Resume OPD Session #{opdSessionNumber + 1}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient OPD Queue List (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E2DCBE] rounded-2xl p-4 space-y-4 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3">
            <h3 className="font-bold text-sm text-[#142618] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#59C749]" /> OPD Live Queue
            </h3>

            <div className="flex items-center p-1 bg-[#FFFDF1] rounded-lg border border-[#E2DCBE] text-[10px]">
              <button
                onClick={() => setQueueFilter('all')}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  queueFilter === 'all' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
                }`}
              >
                All ({encounterQueue.length})
              </button>
              <button
                onClick={() => setQueueFilter('active')}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  queueFilter === 'active' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
                }`}
              >
                Waiting ({waitingCount})
              </button>
              <button
                onClick={() => setQueueFilter('signed_off')}
                className={`px-2 py-1 rounded font-bold transition-all cursor-pointer ${
                  queueFilter === 'signed_off' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
                }`}
              >
                Signed Off ({signedOffCount})
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filteredQueue.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#59C749]/50 mx-auto" />
                <p className="text-xs text-[#142618] font-bold">No patients in OPD queue yet.</p>
                <p className="text-[11px] text-[#526857] italic">
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
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selected?.id === enc.id
                        ? isSigned
                          ? 'bg-[#59C749]/20 border-[#59C749] shadow-xs'
                          : enc.triage?.isRedFlag
                          ? 'bg-rose-100 border-rose-400 shadow-xs'
                          : 'bg-[#59C749]/15 border-[#59C749] shadow-xs'
                        : isSigned
                        ? 'bg-[#FFFDF1] border-[#E2DCBE]'
                        : enc.triage?.isRedFlag
                        ? 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                        : 'bg-[#FFFDF1] border-[#E2DCBE] hover:border-[#59C749]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#142618] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#526857]" /> {enc.patient?.full_name || 'Patient'}
                      </span>
                      <span className="text-[10px] text-[#526857] font-mono">{enc.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#526857] mt-1">
                      <span>{enc.symptomCategory || 'Routine OPD'}</span>
                      {isSigned ? (
                        <span className="text-xs text-[#2B8A1E] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Signed Off
                        </span>
                      ) : enc.triage?.isRedFlag ? (
                        <span className="text-xs text-rose-700 font-bold">
                          {enc.triage?.riskPercentage ? `${enc.triage.riskPercentage}% Red Flag` : 'Red Flag'}
                        </span>
                      ) : (
                        <span className="text-xs text-[#2B8A1E] font-medium">
                          {enc.triage?.riskPercentage ? `${enc.triage.riskPercentage}% Routine` : 'Routine'}
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
        <div className="lg:col-span-8 bg-white border border-[#E2DCBE] rounded-2xl p-6 shadow-xs space-y-6">
          {selected && selected.patient ? (
            <>
              {/* Patient Header & Priority Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DCBE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-center font-bold text-[#142618] text-lg">
                    {(selected.patient?.full_name || 'P').charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-[#142618]">{selected.patient?.full_name || 'Patient Name'}</h3>
                      <span className="text-xs text-[#526857]">
                        {selected.patient?.gender || 'M'}, {selected.patient?.age || '52'} Yrs
                      </span>
                    </div>
                    <p className="text-xs text-[#526857] font-mono">ABHA: {selected.patient?.abha_id || '91-8840-2910-4491'} | Encounter: {selected.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDocOcrText(!showDocOcrText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF1] hover:bg-[#F7F4E1] text-[#142618] text-xs font-semibold rounded-lg transition-colors border border-[#E2DCBE] cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#59C749]" />
                    {showDocOcrText ? 'Hide Document Text' : 'View Prescription Text'}
                  </button>
                </div>
              </div>

              {/* Signed Off Status Banner if Completed */}
              {isCurrentSignedOff && (
                <div className="p-4 rounded-2xl bg-[#59C749]/10 border border-[#59C749]/40 text-[#142618] flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2B8A1E] shrink-0" />
                    <div>
                      <span className="font-bold text-[#142618] text-sm block">Clinical Encounter Signed Off & Discharged</span>
                      <span className="text-[#526857]">Session #{opdSessionNumber} • Saved in Records</span>
                    </div>
                  </div>
                  <button
                    onClick={downloadSignedRxSummary}
                    className="px-3.5 py-2 bg-[#59C749] text-white font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#4EBD3E] shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Download Signed Rx Summary
                  </button>
                </div>
              )}

              {/* PAST MEDICAL HISTORY VS TODAY'S OPD COMPLAINT COMPARISON CARD */}
              <div className="p-5 rounded-2xl bg-[#FFFDF1] border border-[#E2DCBE] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#59C749]/15 text-[#2B8A1E]">
                      <GitCompare className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-sm text-[#142618] tracking-tight">
                      AI History Synthesis: Prescription History vs Today's OPD Problem
                    </h4>
                  </div>
                  <span className="text-xs text-[#2B8A1E] font-bold">
                    Comparative Synthesis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Past History from Prescription */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2DCBE] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2B8A1E] uppercase tracking-wider text-[10px]">
                        1. Past History & Active Rx (From Prescription)
                      </span>
                      <FileText className="w-3.5 h-3.5 text-[#59C749]" />
                    </div>

                    <div>
                      <span className="text-[#526857] block text-[10px]">Document Past Diagnoses:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selected.scannedDoc?.pastMedicalHistory || selected.scannedDoc?.diagnoses || []).length > 0 ? (
                          (selected.scannedDoc?.pastMedicalHistory || selected.scannedDoc?.diagnoses).map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#59C749]/15 text-[#142618] font-bold border border-[#59C749]/30 text-[10px]">
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#526857] italic">No past chronic condition extracted</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2DCBE]">
                      <span className="text-[#526857] block text-[10px]">Extracted Active Medications:</span>
                      <div className="space-y-1 mt-1">
                        {selected.scannedDoc?.medications?.length > 0 ? (
                          selected.scannedDoc.medications.map((m, i) => (
                            <div key={i} className="flex items-center justify-between font-mono text-[11px] bg-[#FFFDF1] px-2 py-1 rounded border border-[#E2DCBE]">
                              <span className="text-[#142618] font-bold">💊 {m.name}</span>
                              <span className="text-[#2B8A1E] font-semibold">{m.dosage} ({m.frequency})</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[#526857] italic">No prescription meds extracted</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Today's OPD Problem from Kiosk */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2DCBE] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#142618] uppercase tracking-wider text-[10px]">
                        2. Today's Chief Complaint (Kiosk Intake)
                      </span>
                      <Activity className="w-3.5 h-3.5 text-[#59C749]" />
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div>
                        <span className="text-[#526857] block text-[10px]">Visit Category:</span>
                        <span className="text-[#142618] font-bold">{selected.symptomCategory || 'General Checkup'}</span>
                      </div>
                      <div>
                        <span className="text-[#526857] block text-[10px]">Symptom Location & Character:</span>
                        <span className="text-[#142618]">{selected.answers?.site || 'General'} • {selected.answers?.character || 'Routine Checkup'}</span>
                      </div>
                      <div>
                        <span className="text-[#526857] block text-[10px]">Pain Rating & SpO2:</span>
                        <span className="text-amber-800 font-bold">{selected.answers?.severity || 1}/10 Pain</span> | <span className="text-[#2B8A1E] font-bold">SpO2 {selected.vitals?.spo2_percent || 98}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLINICAL DECISION TREE DIFFERENTIAL DIAGNOSIS CARD */}
              {selected.decisionTreeEval && (
                <div className="p-5 rounded-2xl bg-white border border-[#E2DCBE] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <Heart className="w-4 h-4" />
                      </span>
                      <h4 className="font-extrabold text-sm text-[#142618]">
                        Clinical Decision Tree & Differential Diagnosis Probability
                      </h4>
                    </div>
                    <span className="text-xs text-rose-700 font-bold">
                      {selected.decisionTreeEval.riskPercentage}% Ischemic Risk
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selected.decisionTreeEval.differentials?.map((diff, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] flex items-center justify-between gap-3 text-xs font-mono">
                        <div>
                          <span className="font-bold text-[#142618] block">{diff.name}</span>
                          <span className="text-[10px] text-[#526857]">Recommended Action: {diff.action}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold text-sm ${diff.probability >= 50 ? 'text-rose-700' : diff.probability >= 25 ? 'text-amber-700' : 'text-[#2B8A1E]'}`}>
                            {diff.probability}%
                          </span>
                          <span className="text-[10px] block text-[#526857]">{diff.riskLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selected.decisionTreeEval.recommendation && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
                      🩺 <strong>Physician Recommendation:</strong> {selected.decisionTreeEval.recommendation}
                    </div>
                  )}
                </div>
              )}

              {/* RAW PRESCRIPTION OCR TEXT VIEWER */}
              {showDocOcrText && (
                <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#142618] font-bold">Scanned Document Raw OCR Stream</span>
                    <span className="text-[10px] text-[#526857]">Source: Uploaded PDF / Camera Snapshot</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-white text-[#142618] font-mono text-[11px] max-h-48 overflow-y-auto border border-[#E2DCBE] whitespace-pre-wrap">
                    {selected.scannedDoc?.rawText || 'No raw text extracted from uploaded file.'}
                  </pre>
                </div>
              )}

              {/* AI EXTRACTED EXECUTIVE HIGHLIGHTS CARD */}
              <div className="p-5 rounded-2xl bg-[#FFFDF1] border border-[#E2DCBE] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#59C749]/15 text-[#2B8A1E]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-sm text-[#142618] tracking-tight">
                      AI Extracted Key Clinical Highlights (5-Second Review)
                    </h4>
                  </div>
                  <span className="text-xs text-[#2B8A1E] font-bold">
                    Clinical Highlights
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {aiHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                        item.type === 'CRITICAL'
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : item.type === 'WARNING' || item.type === 'ALERT'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-white border-[#E2DCBE] text-[#142618]'
                      }`}
                    >
                      <div className="mt-0.5">
                        {item.type === 'CRITICAL' && <ShieldAlert className="w-4 h-4 text-rose-600" />}
                        {item.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {item.type === 'ALERT' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                        {item.type === 'NORMAL' && <CheckCircle2 className="w-4 h-4 text-[#59C749]" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold block">{item.title}</span>
                        <span className="text-[11px] opacity-90">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals Summary Card */}
              <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE]">
                <h4 className="text-xs font-bold text-[#526857] uppercase tracking-wider mb-3">
                  Captured Vital Signs (Peripheral Hardware Sync)
                </h4>
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2DCBE]">
                    <span className="text-[10px] text-[#526857] block">Temperature</span>
                    <span className={`font-bold text-sm ${(selected.vitals?.temperature_c || 37.0) >= 38.5 ? 'text-rose-700' : 'text-amber-800'}`}>
                      {selected.vitals?.temperature_c || 37.0}°C
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2DCBE]">
                    <span className="text-[10px] text-[#526857] block">Oxygen (SpO2)</span>
                    <span className={`font-bold text-sm ${(selected.vitals?.spo2_percent || 98) < 92 ? 'text-rose-700' : 'text-[#2B8A1E]'}`}>
                      {selected.vitals?.spo2_percent || 98}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E2DCBE]">
                    <span className="text-[10px] text-[#526857] block">Heart Rate</span>
                    <span className="font-bold text-sm text-rose-700">
                      {selected.vitals?.heart_rate_bpm || 72} BPM
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Assessment Action Form */}
              <div className="p-4 rounded-xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-3">
                <label className="text-xs font-bold text-[#526857] uppercase tracking-wider block">
                  Physician Assessment & Rx Notes
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Enter physician clinical observations, final diagnosis, or Rx prescription..."
                  className="w-full bg-white border border-[#DED7BD] rounded-xl p-3 text-xs text-[#142618] focus:outline-none focus:border-[#59C749] focus:ring-1 focus:ring-[#59C749] h-20"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleSaveAndSignOff}
                    className="px-6 py-2.5 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save & Sign Off Encounter
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#526857] space-y-2">
              <Stethoscope className="w-10 h-10 text-[#59C749]/40 mx-auto" />
              <p className="text-sm font-bold text-[#142618]">No Patient Selected in OPD Queue</p>
              <p className="text-xs text-[#526857]">Select a patient from the left queue or register new patients at the Kiosk.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
