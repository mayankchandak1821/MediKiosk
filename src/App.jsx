import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import PatientDashboard from './components/PatientDashboard';
import KioskIntake from './components/KioskIntake';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import HardwareSimulator from './components/HardwareSimulator';
import { hardwareAdapter } from './services/hardwareAdapter';

// URL Path to Role Resolver
const getRoleFromPath = (path) => {
  const p = (path || '').toLowerCase().replace(/\/+$/, '') || '/';
  if (p === '/doctor' || p === '/opd') return 'doctor';
  if (p === '/patient' || p === '/kiosk') return 'patient';
  if (p === '/admin') return 'admin';
  if (p === '/login') return 'login';
  return 'landing'; // Default root '/'
};

export default function App() {
  const initialRole = getRoleFromPath(window.location.pathname);
  const [activeRole, setActiveRole] = useState(initialRole);
  const [patientSubView, setPatientSubView] = useState(initialRole === 'patient' ? 'kiosk' : 'dashboard');
  const [kioskInitialStep, setKioskInitialStep] = useState(1);
  const [currentUser, setCurrentUser] = useState({ name: 'Rajesh Verma', role: 'Patient' });
  const [language, setLanguage] = useState('en');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // URL Navigation helper
  const navigateTo = (path, targetRole = null) => {
    const role = targetRole || getRoleFromPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setActiveRole(role);
    if (role === 'patient') {
      setPatientSubView('kiosk');
      setKioskInitialStep(1);
    }
  };

  // Synchronize browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const role = getRoleFromPath(window.location.pathname);
      setActiveRole(role);
      if (role === 'patient') {
        setPatientSubView('kiosk');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
              abha_id: item.abha_id,
              full_name: item.answers?.full_name || 'Patient',
              age: item.answers?.age || 40,
              gender: item.answers?.gender || 'Male',
              phone: item.answers?.phone || '+91 98765 43210'
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
    if (role === 'patient') {
      navigateTo('/patient', 'patient');
      setPatientSubView('dashboard');
    } else if (role === 'doctor') {
      navigateTo('/doctor', 'doctor');
    } else {
      navigateTo('/admin', 'admin');
    }
  };

  const handleEncounterSubmit = (newEncounter) => {
    setEncounterQueue(prev => [newEncounter, ...prev]);
    setActiveEncounter(newEncounter);
    setPatientSubView('dashboard');
    navigateTo('/doctor', 'doctor'); // Switch to Doctor OPD Portal with /doctor URL!
  };

  return (
    <>
      {activeRole === 'landing' ? (
        <LandingPage
          onLaunchKiosk={() => navigateTo('/patient', 'patient')}
          onLaunchDoctor={() => navigateTo('/doctor', 'doctor')}
          onLaunchLogin={() => navigateTo('/login', 'login')}
        />
      ) : (
        <div className="min-h-screen bg-[#FFFDF1] text-[#142618] font-sans selection:bg-[#59C749] selection:text-white flex flex-col">
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
            onOpenLogin={() => navigateTo('/login', 'login')}
            onNavigate={navigateTo}
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
            />
          ) : (
            <div className="space-y-4">
              <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <button
                  onClick={() => setPatientSubView('dashboard')}
                  className="px-4 py-2 bg-white border border-[#E2DCBE] hover:bg-[#F7F4E1] text-[#142618] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
    )}
  </>
  );
}
