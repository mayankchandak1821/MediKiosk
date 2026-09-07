/**
 * MediKiosk Patient Account & ABHA Storage Manager
 * Maintains saved patient profiles in localStorage and memory
 */

const DEFAULT_PATIENTS = [
  {
    abha_id: '91-8840-2910-4491',
    name: 'Rajesh Verma',
    age: 52,
    gender: 'Male',
    phone: '9876543210',
    aadhaar_last4: '4829',
    blood_group: 'O+',
    role: 'Patient'
  },
  {
    abha_id: '91-4820-1948-2041',
    name: 'Priya Sundaram',
    age: 34,
    gender: 'Female',
    phone: '9840123456',
    aadhaar_last4: '1092',
    blood_group: 'A+',
    role: 'Patient'
  }
];

export const patientStore = {
  getPatients: () => {
    try {
      const stored = localStorage.getItem('medikiosk_patients');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load patientStore from localStorage:', err);
    }
    return DEFAULT_PATIENTS;
  },

  savePatient: (patient) => {
    const existing = patientStore.getPatients();
    // Check if patient with same abha_id or phone already exists
    const filtered = existing.filter(
      p => p.abha_id !== patient.abha_id && p.phone !== patient.phone
    );
    const updated = [patient, ...filtered];
    try {
      localStorage.setItem('medikiosk_patients', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save patient to localStorage:', err);
    }
    return patient;
  },

  findPatient: (query) => {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();
    const patients = patientStore.getPatients();
    return patients.find(
      p => p.abha_id.toLowerCase().includes(cleanQuery) || 
           p.phone.includes(cleanQuery) || 
           p.name.toLowerCase().includes(cleanQuery)
    ) || null;
  },

  generateAbhaId: () => {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    return `91-${part1}-${part2}-${part3}`;
  }
};
