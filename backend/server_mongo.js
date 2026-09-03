const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Patient, Encounter, Vitals } = require('./models_mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medikiosk';

mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
  .catch(err => console.warn(`MongoDB connection warning (${err.message})`));

// Root Health Check
app.get('/api/mongo/health', (req, res) => {
  res.json({ status: 'online', database: 'MongoDB Mongoose', timestamp: new Date() });
});

// Vitals Telemetry Endpoints
app.get('/api/mongo/vitals', async (req, res) => {
  try {
    const latest = await Vitals.findOne().sort({ timestamp: -1 });
    res.json(latest || { temperature_c: 37.0, heart_rate_bpm: 72, spo2_percent: 98 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mongo/vitals', async (req, res) => {
  try {
    const vitals = new Vitals(req.body);
    await vitals.save();
    res.json({ message: 'Vitals saved to MongoDB', vitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patient Endpoints
app.post('/api/mongo/patients', async (req, res) => {
  try {
    let patient = await Patient.findOne({ abha_id: req.body.abha_id });
    if (!patient) {
      patient = new Patient(req.body);
      await patient.save();
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Encounters Endpoints
app.get('/api/mongo/encounters', async (req, res) => {
  try {
    const encounters = await Encounter.find().sort({ 'triage.risk_percentage': -1 });
    res.json(encounters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mongo/encounters', async (req, res) => {
  try {
    const encounter = new Encounter({
      encounter_id: `ENC-${Date.now()}`,
      abha_id: req.body.patient?.abha_id || '91-8840-2910-4491',
      care_mode: req.body.careMode || 'allopathy',
      symptom_category: req.body.symptomCategory || 'Routine Checkup',
      answers: req.body.answers,
      vitals: req.body.vitals,
      triage: req.body.triage,
      scanned_doc: req.body.scannedDoc,
      fhir_payload: req.body.fhirPayload,
      status: req.body.triage?.isRedFlag ? 'PRIORITY_ALERT' : 'QUEUED'
    });
    await encounter.save();
    res.status(201).json({ success: true, encounter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MediKiosk Express MongoDB Server running on port ${PORT}`));
