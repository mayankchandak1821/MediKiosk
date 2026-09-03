const mongoose = require('mongoose');

// 1. Patient Schema
const PatientSchema = new mongoose.Schema({
  abha_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  age: { type: Number, default: 30 },
  gender: { type: String, default: 'Male' },
  phone: { type: String },
  preferred_language: { type: String, default: 'en' },
  created_at: { type: Date, default: Date.now }
});

// 2. Encounter Schema
const EncounterSchema = new mongoose.Schema({
  encounter_id: { type: String, required: true },
  abha_id: { type: String, required: true },
  care_mode: { type: String, default: 'allopathy' },
  symptom_category: { type: String },
  answers: { type: Object },
  vitals: { type: Object },
  triage: {
    priority: { type: String, default: 'ROUTINE' },
    is_red_flag: { type: Boolean, default: false },
    risk_percentage: { type: Number, default: 15 },
    risk_level: { type: String, default: 'LOW_ROUTINE' },
    red_flags: [String]
  },
  scanned_doc: { type: Object },
  fhir_payload: { type: Object },
  status: { type: String, default: 'QUEUED' },
  doctor_notes: { type: String },
  created_at: { type: Date, default: Date.now }
});

// 3. Vitals Telemetry Schema
const VitalsSchema = new mongoose.Schema({
  temperature_c: Number,
  heart_rate_bpm: Number,
  spo2_percent: Number,
  respiratory_rate: Number,
  source: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = {
  Patient: mongoose.model('Patient', PatientSchema),
  Encounter: mongoose.model('Encounter', EncounterSchema),
  Vitals: mongoose.model('Vitals', VitalsSchema)
};
