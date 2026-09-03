import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KioskIntake from './components/KioskIntake';
import DoctorDashboard from './components/DoctorDashboard';
import HardwareSimulator from './components/HardwareSimulator';
import { hardwareAdapter } from './services/hardwareAdapter';

export default function App() {
  const [activeView, setActiveView] = useState('kiosk'); // 'kiosk' | 'doctor'
  const [language, setLanguage] = useState('en');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Doctor Availability & OPD Session State
  const [isDoctorAvailable, setIsDoctorAvailable] = useState(true);
  const [opdSessionNumber, setOpdSessionNumber] = useState(1);

  // Hardware State
  const [connectionState, setConnectionState] = useState('simulating');
  const [activeSource, setActiveSource] = useState('simulator');
  const [currentVitals, setCurrentVitals] = useState({
    temperature_c: 37.0,
    heart_rate_bpm: 72,
    spo2_percent: 98,
    timestamp: new Date().toISOString(),
    source: 'Simulator'
  });

  // OPD Encounter Queue State (START FRESH WITH 0 HARDCODED PATIENTS)
  const [encounterQueue, setEncounterQueue] = useState([]);
  const [activeEncounter, setActiveEncounter] = useState(null);

  // Sync encounters with MongoDB API on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/mongo/encounters')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: item.encounter_id || item._id,
            timestamp: new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            patient: {
              abha_id: item.abha_id,
              full_name: item.answers?.full_name || 'Patient',
              age: item.answers?.age || 40,
              gender: item.answers?.gender || 'Male'
            },
            careMode: item.care_mode || 'allopathy',
            symptomCategory: item.symptom_category || 'Intake',
            answers: item.answers || {},
            vitals: item.vitals || {},
            triage: item.triage || {},
            scannedDoc: item.scanned_doc,
            fhirPayload: item.fhir_payload,
            status: item.status || 'QUEUED'
          }));
          setEncounterQueue(formatted);
          if (formatted.length > 0) {
            setActiveEncounter(formatted[0]);
          }
        }
      })
      .catch(err => console.warn('MongoDB initial sync fallback:', err));
  }, []);

  // Hardware Subscription
  useEffect(() => {
    const unsubscribe = hardwareAdapter.subscribe((vitals, state, source) => {
      setCurrentVitals(vitals);
      setConnectionState(state);
      setActiveSource(source);
    });
    return () => unsubscribe();
  }, []);

  const handleEncounterSubmit = (newEncounter) => {
    setEncounterQueue(prev => [newEncounter, ...prev]);
    setActiveEncounter(newEncounter);
    setActiveView('doctor'); // Automatically switch to doctor view to show immediate result!
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950 flex flex-col">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        language={language}
        setLanguage={setLanguage}
        connectionState={connectionState}
        activeSource={activeSource}
        currentVitals={currentVitals}
        openHardwareModal={() => setIsHardwareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12 pt-4">
        {activeView === 'kiosk' ? (
          <KioskIntake
            currentVitals={currentVitals}
            onEncounterSubmit={handleEncounterSubmit}
            language={language}
            isDoctorAvailable={isDoctorAvailable}
            opdSessionNumber={opdSessionNumber}
          />
        ) : (
          <DoctorDashboard
            encounterQueue={encounterQueue}
            activeEncounter={activeEncounter}
            setActiveEncounter={setActiveEncounter}
            isDoctorAvailable={isDoctorAvailable}
            setIsDoctorAvailable={setIsDoctorAvailable}
            opdSessionNumber={opdSessionNumber}
            setOpdSessionNumber={setOpdSessionNumber}
          />
        )}
      </main>

      {/* Hardware Simulator / Attachment Modal */}
      <HardwareSimulator
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        connectionState={connectionState}
        activeSource={activeSource}
        currentVitals={currentVitals}
      />
    </div>
  );
}
