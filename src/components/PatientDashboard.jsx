import React, { useState } from 'react';
import { 
  User, ShieldCheck, Activity, Heart, Thermometer, FileText, Download, 
  PlusCircle, Calendar, CheckCircle2, Clock, Pill, Stethoscope, ChevronRight, Sparkles, Printer, ScanLine, FileSearch, X, Zap
} from 'lucide-react';
import ClinicalDecisionTreeWizard from './ClinicalDecisionTreeWizard';
import VisualBodyMap from './VisualBodyMap';
import { decisionTreeEngine } from '../services/decisionTreeEngine';

export default function PatientDashboard({ 
  encounterQueue = [], 
  onDescribeIllness,
  onOcrDetection,
  currentVitals 
}) {
  const [selectedEncounter, setSelectedEncounter] = useState(encounterQueue[0] || null);

  // Decision Tree Modal State
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [treeCategory, setTreeCategory] = useState('chest_pain');
  const [treeAnswers, setTreeAnswers] = useState({
    chest_character: 'crushing_pressure',
    chest_radiation: 'rad_arm_jaw_neck',
    chest_triggers: 'trig_exertion',
    chest_associated: ['assoc_sweating', 'assoc_dyspnea'],
    chest_risk_history: ['hx_cad', 'hx_htn']
  });

  // Default demo patient profile if queue is empty
  const patientProfile = selectedEncounter?.patient || {
    full_name: 'Rajesh Verma',
    abha_id: '91-8840-2910-4491',
    age: 52,
    gender: 'Male',
    phone: '+91 98765 43210',
    blood_group: 'O+'
  };

  const handleCompleteTreeAssessment = (evalData) => {
    const newEnc = {
      id: `ENC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patient: patientProfile,
      careMode: 'allopathy',
      symptomCategory: treeCategory === 'chest_pain' ? 'Chest Pain / Emergency' : 'Symptom Assessment',
      answers: {
        site: treeAnswers.chest_radiation === 'rad_arm_jaw_neck' ? 'Chest Left & Arm' : 'Chest Center',
        character: treeAnswers.chest_character === 'crushing_pressure' ? 'Pressure / Heavy Squeezing' : 'Discomfort',
        severity: evalData.isRedFlag ? 8 : 4,
        associations: treeAnswers.chest_associated || []
      },
      treeAnswers,
      decisionTreeEval: evalData,
      vitals: currentVitals,
      triage: {
        priority: evalData.priority,
        isRedFlag: evalData.isRedFlag,
        riskPercentage: evalData.riskPercentage,
        riskLevel: evalData.isRedFlag ? 'HIGH_CRITICAL' : 'ROUTINE',
        redFlags: evalData.redFlags
      },
      status: evalData.isRedFlag ? 'PRIORITY_ALERT' : 'QUEUED'
    };

    setSelectedEncounter(newEnc);
    encounterQueue.unshift(newEnc);

    // Sync to Backend API
    fetch('http://localhost:5000/api/encounters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEnc)
    }).catch(err => console.warn('Encounter sync warning:', err));

    setShowTreeModal(false);
  };

  const patientEncounters = encounterQueue.filter(
    e => e.patient?.abha_id === patientProfile.abha_id || e.patient?.full_name === patientProfile.full_name
  );

  const activeEnc = selectedEncounter || patientEncounters[0] || encounterQueue[0];

  const downloadPatientRecord = (enc) => {
    if (!enc) return;
    const pastHistoryStr = (enc.scannedDoc?.pastMedicalHistory || enc.scannedDoc?.diagnoses || []).join(', ') || 'No past chronic condition documented';
    const medsStr = (enc.scannedDoc?.medications || []).map(m => `${m.name} ${m.dosage}`).join(', ') || 'None';

    const recordText = `=====================================================
AIIA GOVERNMENT HOSPITAL - PATIENT PERSONAL HEALTH RECORD (PHR)
-----------------------------------------------------
PATIENT IDENTIFICATION:
Full Name: ${enc.patient?.full_name || patientProfile.full_name}
ABHA ID: ${enc.patient?.abha_id || patientProfile.abha_id}
Age/Gender: ${enc.patient?.age || patientProfile.age} Yrs / ${enc.patient?.gender || patientProfile.gender}
Blood Group: ${patientProfile.blood_group || 'O+'}

ENCOUNTER SUMMARY:
Encounter ID: ${enc.id}
Date/Time: ${enc.timestamp || new Date().toLocaleString()}
Visit Category: ${enc.symptomCategory || 'Routine Checkup'}
Care Mode: ${enc.careMode || 'Allopathy'}

VITAL TELEMETRY PARAMETERS:
Body Temperature: ${enc.vitals?.temperature_c || currentVitals.temperature_c}°C
Oxygen Saturation (SpO2): ${enc.vitals?.spo2_percent || currentVitals.spo2_percent}%
Heart Rate: ${enc.vitals?.heart_rate_bpm || currentVitals.heart_rate_bpm} BPM

PAST MEDICAL HISTORY & ACTIVE RX:
Diagnoses: ${pastHistoryStr}
Extracted Medications: ${medsStr}

PHYSICIAN CONSULTATION NOTES:
${enc.doctor_notes || 'Patient evaluated and cleared by OPD physician.'}

Status: ${enc.status === 'COMPLETED_SIGNED_OFF' ? 'OFFICIALLY SIGNED OFF BY DOCTOR' : 'IN OPD QUEUE'}
=====================================================`;

    const blob = new Blob([recordText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PHR_Record_${(enc.patient?.full_name || 'Patient').replace(/\s+/g, '_')}_${enc.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-teal-500/20">
            {patientProfile.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xl text-slate-100">{patientProfile.full_name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ABDM VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ABHA ID: {patientProfile.abha_id} • {patientProfile.gender}, {patientProfile.age} Yrs • Phone: {patientProfile.phone}
            </p>
          </div>
        </div>

        {/* 2 Side-by-Side Action Buttons: Describe Illness (Decision Tree) & OCR Detection */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowTreeModal(!showTreeModal)}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 ${
              showTreeModal
                ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:scale-105'
            }`}
          >
            <FileText className="w-4 h-4" /> {showTreeModal ? 'Close Symptom Decision Tree' : 'Describe Illness (Decision Tree)'}
          </button>

          <button
            onClick={onOcrDetection}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4 text-cyan-400" /> OCR Detection
          </button>
        </div>
      </div>

      {/* INLINE DYNAMIC DECISION TREE SECTION ON PATIENT DASHBOARD */}
      {showTreeModal && (
        <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" /> Interactive Clinical Symptom Decision Tree
            </span>

            {/* Category Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'chest_pain', label: 'Chest Pain / Heart' },
                { id: 'fever', label: 'Fever & Infection' },
                { id: 'abdominal', label: 'Stomach / Abdominal' },
                { id: 'respiratory', label: 'Cough / Breathlessness' },
                { id: 'headache', label: 'Headache / Dizziness' },
                { id: 'ayush_wellness', label: 'AYUSH Wellness' },
                { id: 'routine_checkup', label: 'Routine OPD Checkup' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTreeCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all border ${
                    treeCategory === cat.id
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Zoomable Pictorial Body Map */}
          <VisualBodyMap
            selectedSite={treeAnswers.site}
            onSelectSite={(siteId) => setTreeAnswers(prev => ({ ...prev, site: siteId }))}
            onSelectCategory={(catId) => setTreeCategory(catId)}
          />

          {/* 2. Dynamic Decision Tree Cards for Selected Zoomed Region */}
          <ClinicalDecisionTreeWizard
            category={treeCategory}
            vitals={currentVitals}
            treeAnswers={treeAnswers}
            onTreeAnswersChange={(updated) => setTreeAnswers(updated)}
            onCompleteTree={(evalData) => handleCompleteTreeAssessment(evalData)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: My ABHA Digital Health Card & Vitals History (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ABHA Digital Health Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-teal-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Ayushman Bharat Health Card
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono text-[10px] font-bold">
                ABDM PHR
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name:</span>
                <span className="text-slate-100 font-bold">{patientProfile.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ABHA Number:</span>
                <span className="text-teal-300 font-bold">{patientProfile.abha_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Age / Gender:</span>
                <span className="text-slate-200">{patientProfile.age} Yrs / {patientProfile.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="text-rose-400 font-bold">{patientProfile.blood_group}</span>
              </div>
            </div>
          </div>

          {/* Current Live Vitals Telemetry */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Current Kiosk Sensor Vitals
            </h3>
            <div className="grid grid-cols-3 gap-2.5 font-mono text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Temp</span>
                <span className="font-bold text-amber-400 text-sm">{currentVitals.temperature_c}°C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SpO2</span>
                <span className="font-bold text-cyan-400 text-sm">{currentVitals.spo2_percent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Heart Rate</span>
                <span className="font-bold text-rose-400 text-sm">{currentVitals.heart_rate_bpm} BPM</span>
              </div>
            </div>
          </div>

          {/* OPD Encounters History Navigation List */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" /> My OPD Visit Encounters
            </h3>

            <div className="space-y-2">
              {patientEncounters.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs italic">
                  No previous OPD intake encounters recorded yet. Click "Describe Illness" above to register.
                </div>
              ) : (
                patientEncounters.map((enc) => (
                  <button
                    key={enc.id}
                    onClick={() => setSelectedEncounter(enc)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      activeEnc?.id === enc.id
                        ? 'bg-teal-500/20 border-teal-400 text-slate-100 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold">{enc.symptomCategory}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{enc.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{enc.answers?.site || 'Routine Evaluation'}</span>
                      {enc.status === 'COMPLETED_SIGNED_OFF' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ✅ SIGNED OFF
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-bold">
                          QUEUED
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Personal Health Record & Prescriptions (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {activeEnc ? (
            <>
              {/* Encounter Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-slate-100">{activeEnc.symptomCategory} OPD Visit</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs font-bold">
                      {activeEnc.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Visit Date: {activeEnc.timestamp} • Care Mode: {activeEnc.careMode}</p>
                </div>

                <button
                  onClick={() => downloadPatientRecord(activeEnc)}
                  className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" /> Download Health Summary
                </button>
              </div>

              {/* Status Badge */}
              {activeEnc.status === 'COMPLETED_SIGNED_OFF' ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 flex items-center justify-between text-xs shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-100 text-sm block">Physician Evaluation Signed Off & Discharged</span>
                      <span className="text-slate-400">Doctor Notes Attached • Official Prescription Ready</span>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadPatientRecord(activeEnc)}
                    className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-4 h-4" /> Download Prescription
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-200 flex items-center gap-3 text-xs">
                  <Clock className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-100 text-sm block">Encounter Submitted to OPD Doctor Queue</span>
                    <span className="text-slate-400">Patient is currently waiting for physician consultation in OPD queue.</span>
                  </div>
                </div>
              )}

              {/* Extracted Past History & Active Medications */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Prescription & Past History Entities
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">OCR DIGITIZED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Past Diagnoses */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Past Medical Diagnoses</span>
                    <div className="flex flex-wrap gap-1">
                      {(activeEnc.scannedDoc?.pastMedicalHistory || activeEnc.scannedDoc?.diagnoses || []).length > 0 ? (
                        (activeEnc.scannedDoc?.pastMedicalHistory || activeEnc.scannedDoc?.diagnoses).map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-bold border border-teal-500/30 text-[10px]">
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No past chronic condition documented</span>
                      )}
                    </div>
                  </div>

                  {/* Prescribed Active Medications */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prescribed Active Medications</span>
                    <div className="space-y-1">
                      {activeEnc.scannedDoc?.medications?.length > 0 ? (
                        activeEnc.scannedDoc.medications.map((m, i) => (
                          <div key={i} className="flex items-center justify-between font-mono text-[11px] bg-slate-950 px-2 py-1 rounded">
                            <span className="text-slate-100 font-bold">💊 {m.name} {m.dosage}</span>
                            <span className="text-teal-400">{m.frequency}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No active medications extracted</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Vitals & Symptom Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Intake Symptoms</span>
                  <p className="text-slate-200">Category: <span className="text-teal-300 font-bold">{activeEnc.symptomCategory}</span></p>
                  <p className="text-slate-200">Location: <span className="text-slate-100">{activeEnc.answers?.site || 'General'}</span></p>
                  <p className="text-slate-200">Discomfort: <span className="text-slate-100">{activeEnc.answers?.character || 'Routine Evaluation'}</span></p>
                  <p className="text-slate-200">Pain Scale: <span className="text-amber-400 font-bold">{activeEnc.answers?.severity || 1}/10</span></p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Telemetry Vital Signs</span>
                  <p className="text-slate-200">Temperature: <span className="text-amber-400 font-bold">{activeEnc.vitals?.temperature_c || 37.0}°C</span></p>
                  <p className="text-slate-200">Oxygen (SpO2): <span className="text-cyan-400 font-bold">{activeEnc.vitals?.spo2_percent || 98}%</span></p>
                  <p className="text-slate-200">Heart Rate: <span className="text-rose-400 font-bold">{activeEnc.vitals?.heart_rate_bpm || 72} BPM</span></p>
                  <p className="text-slate-200">Triage Risk: <span className="text-emerald-400 font-bold">{activeEnc.triage?.riskPercentage || 15}% ROUTINE</span></p>
                </div>
              </div>

              {/* CLINICAL DECISION TREE DIFFERENTIAL DIAGNOSIS CARD */}
              {activeEnc.decisionTreeEval && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-teal-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        <Heart className="w-4 h-4" />
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-100">
                        Patient Symptom Assessment & Clinical Differential Breakdown
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold uppercase">
                      {activeEnc.decisionTreeEval.riskPercentage}% Evaluated Risk
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeEnc.decisionTreeEval.differentials?.map((diff, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
                        <div>
                          <span className="font-bold text-slate-200 block">{diff.name}</span>
                          <span className="text-[10px] text-slate-400">Action Recommendation: {diff.action}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold text-sm ${diff.probability >= 50 ? 'text-rose-400' : diff.probability >= 25 ? 'text-amber-400' : 'text-teal-400'}`}>
                            {diff.probability}%
                          </span>
                          <span className="text-[10px] block text-slate-400">{diff.riskLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeEnc.decisionTreeEval.recommendation && (
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 font-medium">
                      🩺 <strong>Clinical Triage Guidance:</strong> {activeEnc.decisionTreeEval.recommendation}
                    </div>
                  )}
                </div>
              )}

              {/* Doctor Consultation Notes */}
              {activeEnc.doctor_notes && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Physician Assessment & Consultation Notes</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {activeEnc.doctor_notes}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <User className="w-10 h-10 text-teal-400/40 mx-auto" />
              <p className="text-sm font-bold text-slate-300">No Patient Encounter Selected</p>
              <p className="text-xs text-slate-500">Click "Describe Illness (Decision Tree)" above to evaluate your symptoms.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
