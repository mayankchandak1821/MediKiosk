import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import PatientDashboard from './components/PatientDashboard';
import KioskIntake from './components/KioskIntake';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import HardwareSimulator from './components/HardwareSimulator';
import { hardwareAdapter } from './services/hardwareAdapter';

export default function App() {
  const [activeRole, setActiveRole] = useState('login'); // First page default is 'login'!
  const [patientSubView, setPatientSubView] = useState('dashboard'); // 'dashboard' | 'kiosk'
  const [kioskInitialStep, setKioskInitialStep] = useState(2); // 2 = Describe Illness, 3 = OCR Detection
  const [currentUser, setCurrentUser] = useState({
    name: 'Rajesh Verma',
    full_name: 'Rajesh Verma',
    abha_id: '91-8840-2910-4491',
    age: 52,
    gender: 'Male',
    phone: '9876543210',
    blood_group: 'O+',
    role: 'Patient'
  });
  const [language, setLanguage] = useState('en');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Doctor Availability & OPD Session State
  const [isDoctorAvailable, setIsDoctorAvailable] = useState(true);
  const [opdSessionNumber, setOpdSessionNumber] = useState(1);

  // Hardware Telemetry State
  const [connectionState, setConnectionState] = useState('simulating');
  const [activeSource, setActiveSource] = useState('simulator');
  const [currentVitals, setCurrentVitals] = useState({
    temperature_c: 37.0,
    heart_rate_bpm: 72,
    spo2_percent: 98,
    timestamp: new Date().toISOString(),
    source: 'Simulator'
  });

  // OPD Encounter Queue State
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
              abha_id: item.patient?.abha_id || item.abha_id || '91-8840-2910-4491',
              full_name: item.patient?.full_name || item.patient?.name || item.answers?.full_name || 'Rajesh Verma',
              age: item.patient?.age || item.answers?.age || 40,
              gender: item.patient?.gender || item.answers?.gender || 'Male',
              phone: item.patient?.phone || item.answers?.phone || '+91 98765 43210'
            },
            careMode: item.care_mode || 'allopathy',
            symptomCategory: item.symptom_category || 'Intake',
            answers: item.answers || {},
            vitals: item.vitals || {},
            triage: item.triage || {},
            scannedDoc: item.scanned_doc,
            doctor_notes: item.doctor_notes,
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

  const handleLogin = (role, userDetails) => {
    setCurrentUser(userDetails);
    setActiveRole(role);
    if (role === 'patient') setPatientSubView('dashboard');
  };

  const handleEncounterSubmit = (newEncounter) => {
    setEncounterQueue(prev => {
      const filtered = prev.filter(e => {
        const isSamePatient = (
          (e.patient?.abha_id && e.patient?.abha_id === newEncounter.patient?.abha_id) ||
          (e.patient?.full_name && e.patient?.full_name === newEncounter.patient?.full_name)
        );
        const isNewActualCase = newEncounter.symptomCategory && 
                                !newEncounter.symptomCategory.toLowerCase().includes('routine') && 
                                newEncounter.symptomCategory !== 'Intake';
        const isExistingRoutine = e.symptomCategory && 
                                  (e.symptomCategory.toLowerCase().includes('routine') || e.symptomCategory === 'Intake');
        if (isSamePatient && isNewActualCase && isExistingRoutine) {
          return false; // Remove routine checkup placeholder in favor of actual case
        }
        return true;
      });
      return [newEncounter, ...filtered];
    });
    setActiveEncounter(newEncounter);
    setPatientSubView('dashboard');
    setActiveRole('doctor'); // Switch to Doctor OPD Portal to show queued intake!
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950 flex flex-col">
      {/* Header Navigation */}
      <Header
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentUser={currentUser}
        language={language}
        setLanguage={setLanguage}
        connectionState={connectionState}
        activeSource={activeSource}
        currentVitals={currentVitals}
        openHardwareModal={() => setIsHardwareModalOpen(true)}
        onOpenLogin={() => setActiveRole('login')}
      />

      {/* Main Content Router View */}
      <main className="flex-1 pb-12 pt-4">
        {activeRole === 'login' ? (
          <LoginPage onLogin={handleLogin} language={language} />
        ) : activeRole === 'patient' ? (
          patientSubView === 'dashboard' ? (
            <PatientDashboard
              encounterQueue={encounterQueue}
              currentVitals={currentVitals}
              onDescribeIllness={() => {
                setKioskInitialStep(2);
                setPatientSubView('kiosk');
              }}
              onOcrDetection={() => {
                setKioskInitialStep(3);
                setPatientSubView('kiosk');
              }}
              currentUser={currentUser}
              language={language}
            />
          ) : (
            <div className="space-y-4">
              <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <button
                  onClick={() => setPatientSubView('dashboard')}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-teal-400 font-bold text-xs rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1.5"
                >
                  ← Back to Patient Dashboard
                </button>
              </div>
              <KioskIntake
                key={kioskInitialStep}
                initialStep={kioskInitialStep}
                currentVitals={currentVitals}
                onEncounterSubmit={handleEncounterSubmit}
                language={language}
                isDoctorAvailable={isDoctorAvailable}
                opdSessionNumber={opdSessionNumber}
                currentUser={currentUser}
              />
            </div>
          )
        ) : activeRole === 'doctor' ? (
          <DoctorDashboard
            encounterQueue={encounterQueue}
            activeEncounter={activeEncounter}
            setActiveEncounter={setActiveEncounter}
            isDoctorAvailable={isDoctorAvailable}
            setIsDoctorAvailable={setIsDoctorAvailable}
            opdSessionNumber={opdSessionNumber}
            setOpdSessionNumber={setOpdSessionNumber}
            currentUser={currentUser}
          />
        ) : (
          <AdminDashboard
            encounterQueue={encounterQueue}
            currentVitals={currentVitals}
            isDoctorAvailable={isDoctorAvailable}
            setIsDoctorAvailable={setIsDoctorAvailable}
            opdSessionNumber={opdSessionNumber}
            setOpdSessionNumber={setOpdSessionNumber}
            openHardwareModal={() => setIsHardwareModalOpen(true)}
          />
        )}
      </main>

      {/* Vitals Customizer Modal */}
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
