/**
 * MediKiosk Universal Clinical Decision Tree Engine (SIH26047)
 * Implements dynamic, branching clinical symptom decision trees for:
 * - Chest Pain / Emergency
 * - Fever & Infections
 * - Abdominal Pain & Digestion
 * - Cough & Respiratory / Breathlessness
 * - Headache & Neurological
 * - AYUSH & Ayurvedic Prakriti
 * - Routine OPD General Checkup
 *
 * Computes Differential Diagnosis Probabilities and Immediate Red Flag Triage.
 */

export const DECISION_TREES = {
  chest_pain: {
    id: 'chest_pain',
    name: 'Cardiovascular & Chest Pain Decision Tree',
    name_hi: 'αñ╣αÑâαñªαñ» αñÅαñ╡αñé αñ╕αÑÇαñ¿αÑç αñòαÑç αñªαñ░αÑìαñª αñòαñ╛ αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖',
    steps: [
      {
        id: 'chest_character',
        title: 'Step 1: What is the exact sensation of the chest discomfort?',
        title_hi: 'αñÜαñ░αñú 1: αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñªαñ░αÑìαñª αñòαÑÇ αñ╕αñ╣αÑÇ αñàαñ¿αÑüαñ¡αÑéαññαñ┐ αñòαÑìαñ»αñ╛ αñ╣αÑê?',
        subtitle: 'Select primary character of chest pain',
        subtitle_hi: 'αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñªαñ░αÑìαñª αñòαÑç αñ¬αÑìαñ░αñ╛αñÑαñ«αñ┐αñò αñ¬αÑìαñ░αñòαñ╛αñ░ αñòαñ╛ αñÜαñ»αñ¿ αñòαñ░αÑçαñé',
        options: [
          { id: 'crushing_pressure', label: 'Crushing Heavy Pressure / Tight Band / Heavy Weight', label_hi: 'αñªαñ¼αñ╛αñ╡ αñ¡αñ░αñ╛ αñ¡αñ╛αñ░αÑÇαñ¬αñ¿ / αñòαñ╕αññαñ╛ αñ╣αÑüαñå αñ¼αÑêαñéαñí / αñ¡αñ╛αñ░αÑÇ αñ╡αñ£αñ¿ αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑïαñ¿αñ╛', icon: 'Heart', isRedFlag: true, weight: { acs: 40, gerd: 5, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'sharp_stabbing', label: 'Sharp Stabbing / Knife-like Pain', label_hi: 'αññαÑçαñ£ αñÜαÑüαñ¡αñ¿ αñ╡αñ╛αñ▓αñ╛ / αñÜαñ╛αñòαÑé αñ£αÑêαñ╕αñ╛ αññαÑçαñ£ αñªαñ░αÑìαñª', icon: 'Activity', weight: { acs: 10, gerd: 10, pleuritic: 40, musculoskeletal: 25 } },
          { id: 'substernal_burning', label: 'Substernal Burning / Acid Reflux / Heartburn', label_hi: 'αñ╕αÑÇαñ¿αÑç αñòαÑç αñ¼αÑÇαñÜ αñ«αÑçαñé αñ£αñ▓αñ¿ / αñÅαñ╕αñ┐αñí αñ░αñ┐αñ½αÑìαñ▓αñòαÑìαñ╕ / αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ', icon: 'Flame', weight: { acs: 10, gerd: 50, pleuritic: 5, musculoskeletal: 5 } },
          { id: 'chest_wall_soreness', label: 'Localized Tenderness / Pain When Pressing Chest Wall', label_hi: 'αñ╕αÑÇαñ¿αÑç αñòαÑÇ αñªαÑÇαñ╡αñ╛αñ░ αñòαÑï αñªαñ¼αñ╛αñ¿αÑç αñ¬αñ░ αñªαñ░αÑìαñª / αñ«αñ╛αñéαñ╕αñ¬αÑçαñ╢αñ┐αñ»αÑïαñé αñòαñ╛ αñûαñ┐αñéαñÜαñ╛αñ╡', icon: 'User', weight: { acs: 0, gerd: 5, pleuritic: 15, musculoskeletal: 60 } }
        ]
      },
      {
        id: 'chest_radiation',
        title: 'Step 2: Does the chest pain spread (radiate) to other body areas?',
        title_hi: 'αñÜαñ░αñú 2: αñòαÑìαñ»αñ╛ αñ╕αÑÇαñ¿αÑç αñòαñ╛ αñªαñ░αÑìαñª αñ╢αñ░αÑÇαñ░ αñòαÑç αñàαñ¿αÑìαñ» αñ╣αñ┐αñ╕αÑìαñ╕αÑïαñé αñ«αÑçαñé αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê?',
        subtitle: 'Check for radiation patterns characteristic of myocardial ischemia',
        subtitle_hi: 'αñ╣αÑâαñªαñ» αñÿαñ╛αññ (αñ«αñ╛αñ»αÑïαñòαñ╛αñ░αÑìαñíαñ┐αñ»αñ▓ αñçαñ╕αÑìαñòαñ┐αñ«αñ┐αñ»αñ╛) αñòαÑç αñ▓αñòαÑìαñ╖αñúαÑïαñé αñòαÑÇ αñ£αñ╛αñéαñÜ αñòαñ░αÑçαñé',
        options: [
          { id: 'rad_arm_jaw_neck', label: 'Radiates to Left Arm, Shoulder, Jaw, or Neck', label_hi: 'αñ¼αñ╛αñ»αÑçαñé αñ╣αñ╛αñÑ, αñòαñéαñºαÑç, αñ£αñ¼αñíαñ╝αÑç αñ»αñ╛ αñùαñ░αÑìαñªαñ¿ αñòαÑÇ αññαñ░αñ½ αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê', icon: 'ShieldAlert', isRedFlag: true, weight: { acs: 45, gerd: 0, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'rad_back', label: 'Radiates straight through to the Upper Back / Interscapular area', label_hi: 'αñ¬αÑÇαñ¢αÑç αñ¬αÑÇαñá / αñòαñéαñºαÑïαñé αñòαÑç αñ¼αÑÇαñÜ αñ╕αÑÇαñºαÑç αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê', icon: 'AlertTriangle', isRedFlag: true, weight: { acs: 25, gerd: 10, pleuritic: 10, musculoskeletal: 10 } },
          { id: 'rad_epigastric', label: 'Spreads down towards Upper Stomach / Epigastrium', label_hi: 'αñèαñ¬αñ░αÑÇ αñ¬αÑçαñƒ αñòαÑÇ αññαñ░αñ½ αñ¿αÑÇαñÜαÑç αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê', icon: 'Activity', weight: { acs: 20, gerd: 35, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'rad_none', label: 'Does NOT spread (Stays localized in one small spot)', label_hi: 'αñòαñ╣αÑÇ αñ¿αñ╣αÑÇαñé αñ½αÑêαñ▓αññαñ╛ (αñÅαñò αñ╣αÑÇ αñ╕αÑìαñÑαñ╛αñ¿ αñ¬αñ░ αñ╕αÑÇαñ«αñ┐αññ αñ░αñ╣αññαñ╛ αñ╣αÑê)', icon: 'CheckCircle2', weight: { acs: 0, gerd: 10, pleuritic: 20, musculoskeletal: 30 } }
        ]
      },
      {
        id: 'chest_triggers',
        title: 'Step 3: What worsens or triggers the chest pain?',
        title_hi: 'αñÜαñ░αñú 3: αñòαñ┐αñ╕ αñùαññαñ┐αñ╡αñ┐αñºαñ┐ αñ╕αÑç αñªαñ░αÑìαñª αñ¼αñóαñ╝αññαñ╛ αñ»αñ╛ αñƒαÑìαñ░αñ┐αñùαñ░ αñ╣αÑïαññαñ╛ αñ╣αÑê?',
        subtitle: 'Aggravating and relieving factor evaluation',
        subtitle_hi: 'αñªαñ░αÑìαñª αñòαÑï αñ¼αñóαñ╝αñ╛αñ¿αÑç αñöαñ░ αñÿαñƒαñ╛αñ¿αÑç αñ╡αñ╛αñ▓αÑç αñòαñ╛αñ░αñòαÑïαñé αñòαñ╛ αñ«αÑéαñ▓αÑìαñ»αñ╛αñéαñòαñ¿',
        options: [
          { id: 'trig_exertion', label: 'Worse with Physical Exertion, Walking, or Climbing Stairs', label_hi: 'αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñ¬αñ░αñ┐αñ╢αÑìαñ░αñ«, αñÜαñ▓αñ¿αÑç αñ»αñ╛ αñ╕αÑÇαñóαñ╝αñ┐αñ»αñ╛αñé αñÜαñóαñ╝αñ¿αÑç αñ╕αÑç αñªαñ░αÑìαñª αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê', icon: 'Activity', isRedFlag: true, weight: { acs: 35, gerd: 0, pleuritic: 0, musculoskeletal: 5 } },
          { id: 'trig_breathing_cough', label: 'Worse with Deep Inspiration, Breathing, or Coughing', label_hi: 'αñùαñ╣αñ░αÑÇ αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç, αñ¢αÑÇαñéαñòαñ¿αÑç αñ»αñ╛ αñûαñ╛αñéαñ╕αñ¿αÑç αñ╕αÑç αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê', icon: 'Wind', weight: { acs: 5, gerd: 0, pleuritic: 50, musculoskeletal: 20 } },
          { id: 'trig_fatty_food', label: 'Worse after Fatty Meals or Lying Down Flat', label_hi: 'αññαñ▓αñ╛-αñ¡αÑüαñ¿αñ╛ αñûαñ╛αñ¿αÑç αñ»αñ╛ αñ╕αÑÇαñºαÑç αñ▓αÑçαñƒαñ¿αÑç αñ╕αÑç αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê', icon: 'Flame', weight: { acs: 5, gerd: 45, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'trig_body_movement', label: 'Worse with Arm Movement or Twisting Torso', label_hi: 'αñ╣αñ╛αñÑ αñ╣αñ┐αñ▓αñ╛αñ¿αÑç αñ»αñ╛ αñºαñíαñ╝ αñòαÑï αñ«αÑïαñíαñ╝αñ¿αÑç αñ╕αÑç αñªαñ░αÑìαñª αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê', icon: 'User', weight: { acs: 0, gerd: 0, pleuritic: 10, musculoskeletal: 50 } }
        ]
      },
      {
        id: 'chest_associated',
        title: 'Step 4: Are you experiencing any accompanying emergency symptoms?',
        title_hi: 'αñÜαñ░αñú 4: αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ¿αñ«αÑçαñé αñ╕αÑç αñòαÑïαñê αñùαñéαñ¡αÑÇαñ░ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ▓αñòαÑìαñ╖αñú αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑï αñ░αñ╣αÑç αñ╣αÑêαñé?',
        subtitle: 'Multi-system autonomic indicator check',
        subtitle_hi: 'αñ¼αñ╣αÑü-αñ¬αÑìαñ░αñúαñ╛αñ▓αÑÇ αñ╕αÑìαñ╡αñ╛αñ»αññαÑìαññ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ╕αñéαñòαÑçαññαÑïαñé αñòαÑÇ αñ£αñ╛αñéαñÜ αñòαñ░αÑçαñé',
        isMultiSelect: true,
        options: [
          { id: 'assoc_sweating', label: 'Profuse Cold Sweating (Diaphoresis)', label_hi: 'αñàαññαÑìαñ»αñºαñ┐αñò αñáαñéαñíαñ╛ αñ¬αñ╕αÑÇαñ¿αñ╛ αñåαñ¿αñ╛ (αñíαñ╛αñçαñ½αÑïαñ░αÑçαñ╕αñ┐αñ╕)', isRedFlag: true, weight: { acs: 25, gerd: 0, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'assoc_dyspnea', label: 'Severe Shortness of Breath / Air Hunger', label_hi: 'αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç αñ«αÑçαñé αñ¡αñ╛αñ░αÑÇ αññαñòαñ▓αÑÇαñ½ / αñ╣αñ╡αñ╛ αñòαÑÇ αñòαñ«αÑÇ αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑïαñ¿αñ╛', isRedFlag: true, weight: { acs: 25, gerd: 0, pleuritic: 25, musculoskeletal: 0 } },
          { id: 'assoc_nausea_vomiting', label: 'Nausea or Vomiting', label_hi: 'αñëαñ▓αÑìαñƒαÑÇ αñ»αñ╛ αñ«αñ┐αñÜαñ▓αÑÇ (αñ£αÑÇ αñ«αñ┐αñÜαñ▓αñ╛αñ¿αñ╛)', weight: { acs: 15, gerd: 20, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'assoc_dizziness', label: 'Dizziness / Lightheadedness / Fainting tendency', label_hi: 'αñÜαñòαÑìαñòαñ░ αñåαñ¿αñ╛ / αñ¼αÑçαñ╣αÑïαñ╢αÑÇ αñòαÑÇ αñ╕αÑìαñÑαñ┐αññαñ┐ αñ¼αñ¿αñ¿αñ╛', isRedFlag: true, weight: { acs: 20, gerd: 0, pleuritic: 0, musculoskeletal: 0 } }
        ]
      }
    ]
  },
  fever: {
    id: 'fever',
    name: 'Infectious & Pyrexia Decision Tree',
    name_hi: 'αñ¼αÑüαñûαñ╛αñ░ αñÅαñ╡αñé αñ╕αñéαñòαÑìαñ░αñ«αñú αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖',
    steps: [
      {
        id: 'fever_pattern',
        title: 'Step 1: What is the temperature pattern and onset?',
        title_hi: 'αñÜαñ░αñú 1: αñ¼αÑüαñûαñ╛αñ░ αñòαñ╛ αñ¬αÑêαñƒαñ░αÑìαñ¿ αñöαñ░ αñ╢αÑüαñ░αÑüαñåαññ αñòαÑêαñ╕αÑÇ αñ╣αÑê?',
        subtitle: 'Fever spike frequency and chills evaluation',
        subtitle_hi: 'αñ¼αÑüαñûαñ╛αñ░ αñòαñ╛ αñ╕αÑìαññαñ░ αñöαñ░ αñòαñéαñ¬αñòαñéαñ¬αÑÇ αñòαÑÇ αñ£αñ╛αñéαñÜ αñòαñ░αÑçαñé',
        options: [
          { id: 'spiking_chills', label: 'High Spiking Fever (>102┬░F) with Shaking Chills & Rigors', label_hi: 'αñòαñéαñ¬αñòαñéαñ¬αÑÇ αñöαñ░ αñáαñéαñí αñòαÑç αñ╕αñ╛αñÑ αññαÑçαñ£ αñ¼αÑüαñûαñ╛αñ░ (>102┬░F)', icon: 'Thermometer', isRedFlag: true, weight: { malaria: 45, bacterial: 35, dengue: 20 } },
          { id: 'continuous_moderate', label: 'Continuous Moderate Fever (99┬░F - 101┬░F)', label_hi: 'αñ▓αñùαñ╛αññαñ╛αñ░ αñ╣αñ▓αÑìαñòαñ╛ αñ»αñ╛ αñ«αñºαÑìαñ»αñ« αñ¼αÑüαñûαñ╛αñ░ (99┬░F - 101┬░F)', icon: 'Activity', weight: { viral: 45, bacterial: 25, malaria: 10 } },
          { id: 'low_grade_night_sweats', label: 'Low-Grade Evening Spikes with Profuse Night Sweats', label_hi: 'αñ╢αñ╛αñ« αñòαÑï αñ¼αÑüαñûαñ╛αñ░ αñÜαñóαñ╝αñ¿αñ╛ αñöαñ░ αñ░αñ╛αññ αñ«αÑçαñé αñàαññαÑìαñ»αñºαñ┐αñò αñ¬αñ╕αÑÇαñ¿αñ╛ αñåαñ¿αñ╛', icon: 'Flame', weight: { tb: 50, chronic: 35, viral: 15 } }
        ]
      },
      {
        id: 'fever_focal_symptoms',
        title: 'Step 2: Which organ systems show focal infection symptoms?',
        title_hi: 'αñÜαñ░αñú 2: αñ╢αñ░αÑÇαñ░ αñòαÑç αñòαñ┐αñ╕ αñàαñéαñù αñ«αÑçαñé αñ╕αñéαñòαÑìαñ░αñ«αñú αñòαÑç αñ▓αñòαÑìαñ╖αñú αñªαñ┐αñû αñ░αñ╣αÑç αñ╣αÑêαñé?',
        subtitle: 'Anatomical symptom localization',
        subtitle_hi: 'αñ╕αñéαñòαÑìαñ░αñ«αñú αñòαÑç αñ╕αÑìαñÑαñ╛αñ¿ αñòαÑÇ αñ¬αñ╣αñÜαñ╛αñ¿ αñòαñ░αÑçαñé',
        isMultiSelect: true,
        options: [
          { id: 'focal_throat', label: 'Severe Sore Throat / Painful Swallowing', label_hi: 'αñùαñ▓αÑç αñ«αÑçαñé αññαÑçαñ£ αñªαñ░αÑìαñª / αñ¿αñ┐αñùαñ▓αñ¿αÑç αñ«αÑçαñé αññαñòαñ▓αÑÇαñ½', icon: 'Activity', weight: { pharyngitis: 45 } },
          { id: 'focal_cough_phlegm', label: 'Persistent Cough with Yellow/Green Phlegm', label_hi: 'αñ▓αñùαñ╛αññαñ╛αñ░ αñûαñ╛αñéαñ╕αÑÇ αñòαÑç αñ╕αñ╛αñÑ αñ¬αÑÇαñ▓αñ╛/αñ╣αñ░αñ╛ αñ¼αñ▓αñùαñ«', icon: 'Wind', weight: { pneumonia: 45 } },
          { id: 'focal_urinary', label: 'Burning Sensation while Urinating / High Frequency', label_hi: 'αñ¬αÑçαñ╢αñ╛αñ¼ αñ«αÑçαñé αñ£αñ▓αñ¿ / αñ¼αñ╛αñ░-αñ¼αñ╛αñ░ αñ¬αÑçαñ╢αñ╛αñ¼ αñ£αñ╛αñ¿αñ╛', icon: 'Activity', weight: { uti: 50 } },
          { id: 'focal_joint_eye', label: 'Severe Joint/Muscle Pain & Pain Behind Eyes', label_hi: 'αñ£αÑïαñíαñ╝αÑïαñé αñ╡ αñ«αñ╛αñéαñ╕αñ¬αÑçαñ╢αñ┐αñ»αÑïαñé αñ«αÑçαñé αññαÑçαñ£ αñªαñ░αÑìαñª αñöαñ░ αñåαñéαñûαÑïαñé αñòαÑç αñ¬αÑÇαñ¢αÑç αñªαñ░αÑìαñª', icon: 'ShieldAlert', weight: { dengue: 50 } }
        ]
      }
    ]
  },
  abdominal: {
    id: 'abdominal',
    name: 'Gastrointestinal & Abdominal Pain Decision Tree',
    name_hi: 'αñ¬αÑçαñƒ αñªαñ░αÑìαñª αñÅαñ╡αñé αñ¬αñ╛αñÜαñ¿ αññαñéαññαÑìαñ░ αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖',
    steps: [
      {
        id: 'abdo_location',
        title: 'Step 1: Where in the abdomen is the pain located?',
        title_hi: 'αñÜαñ░αñú 1: αñ¬αÑçαñƒ αñ«αÑçαñé αñªαñ░αÑìαñª αñòαñ┐αñ╕ αñ╣αñ┐αñ╕αÑìαñ╕αÑç αñ«αÑçαñé αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑï αñ░αñ╣αñ╛ αñ╣αÑê?',
        subtitle: 'Abdominal quadrant localization',
        subtitle_hi: 'αñ¬αÑçαñƒ αñªαñ░αÑìαñª αñòαÑç αñòαÑìαñ╖αÑçαññαÑìαñ░ αñòαñ╛ αñÜαñ»αñ¿ αñòαñ░αÑçαñé',
        options: [
          { id: 'epigastric', label: 'Upper Stomach / Epigastrium (Acid Reflux / Stomach)', label_hi: 'αñèαñ¬αñ░αÑÇ αñ¬αÑçαñƒ / αñ¿αñ╛αñ¡αñ┐ αñòαÑç αñèαñ¬αñ░ (αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ / αñ£αñ▓αñ¿)', icon: 'Flame', weight: { gerd: 45, gastritis: 45 } },
          { id: 'ruq', label: 'Right Upper Quadrant (Under Right Rib Cage)', label_hi: 'αñªαñ╛αñ╣αñ┐αñ¿αÑÇ αñ¬αñ╕αñ▓αÑÇ αñòαÑç αñ¿αÑÇαñÜαÑç (αñ¬αñ┐αññαÑìαññαñ╛αñ╢αñ» / αñ»αñòαÑâαññ αñòαÑìαñ╖αÑçαññαÑìαñ░)', icon: 'Activity', weight: { cholecystitis: 50 } },
          { id: 'rlq', label: 'Right Lower Quadrant (Near Right Hip Bone)', label_hi: 'αñªαñ╛αñ╣αñ┐αñ¿αÑÇ αññαñ░αñ½ αñ¿αÑÇαñÜαÑç αñ¬αÑçαñƒ αñ«αÑçαñé (αñàαñ¬αÑçαñéαñíαñ┐αñòαÑìαñ╕ αñòαÑìαñ╖αÑçαññαÑìαñ░)', icon: 'ShieldAlert', isRedFlag: true, weight: { appendicitis: 55 } },
          { id: 'generalized_cramps', label: 'Diffuse Cramps & Bloating all over Stomach', label_hi: 'αñ¬αÑéαñ░αÑç αñ¬αÑçαñƒ αñ«αÑçαñé αñ«αñ░αÑïαñíαñ╝, αñÉαñéαñáαñ¿ αñöαñ░ αñùαÑêαñ╕ αñ¡αñ░ αñ£αñ╛αñ¿αñ╛', icon: 'User', weight: { gastroenteritis: 45 } }
        ]
      },
      {
        id: 'abdo_red_flags',
        title: 'Step 2: Are you experiencing any severe GI red flags?',
        title_hi: 'αñÜαñ░αñú 2: αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ¿αñ«αÑçαñé αñ╕αÑç αñòαÑïαñê αñùαñéαñ¡αÑÇαñ░ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ▓αñòαÑìαñ╖αñú αñ╣αÑêαñé?',
        subtitle: 'Internal bleeding and peritonitis screening',
        subtitle_hi: 'αñåαñéαññαñ░αñ┐αñò αñ░αñòαÑìαññαñ╕αÑìαñ░αñ╛αñ╡ αñöαñ░ αñùαñéαñ¡αÑÇαñ░ αñ¬αÑçαñƒ αñ╕αñéαñòαÑìαñ░αñ«αñú αñòαÑÇ αñ£αñ╛αñéαñÜ',
        isMultiSelect: true,
        options: [
          { id: 'abdo_vomit_blood', label: 'Vomiting Blood or Dark Coffee-Ground Fluid', label_hi: 'αñëαñ▓αÑìαñƒαÑÇ αñ«αÑçαñé αñûαÑéαñ¿ αñ»αñ╛ αñùαñ╛αñóαñ╝αñ╛ αñ¡αÑéαñ░αñ╛ αññαñ░αñ▓ αñåαñ¿αñ╛', icon: 'ShieldAlert', isRedFlag: true, weight: { gi_bleed: 50 } },
          { id: 'abdo_black_stool', label: 'Passing Black Tarry Stool (Melena)', label_hi: 'αñòαñ╛αñ▓αñ╛ αññαñ╛αñ░αñòαÑïαñ▓ αñ£αÑêαñ╕αñ╛ αñ«αñ▓ (αñ¬αñûαñ╛αñ¿αñ╛) αñåαñ¿αñ╛', icon: 'AlertTriangle', isRedFlag: true, weight: { gi_bleed: 50 } },
          { id: 'abdo_rigid_stomach', label: 'Stomach is Board-Like Hard & Painful to Touch', label_hi: 'αñ¬αÑçαñƒ αñ▓αñòαñíαñ╝αÑÇ αñ£αÑêαñ╕αñ╛ αñòαñíαñ╝αñ╛ αñ╣αÑïαñ¿αñ╛ αñöαñ░ αñ¢αÑéαñ¿αÑç αñ¬αñ░ αññαÑçαñ£ αñªαñ░αÑìαñª αñ╣αÑïαñ¿αñ╛', icon: 'ShieldAlert', isRedFlag: true, weight: { peritonitis: 55 } }
        ]
      }
    ]
  },
  respiratory: {
    id: 'respiratory',
    name: 'Respiratory & Breathlessness Decision Tree',
    name_hi: 'αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛ αñÅαñ╡αñé αñûαñ╛αñéαñ╕αÑÇ αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖',
    steps: [
      {
        id: 'resp_dyspnea_severity',
        title: 'Step 1: How severe is the breathing difficulty?',
        title_hi: 'αñÜαñ░αñú 1: αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç αñ«αÑçαñé αññαñòαñ▓αÑÇαñ½ αñòαñ┐αññαñ¿αÑÇ αñùαñéαñ¡αÑÇαñ░ αñ╣αÑê?',
        subtitle: 'Air hunger and talk test evaluation',
        subtitle_hi: 'αñ╕αñ╛αñéαñ╕ αñòαÑÇ αñòαñ«αÑÇ αñÅαñ╡αñé αñ¼αÑïαñ▓αñ¿αÑç αñòαÑÇ αñòαÑìαñ╖αñ«αññαñ╛ αñòαÑÇ αñ£αñ╛αñéαñÜ',
        options: [
          { id: 'resp_rest_breathless', label: 'Breathless at Rest / Cannot Complete Short Sentences', label_hi: 'αñ¼αÑêαñáαÑç-αñ¼αÑêαñáαÑç αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛ / αñ¬αÑéαñ░αÑç αñ╡αñ╛αñòαÑìαñ» αñ¿ αñ¼αÑïαñ▓ αñ¬αñ╛αñ¿αñ╛', icon: 'ShieldAlert', isRedFlag: true, weight: { acute_asthma: 45, heart_failure: 35, copd: 20 } },
          { id: 'resp_exertion_only', label: 'Breathless Only when Walking or Climbing Stairs', label_hi: 'αñòαÑçαñ╡αñ▓ αñÜαñ▓αñ¿αÑç αñ»αñ╛ αñ╕αÑÇαñóαñ╝αñ┐αñ»αñ╛αñé αñÜαñóαñ╝αñ¿αÑç αñ¬αñ░ αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛', icon: 'Wind', weight: { copd: 40, asthma: 30, deconditioning: 30 } },
          { id: 'resp_positional', label: 'Cannot Lie Flat in Bed without Waking Up Gasping', label_hi: 'αñ¼αñ┐αñ¿αñ╛ αññαñòαñ┐αñ»αÑç αñ╕αÑÇαñºαÑç αñ▓αÑçαñƒαñ¿αÑç αñ¬αñ░ αñ╕αñ╛αñéαñ╕ αñ░αÑüαñòαñ¿αñ╛ αñöαñ░ αñ£αñ╛αñùαñ¿αñ╛', icon: 'Heart', isRedFlag: true, weight: { heart_failure: 50, pulmonary_edema: 40 } }
        ]
      },
      {
        id: 'resp_cough_sputum',
        title: 'Step 2: What is the cough and sputum character?',
        title_hi: 'αñÜαñ░αñú 2: αñûαñ╛αñéαñ╕αÑÇ αñöαñ░ αñ¼αñ▓αñùαñ« αñòαñ╛ αñ¬αÑìαñ░αñòαñ╛αñ░ αñòαÑêαñ╕αñ╛ αñ╣αÑê?',
        subtitle: 'Auscultation & sputum analysis',
        subtitle_hi: 'αñûαñ╛αñéαñ╕αÑÇ αñòαÑÇ αñåαñ╡αñ╛αñ£ αñöαñ░ αñ¼αñ▓αñùαñ« αñòαÑÇ αñ£αñ╛αñéαñÜ',
        options: [
          { id: 'dry_whistling', label: 'Dry Cough with High-Pitched Whistling / Wheezing Sound', label_hi: 'αñ╕αÑéαñûαÑÇ αñûαñ╛αñéαñ╕αÑÇ αñòαÑç αñ╕αñ╛αñÑ αñ╕αÑÇαñƒαÑÇ αñ£αÑêαñ╕αÑÇ αñåαñ╡αñ╛αñ£ (αñ╕αÑÇαñƒαÑÇ αñ¼αñ£αñ¿αñ╛)', icon: 'Wind', weight: { asthma: 50, copd: 35 } },
          { id: 'thick_yellow_green', label: 'Coughing up Thick Yellow / Green Phlegm', label_hi: 'αñùαñ╛αñóαñ╝αñ╛ αñ¬αÑÇαñ▓αñ╛ αñ»αñ╛ αñ╣αñ░αñ╛ αñ¼αñ▓αñùαñ« αñ¿αñ┐αñòαñ▓αñ¿αñ╛', icon: 'Activity', weight: { pneumonia: 50, bronchitis: 40 } },
          { id: 'pink_frothy_blood', label: 'Coughing up Pink Frothy Sputum or Blood Spots', label_hi: 'αñùαÑüαñ▓αñ╛αñ¼αÑÇ αñ¥αñ╛αñùαñªαñ╛αñ░ αñ¼αñ▓αñùαñ« αñ»αñ╛ αñûαÑéαñ¿ αñòαÑç αñºαñ¼αÑìαñ¼αÑç αñåαñ¿αñ╛', icon: 'ShieldAlert', isRedFlag: true, weight: { pulmonary_edema: 50, tb: 40 } }
        ]
      }
    ]
  },
  headache: {
    id: 'headache',
    name: 'Neurological & Headache Decision Tree',
    name_hi: 'αñ╕αñ┐αñ░αñªαñ░αÑìαñª αñÅαñ╡αñé αññαñéαññαÑìαñ░αñ┐αñòαñ╛ αññαñéαññαÑìαñ░ αñ¿αñ┐αñ░αÑìαñúαñ» αñ╡αÑâαñòαÑìαñ╖',
    steps: [
      {
        id: 'head_onset_character',
        title: 'Step 1: What was the speed of onset and pain character?',
        title_hi: 'αñÜαñ░αñú 1: αñ╕αñ┐αñ░αñªαñ░αÑìαñª αñòαÑÇ αñ╢αÑüαñ░αÑüαñåαññ αñöαñ░ αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñòαÑêαñ╕αÑÇ αñÑαÑÇ?',
        subtitle: 'Intracranial pain pattern analysis',
        subtitle_hi: 'αñªαñ░αÑìαñª αñòαÑç αñ¬αÑìαñ░αñòαñ╛αñ░ αñòαñ╛ αñ╡αñ┐αñ╢αÑìαñ▓αÑçαñ╖αñú αñòαñ░αÑçαñé',
        options: [
          { id: 'thunderclap_sudden', label: 'Sudden "Thunderclap" Explosion (Worst Headache of Life)', label_hi: 'αñàαñÜαñ╛αñ¿αñò αñ¼αñ┐αñ£αñ▓αÑÇ αñ£αÑêαñ╕αñ╛ αñºαñ«αñ╛αñòαñ╛ (αñ£αÑÇαñ╡αñ¿ αñòαñ╛ αñ╕αñ¼αñ╕αÑç αñ¡αñ»αñ╛αñ¿αñò αñ╕αñ┐αñ░αñªαñ░αÑìαñª)', icon: 'ShieldAlert', isRedFlag: true, weight: { sah: 60, aneurysm: 35 } },
          { id: 'one_sided_throbbing', label: 'One-Sided Throbbing Pain with Nausea & Light Sensitivity', label_hi: 'αñÅαñò αññαñ░αñ½αñ╛ αñƒαñ¬αñòαññαñ╛ αñªαñ░αÑìαñª, αñ«αñ┐αñÜαñ▓αÑÇ αñöαñ░ αñ░αÑïαñ╢αñ¿αÑÇ αñ╕αÑç αññαñòαñ▓αÑÇαñ½', icon: 'Activity', weight: { migraine: 55, tension: 15 } },
          { id: 'tight_band_forehead', label: 'Constant Tight Squeezing Band Around Temples & Forehead', label_hi: 'αñ«αñ╛αñÑαÑç αñöαñ░ αñòαñ¿αñ¬αñƒαÑÇ αñòαÑç αñÜαñ╛αñ░αÑïαñé αñôαñ░ αñòαñ╕αññαñ╛ αñ╣αÑüαñå αññαñ¿αñ╛αñ╡αñ»αÑüαñòαÑìαññ αñªαñ░αÑìαñª', icon: 'User', weight: { tension: 60, fatigue: 30 } }
        ]
      },
      {
        id: 'head_neuro_deficits',
        title: 'Step 2: Are you experiencing any neurological red flags?',
        title_hi: 'αñÜαñ░αñú 2: αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ¿αñ«αÑçαñé αñ╕αÑç αñòαÑïαñê αñ¿αÑìαñ»αÑéαñ░αÑïαñ▓αÑëαñ£αñ┐αñòαñ▓ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ▓αñòαÑìαñ╖αñú αñ╣αÑêαñé?',
        subtitle: 'FAST stroke & meningeal sign screening',
        subtitle_hi: 'αñ▓αñòαñ╡αñ╛ (αñ╕αÑìαñƒαÑìαñ░αÑïαñò) αñöαñ░ αñªαñ┐αñ«αñ╛αñùαÑÇ αñ¼αÑüαñûαñ╛αñ░ αñòαÑÇ αñ£αñ╛αñéαñÜ',
        isMultiSelect: true,
        options: [
          { id: 'stroke_facial_droop', label: 'Facial Droop, Arm Weakness, or Slurred Speech', label_hi: 'αñÜαÑçαñ╣αñ░αñ╛ αñƒαÑçαñóαñ╝αñ╛ αñ╣αÑïαñ¿αñ╛, αñ╣αñ╛αñÑ αñ«αÑçαñé αñòαñ«αñ£αÑïαñ░αÑÇ αñ»αñ╛ αñåαñ╡αñ╛αñ£ αññαÑüαññαñ▓αñ╛αñ¿αñ╛', icon: 'ShieldAlert', isRedFlag: true, weight: { stroke: 60 } },
          { id: 'stiff_neck_fever', label: 'Stiff Neck + High Fever + Sensitivity to Light', label_hi: 'αñùαñ░αÑìαñªαñ¿ αñ«αÑçαñé αñàαñòαñíαñ╝αñ¿ + αññαÑçαñ£ αñ¼αÑüαñûαñ╛αñ░ + αñ░αÑïαñ╢αñ¿αÑÇ αñ╕αÑç αñíαñ░ αñ▓αñùαñ¿αñ╛', icon: 'ShieldAlert', isRedFlag: true, weight: { meningitis: 55 } },
          { id: 'vision_loss_double', label: 'Sudden Vision Loss, Double Vision, or Dizziness', label_hi: 'αñàαñÜαñ╛αñ¿αñò αñåαñéαñûαÑïαñé αñ╕αÑç αñºαÑüαñéαñºαñ▓αñ╛ αñªαñ┐αñûαñ¿αñ╛, αñªαÑï-αñªαÑï αñªαñ┐αñûαñ¿αñ╛ αñ»αñ╛ αñÜαñòαÑìαñòαñ░', icon: 'AlertTriangle', isRedFlag: true, weight: { stroke: 45 } }
        ]
      }
    ]
  },
  ayush_wellness: {
    id: 'ayush_wellness',
    name: 'AYUSH Prakriti & Dashavidha Pariksha Decision Tree',
    name_hi: 'αñåαñ»αÑüαñ╖ αñÅαñ╡αñé αñåαñ»αÑüαñ░αÑìαñ╡αÑçαñªαñ┐αñò αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú',
    steps: [
      {
        id: 'ayush_dosha',
        title: 'Step 1: Dominant Body Constitution (Prakriti Pariksha)',
        title_hi: 'αñÜαñ░αñú 1: αñåαñ¬αñòαÑÇ αñ«αÑüαñûαÑìαñ» αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñ¬αÑìαñ░αñòαÑâαññαñ┐ (αññαÑìαñ░αñ┐αñªαÑïαñ╖ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú)',
        subtitle: 'Ayurvedic tridosha assessment',
        subtitle_hi: 'αñåαñ»αÑüαñ░αÑìαñ╡αÑçαñªαñ┐αñò αñ╡αñ╛αññ, αñ¬αñ┐αññαÑìαññ, αñòαñ½ αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñ¿αñ┐αñ░αÑìαñºαñ╛αñ░αñú',
        options: [
          { id: 'vata_prakriti', label: 'Vata Dominant (Light build, dry skin, active mind, irregular digestion)', label_hi: 'αñ╡αñ╛αññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ╣αñ▓αÑìαñòαñ╛ αñ╢αñ░αÑÇαñ░, αñ░αÑéαñûαÑÇ αññαÑìαñ╡αñÜαñ╛, αñÜαñéαñÜαñ▓ αñ«αñ¿, αñàαñ¿αñ┐αñ╢αÑìαñÜαñ┐αññ αñ¬αñ╛αñÜαñ¿)', icon: 'Wind', weight: { vata: 60 } },
          { id: 'pitta_prakriti', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp focus)', label_hi: 'αñ¬αñ┐αññαÑìαññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñºαÑìαñ»αñ« αñ╢αñ░αÑÇαñ░, αñùαñ░αÑìαñ« αññαÑìαñ╡αñÜαñ╛, αññαÑçαñ£ αñ¬αñ╛αñÜαñ¿, αñÅαñòαñ╛αñùαÑìαñ░ αñ¼αÑüαñªαÑìαñºαñ┐)', icon: 'Flame', weight: { pitta: 60 } },
          { id: 'kapha_prakriti', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady endurance)', label_hi: 'αñòαñ½ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñ£αñ¼αÑéαññ αñ╢αñ░αÑÇαñ░, αñÜαñ┐αñòαñ¿αÑÇ αññαÑìαñ╡αñÜαñ╛, αñ╢αñ╛αñéαññ αñ╕αÑìαñ╡αñ¡αñ╛αñ╡, αñ╕αñ╣αñ¿αñ╢αÑÇαñ▓αññαñ╛)', icon: 'User', weight: { kapha: 60 } }
        ]
      },
      {
        id: 'ayush_agni',
        title: 'Step 2: Digestive Fire Capacity (Agni Pariksha)',
        title_hi: 'αñÜαñ░αñú 2: αñ£αñáαñ░αñ╛αñùαÑìαñ¿αñ┐ αñÅαñ╡αñé αñ¬αñ╛αñÜαñ¿ αñòαÑìαñ╖αñ«αññαñ╛ (αñàαñùαÑìαñ¿αñ┐ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú)',
        subtitle: 'Metabolic capacity evaluation',
        subtitle_hi: 'αñ¬αñ╛αñÜαñ¿ αñÅαñ╡αñé αñÜαñ»αñ╛αñ¬αñÜαñ» αñòαÑìαñ╖αñ«αññαñ╛ αñòαñ╛ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú',
        options: [
          { id: 'samagni', label: 'Sama Agni (Normal, smooth digestion without acidity or bloating)', label_hi: 'αñ╕αñ« αñàαñùαÑìαñ¿αñ┐ (αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ», αñ╕αÑüαñÜαñ╛αñ░αÑé αñ¬αñ╛αñÜαñ¿, αñ¼αñ┐αñ¿αñ╛ αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ αñòαÑç)', icon: 'CheckCircle2', weight: { balanced: 50 } },
          { id: 'mandagni', label: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)', label_hi: 'αñ«αñéαñª αñàαñùαÑìαñ¿αñ┐ (αñºαÑÇαñ«αÑÇ αñ¬αñ╛αñÜαñ¿ αñ╢αñòαÑìαññαñ┐, αñûαñ╛αñ¿αÑç αñòαÑç αñ¼αñ╛αñª αñ¡αñ╛αñ░αÑÇαñ¬αñ¿, αñòαñ« αñ¡αÑéαñû)', icon: 'Activity', weight: { kapha: 35 } },
          { id: 'tikshnagni', label: 'Tikshna Agni (Hyperactive digestion, frequent burning hunger, heartburn)', label_hi: 'αññαÑÇαñòαÑìαñ╖αÑìαñú αñàαñùαÑìαñ¿αñ┐ (αñàαññαÑìαñ»αñºαñ┐αñò αññαÑÇαñ╡αÑìαñ░ αñ¡αÑéαñû, αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñ£αñ▓αñ¿, αññαÑçαñ£ αññαÑçαñ£αñ╛αñ¼αñ┐αñ»αññ)', icon: 'Flame', weight: { pitta: 45 } }
        ]
      }
    ]
  },
  routine_checkup: {
    id: 'routine_checkup',
    name: 'Routine OPD General Checkup Decision Tree',
    name_hi: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñ╕αÑìαñ╡αñ╛αñ╕αÑìαñÑαÑìαñ» αñÅαñ╡αñé αñôαñ¬αÑÇαñíαÑÇ αñ¬αñ░αñ╛αñ«αñ░αÑìαñ╢',
    steps: [
      {
        id: 'routine_purpose',
        title: 'Step 1: What is the primary purpose of today\'s visit?',
        title_hi: 'αñÜαñ░αñú 1: αñåαñ£ αñòαÑç αñàαñ╕αÑìαñ¬αññαñ╛αñ▓ αñåαñùαñ«αñ¿ αñòαñ╛ αñ«αÑüαñûαÑìαñ» αñòαñ╛αñ░αñú αñòαÑìαñ»αñ╛ αñ╣αÑê?',
        subtitle: 'General preventive OPD checkup',
        subtitle_hi: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñ╕αÑìαñ╡αñ╛αñ╕αÑìαñÑαÑìαñ» αñ¬αñ░αÑÇαñòαÑìαñ╖αñú αñÅαñ╡αñé αñ¬αñ░αñ╛αñ«αñ░αÑìαñ╢',
        options: [
          { id: 'general_wellness', label: 'General Health & Vital Screening (BP, Sugar, Weight)', label_hi: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñ╕αÑìαñ╡αñ╛αñ╕αÑìαñÑαÑìαñ» αñ¬αñ░αÑÇαñòαÑìαñ╖αñú (αñ¼αÑÇαñ¬αÑÇ, αñ╢αÑüαñùαñ░, αñ╡αñ£αñ¿ αñ£αñ╛αñéαñÜ)', icon: 'CheckCircle2', weight: { routine: 60 } },
          { id: 'med_refill', label: 'Routine Prescription Medication Refill / Follow-up', label_hi: 'αñ¿αñ┐αñ»αñ«αñ┐αññ αñªαñ╡αñ╛αñçαñ»αÑïαñé αñòαñ╛ αñ¬αñ░αñÜαñ╛ αñªαÑïαñ¼αñ╛αñ░αñ╛ αñ▓αñ┐αñûαñ╡αñ╛αñ¿αñ╛ / αñ½αÑëαñ▓αÑï-αñàαñ¬', icon: 'Activity', weight: { routine: 50 } },
          { id: 'blood_report_review', label: 'Reviewing Pathology Blood / Lab Test Reports', label_hi: 'αñûαÑéαñ¿ αñ╡ αñ▓αÑêαñ¼ αñ£αñ╛αñéαñÜ αñ░αñ┐αñ¬αÑïαñ░αÑìαñƒ αñíαÑëαñòαÑìαñƒαñ░ αñòαÑï αñªαñ┐αñûαñ╛αñ¿αñ╛', icon: 'User', weight: { routine: 50 } }
        ]
      }
    ]
  }
};

class DecisionTreeEngine {
  /**
   * Get Decision Tree for a specific symptom category
   */
  getTreeForCategory(categoryId = 'routine_checkup') {
    return DECISION_TREES[categoryId] || DECISION_TREES.routine_checkup;
  }

  /**
   * Universal Differential Diagnosis & Red-Flag Evaluator for ANY category
   */
  evaluateTree(categoryId = 'chest_pain', treeAnswers = {}, vitals = {}) {
    if (categoryId === 'chest_pain') {
      return this.evaluateChestPainTree(treeAnswers, vitals);
    }

    const treeConfig = this.getTreeForCategory(categoryId);
    const redFlags = [];
    let riskPercentage = 15;
    let isRedFlag = false;

    // Scan for red flags across selected options
    treeConfig.steps.forEach(step => {
      const selected = treeAnswers[step.id];
      if (!selected) return;

      const selectedIds = Array.isArray(selected) ? selected : [selected];
      step.options.forEach(opt => {
        if (selectedIds.includes(opt.id)) {
          if (opt.isRedFlag) {
            isRedFlag = true;
            riskPercentage += 25;
            redFlags.push(opt.label);
          }
        }
      });
    });

    // Check vital telemetry
    const spo2 = vitals.spo2_percent || 98;
    if (spo2 < 90) {
      isRedFlag = true;
      riskPercentage += 35;
      redFlags.push(`Critical Hypoxia: SpO2 ${spo2}%`);
    }

    const temp = vitals.temperature_c || 37.0;
    if (temp >= 39.0) {
      riskPercentage += 15;
      redFlags.push(`High Fever: ${temp}┬░C`);
    }

    riskPercentage = Math.min(95, Math.max(10, riskPercentage));
    const priority = isRedFlag ? 'RED_FLAG_CRITICAL' : riskPercentage >= 35 ? 'URGENT' : 'ROUTINE';

    // Differentials list per category
    let differentials = [];
    if (categoryId === 'fever') {
      differentials = [
        { name: 'Acute Viral Pyrexia / Influenza', probability: 55, riskLevel: 'MODERATE', action: 'Antipyretics & Hydration' },
        { name: 'Malaria / Vector-Borne Infection', probability: 25, riskLevel: 'MODERATE', action: 'Peripheral Blood Smear / Rapid Antigen Test' },
        { name: 'Bacterial Pharyngitis / Chest Infection', probability: 20, riskLevel: 'LOW', action: 'CBC & Physical Exam' }
      ];
    } else if (categoryId === 'abdominal') {
      differentials = [
        { name: 'Gastritis / Peptic Acid Reflux', probability: 50, riskLevel: 'LOW', action: 'Oral Antacids & Diet Control' },
        { name: 'Acute Gastroenteritis / Food Intolerance', probability: 30, riskLevel: 'MODERATE', action: 'ORS Rehydration & Spasmolytics' },
        { name: 'Acute Appendicitis / Surgical Abdomen', probability: 20, riskLevel: isRedFlag ? 'HIGH_CRITICAL' : 'LOW', action: 'USG Abdomen & Surgical Triage' }
      ];
    } else if (categoryId === 'respiratory') {
      differentials = [
        { name: 'Acute Bronchial Asthma Exacerbation', probability: 45, riskLevel: 'MODERATE', action: 'Nebulization & Auscultation' },
        { name: 'Acute Bronchitis / Lower Respiratory Infection', probability: 35, riskLevel: 'MODERATE', action: 'Chest X-Ray & Sputum Culture' },
        { name: 'COPD Exacerbation / Acute Heart Failure', probability: 20, riskLevel: isRedFlag ? 'HIGH_CRITICAL' : 'LOW', action: '12-Lead ECG & SpO2 Monitoring' }
      ];
    } else if (categoryId === 'headache') {
      differentials = [
        { name: 'Tension Type Muscle Contraction Headache', probability: 55, riskLevel: 'LOW', action: 'Rest & Analgesic Relief' },
        { name: 'Acute Migraine with Vascular Aura', probability: 30, riskLevel: 'MODERATE', action: 'Triptan / Dark Room Rest' },
        { name: 'Subarachnoid Hemorrhage / Stroke Red Flag', probability: 15, riskLevel: isRedFlag ? 'HIGH_CRITICAL' : 'LOW', action: 'STAT Non-Contrast Brain CT' }
      ];
    } else {
      differentials = [
        { name: 'Routine Physical Wellness & Vitals Clearance', probability: 85, riskLevel: 'ROUTINE', action: 'Routine Doctor Consultation' },
        { name: 'Lifestyle / Preventive Diet Counseling', probability: 15, riskLevel: 'ROUTINE', action: 'Preventive Health Assessment' }
      ];
    }

    return {
      priority,
      isRedFlag,
      riskPercentage,
      redFlags: Array.from(new Set(redFlags)),
      differentials,
      recommendation: isRedFlag
        ? 'IMMEDIATE TRIAGE: High-risk clinical red flag detected. Route to Nursing Station immediately.'
        : 'Routine OPD Evaluation: Proceed with standard doctor consultation.'
    };
  }

  evaluateChestPainTree(treeAnswers = {}, vitals = {}) {
    let acsScore = 0;
    let gerdScore = 0;
    let pleuriticScore = 0;
    let musculoskeletalScore = 0;
    const redFlags = [];

    const char = treeAnswers.chest_character;
    const rad = treeAnswers.chest_radiation;
    const trig = treeAnswers.chest_triggers;
    const assoc = treeAnswers.chest_associated || [];

    // Character
    if (char === 'crushing_pressure') {
      acsScore += 40;
      redFlags.push('Squeezing Crushing Chest Pressure (High Ischemia Indicator)');
    } else if (char === 'sharp_stabbing') {
      pleuriticScore += 35;
      musculoskeletalScore += 25;
    } else if (char === 'substernal_burning') {
      gerdScore += 45;
    } else if (char === 'chest_wall_soreness') {
      musculoskeletalScore += 55;
    }

    // Radiation
    if (rad === 'rad_arm_jaw_neck') {
      acsScore += 40;
      redFlags.push('Radiation to Left Arm / Jaw / Neck (Classic ACS Indicator)');
    } else if (rad === 'rad_back') {
      acsScore += 20;
      pleuriticScore += 15;
      redFlags.push('Radiation to Upper Back (Aortic / Ischemic Alert)');
    } else if (rad === 'rad_epigastric') {
      gerdScore += 25;
      acsScore += 15;
    }

    // Triggers
    if (trig === 'trig_exertion') {
      acsScore += 30;
      redFlags.push('Chest Pain Exertional Onset (Angina / Ischemia)');
    } else if (trig === 'trig_breathing_cough') {
      pleuriticScore += 45;
    } else if (trig === 'trig_fatty_food') {
      gerdScore += 35;
    } else if (trig === 'trig_body_movement') {
      musculoskeletalScore += 45;
    }

    // Associated Symptoms
    if (assoc.includes('assoc_sweating')) {
      acsScore += 25;
      redFlags.push('Profuse Cold Sweating (Diaphoresis)');
    }
    if (assoc.includes('assoc_dyspnea')) {
      acsScore += 20;
      pleuriticScore += 20;
      redFlags.push('Acute Respiratory Distress / Air Hunger');
    }
    if (assoc.includes('assoc_dizziness')) {
      acsScore += 15;
      redFlags.push('Cardiovascular Syncope / Hypoperfusion Tendency');
    }

    // Vitals modifier
    const spo2 = vitals.spo2_percent || 98;
    if (spo2 < 90) {
      acsScore += 30;
      redFlags.push(`Critical Hypoxia: SpO2 ${spo2}%`);
    }

    const totalRaw = Math.max(1, acsScore + gerdScore + pleuriticScore + musculoskeletalScore);
    const acsProb = Math.min(95, Math.round((acsScore / totalRaw) * 100));
    const gerdProb = Math.round((gerdScore / totalRaw) * 100);
    const pleuriticProb = Math.round((pleuriticScore / totalRaw) * 100);
    const musculoProb = Math.round((musculoskeletalScore / totalRaw) * 100);

    const isRedFlag = acsProb >= 50 || redFlags.length >= 2;
    const priority = isRedFlag ? 'RED_FLAG_CRITICAL' : acsProb >= 30 ? 'URGENT' : 'ROUTINE';

    const differentials = [
      {
        name: 'Acute Coronary Syndrome (ACS / Angina / MI)',
        probability: acsProb,
        riskLevel: acsProb >= 60 ? 'HIGH_CRITICAL' : acsProb >= 35 ? 'MODERATE' : 'LOW',
        action: acsProb >= 40 ? 'Urgent 12-Lead ECG & Troponin STAT' : 'Routine Cardiac Check'
      },
      {
        name: 'Gastroesophageal Reflux (GERD) / Acid Gastritis',
        probability: gerdProb,
        riskLevel: gerdProb >= 50 ? 'MODERATE' : 'LOW',
        action: 'Oral Antacids / Proton Pump Inhibitor'
      },
      {
        name: 'Pleuritic / Pulmonary Pathologies (Pneumonia/Pleurisy)',
        probability: pleuriticProb,
        riskLevel: pleuriticProb >= 40 ? 'MODERATE' : 'LOW',
        action: 'Chest X-Ray & Auscultation'
      },
      {
        name: 'Musculoskeletal Chest Wall Soreness / Costochondritis',
        probability: musculoProb,
        riskLevel: 'LOW',
        action: 'Local Warm Compress / NSAID Analgesic'
      }
    ].sort((a, b) => b.probability - a.probability);

    return {
      priority,
      isRedFlag,
      riskPercentage: acsProb,
      redFlags: Array.from(new Set(redFlags)),
      differentials,
      recommendation: isRedFlag 
        ? 'IMMEDIATE CARDIAC TRIAGE: Perform 12-Lead ECG, administer Oxygen if SpO2 < 94%, and notify OPD Physician STAT.' 
        : 'Routine OPD Evaluation: Complete physical exam and baseline diagnostic workup.'
    };
  }
}

export const decisionTreeEngine = new DecisionTreeEngine();

export const TREE_TRANSLATIONS = {
  // --- CHEST PAIN ---
  chest_character: {
    title: {
      en: 'Step 1: What is the exact sensation of the chest discomfort?',
      hi: 'αñÜαñ░αñú 1: αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñªαñ░αÑìαñª αñòαÑÇ αñ╕αñ╣αÑÇ αñàαñ¿αÑüαñ¡αÑéαññαñ┐ αñòαÑìαñ»αñ╛ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 1: α«¿α»åα«₧α»ìα«Üα»ü α«àα«Üα»îα«òα«░α«┐α«»α«ñα»ìα«ñα«┐α«⌐α»ì α«ñα»üα«▓α»ìα«▓α«┐α«»α««α«╛α«⌐ α«ëα«úα«░α»ìα«╡α»ü α«Äα«⌐α»ìα«⌐?',
      te: 'α░ªα░╢ 1: α░¢α░╛α░ñα▒Ç α░àα░╕α▒îα░òα░░α▒ìα░»α░é α░»α▒èα░òα▒ìα░ò α░ûα░Üα▒ìα░Üα░┐α░ñα░«α▒êα░¿ α░àα░¿α▒üα░¡α▒éα░ñα░┐ α░Åα░«α░┐α░ƒα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αñ¢αñ╛αññαÑÇαññ αñ╣αÑïαñúαñ╛αñ▒αÑìαñ»αñ╛ αññαÑìαñ░αñ╛αñ╕αñ╛αñÜαÑÇ αñ¿αÑçαñ«αñòαÑÇ αñàαñ¿αÑüαñ¡αÑéαññαÑÇ αñòαñ╛αñ» αñåαñ╣αÑç?',
      bn: 'αªºαª╛αª¬ αºº: αª¼αºüαªòαºçαª░ αªàαª╕αºìαª¼αª╕αºìαªñαª┐αª░ αª╕αªáαª┐αªò αªàαª¿αºüαª¡αºéαªñαª┐ αªòαºÇ?'
    },
    subtitle: {
      en: 'Select primary character of chest pain',
      hi: 'αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñªαñ░αÑìαñª αñòαÑç αñ¬αÑìαñ░αñ╛αñÑαñ«αñ┐αñò αñ¬αÑìαñ░αñòαñ╛αñ░ αñòαñ╛ αñÜαñ»αñ¿ αñòαñ░αÑçαñé',
      ta: 'α««α«╛α«░α»ìα«¬α»ü α«╡α«▓α«┐α«»α«┐α«⌐α»ì α««α»üα«ñα«⌐α»ìα««α»ê α«ñα«⌐α»ìα««α»êα«»α»êα«ñα»ì α«ñα»çα«░α»ìα«¿α»ìα«ñα»åα«ƒα»üα«òα»ìα«òα«╡α»üα««α»ì',
      te: 'α░¢α░╛α░ñα▒Ç α░¿α▒èα░¬α▒ìα░¬α░┐ α░»α▒èα░òα▒ìα░ò α░¬α▒ìα░░α░╛α░Ñα░«α░┐α░ò α░░α░òα░╛α░¿α▒ìα░¿α░┐ α░Äα░éα░Üα▒üα░òα▒ïα░éα░íα░┐',
      mr: 'αñ¢αñ╛αññαÑÇαññαÑÇαñ▓ αñ╡αÑçαñªαñ¿αÑçαñÜαñ╛ αñ¬αÑìαñ░αñ╛αñÑαñ«αñ┐αñò αñ¬αÑìαñ░αñòαñ╛αñ░ αñ¿αñ┐αñ╡αñíαñ╛',
      bn: 'αª¼αºüαªòαºçαª░ αª¼αºìαª»αªÑαª╛αª░ αª¬αºìαª░αª╛αªÑαª«αª┐αªò αªºαª░αª¿ αª¿αª┐αª░αºìαª¼αª╛αªÜαª¿ αªòαª░αºüαª¿'
    }
  },
  crushing_pressure: {
    en: 'Crushing Heavy Pressure / Tight Band / Heavy Weight',
    hi: 'αñªαñ¼αñ╛αñ╡ αñ¡αñ░αñ╛ αñ¡αñ╛αñ░αÑÇαñ¬αñ¿ / αñòαñ╕αññαñ╛ αñ╣αÑüαñå αñ¼αÑêαñéαñí / αñ¡αñ╛αñ░αÑÇ αñ╡αñ£αñ¿ αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑïαñ¿αñ╛',
    ta: 'α«àα«┤α»üα«ñα»ìα«ñα»üα««α»ì α«¬α«╛α«░α««α«╛α«⌐ α«ëα«úα«░α»ìα«╡α»ü / α«çα«▒α»üα«òα»ìα«òα««α«╛α«⌐ α«¬α«ƒα»ìα«ƒα»ê / α«¬α«╛α«░α««α»ì',
    te: 'α░¿α░▓α░┐α░¬α░┐α░╡α▒çα░╕α▒ç α░¼α░░α▒üα░╡α▒ü / α░¼α░┐α░ùα▒üα░ñα▒üα░ùα░╛ α░ëα░¿α▒ìα░¿ α░¼α▒ìα░»α░╛α░éα░íα▒ì / α░¼α░░α▒üα░╡α▒ü αñ«αñ╣αñ╕αÑéαñ╕ α░òα░╛α░╡α░íα░é',
    mr: 'αñªαñ╛αñ¼αñ╛αñ╡αñ»αÑüαñòαÑìαññ αñ£αñíαñ¬αñúαñ╛ / αñÿαñƒαÑìαñƒ αñ¬αñƒαÑìαñƒαñ╛ / αñ£αñí αñ╡αñ£αñ¿ αñ£αñ╛αñúαñ╡αñúαÑç',
    bn: 'αª¬αºçαª╖αªúαªòαª╛αª░αºÇ αª¡αª╛αª░αºÇ αªÜαª╛αª¬ / αªƒαª╛αªçαªƒ αª¼αºìαª»αª╛αª¿αºìαªí / αª¡αª╛αª░αºÇ αªôαª£αª¿ αªàαª¿αºüαª¡αª¼'
  },
  sharp_stabbing: {
    en: 'Sharp Stabbing / Knife-like Pain',
    hi: 'αññαÑçαñ£ αñÜαÑüαñ¡αñ¿ αñ╡αñ╛αñ▓αñ╛ / αñÜαñ╛αñòαÑé αñ£αÑêαñ╕αñ╛ αññαÑçαñ£ αñªαñ░αÑìαñª',
    ta: 'α«òα»éα«░α»ìα««α»êα«»α«╛α«⌐ α«òα»üα«ñα»ìα«ñα»üα««α»ì α«╡α«▓α«┐ / α«òα«ñα»ìα«ñα«┐ α«¬α»ïα«⌐α»ìα«▒ α«╡α«▓α«┐',
    te: 'α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░ùα▒üα░Üα▒ìα░Üα▒üα░òα▒üα░¿α▒ç α░¿α▒èα░¬α▒ìα░¬α░┐ / α░òα░ñα▒ìα░ñα░┐ α░▓α░╛α░éα░ƒα░┐ α░¿α▒èα░¬α▒ìα░¬α░┐',
    mr: 'αññαÑÇαñ╡αÑìαñ░ αñƒαÑïαñÜαñúαñ╛αñ░αÑÇ αñ╡αÑçαñªαñ¿αñ╛ / αñ╕αÑüαñ░αÑÇαñ╕αñ╛αñ░αñûαÑÇ αñòαñ│αñ╛',
    bn: 'αªñαºÇαª¼αºìαª░ αª╕αºéαªüαªÜ αª½αºïαªƒαª╛αª¿αºïαª░ αª«αªñαºï / αª¢αºüαª░αª┐αª░ αª«αªñαºï αªñαºÇαª¼αºìαª░ αª¼αºìαª»αªÑαª╛'
  },
  substernal_burning: {
    en: 'Substernal Burning / Acid Reflux / Heartburn',
    hi: 'αñ╕αÑÇαñ¿αÑç αñòαÑç αñ¼αÑÇαñÜ αñ«αÑçαñé αñ£αñ▓αñ¿ / αñÅαñ╕αñ┐αñí αñ░αñ┐αñ½αÑìαñ▓αñòαÑìαñ╕ / αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ',
    ta: 'α««α«╛α«░α»ìα«¬α«┐α«⌐α»ì α«¿α«ƒα»üα«╡α«┐α«▓α»ì α«Äα«░α«┐α«Üα»ìα«Üα«▓α»ì / α«àα««α«┐α«▓ α«░α«┐α«âα«¬α»ìα«│α«òα»ìα«╕α»ì',
    te: 'α░¢α░╛α░ñα▒Ç α░«α░ºα▒ìα░»α░▓α▒ï α░«α░éα░ƒ / α░»α░╛α░╕α░┐α░íα▒ì α░░α░┐α░½α▒ìα░▓α░òα▒ìα░╕α▒ì / α░ùα▒üα░éα░íα▒åα░▓α▒ìα░▓α▒ï α░«α░éα░ƒ',
    mr: 'αñ¢αñ╛αññαÑÇαñÜαÑìαñ»αñ╛ αñ«αñºαÑìαñ»αñ¡αñ╛αñùαÑÇ αñ£αñ│αñ£αñ│ / αÑ▓αñ╕αñ┐αñíαñ┐αñƒαÑÇ',
    bn: 'αª¼αºüαªòαºçαª░ αª«αª╛αª¥αºç αª£αºìαª¼αª╛αª▓αª╛αª¬αºïαº£αª╛ / αªÅαª╕αª┐αªíαª┐αªƒαª┐ / αªàαª«αºìαª¼αª▓'
  },
  chest_wall_soreness: {
    en: 'Localized Tenderness / Pain When Pressing Chest Wall',
    hi: 'αñ╕αÑÇαñ¿αÑç αñòαÑÇ αñªαÑÇαñ╡αñ╛αñ░ αñòαÑï αñªαñ¼αñ╛αñ¿αÑç αñ¬αñ░ αñªαñ░αÑìαñª / αñ«αñ╛αñéαñ╕αñ¬αÑçαñ╢αñ┐αñ»αÑïαñé αñòαñ╛ αñûαñ┐αñéαñÜαñ╛αñ╡',
    ta: 'α««α«╛α«░α»ìα«¬α»ê α«àα«┤α»üα«ñα»ìα«ñα»üα««α»ì α«¬α»ïα«ñα»ü α«╡α«▓α«┐ / α«ñα«Üα»ê α«¬α«┐α«ƒα«┐α«¬α»ìα«¬α»ü',
    te: 'α░¢α░╛α░ñα▒Çα░¬α▒ê α░¿α▒èα░òα▒ìα░òα░┐α░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░¿α▒èα░¬α▒ìα░¬α░┐ / α░òα░éα░íα░░α░╛α░▓ α░¿α▒èα░¬α▒ìα░¬α▒üα░▓α▒ü',
    mr: 'αñ¢αñ╛αññαÑÇαñ╡αñ░ αñªαñ╛αñ¼αñ▓αÑìαñ»αñ╛αñ╡αñ░ αñ╣αÑïαñúαñ╛αñ░αÑÇ αñ╡αÑçαñªαñ¿αñ╛ / αñ╕αÑìαñ¿αñ╛αñ»αÑéαñéαñÜαñ╛ αññαñ╛αñú',
    bn: 'αª¼αºüαªòαºç αªÜαª╛αª¬ αªªαª┐αª▓αºç αª¼αºìαª»αªÑαª╛ / αª¬αºçαª╢αºÇαª░ αªƒαª╛αª¿'
  },
  chest_radiation: {
    title: {
      en: 'Step 2: Does the chest pain spread (radiate) to other body areas?',
      hi: 'αñÜαñ░αñú 2: αñòαÑìαñ»αñ╛ αñ╕αÑÇαñ¿αÑç αñòαñ╛ αñªαñ░αÑìαñª αñ╢αñ░αÑÇαñ░ αñòαÑç αñàαñ¿αÑìαñ» αñ╣αñ┐αñ╕αÑìαñ╕αÑïαñé αñ«αÑçαñé αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 2: α««α«╛α«░α»ìα«¬α»ü α«╡α«▓α«┐ α«ëα«ƒα«▓α«┐α«⌐α»ì α«¬α«┐α«▒ α«¬α«òα»üα«ñα«┐α«òα«│α»üα«òα»ìα«òα»ü α«¬α«░α«╡α»üα«òα«┐α«▒α«ñα«╛?',
      te: 'α░ªα░╢ 2: α░¢α░╛α░ñα▒Ç α░¿α▒èα░¬α▒ìα░¬α░┐ α░╢α░░α▒Çα░░α░éα░▓α▒ïα░¿α░┐ α░çα░ñα░░ α░¡α░╛α░ùα░╛α░▓α░òα▒ü α░╡α▒ìα░»α░╛α░¬α░┐α░╕α▒ìα░ñα▒üα░éα░ªα░╛?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 2: αñ¢αñ╛αññαÑÇαññαÑÇαñ▓ αñ╡αÑçαñªαñ¿αñ╛ αñ╢αñ░αÑÇαñ░αñ╛αñÜαÑìαñ»αñ╛ αñçαññαñ░ αñ¡αñ╛αñùαñ╛αñéαññ αñ¬αñ╕αñ░αññαÑç αñòαñ╛?',
      bn: 'αªºαª╛αª¬ αº¿: αª¼αºüαªòαºçαª░ αª¼αºìαª»αªÑαª╛ αªòαª┐ αª╢αª░αºÇαª░αºçαª░ αªàαª¿αºìαª»αª╛αª¿αºìαª» αªàαªéαª╢αºç αª¢αªíαª╝αª┐αª»αª╝αºç αª¬αªíαª╝αºç?'
    },
    subtitle: {
      en: 'Check for radiation patterns characteristic of myocardial ischemia',
      hi: 'αñ╣αÑâαñªαñ» αñÿαñ╛αññ (αñ«αñ╛αñ»αÑïαñòαñ╛αñ░αÑìαñíαñ┐αñ»αñ▓ αñçαñ╕αÑìαñòαñ┐αñ«αñ┐αñ»αñ╛) αñòαÑç αñ▓αñòαÑìαñ╖αñúαÑïαñé αñòαÑÇ αñ£αñ╛αñéαñÜ αñòαñ░αÑçαñé',
      ta: 'α«çα«ñα«» α«¬α«╛α«ñα«┐α«¬α»ìα«¬α«┐α«⌐α»ì α«àα«▒α«┐α«òα»üα«▒α«┐α«òα«│α»ê α«Üα«░α«┐α«¬α«╛α«░α»ìα«òα»ìα«òα«╡α»üα««α»ì',
      te: 'α░ùα▒üα░éα░íα▒åα░¬α▒ïα░ƒα▒ü α░▓α░òα▒ìα░╖α░úα░╛α░▓α░¿α▒ü α░ñα░¿α░┐α░ûα▒Ç α░Üα▒çα░»α░éα░íα░┐',
      mr: 'αñ╣αÑâαñªαñ»αñ╡αñ┐αñòαñ╛αñ░αñ╛αñÜαÑìαñ»αñ╛ αñ▓αñòαÑìαñ╖αñúαñ╛αñéαñÜαÑÇ αññαñ¬αñ╛αñ╕αñúαÑÇ αñòαñ░αñ╛',
      bn: 'αª╣αºâαªªαª░αºïαªùαºçαª░ αª▓αªòαºìαª╖αªú αª¬αª░αºÇαªòαºìαª╖αª╛ αªòαª░αºüαª¿'
    }
  },
  rad_arm_jaw_neck: {
    en: 'Radiates to Left Arm, Shoulder, Jaw, or Neck',
    hi: 'αñ¼αñ╛αñ»αÑçαñé αñ╣αñ╛αñÑ, αñòαñéαñºαÑç, αñ£αñ¼αñíαñ╝αÑç αñ»αñ╛ αñùαñ░αÑìαñªαñ¿ αñòαÑÇ αññαñ░αñ½ αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê',
    ta: 'α«çα«ƒα«ñα»ü α«òα»ê, α«ñα»ïα«│α»ì, α«ñα«╛α«ƒα»ê α«àα«▓α»ìα«▓α«ñα»ü α«òα«┤α»üα«ñα»ìα«ñα»üα«òα»ìα«òα»ü α«¬α«░α«╡α»üα«òα«┐α«▒α«ñα»ü',
    te: 'α░Äα░íα░« α░Üα▒çα░»α░┐, α░¡α▒üα░£α░é, α░ªα░╡α░í α░▓α▒çα░ªα░╛ α░«α▒åα░íα░òα▒ü α░╡α▒ìα░»α░╛α░¬α░┐α░╕α▒ìα░ñα▒üα░éα░ªα░┐',
    mr: 'αñíαñ╛αñ╡αñ╛ αñ╣αñ╛αññ, αñûαñ╛αñéαñªαñ╛, αñ¿αñ╛αñíαÑÇ αñòαñ┐αñéαñ╡αñ╛ αñ«αñ╛αñ¿αÑçαñòαñíαÑç αñ¬αñ╕αñ░αññαÑç',
    bn: 'αª¼αª╛αª« αª╣αª╛αªñ, αªòαª╛αªüαªº, αªÜαºïαª»αª╝αª╛αª▓ αª¼αª╛ αªÿαª╛αªíαª╝αºç αª¢αªíαª╝αª┐αª»αª╝αºç αª¬αªíαª╝αºç'
  },
  rad_back: {
    en: 'Radiates straight through to the Upper Back / Interscapular area',
    hi: 'αñ¬αÑÇαñ¢αÑç αñ¬αÑÇαñá / αñòαñéαñºαÑïαñé αñòαÑç αñ¼αÑÇαñÜ αñ╕αÑÇαñºαÑç αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê',
    ta: 'α««α»üα«ñα»üα«òα«┐α«⌐α»ì α««α»çα«▓α»ì α«¬α«òα»üα«ñα«┐α«òα»ìα«òα»ü α«¿α»çα«░α«ƒα«┐ α«¬α«░α«╡α«▓α»ì',
    te: 'α░╡α▒åα░¿α▒üα░ò α░╡α▒Çα░¬α▒ü / α░¡α▒üα░£α░╛α░▓ α░«α░ºα▒ìα░»α░▓α▒ïα░òα░┐ α░¿α▒çα░░α▒üα░ùα░╛ α░╡α▒ìα░»α░╛α░¬α░┐α░╕α▒ìα░ñα▒üα░éα░ªα░┐',
    mr: 'αñ¬αñ╛αñáαÑÇαñÜαÑìαñ»αñ╛ αñ╡αñ░αñÜαÑìαñ»αñ╛ αñ¡αñ╛αñùαñ╛αññ αñ╕αñ░αñ│ αñ¬αñ╕αñ░αññαÑç',
    bn: 'αª¬αª┐αªáαºçαª░ αªôαª¬αª░αºçαª░ αªàαªéαª╢αºç αª¢αªíαª╝αª┐αª»αª╝αºç αª¬αªíαª╝αºç'
  },
  rad_epigastric: {
    en: 'Spreads down towards Upper Stomach / Epigastrium',
    hi: 'αñèαñ¬αñ░αÑÇ αñ¬αÑçαñƒ αñòαÑÇ αññαñ░αñ½ αñ¿αÑÇαñÜαÑç αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê',
    ta: 'α««α»çα«▓α»ì α«╡α«»α«┐α«▒α»ìα«▒α»ê α«¿α»ïα«òα»ìα«òα«┐ α«òα»Çα«┤α»ç α«¬α«░α«╡α»üα«òα«┐α«▒α«ñα»ü',
    te: 'α░¬α▒ê α░òα░íα▒üα░¬α▒ü α░╡α▒êα░¬α▒ü α░òα░┐α░éα░ªα░┐α░òα░┐ α░╡α▒ìα░»α░╛α░¬α░┐α░╕α▒ìα░ñα▒üα░éα░ªα░┐',
    mr: 'αñ╡αñ░αñÜαÑìαñ»αñ╛ αñ¬αÑïαñƒαñ╛αñòαñíαÑç αñûαñ╛αñ▓αÑÇ αñ¬αñ╕αñ░αññαÑç',
    bn: 'αªëαª¬αª░αºçαª░ αª¬αºçαªƒαºçαª░ αªªαª┐αªòαºç αª¢αªíαª╝αª┐αª»αª╝αºç αª¬αªíαª╝αºç'
  },
  rad_none: {
    en: 'Does NOT spread (Stays localized in one small spot)',
    hi: 'αñòαñ╣αÑÇ αñ¿αñ╣αÑÇαñé αñ½αÑêαñ▓αññαñ╛ (αñÅαñò αñ╣αÑÇ αñ╕αÑìαñÑαñ╛αñ¿ αñ¬αñ░ αñ╕αÑÇαñ«αñ┐αññ αñ░αñ╣αññαñ╛ αñ╣αÑê)',
    ta: 'α«¬α«░α«╡α«╡α«┐α«▓α»ìα«▓α»ê (α«Æα«░α»ç α«çα«ƒα«ñα»ìα«ñα«┐α«▓α»ì α««α«ƒα»ìα«ƒα»üα««α»ç α«ëα«│α»ìα«│α«ñα»ü)',
    te: 'α░╡α▒ìα░»α░╛α░¬α░┐α░éα░Üα░ªα▒ü (α░Æα░òα▒ç α░Üα▒ïα░ƒ α░╕α▒ìα░Ñα░╛α░¿α░┐α░òα░éα░ùα░╛ α░ëα░éα░ƒα▒üα░éα░ªα░┐)',
    mr: 'αñ¬αñ╕αñ░αññ αñ¿αñ╛αñ╣αÑÇ (αñÅαñòαñ╛αñÜ αñáαñ┐αñòαñ╛αñúαÑÇ αñ«αñ░αÑìαñ»αñ╛αñªαñ┐αññ αñ░αñ╛αñ╣αññαÑç)',
    bn: 'αª¢αªíαª╝αª┐αª»αª╝αºç αª¬αªíαª╝αºç αª¿αª╛ (αªÅαªòαªç αª╕αºìαªÑαª╛αª¿αºç αª╕αºÇαª«αª╛αª¼αªªαºìαªº αªÑαª╛αªòαºç)'
  },
  chest_triggers: {
    title: {
      en: 'Step 3: What worsens or triggers the chest pain?',
      hi: 'αñÜαñ░αñú 3: αñòαñ┐αñ╕ αñùαññαñ┐αñ╡αñ┐αñºαñ┐ αñ╕αÑç αñªαñ░αÑìαñª αñ¼αñóαñ╝αññαñ╛ αñ»αñ╛ αñƒαÑìαñ░αñ┐αñùαñ░ αñ╣αÑïαññαñ╛ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 3: α««α«╛α«░α»ìα«¬α»ü α«╡α«▓α«┐α«»α»ê α«ñα»Çα«╡α«┐α«░α««α«╛α«òα»ìα«òα»üα«╡α«ñα»ü α«Äα«ñα»ü?',
      te: 'α░ªα░╢ 3: α░¿α▒èα░¬α▒ìα░¬α░┐α░¿α░┐ α░¬α▒åα░éα░Üα▒ç α░òα░╛α░░α░úα░╛α░▓α▒ü α░Åα░«α░┐α░ƒα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 3: αñòαñ╢αñ╛αñ¿αÑç αñ╡αÑçαñªαñ¿αñ╛ αñ╡αñ╛αñóαññαÑç αñòαñ┐αñéαñ╡αñ╛ αñ╕αÑüαñ░αÑé αñ╣αÑïαññαÑç?',
      bn: 'αªºαª╛αª¬ αº⌐: αªòαºÇαª╕αºçαª░ αªòαª╛αª░αªúαºç αª¼αºìαª»αªÑαª╛ αª¼αª╛αº£αºç αª¼αª╛ αª╢αºüαª░αºü αª╣αºƒ?'
    },
    subtitle: {
      en: 'Aggravating and relieving factor evaluation',
      hi: 'αñªαñ░αÑìαñª αñòαÑï αñ¼αñóαñ╝αñ╛αñ¿αÑç αñöαñ░ αñÿαñƒαñ╛αñ¿αÑç αñ╡αñ╛αñ▓αÑç αñòαñ╛αñ░αñòαÑïαñé αñòαñ╛ αñ«αÑéαñ▓αÑìαñ»αñ╛αñéαñòαñ¿',
      ta: 'α«╡α«▓α«┐α«»α»ê α«àα«ñα«┐α«òα«░α«┐α«òα»ìα«òα»üα««α»ì α«òα«╛α«░α«úα«┐α«òα«│α«┐α«⌐α»ì α««α«ñα«┐α«¬α»ìα«¬α»Çα«ƒα»ü',
      te: 'α░¿α▒èα░¬α▒ìα░¬α░┐α░¿α░┐ α░¬α▒åα░éα░Üα▒ç α░àα░éα░╢α░╛α░▓ α░«α▒éα░▓α▒ìα░»α░╛α░éα░òα░¿α░é',
      mr: 'αñ╡αÑçαñªαñ¿αñ╛ αñ╡αñ╛αñóαñ╡αñúαñ╛αñ▒αÑìαñ»αñ╛ αñÿαñƒαñòαñ╛αñéαñÜαÑç αñ«αÑéαñ▓αÑìαñ»αñ«αñ╛αñ¬αñ¿',
      bn: 'αª¼αºìαª»αªÑαª╛ αª¼αª╛αº£αª╛αª¿αºïαª░ αªòαª╛αª░αªúαª╕αª«αºéαª╣αºçαª░ αª«αºéαª▓αºìαª»αª╛αºƒαª¿'
    }
  },
  trig_exertion: {
    en: 'Worse with Physical Exertion, Walking, or Climbing Stairs',
    hi: 'αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñ¬αñ░αñ┐αñ╢αÑìαñ░αñ«, αñÜαñ▓αñ¿αÑç αñ»αñ╛ αñ╕αÑÇαñóαñ╝αñ┐αñ»αñ╛αñé αñÜαñóαñ╝αñ¿αÑç αñ╕αÑç αñªαñ░αÑìαñª αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê',
    ta: 'α«ëα«ƒα«▒α»ìα«¬α«»α«┐α«▒α»ìα«Üα«┐, α«¿α«ƒα«¬α»ìα«¬α«ñα»ü α«àα«▓α»ìα«▓α«ñα»ü α«¬α«ƒα«┐α«òα»ìα«òα«ƒα»ìα«ƒα»üα«òα«│α«┐α«▓α»ì α«Åα«▒α»üα««α»ì α«¬α»ïα«ñα»ü α««α»ïα«Üα««α«╛α«òα«┐α«▒α«ñα»ü',
    te: 'α░╢α░╛α░░α▒Çα░░α░ò α░╢α▒ìα░░α░«, α░¿α░íα░ò α░▓α▒çα░ªα░╛ α░«α▒åα░ƒα▒ìα░▓α▒ü α░Äα░òα▒ìα░òα▒çα░ƒα░¬α▒ìα░¬α▒üα░íα▒ü α░Äα░òα▒ìα░òα▒üα░╡α░╡α▒üα░ñα▒üα░éα░ªα░┐',
    mr: 'αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñ╢αÑìαñ░αñ«, αñÜαñ╛αñ▓αñúαÑç αñòαñ┐αñéαñ╡αñ╛ αñ¬αñ╛αñ»αñ▒αÑìαñ»αñ╛ αñÜαñóαñ▓αÑìαñ»αñ╛αñ¿αÑç αñ╡αÑçαñªαñ¿αñ╛ αñ╡αñ╛αñóαññαÑç',
    bn: 'αª╢αª╛αª░αºÇαª░αª┐αªò αª¬αª░αª┐αª╢αºìαª░αª«, αª╣αª╛αªüαªƒαª╛ αª¼αª╛ αª╕αª┐αªüαº£αª┐ αªÜαº£αª▓αºç αª¼αºìαª»αªÑαª╛ αª¼αª╛αº£αºç'
  },
  trig_breathing_cough: {
    en: 'Worse with Deep Inspiration, Breathing, or Coughing',
    hi: 'αñùαñ╣αñ░αÑÇ αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç, αñ¢αÑÇαñéαñòαñ¿αÑç αñ»αñ╛ αñûαñ╛αñéαñ╕αñ¿αÑç αñ╕αÑç αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê',
    ta: 'α«åα«┤α»ìα«¿α»ìα«ñ α««α»éα«Üα»ìα«Üα»ü α«àα«▓α»ìα«▓α«ñα»ü α«çα«░α»üα««α«▓α«┐α«⌐α»ì α«¬α»ïα«ñα»ü α««α»ïα«Üα««α«╛α«òα«┐α«▒α«ñα»ü',
    te: 'α░ùα░╛α░óα░éα░ùα░╛ α░èα░¬α░┐α░░α░┐ α░¬α▒Çα░▓α▒ìα░Üα░íα░é α░▓α▒çα░ªα░╛ α░ªα░ùα▒ìα░ùα░┐α░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░Äα░òα▒ìα░òα▒üα░╡α░╡α▒üα░ñα▒üα░éα░ªα░┐',
    mr: 'αñªαÑÇαñ░αÑìαñÿ αñ╢αÑìαñ╡αñ╛αñ╕ αñÿαÑçαñúαÑç αñòαñ┐αñéαñ╡αñ╛ αñûαÑïαñòαñ▓αÑìαñ»αñ╛αñ¿αÑç αñ╡αÑçαñªαñ¿αñ╛ αñ╡αñ╛αñóαññαÑç',
    bn: 'αªùαª¡αºÇαª░ αª╢αºìαª¼αª╛αª╕ αª¿αºçαªôαºƒαª╛ αª¼αª╛ αªòαª╛αª╢αª╛αª░ αª╕αª╛αªÑαºç αª¼αºìαª»αªÑαª╛ αª¼αª╛αº£αºç'
  },
  trig_fatty_food: {
    en: 'Worse after Fatty Meals or Lying Down Flat',
    hi: 'αññαñ▓αñ╛-αñ¡αÑüαñ¿αñ╛ αñûαñ╛αñ¿αÑç αñ»αñ╛ αñ╕αÑÇαñºαÑç αñ▓αÑçαñƒαñ¿αÑç αñ╕αÑç αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê',
    ta: 'α«òα»èα«┤α»üα«¬α»ìα«¬α»ü α«ëα«úα«╡α»üα«òα«│α»ì α«àα«▓α»ìα«▓α«ñα»ü α«¿α»çα«░α«╛α«ò α«¬α«ƒα»üα«òα»ìα«òα»üα««α»ì α«¬α»ïα«ñα»ü α««α»ïα«Üα««α«╛α«òα«┐α«▒α«ñα»ü',
    te: 'α░òα▒èα░╡α▒ìα░╡α▒ü α░¬α░ªα░╛α░░α▒ìα░Ñα░╛α░▓α▒ü α░ñα░┐α░¿α▒ìα░¿ α░ñα░░α▒ìα░╡α░╛α░ñ α░▓α▒çα░ªα░╛ α░¬α░íα▒üα░òα▒üα░¿α▒ìα░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░Äα░òα▒ìα░òα▒üα░╡α░╡α▒üα░ñα▒üα░éα░ªα░┐',
    mr: 'αññαÑçαñ▓αñòαñƒ αñàαñ¿αÑìαñ¿ αñòαñ┐αñéαñ╡αñ╛ αñ╕αñ░αñ│ αñ¥αÑïαñ¬αñ▓αÑìαñ»αñ╛αñ¿αÑç αñ╡αÑçαñªαñ¿αñ╛ αñ╡αñ╛αñóαññαÑç',
    bn: 'αªÜαª░αºìαª¼αª┐αª»αºüαªòαºìαªñ αªûαª╛αª¼αª╛αª░ αªûαª╛αªôαºƒαª╛ αª¼αª╛ αª╢αºïαªôαºƒαª╛αª░ αª¬αª░ αª¼αºìαª»αªÑαª╛ αª¼αª╛αº£αºç'
  },
  trig_body_movement: {
    en: 'Worse with Arm Movement or Twisting Torso',
    hi: 'αñ╣αñ╛αñÑ αñ╣αñ┐αñ▓αñ╛αñ¿αÑç αñ»αñ╛ αñºαñíαñ╝ αñòαÑï αñ«αÑïαñíαñ╝αñ¿αÑç αñ╕αÑç αñªαñ░αÑìαñª αñ¼αñóαñ╝αññαñ╛ αñ╣αÑê',
    ta: 'α«òα»ê α«àα«Üα»êα«╡α»ü α«àα«▓α»ìα«▓α«ñα»ü α«ëα«ƒα«▓α»ê α«ñα«┐α«░α»üα«¬α»ìα«¬α»üα««α»ì α«¬α»ïα«ñα»ü α««α»ïα«Üα««α«╛α«òα«┐α«▒α«ñα»ü',
    te: 'α░Üα▒çα░ñα▒üα░▓α▒ü α░òα░ªα░▓α▒ìα░Üα░íα░é α░▓α▒çα░ªα░╛ α░╢α░░α▒Çα░░α░╛α░¿α▒ìα░¿α░┐ α░ñα░┐α░¬α▒ìα░¬α░┐α░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░Äα░òα▒ìα░òα▒üα░╡α░╡α▒üα░ñα▒üα░éα░ªα░┐',
    mr: 'αñ╣αñ╛αññ αñ╣αñ▓αñ╡αñúαÑç αñòαñ┐αñéαñ╡αñ╛ αñ╢αñ░αÑÇαñ░ αñ╡αñ│αñ╡αñ▓αÑìαñ»αñ╛αñ¿αÑç αñ╡αÑçαñªαñ¿αñ╛ αñ╡αñ╛αñóαññαÑç',
    bn: 'αª╣αª╛αªñ αª¿αª╛αº£αª╛αªÜαª╛αº£αª╛ αªòαª░αª╛ αª¼αª╛ αª╢αª░αºÇαª░ αªÿαºïαª░αª╛αª▓αºç αª¼αºìαª»αªÑαª╛ αª¼αª╛αº£αºç'
  },
  chest_associated: {
    title: {
      en: 'Step 4: Are you experiencing any accompanying emergency symptoms?',
      hi: 'αñÜαñ░αñú 4: αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ¿αñ«αÑçαñé αñ╕αÑç αñòαÑïαñê αñùαñéαñ¡αÑÇαñ░ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ▓αñòαÑìαñ╖αñú αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑï αñ░αñ╣αÑç αñ╣αÑêαñé?',
      ta: 'α«¬α«ƒα«┐ 4: α«àα«╡α«Üα«░ α«àα«▒α«┐α«òα»üα«▒α«┐α«òα«│α»ì α«Åα«ñα»çα«⌐α»üα««α»ì α«ëα«│α»ìα«│α«ñα«╛?',
      te: 'α░ªα░╢ 4: α░çα░ñα░░ α░àα░ñα▒ìα░»α░╡α░╕α░░ α░▓α░òα▒ìα░╖α░úα░╛α░▓α▒ü α░Åα░«α▒êα░¿α░╛ α░ëα░¿α▒ìα░¿α░╛α░»α░╛?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 4: αñòαñ╛αñ╣αÑÇ αñùαñéαñ¡αÑÇαñ░ αñåαñúαÑÇαñ¼αñ╛αñúαÑÇαñÜαÑÇ αñ▓αñòαÑìαñ╖αñúαÑç αñ£αñ╛αñúαñ╡αññ αñåαñ╣αÑçαññ αñòαñ╛?',
      bn: 'αªºαª╛αª¬ αº¬: αªàαª¿αºìαª»αª╛αª¿αºìαª» αª£αª░αºüαª░αª┐ αªòαºïαª¿αºï αª▓αªòαºìαª╖αªú αªªαºçαªûαª╛ αªªαª┐αªÜαºìαª¢αºç αªòαª┐?'
    },
    subtitle: {
      en: 'Multi-system autonomic indicator check',
      hi: 'αñ¼αñ╣αÑü-αñ¬αÑìαñ░αñúαñ╛αñ▓αÑÇ αñ╕αÑìαñ╡αñ╛αñ»αññαÑìαññ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ╕αñéαñòαÑçαññαÑïαñé αñòαÑÇ αñ£αñ╛αñéαñÜ αñòαñ░αÑçαñé',
      ta: 'α«àα«╡α«Üα«░ α«àα«▒α«┐α«òα»üα«▒α«┐α«òα«│α«┐α«⌐α»ì α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░àα░ñα▒ìα░»α░╡α░╕α░░ α░╕α░éα░òα▒çα░ñα░╛α░▓ α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αñåαñúαÑÇαñ¼αñ╛αñúαÑÇαñÜαÑìαñ»αñ╛ αñ▓αñòαÑìαñ╖αñúαñ╛αñéαñÜαÑÇ αññαñ¬αñ╛αñ╕αñúαÑÇ',
      bn: 'αª£αª░αºüαª░αª┐ αª▓αªòαºìαª╖αªúαºçαª░ αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  assoc_sweating: {
    en: 'Profuse Cold Sweating (Diaphoresis)',
    hi: 'αñàαññαÑìαñ»αñºαñ┐αñò αñáαñéαñíαñ╛ αñ¬αñ╕αÑÇαñ¿αñ╛ αñåαñ¿αñ╛ (αñíαñ╛αñçαñ½αÑïαñ░αÑçαñ╕αñ┐αñ╕)',
    ta: 'α«àα«ñα«┐α«ò α«òα»üα«│α«┐α«░α»ìα«¿α»ìα«ñ α«╡α»çα«░α»ìα«╡α»ê',
    te: 'α░àα░ºα░┐α░òα░éα░ùα░╛ α░Üα░▓α▒ìα░▓α░¿α░┐ α░Üα▒åα░«α░ƒα░▓α▒ü α░¬α░ƒα▒ìα░ƒα░íα░é',
    mr: 'αñàαññαñ┐ αñ¬αÑìαñ░αñ«αñ╛αñúαñ╛αññ αñùαñ╛αñ░ αñÿαñ╛αñ« αñ»αÑçαñúαÑç',
    bn: 'αª¬αºìαª░αªÜαºüαª░ αªáαª╛αªúαºìαªíαª╛ αªÿαª╛αª« αª╣αªôαºƒαª╛'
  },
  assoc_dyspnea: {
    en: 'Severe Shortness of Breath / Air Hunger',
    hi: 'αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç αñ«αÑçαñé αñ¡αñ╛αñ░αÑÇ αññαñòαñ▓αÑÇαñ½ / αñ╣αñ╡αñ╛ αñòαÑÇ αñòαñ«αÑÇ αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑïαñ¿αñ╛',
    ta: 'α«òα«ƒα»üα««α»êα«»α«╛α«⌐ α««α»éα«Üα»ìα«Üα»üα«ñα»ìα«ñα«┐α«úα«▒α«▓α»ì',
    te: 'α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░èα░¬α░┐α░░α░╛α░íα░òα░¬α▒ïα░╡α░íα░é',
    mr: 'αñ╢αÑìαñ╡αñ╛αñ╕ αñÿαÑçαñúαÑìαñ»αñ╛αñ╕ αñ¬αÑìαñ░αñÜαñéαñí αññαÑìαñ░αñ╛αñ╕ αñ╣αÑïαñúαÑç',
    bn: 'αªñαºÇαª¼αºìαª░ αª╢αºìαª¼αª╛αª╕αªòαª╖αºìαªƒ αª╣αªôαºƒαª╛'
  },
  assoc_nausea_vomiting: {
    en: 'Nausea or Vomiting',
    hi: 'αñëαñ▓αÑìαñƒαÑÇ αñ»αñ╛ αñ«αñ┐αñÜαñ▓αÑÇ (αñ£αÑÇ αñ«αñ┐αñÜαñ▓αñ╛αñ¿αñ╛)',
    ta: 'α«òα»üα««α«ƒα»ìα«ƒα«▓α»ì α«àα«▓α»ìα«▓α«ñα»ü α«╡α«╛α«¿α»ìα«ñα«┐',
    te: 'α░╡α░┐α░òα░╛α░░α░é α░▓α▒çα░ªα░╛ α░╡α░╛α░éα░ñα▒üα░▓α▒ü',
    mr: 'αñ«αñ│αñ«αñ│ αñòαñ┐αñéαñ╡αñ╛ αñëαñ▓αñƒαÑÇ αñ╣αÑïαñúαÑç',
    bn: 'αª¼αª«αª┐ αª¡αª╛αª¼ αª¼αª╛ αª¼αª«αª┐ αª╣αªôαºƒαª╛'
  },
  assoc_dizziness: {
    en: 'Dizziness / Lightheadedness / Fainting tendency',
    hi: 'αñÜαñòαÑìαñòαñ░ αñåαñ¿αñ╛ / αñ¼αÑçαñ╣αÑïαñ╢αÑÇ αñòαÑÇ αñ╕αÑìαñÑαñ┐αññαñ┐ αñ¼αñ¿αñ¿αñ╛',
    ta: 'α«ñα«▓α»êα«Üα»ìα«Üα»üα«▒α»ìα«▒α«▓α»ì / α««α«»α«òα»ìα«òα««α»ì α«╡α«░α»üα«╡α«ñα»ü α«¬α»ïα«⌐α»ìα«▒ α«ëα«úα«░α»ìα«╡α»ü',
    te: 'α░«α▒êα░òα░«α▒ü / α░╕α▒ìα░¬α▒âα░╣ α░ñα░¬α▒ìα░¬α▒ç α░¬α░░α░┐α░╕α▒ìα░Ñα░┐α░ñα░┐',
    mr: 'αñÜαñòαÑìαñòαñ░ αñ»αÑçαñúαÑç / αñÜαñòαÑìαñòαñ░ αñ»αÑçαñèαñ¿ αñ¬αñíαñúαÑìαñ»αñ╛αñÜαÑÇ αñ╢αñòαÑìαñ»αññαñ╛',
    bn: 'αª«αª╛αªÑαª╛ αªÿαºïαª░αª╛ / αªàαª£αºìαª₧αª╛αª¿ αª╣αºƒαºç αª»αª╛αªôαºƒαª╛αª░ αª¡αª╛αª¼'
  },

  // --- FEVER ---
  fever_pattern: {
    title: {
      en: 'Step 1: What is the temperature pattern and onset?',
      hi: 'αñÜαñ░αñú 1: αñ¼αÑüαñûαñ╛αñ░ αñòαñ╛ αñ¬αÑêαñƒαñ░αÑìαñ¿ αñöαñ░ αñ╢αÑüαñ░αÑüαñåαññ αñòαÑêαñ╕αÑÇ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 1: α«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α«┐α«⌐α»ì α««α»üα«▒α»ê α««α«▒α»ìα«▒α»üα««α»ì α«åα«░α««α»ìα«¬α««α»ì α«Äα«╡α»ìα«╡α«╛α«▒α»ü α«ëα«│α»ìα«│α«ñα»ü?',
      te: 'α░ªα░╢ 1: α░£α▒ìα░╡α░░α░é α░»α▒èα░òα▒ìα░ò α░ñα▒Çα░░α▒ü α░«α░░α░┐α░»α▒ü α░¬α▒ìα░░α░╛α░░α░éα░¡α░é α░Äα░▓α░╛ α░ëα░éα░ªα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αññαñ╛αñ¬αñ╛αñÜαÑç αñ╕αÑìαñ╡αñ░αÑéαñ¬ αñåαñúαñ┐ αñ╕αÑüαñ░αÑüαñ╡αñ╛αññ αñòαñ╢αÑÇ αñåαñ╣αÑç?',
      bn: 'αªºαª╛αª¬ αºº: αª£αºìαª¼αª░αºçαª░ αªºαª░αª¿ αªÅαª¼αªé αª╢αºüαª░αºü αªòαºçαª«αª¿?'
    },
    subtitle: {
      en: 'Fever spike frequency and chills evaluation',
      hi: 'αñ¼αÑüαñûαñ╛αñ░ αñòαñ╛ αñ╕αÑìαññαñ░ αñöαñ░ αñòαñéαñ¬αñòαñéαñ¬αÑÇ αñòαÑÇ αñ£αñ╛αñéαñÜ αñòαñ░αÑçαñé',
      ta: 'α«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α«┐α«⌐α»ì α«àα«│α«╡α»ü α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░£α▒ìα░╡α░░α░é α░ñα▒Çα░╡α▒ìα░░α░ñ α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αññαñ╛αñ¬αñ╛αñÜαÑÇ αññαÑÇαñ╡αÑìαñ░αññαñ╛ αññαñ¬αñ╛αñ╕αñ╛',
      bn: 'αª£αºìαª¼αª░αºçαª░ αª«αª╛αªñαºìαª░αª╛ αª¬αª░αºÇαªòαºìαª╖αª╛ αªòαª░αºüαª¿'
    }
  },
  spiking_chills: {
    en: 'High Spiking Fever (>102┬░F) with Shaking Chills & Rigors',
    hi: 'αñòαñéαñ¬αñòαñéαñ¬αÑÇ αñöαñ░ αñáαñéαñí αñòαÑç αñ╕αñ╛αñÑ αññαÑçαñ£ αñ¼αÑüαñûαñ╛αñ░ (>102┬░F)',
    ta: 'α«¿α«ƒα»üα«òα»ìα«òα«ñα»ìα«ñα»üα«ƒα«⌐α»ì α«òα»éα«ƒα«┐α«» α«àα«ñα«┐α«ò α«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α»ì (>102┬░F)',
    te: 'α░╡α░úα▒üα░òα▒ü α░«α░░α░┐α░»α▒ü α░Üα░▓α░┐α░ñα▒ï α░òα▒éα░íα░┐α░¿ α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░£α▒ìα░╡α░░α░é (>102┬░F)',
    mr: 'αñÑαñéαñíαÑÇ αñ╡αñ£αÑéαñ¿ αññαÑÇαñ╡αÑìαñ░ αññαñ╛αñ¬ αñ»αÑçαñúαÑç (>102┬░F)',
    bn: 'αªòαª╛αªüαª¬αºüαª¿αª┐ αªô αªáαª╛αªúαºìαªíαª╛αª╕αª╣ αªûαºüαª¼ αª¼αºçαª╢αª┐ αª£αºìαª¼αª░ (>102┬░F)'
  },
  continuous_moderate: {
    en: 'Continuous Moderate Fever (99┬░F - 101┬░F)',
    hi: 'αñ▓αñùαñ╛αññαñ╛αñ░ αñ╣αñ▓αÑìαñòαñ╛ αñ»αñ╛ αñ«αñºαÑìαñ»αñ« αñ¼αÑüαñûαñ╛αñ░ (99┬░F - 101┬░F)',
    ta: 'α«ñα»èα«ƒα«░α»ìα«Üα»ìα«Üα«┐α«»α«╛α«⌐ α««α«┐α«ñα««α«╛α«⌐ α«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α»ì (99┬░F - 101┬░F)',
    te: 'α░¿α░┐α░░α░éα░ñα░░ α░«α░┐α░ñα░«α▒êα░¿ α░£α▒ìα░╡α░░α░é (99┬░F - 101┬░F)',
    mr: 'αñ╕αññαññ αñàαñ╕αñúαñ╛αñ░αñ╛ αñ«αñºαÑìαñ»αñ« αññαñ╛αñ¬ (99┬░F - 101┬░F)',
    bn: 'αªàαª¿αª¼αª░αªñ αª«αª╛αª¥αª╛αª░αª┐ αª£αºìαª¼αª░ (99┬░F - 101┬░F)'
  },
  low_grade_night_sweats: {
    en: 'Low-Grade Evening Spikes with Profuse Night Sweats',
    hi: 'αñ╢αñ╛αñ« αñòαÑï αñ¼αÑüαñûαñ╛αñ░ αñÜαñóαñ╝αñ¿αñ╛ αñöαñ░ αñ░αñ╛αññ αñ«αÑçαñé αñàαññαÑìαñ»αñºαñ┐αñò αñ¬αñ╕αÑÇαñ¿αñ╛ αñåαñ¿αñ╛',
    ta: 'α««α«╛α«▓α»ê α«¿α»çα«░α«òα»ì α«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α»ì α««α«▒α»ìα«▒α»üα««α»ì α«çα«░α«╡α»ü α«╡α»çα«░α»ìα«╡α»ê',
    te: 'α░╕α░╛α░»α░éα░ñα▒ìα░░α░é α░£α▒ìα░╡α░░α░é α░░α░╛α░╡α░íα░é α░«α░░α░┐α░»α▒ü α░░α░╛α░ñα▒ìα░░α░┐ α░Üα▒åα░«α░ƒα░▓α▒ü α░¬α░ƒα▒ìα░ƒα░íα░é',
    mr: 'αñ╕αñéαñºαÑìαñ»αñ╛αñòαñ╛αñ│αÑÇ αññαñ╛αñ¬ αñÜαñóαñúαÑç αñåαñúαñ┐ αñ░αñ╛αññαÑìαñ░αÑÇ αñûαÑéαñ¬ αñÿαñ╛αñ« αñ»αÑçαñúαÑç',
    bn: 'αª╕αª╛αªüαª¥αºçαª░ αª¼αºçαª▓αª╛ αª£αºìαª¼αª░ αªôαªáαª╛ αªô αª░αª╛αªñαºç αª¬αºìαª░αªÜαºüαª░ αªÿαª╛αª« αª╣αªôαºƒαª╛'
  },
  fever_focal_symptoms: {
    title: {
      en: 'Step 2: Which organ systems show focal infection symptoms?',
      hi: 'αñÜαñ░αñú 2: αñ╢αñ░αÑÇαñ░ αñòαÑç αñòαñ┐αñ╕ αñàαñéαñù αñ«αÑçαñé αñ╕αñéαñòαÑìαñ░αñ«αñú αñòαÑç αñ▓αñòαÑìαñ╖αñú αñªαñ┐αñû αñ░αñ╣αÑç αñ╣αÑêαñé?',
      ta: 'α«¬α«ƒα«┐ 2: α«Äα«¿α»ìα«ñ α«ëα«▒α»üα«¬α»ìα«¬α«┐α«▓α»ì α«ñα»èα«▒α»ìα«▒α»ü α«àα«▒α«┐α«òα»üα«▒α«┐α«òα«│α»ì α«ëα«│α»ìα«│α«⌐?',
      te: 'α░ªα░╢ 2: α░Å α░àα░╡α░»α░╡α░éα░▓α▒ï α░çα░¿α▒ìα░½α▒åα░òα▒ìα░╖α░¿α▒ì α░▓α░òα▒ìα░╖α░úα░╛α░▓α▒ü α░ëα░¿α▒ìα░¿α░╛α░»α░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 2: αñ╢αñ░αÑÇαñ░αñ╛αñÜαÑìαñ»αñ╛ αñòαÑïαñúαññαÑìαñ»αñ╛ αñ¡αñ╛αñùαñ╛αññ αñ╕αñéαñ╕αñ░αÑìαñùαñ╛αñÜαÑÇ αñ▓αñòαÑìαñ╖αñúαÑç αñåαñ╣αÑçαññ?',
      bn: 'αªºαª╛αª¬ αº¿: αª╢αª░αºÇαª░αºçαª░ αªòαºïαª¿ αªàαªéαª╢αºç αª╕αªéαªòαºìαª░αª«αªúαºçαª░ αª▓αªòαºìαª╖αªú αª¼αª┐αªªαºìαª»αª«αª╛αª¿?'
    },
    subtitle: {
      en: 'Anatomical symptom localization',
      hi: 'αñ╕αñéαñòαÑìαñ░αñ«αñú αñòαÑç αñ╕αÑìαñÑαñ╛αñ¿ αñòαÑÇ αñ¬αñ╣αñÜαñ╛αñ¿ αñòαñ░αÑçαñé',
      ta: 'α«ñα»èα«▒α»ìα«▒α»ü α«çα«ƒα«ñα»ìα«ñα»ê α«àα«ƒα»êα«»α«╛α«│α««α»ì α«òα«╛α«úα«╡α»üα««α»ì',
      te: 'α░çα░¿α▒ìα░½α▒åα░òα▒ìα░╖α░¿α▒ì α░¬α▒ìα░░α░╛α░éα░ñα░╛α░¿α▒ìα░¿α░┐ α░ùα▒üα░░α▒ìα░ñα░┐α░éα░Üα░éα░íα░┐',
      mr: 'αñ╕αñéαñ╕αñ░αÑìαñùαñ╛αñÜαÑÇ αñ£αñ╛αñùαñ╛ αñôαñ│αñûαñ╛',
      bn: 'αª╕αªéαªòαºìαª░αª«αªúαºçαª░ αª╕αºìαªÑαª╛αª¿ αªÜαª┐αª╣αºìαª¿αª┐αªñ αªòαª░αºüαª¿'
    }
  },
  focal_throat: {
    en: 'Severe Sore Throat / Painful Swallowing',
    hi: 'αñùαñ▓αÑç αñ«αÑçαñé αññαÑçαñ£ αñªαñ░αÑìαñª / αñ¿αñ┐αñùαñ▓αñ¿αÑç αñ«αÑçαñé αññαñòαñ▓αÑÇαñ½',
    ta: 'α«òα«ƒα»üα««α»êα«»α«╛α«⌐ α«ñα»èα«úα»ìα«ƒα»ê α«╡α«▓α«┐ / α«╡α«┐α«┤α»üα«Öα»ìα«òα»üα«╡α«ñα«┐α«▓α»ì α«Üα«┐α«░α««α««α»ì',
    te: 'α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░ùα▒èα░éα░ñα▒ü α░¿α▒èα░¬α▒ìα░¬α░┐ / α░«α░┐α░éα░ùα░íα░éα░▓α▒ï α░çα░¼α▒ìα░¼α░éα░ªα░┐',
    mr: 'αñÿαñ╢αñ╛αññ αññαÑÇαñ╡αÑìαñ░ αñ╡αÑçαñªαñ¿αñ╛ / αñùαñ┐αñ│αññαñ╛αñ¿αñ╛ αññαÑìαñ░αñ╛αñ╕',
    bn: 'αªñαºÇαª¼αºìαª░ αªùαª▓αª╛ αª¼αºìαª»αªÑαª╛ / αªùαª┐αª▓αªñαºç αªàαª╕αºüαª¼αª┐αªºαª╛'
  },
  focal_cough_phlegm: {
    en: 'Persistent Cough with Yellow/Green Phlegm',
    hi: 'αñ▓αñùαñ╛αññαñ╛αñ░ αñûαñ╛αñéαñ╕αÑÇ αñòαÑç αñ╕αñ╛αñÑ αñ¬αÑÇαñ▓αñ╛/αñ╣αñ░αñ╛ αñ¼αñ▓αñùαñ«',
    ta: 'α««α«₧α»ìα«Üα«│α»ì/α«¬α«Üα»ìα«Üα»ê α«Üα«│α«┐α«»α»üα«ƒα«⌐α»ì α«ñα»èα«ƒα«░α»ìα«Üα»ìα«Üα«┐α«»α«╛α«⌐ α«çα«░α»üα««α«▓α»ì',
    te: 'α░¬α░╕α▒üα░¬α▒ü/α░¬α░Üα▒ìα░Üα░¿α░┐ α░òα░½α░éα░ñα▒ï α░òα▒éα░íα░┐α░¿ α░¿α░┐α░░α░éα░ñα░░ α░ªα░ùα▒ìα░ùα▒ü',
    mr: 'αñ¬αñ┐αñ╡αñ│αÑìαñ»αñ╛/αñ╣αñ┐αñ░αñ╡αÑìαñ»αñ╛ αñòαñ½αñ╛αñ╕αñ╣ αñ╕αññαññ αñûαÑïαñòαñ▓αñ╛',
    bn: 'αª╣αª▓αºüαªª/αª╕αª¼αºüαª£ αªòαª½αª╕αª╣ αªàαª¿αª¼αª░αªñ αªòαª╛αª╢αª┐'
  },
  focal_urinary: {
    en: 'Burning Sensation while Urinating / High Frequency',
    hi: 'αñ¬αÑçαñ╢αñ╛αñ¼ αñ«αÑçαñé αñ£αñ▓αñ¿ / αñ¼αñ╛αñ░-αñ¼αñ╛αñ░ αñ¬αÑçαñ╢αñ╛αñ¼ αñ£αñ╛αñ¿αñ╛',
    ta: 'α«Üα«┐α«▒α»üα«¿α»Çα«░α»ì α«òα«┤α«┐α«òα»ìα«òα»üα««α»ì α«¬α»ïα«ñα»ü α«Äα«░α«┐α«Üα»ìα«Üα«▓α»ì',
    te: 'α░«α▒éα░ñα▒ìα░░α░╡α░┐α░╕α░░α▒ìα░£α░¿α░▓α▒ï α░«α░éα░ƒ / α░ñα░░α░Üα▒üα░ùα░╛ α░╡α▒åα░│α▒ìα░▓α░╛α░▓α▒ìα░╕α░┐ α░░α░╛α░╡α░íα░é',
    mr: 'αñ▓αñÿαñ╡αÑÇ αñòαñ░αññαñ╛αñ¿αñ╛ αñ£αñ│αñ£αñ│ / αñ╡αñ╛αñ░αñéαñ╡αñ╛αñ░ αñ▓αñÿαñ╡αÑÇ αñ╣αÑïαñúαÑç',
    bn: 'αª¬αª╕αºìαª░αª╛αª¼αºç αª£αºìαª¼αª╛αª▓αª╛αª¬αºïαº£αª╛ / αªÿαª¿ αªÿαª¿ αª¬αª╕αºìαª░αª╛αª¼ αª╣αªôαºƒαª╛'
  },
  focal_joint_eye: {
    en: 'Severe Joint/Muscle Pain & Pain Behind Eyes',
    hi: 'αñ£αÑïαñíαñ╝αÑïαñé αñ╡ αñ«αñ╛αñéαñ╕αñ¬αÑçαñ╢αñ┐αñ»αÑïαñé αñ«αÑçαñé αññαÑçαñ£ αñªαñ░αÑìαñª αñöαñ░ αñåαñéαñûαÑïαñé αñòαÑç αñ¬αÑÇαñ¢αÑç αñªαñ░αÑìαñª',
    ta: 'α«òα«ƒα»üα««α»êα«»α«╛α«⌐ α««α»éα«ƒα»ìα«ƒα»ü/α«ñα«Üα»ê α«╡α«▓α«┐ α««α«▒α»ìα«▒α»üα««α»ì α«òα«úα»ì α«╡α«▓α«┐',
    te: 'α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░òα▒Çα░│α▒ìα░│α▒ü/α░òα░éα░íα░░α░╛α░▓ α░¿α▒èα░¬α▒ìα░¬α░┐ α░«α░░α░┐α░»α▒ü α░òα░│α▒ìα░│ α░╡α▒åα░¿α▒üα░ò α░¿α▒èα░¬α▒ìα░¬α░┐',
    mr: 'αñ╕αñ╛αñéαñºαÑçαñªαÑüαñûαÑÇ, αñ╕αÑìαñ¿αñ╛αñ»αÑéαñªαÑüαñûαÑÇ αñåαñúαñ┐ αñíαÑïαñ│αÑìαñ»αñ╛αñéαñÜαÑìαñ»αñ╛ αñ«αñ╛αñùαÑç αñ╡αÑçαñªαñ¿αñ╛',
    bn: 'αªñαºÇαª¼αºìαª░ αª£αºïαº£αª╛/αª¬αºçαª╢αºÇ αª¼αºìαª»αªÑαª╛ αªÅαª¼αªé αªÜαºïαªûαºçαª░ αª¬αºçαª¢αª¿αºç αª¼αºìαª»αªÑαª╛'
  },

  // --- ABDOMINAL ---
  abdo_location: {
    title: {
      en: 'Step 1: Where in the abdomen is the pain located?',
      hi: 'αñÜαñ░αñú 1: αñ¬αÑçαñƒ αñ«αÑçαñé αñªαñ░αÑìαñª αñòαñ┐αñ╕ αñ╣αñ┐αñ╕αÑìαñ╕αÑç αñ«αÑçαñé αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑï αñ░αñ╣αñ╛ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 1: α«╡α«»α«┐α«▒α»ìα«▒α«┐α«▓α»ì α«╡α«▓α«┐ α«Äα«Öα»ìα«òα»ü α«ëα«│α»ìα«│α«ñα»ü?',
      te: 'α░ªα░╢ 1: α░òα░íα▒üα░¬α▒üα░▓α▒ï α░¿α▒èα░¬α▒ìα░¬α░┐ α░Å α░¡α░╛α░ùα░éα░▓α▒ï α░ëα░éα░ªα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αñ¬αÑïαñƒαñ╛αññ αñ╡αÑçαñªαñ¿αñ╛ αñ¿αÑçαñ«αñòαÑÇ αñòαÑïαñáαÑç αñ╣αÑïαññ αñåαñ╣αÑç?',
      bn: 'αªºαª╛αª¬ αºº: αª¬αºçαªƒαºçαª░ αªòαºïαª¿ αªàαªéαª╢αºç αª¼αºìαª»αªÑαª╛ αª╣αªÜαºìαª¢αºç?'
    },
    subtitle: {
      en: 'Abdominal quadrant localization',
      hi: 'αñ¬αÑçαñƒ αñªαñ░αÑìαñª αñòαÑç αñòαÑìαñ╖αÑçαññαÑìαñ░ αñòαñ╛ αñÜαñ»αñ¿ αñòαñ░αÑçαñé',
      ta: 'α«╡α«»α«┐α«▒α»ü α«╡α«▓α«┐ α«¬α«òα»üα«ñα«┐α«»α»êα«ñα»ì α«ñα»çα«░α»ìα«¿α»ìα«ñα»åα«ƒα»üα«òα»ìα«òα«╡α»üα««α»ì',
      te: 'α░òα░íα▒üα░¬α▒ü α░¿α▒èα░¬α▒ìα░¬α░┐ α░¬α▒ìα░░α░╛α░éα░ñα░╛α░¿α▒ìα░¿α░┐ α░Äα░éα░Üα▒üα░òα▒ïα░éα░íα░┐',
      mr: 'αñ¬αÑïαñƒαñªαÑüαñûαÑÇαñÜαñ╛ αñ¡αñ╛αñù αñ¿αñ┐αñ╡αñíαñ╛',
      bn: 'αª¬αºçαªƒ αª¼αºìαª»αªÑαª╛αª░ αª╕αºìαªÑαª╛αª¿ αª¿αª┐αª░αºìαª¼αª╛αªÜαª¿ αªòαª░αºüαª¿'
    }
  },
  epigastric: {
    en: 'Upper Stomach / Epigastrium (Acid Reflux / Stomach)',
    hi: 'αñèαñ¬αñ░αÑÇ αñ¬αÑçαñƒ / αñ¿αñ╛αñ¡αñ┐ αñòαÑç αñèαñ¬αñ░ (αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ / αñ£αñ▓αñ¿)',
    ta: 'α««α»çα«▓α»ì α«╡α«»α«┐α«▒α»ü (α«àα«Üα«┐α«ƒα«┐α«ƒα»ìα«ƒα«┐ / α«Äα«░α«┐α«Üα»ìα«Üα«▓α»ì)',
    te: 'α░¬α▒ê α░òα░íα▒üα░¬α▒ü / α░¿α░╛α░¡α░┐ α░¬α▒êα░¿ (α░»α░╛α░╕α░┐α░íα░┐α░ƒα▒Ç / α░«α░éα░ƒ)',
    mr: 'αñ╡αñ░αñÜαÑç αñ¬αÑïαñƒ / αñ¢αñ╛αññαÑÇαñûαñ╛αñ▓αÑÇαñ▓ αñ¡αñ╛αñù (αÑ▓αñ╕αñ┐αñíαñ┐αñƒαÑÇ)',
    bn: 'αªëαª¬αª░αºçαª░ αª¬αºçαªƒ / αª¿αª╛αª¡αª┐αª░ αªëαª¬αª░αºç (αªÅαª╕αª┐αªíαª┐αªƒαª┐ / αª£αºìαª¼αª╛αª▓αª╛)'
  },
  ruq: {
    en: 'Right Upper Quadrant (Under Right Rib Cage)',
    hi: 'αñªαñ╛αñ╣αñ┐αñ¿αÑÇ αñ¬αñ╕αñ▓αÑÇ αñòαÑç αñ¿αÑÇαñÜαÑç (αñ¬αñ┐αññαÑìαññαñ╛αñ╢αñ» / αñ»αñòαÑâαññ αñòαÑìαñ╖αÑçαññαÑìαñ░)',
    ta: 'α«╡α«▓α«ñα»ü α«╡α«┐α«▓α«╛ α«Äα«▓α»üα««α»ìα«¬α»üα«òα»ìα«òα»ü α«òα»Çα«┤α»ç',
    te: 'α░òα▒üα░íα░┐ α░¬α░òα▒ìα░òα░ƒα▒åα░«α▒üα░ò α░òα░┐α░éα░ª (α░¬α░┐α░ñα▒ìα░ñα░╛α░╢α░»α░é/α░òα░╛α░▓α▒çα░»α░é)',
    mr: 'αñëαñ£αñ╡αÑìαñ»αñ╛ αñ¼αñ░αñùαñíαÑÇαñûαñ╛αñ▓αÑÇ (αñ¬αñ┐αññαÑìαññαñ╛αñ╢αñ»/αñ»αñòαÑâαññ αñ¡αñ╛αñù)',
    bn: 'αªíαª╛αª¿ αª¬αª╛αªüαª£αª░αºçαª░ αª¿αª┐αªÜαºç (αª¬αª┐αªñαºìαªñαªÑαª▓αª┐/αªòαª▓αª┐αª£αª╛αª░ αªàαªéαª╢)'
  },
  rlq: {
    en: 'Right Lower Quadrant (Near Right Hip Bone)',
    hi: 'αñªαñ╛αñ╣αñ┐αñ¿αÑÇ αññαñ░αñ½ αñ¿αÑÇαñÜαÑç αñ¬αÑçαñƒ αñ«αÑçαñé (αñàαñ¬αÑçαñéαñíαñ┐αñòαÑìαñ╕ αñòαÑìαñ╖αÑçαññαÑìαñ░)',
    ta: 'α«╡α«▓α«ñα»ü α«òα»Çα«┤α»ì α«╡α«»α«┐α«▒α»ü (α«àα«¬α»ìα«¬α»åα«⌐α»ìα«ƒα«┐α«òα»ìα«╕α»ì α«¬α«òα»üα«ñα«┐)',
    te: 'α░òα▒üα░íα░┐ α░òα░┐α░éα░ªα░┐ α░òα░íα▒üα░¬α▒ü (α░àα░¬α▒åα░éα░íα░┐α░òα▒ìα░╕α▒ì α░¬α▒ìα░░α░╛α░éα░ñα░é)',
    mr: 'αñëαñ£αñ╡αÑìαñ»αñ╛ αñ¼αñ╛αñ£αÑéαñ▓αñ╛ αñûαñ╛αñ▓αÑÇ αñ¬αÑïαñƒαñ╛αññ (αñàαñ¬αÑçαñéαñíαñ┐αñòαÑìαñ╕ αñ¡αñ╛αñù)',
    bn: 'αªíαª╛αª¿ αªªαª┐αªòαºçαª░ αªñαª▓αª¬αºçαªƒαºç (αªàαºìαª»αª╛αª¬αºçαª¿αºìαªíαª┐αªòαºìαª╕ αªàαªéαª╢)'
  },
  generalized_cramps: {
    en: 'Diffuse Cramps & Bloating all over Stomach',
    hi: 'αñ¬αÑéαñ░αÑç αñ¬αÑçαñƒ αñ«αÑçαñé αñ«αñ░αÑïαñíαñ╝, αñÉαñéαñáαñ¿ αñöαñ░ αñùαÑêαñ╕ αñ¡αñ░ αñ£αñ╛αñ¿αñ╛',
    ta: 'α«╡α«»α«┐α«▒α»ü α««α»üα«┤α»üα«╡α«ñα»üα««α»ì α«¬α«┐α«ƒα«┐α«¬α»ìα«¬α»ü α««α«▒α»ìα«▒α»üα««α»ì α«ëα«¬α»ìα«¬α«Üα««α»ì',
    te: 'α░òα░íα▒üα░¬α▒ü α░àα░éα░ñα░ƒα░╛ α░ñα░┐α░«α▒ìα░«α░┐α░░α▒ìα░▓α▒ü α░«α░░α░┐α░»α▒ü α░ùα▒ìα░»α░╛α░╕α▒ì α░░α░╛α░╡α░íα░é',
    mr: 'αñ╕αñéαñ¬αÑéαñ░αÑìαñú αñ¬αÑïαñƒαñ╛αññ αñ¬αñ┐αñ│αñ╡αñƒαñúαÑç αñåαñúαñ┐ αñùαÑàαñ╕ αñ╣αÑïαñúαÑç',
    bn: 'αª╕αª╛αª░αª╛ αª¬αºçαªƒαºç αªòαª╛αª«αº£αª╛αª¿αºï αª¼αºìαª»αªÑαª╛ αªô αªùαºìαª»αª╛αª╕ αª£αª«αª╛'
  },
  abdo_red_flags: {
    title: {
      en: 'Step 2: Are you experiencing any severe GI red flags?',
      hi: 'αñÜαñ░αñú 2: αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ¿αñ«αÑçαñé αñ╕αÑç αñòαÑïαñê αñùαñéαñ¡αÑÇαñ░ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ▓αñòαÑìαñ╖αñú αñ╣αÑêαñé?',
      ta: 'α«¬α«ƒα«┐ 2: α«òα«ƒα»üα««α»êα«»α«╛α«⌐ α«àα«╡α«Üα«░ α«àα«▒α«┐α«òα»üα«▒α«┐α«òα«│α»ì α«Åα«ñα»çα«⌐α»üα««α»ì α«ëα«│α»ìα«│α«ñα«╛?',
      te: 'α░ªα░╢ 2: α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░àα░ñα▒ìα░»α░╡α░╕α░░ α░▓α░òα▒ìα░╖α░úα░╛α░▓α▒ü α░Åα░«α▒êα░¿α░╛ α░ëα░¿α▒ìα░¿α░╛α░»α░╛?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 2: αñòαñ╛αñ╣αÑÇ αñùαñéαñ¡αÑÇαñ░ αñåαñúαÑÇαñ¼αñ╛αñúαÑÇαñÜαÑÇ αñ▓αñòαÑìαñ╖αñúαÑç αñåαñ╣αÑçαññ αñòαñ╛?',
      bn: 'αªºαª╛αª¬ αº¿: αªòαºïαª¿αºï αªùαºüαª░αºüαªñαª░ αª£αª░αºüαª░αª┐ αª▓αªòαºìαª╖αªú αªªαºçαªûαª╛ αªªαª┐αªÜαºìαª¢αºç αªòαª┐?'
    },
    subtitle: {
      en: 'Internal bleeding and peritonitis screening',
      hi: 'αñåαñéαññαñ░αñ┐αñò αñ░αñòαÑìαññαñ╕αÑìαñ░αñ╛αñ╡ αñöαñ░ αñùαñéαñ¡αÑÇαñ░ αñ¬αÑçαñƒ αñ╕αñéαñòαÑìαñ░αñ«αñú αñòαÑÇ αñ£αñ╛αñéαñÜ',
      ta: 'α«ëα«│α»ì α«░α«ñα»ìα«ñα«¬α»ìα«¬α»ïα«òα»ìα«òα»ü α«¬α«░α«┐α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░åα░éα░ñα░░α░┐α░ò α░░α░òα▒ìα░ñα░╕α▒ìα░░α░╛α░╡α░é α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αñàαñéαññαñ░αÑìαñùαññ αñ░αñòαÑìαññαñ╕αÑìαññαÑìαñ░αñ╛αñ╡ αññαñ¬αñ╛αñ╕αñúαÑÇ',
      bn: 'αªàαª¡αºìαª»αª¿αºìαªñαª░αºÇαªú αª░αªòαºìαªñαª¬αª╛αªñ αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  abdo_vomit_blood: {
    en: 'Vomiting Blood or Dark Coffee-Ground Fluid',
    hi: 'αñëαñ▓αÑìαñƒαÑÇ αñ«αÑçαñé αñûαÑéαñ¿ αñ»αñ╛ αñùαñ╛αñóαñ╝αñ╛ αñ¡αÑéαñ░αñ╛ αññαñ░αñ▓ αñåαñ¿αñ╛',
    ta: 'α«╡α«╛α«¿α»ìα«ñα«┐α«»α«┐α«▓α»ì α«░α«ñα»ìα«ñα««α»ì α«àα«▓α»ìα«▓α«ñα»ü α«òα«╛α«¬α«┐ α«¿α«┐α«▒ α«ñα«┐α«░α«╡α««α»ì',
    te: 'α░╡α░╛α░éα░ñα░┐α░▓α▒ï α░░α░òα▒ìα░ñα░é α░▓α▒çα░ªα░╛ α░¿α░▓α▒ìα░▓α░¿α░┐ α░ªα▒ìα░░α░╡α░é α░░α░╛α░╡α░íα░é',
    mr: 'αñëαñ▓αÑìαñƒαÑÇαñ«αñºαÑìαñ»αÑç αñ░αñòαÑìαññ αñòαñ┐αñéαñ╡αñ╛ αñòαñ╛αñ│αñ╛ αñªαÑìαñ░αñ╡ αñ»αÑçαñúαÑç',
    bn: 'αª¼αª«αª┐αªñαºç αª░αªòαºìαªñ αª¼αª╛ αªùαª╛αº¥ αªòαª½αª┐ αª░αªÖαºçαª░ αªñαª░αª▓ αª¼αºçαª░ αª╣αªôαºƒαª╛'
  },
  abdo_black_stool: {
    en: 'Passing Black Tarry Stool (Melena)',
    hi: 'αñòαñ╛αñ▓αñ╛ αññαñ╛αñ░αñòαÑïαñ▓ αñ£αÑêαñ╕αñ╛ αñ«αñ▓ (αñ¬αñûαñ╛αñ¿αñ╛) αñåαñ¿αñ╛',
    ta: 'α«òα«░α»üα«¬α»ìα«¬α»ü α«¿α«┐α«▒ α««α«▓α««α»ì α«òα«┤α«┐α«ñα»ìα«ñα«▓α»ì',
    te: 'α░¿α░▓α▒ìα░▓α░¿α░┐ α░«α░▓α░é α░░α░╛α░╡α░íα░é (α░«α▒åα░▓α▒çα░¿α░╛)',
    mr: 'αñòαñ╛αñ│αÑìαñ»αñ╛ αñ░αñéαñùαñ╛αñÜαÑç αñ╢αÑîαñÜ αñ╣αÑïαñúαÑç',
    bn: 'αªòαª╛αª▓αºï αª░αªÖαºçαª░ αª¬αª╛αºƒαªûαª╛αª¿αª╛ αª╣αªôαºƒαª╛'
  },
  abdo_rigid_stomach: {
    en: 'Stomach is Board-Like Hard & Painful to Touch',
    hi: 'αñ¬αÑçαñƒ αñ▓αñòαñíαñ╝αÑÇ αñ£αÑêαñ╕αñ╛ αñòαñíαñ╝αñ╛ αñ╣αÑïαñ¿αñ╛ αñöαñ░ αñ¢αÑéαñ¿αÑç αñ¬αñ░ αññαÑçαñ£ αñªαñ░αÑìαñª αñ╣αÑïαñ¿αñ╛',
    ta: 'α«╡α«»α«┐α«▒α»ü α«¬α«▓α«òα»ê α«¬α»ïα«▓α»ì α«òα«ƒα«┐α«⌐α««α«╛α«ò α«çα«░α»üα«ñα»ìα«ñα«▓α»ì',
    te: 'α░òα░íα▒üα░¬α▒ü α░òα░▓α░¬α░▓α░╛ α░ùα░ƒα▒ìα░ƒα░┐α░ùα░╛ α░àα░╡α▒ìα░╡α░íα░é α░«α░░α░┐α░»α▒ü α░ñα░╛α░òα░┐α░ñα▒ç α░¿α▒èα░¬α▒ìα░¬α░┐',
    mr: 'αñ¬αÑïαñƒ αñ▓αñ╛αñòαñíαñ╛αñ╕αñ╛αñ░αñûαÑç αñòαñíαñò αñ╣αÑïαñúαÑç αñåαñúαñ┐ αñ╢αñ┐αñ╡αñ▓αÑìαñ»αñ╛αñ╕ αñàαññαñ┐ αñ╡αÑçαñªαñ¿αñ╛',
    bn: 'αª¬αºçαªƒ αªòαª╛αªáαºçαª░ αª«αªñαºï αª╢αªòαºìαªñ αª╣αªôαºƒαª╛ αªÅαª¼αªé αª¢αºïαªüαºƒαª╛ αª«αª╛αªñαºìαª░αªç αª¼αºìαª»αªÑαª╛'
  },

  // --- RESPIRATORY ---
  resp_dyspnea_severity: {
    title: {
      en: 'Step 1: How severe is the breathing difficulty?',
      hi: 'αñÜαñ░αñú 1: αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç αñ«αÑçαñé αññαñòαñ▓αÑÇαñ½ αñòαñ┐αññαñ¿αÑÇ αñùαñéαñ¡αÑÇαñ░ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 1: α««α»éα«Üα»ìα«Üα»üα«ñα»ìα«ñα«┐α«úα«▒α«▓α»ì α«Äα«╡α»ìα«╡α«│α«╡α»ü α«òα«ƒα»üα««α»êα«»α«╛α«ò α«ëα«│α»ìα«│α«ñα»ü?',
      te: 'α░ªα░╢ 1: α░èα░¬α░┐α░░α░╛α░íα░òα░¬α▒ïα░╡α░íα░é α░Äα░éα░ñ α░ñα▒Çα░╡α▒ìα░░α░éα░ùα░╛ α░ëα░éα░ªα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αñ╢αÑìαñ╡αñ╛αñ╕ αñÿαÑçαñúαÑìαñ»αñ╛αñ╕ αñ╣αÑïαñúαñ╛αñ░αñ╛ αññαÑìαñ░αñ╛αñ╕ αñòαñ┐αññαÑÇ αñùαñéαñ¡αÑÇαñ░ αñåαñ╣αÑç?',
      bn: 'αªºαª╛αª¬ αºº: αª╢αºìαª¼αª╛αª╕αªòαª╖αºìαªƒ αªòαªñαªƒαª╛ αªñαºÇαª¼αºìαª░?'
    },
    subtitle: {
      en: 'Air hunger and talk test evaluation',
      hi: 'αñ╕αñ╛αñéαñ╕ αñòαÑÇ αñòαñ«αÑÇ αñÅαñ╡αñé αñ¼αÑïαñ▓αñ¿αÑç αñòαÑÇ αñòαÑìαñ╖αñ«αññαñ╛ αñòαÑÇ αñ£αñ╛αñéαñÜ',
      ta: 'α««α»éα«Üα»ìα«Üα»ü α«àα«│α«╡α»ü α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░╢α▒ìα░╡α░╛α░╕ α░╕α░╛α░«α░░α▒ìα░Ñα▒ìα░» α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αñ╢αÑìαñ╡αñ╛αñ╕αñ╛αñÜαÑÇ αñòαÑìαñ╖αñ«αññαñ╛ αññαñ¬αñ╛αñ╕αñ╛',
      bn: 'αª╢αºìαª¼αª╛αª╕ αª¿αºçαªôαºƒαª╛αª░ αªòαºìαª╖αª«αªñαª╛ αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  resp_rest_breathless: {
    en: 'Breathless at Rest / Cannot Complete Short Sentences',
    hi: 'αñ¼αÑêαñáαÑç-αñ¼αÑêαñáαÑç αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛ / αñ¬αÑéαñ░αÑç αñ╡αñ╛αñòαÑìαñ» αñ¿ αñ¼αÑïαñ▓ αñ¬αñ╛αñ¿αñ╛',
    ta: 'α«ôα«»α»ìα«╡α«┐α«▓α»ì α«çα«░α»üα«òα»ìα«òα»üα««α»ì α«¬α»ïα«ñα»üα««α»ì α««α»éα«Üα»ìα«Üα»üα«ñα»ìα«ñα«┐α«úα«▒α«▓α»ì',
    te: 'α░òα▒éα░░α▒ìα░Üα▒üα░¿α▒ìα░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░òα▒éα░íα░╛ α░èα░¬α░┐α░░α░╛α░íα░òα░¬α▒ïα░╡α░íα░é / α░Üα░┐α░¿α▒ìα░¿ α░╡α░╛α░òα▒ìα░»α░╛α░▓α▒ü α░«α░╛α░ƒα▒ìα░▓α░╛α░íα░▓α▒çα░òα░¬α▒ïα░╡α░íα░é',
    mr: 'αñ¼αñ╕αñ▓αÑìαñ»αñ╛ αñ£αñ╛αñùαÑÇ αñ╢αÑìαñ╡αñ╛αñ╕ αñ½αÑüαñ▓αñúαÑç / αñ¬αÑéαñ░αÑìαñú αñ╡αñ╛αñòαÑìαñ» αñ¼αÑïαñ▓αññαñ╛ αñ¿ αñ»αÑçαñúαÑç',
    bn: 'αª¼αª╕αºç αªÑαª╛αªòαª▓αºçαªô αª╢αºìαª¼αª╛αª╕αªòαª╖αºìαªƒ αª╣αªôαª»αª╝αª╛ / αª¬αºüαª░αºï αª¼αª╛αªòαºìαª» αª¼αª▓αªñαºç αª¿αª╛ αª¬αª╛αª░αª╛'
  },
  resp_exertion_only: {
    en: 'Breathless Only when Walking or Climbing Stairs',
    hi: 'αñòαÑçαñ╡αñ▓ αñÜαñ▓αñ¿αÑç αñ»αñ╛ αñ╕αÑÇαñóαñ╝αñ┐αñ»αñ╛αñé αñÜαñóαñ╝αñ¿αÑç αñ¬αñ░ αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛',
    ta: 'α«¿α«ƒα«òα»ìα«òα»üα««α»ì α«¬α»ïα«ñα»ü α«àα«▓α»ìα«▓α«ñα»ü α«¬α«ƒα«┐α«òα»ìα«òα«ƒα»ìα«ƒα»üα«òα«│α«┐α«▓α»ì α«Åα«▒α»üα««α»ì α«¬α»ïα«ñα»ü α««α«ƒα»ìα«ƒα»üα««α»ì α««α»éα«Üα»ìα«Üα»üα«ñα»ìα«ñα«┐α«úα«▒α«▓α»ì',
    te: 'α░¿α░íα░┐α░Üα░┐α░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░▓α▒çα░ªα░╛ α░«α▒åα░ƒα▒ìα░▓α▒ü α░Äα░òα▒ìα░òα░┐α░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░«α░╛α░ñα▒ìα░░α░«α▒ç α░èα░¬α░┐α░░α░╛α░íα░òα░¬α▒ïα░╡α░íα░é',
    mr: 'αñ½αñòαÑìαññ αñÜαñ╛αñ▓αññαñ╛αñ¿αñ╛ αñòαñ┐αñéαñ╡αñ╛ αñ¬αñ╛αñ»αñ▒αÑìαñ»αñ╛ αñÜαñóαññαñ╛αñ¿αñ╛ αñ╢αÑìαñ╡αñ╛αñ╕ αñ½αÑüαñ▓αñúαÑç',
    bn: 'αª╢αºüαªºαºü αª╣αª╛αªüαªƒαª╛αª░ αª╕αª«αºƒ αª¼αª╛ αª╕αª┐αªüαº£αª┐ αªªαª┐αºƒαºç αªôαªáαª╛αª░ αª╕αª«αºƒ αª╢αºìαª¼αª╛αª╕αªòαª╖αºìαªƒ'
  },
  resp_positional: {
    en: 'Cannot Lie Flat in Bed without Waking Up Gasping',
    hi: 'αñ¼αñ┐αñ¿αñ╛ αññαñòαñ┐αñ»αÑç αñ╕αÑÇαñºαÑç αñ▓αÑçαñƒαñ¿αÑç αñ¬αñ░ αñ╕αñ╛αñéαñ╕ αñ░αÑüαñòαñ¿αñ╛ αñöαñ░ αñ£αñ╛αñùαñ¿αñ╛',
    ta: 'α«¬α«ƒα»üα«òα»ìα«òα»êα«»α«┐α«▓α»ì α«¿α»çα«░α«╛α«ò α«¬α«ƒα»üα«òα»ìα«ò α««α»üα«ƒα«┐α«»α«╛α««α»ê',
    te: 'α░¿α▒çα░░α▒üα░ùα░╛ α░¬α░íα▒üα░òα▒üα░¿α▒ìα░¿α░¬α▒ìα░¬α▒üα░íα▒ü α░èα░¬α░┐α░░α░┐ α░àα░éα░ªα░ò α░«α▒çα░▓α▒ìα░òα▒ïα░╡α░íα░é',
    mr: 'αñ╕αñ░αñ│ αñ¥αÑïαñ¬αñ▓αÑìαñ»αñ╛αñ╕ αñ╢αÑìαñ╡αñ╛αñ╕ αñòαÑïαñéαñíαñúαÑç αñåαñúαñ┐ αñ£αñ╛αñù αñ»αÑçαñúαÑç',
    bn: 'αª╕αºïαª£αª╛ αª╣αºƒαºç αª╢αºüαªñαºç αª¿αª╛ αª¬αª╛αª░αª╛ αªÅαª¼αªé αª╢αºìαª¼αª╛αª╕αºçαª░ αª£αª¿αºìαª» αª£αºçαªùαºç αªôαªáαª╛'
  },
  resp_cough_sputum: {
    title: {
      en: 'Step 2: What is the cough and sputum character?',
      hi: 'αñÜαñ░αñú 2: αñûαñ╛αñéαñ╕αÑÇ αñöαñ░ αñ¼αñ▓αñùαñ« αñòαñ╛ αñ¬αÑìαñ░αñòαñ╛αñ░ αñòαÑêαñ╕αñ╛ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 2: α«çα«░α»üα««α«▓α»ì α««α«▒α»ìα«▒α»üα««α»ì α«Üα«│α«┐α«»α«┐α«⌐α»ì α«ñα«⌐α»ìα««α»ê α«Äα«⌐α»ìα«⌐?',
      te: 'α░ªα░╢ 2: α░ªα░ùα▒ìα░ùα▒ü α░«α░░α░┐α░»α▒ü α░òα░½α░é α░░α░òα░é α░Äα░▓α░╛ α░ëα░éα░ªα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 2: αñûαÑïαñòαñ▓αñ╛ αñåαñúαñ┐ αñòαñ½αñ╛αñÜαÑç αñ╕αÑìαñ╡αñ░αÑéαñ¬ αñòαñ╕αÑç αñåαñ╣αÑç?',
      bn: 'αªºαª╛αª¬ αº¿: αªòαª╛αª╢αª┐ αªô αªòαª½αºçαª░ αªºαª░αª¿ αªòαºçαª«αª¿?'
    },
    subtitle: {
      en: 'Auscultation & sputum analysis',
      hi: 'αñûαñ╛αñéαñ╕αÑÇ αñòαÑÇ αñåαñ╡αñ╛αñ£ αñöαñ░ αñ¼αñ▓αñùαñ« αñòαÑÇ αñ£αñ╛αñéαñÜ',
      ta: 'α«çα«░α»üα««α«▓α»ì α«Æα«▓α«┐ α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░ªα░ùα▒ìα░ùα▒ü α░ºα▒ìα░╡α░¿α░┐ α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αñûαÑïαñòαñ▓αÑìαñ»αñ╛αñÜαñ╛ αñåαñ╡αñ╛αñ£ αññαñ¬αñ╛αñ╕αñ╛',
      bn: 'αªòαª╛αª╢αª┐αª░ αª╢αª¼αºìαªª αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  dry_whistling: {
    en: 'Dry Cough with High-Pitched Whistling / Wheezing Sound',
    hi: 'αñ╕αÑéαñûαÑÇ αñûαñ╛αñéαñ╕αÑÇ αñòαÑç αñ╕αñ╛αñÑ αñ╕αÑÇαñƒαÑÇ αñ£αÑêαñ╕αÑÇ αñåαñ╡αñ╛αñ£ (αñ╕αÑÇαñƒαÑÇ αñ¼αñ£αñ¿αñ╛)',
    ta: 'α«ëα«▓α«░α»ì α«çα«░α»üα««α«▓α»üα«ƒα«⌐α»ì α«╡α«┐α«Üα«┐α«▓α»ì α«¬α»ïα«⌐α»ìα«▒ α«Æα«▓α«┐',
    te: 'α░¬α▒èα░íα░┐ α░ªα░ùα▒ìα░ùα▒ü α░«α░░α░┐α░»α▒ü α░êα░▓ α░╡α▒çα░╕α░┐α░¿α░ƒα▒ìα░▓α▒ü α░╢α░¼α▒ìα░ªα░é α░░α░╛α░╡α░íα░é',
    mr: 'αñòαÑïαñ░αñíαÑìαñ»αñ╛ αñûαÑïαñòαñ▓αÑìαñ»αñ╛αñ╕αñ╣ αñ╢αñ┐αñƒαÑÇαñ╕αñ╛αñ░αñûαñ╛ αñåαñ╡αñ╛αñ£ αñ»αÑçαñúαÑç',
    bn: 'αª╢αºüαªòαª¿αºï αªòαª╛αª╢αª┐ αªô αª¼αª╛αªüαª╢αª┐αª░ αª«αªñαºï αªåαªôαºƒαª╛αª£ αª╣αªôαºƒαª╛'
  },
  thick_yellow_green: {
    en: 'Coughing up Thick Yellow / Green Phlegm',
    hi: 'αñùαñ╛αñóαñ╝αñ╛ αñ¬αÑÇαñ▓αñ╛ αñ»αñ╛ αñ╣αñ░αñ╛ αñ¼αñ▓αñùαñ« αñ¿αñ┐αñòαñ▓αñ¿αñ╛',
    ta: 'α«ñα«ƒα«┐α««α«⌐α«╛α«⌐ α««α«₧α»ìα«Üα«│α»ì / α«¬α«Üα»ìα«Üα»ê α«Üα«│α«┐',
    te: 'α░«α░éα░ªα░¬α░╛α░ƒα░┐ α░¬α░╕α▒üα░¬α▒ü / α░¬α░Üα▒ìα░Üα░¿α░┐ α░òα░½α░é α░░α░╛α░╡α░íα░é',
    mr: 'αñÿαñƒαÑìαñƒ αñ¬αñ┐αñ╡αñ│αñ╛ αñòαñ┐αñéαñ╡αñ╛ αñ╣αñ┐αñ░αñ╡αñ╛ αñòαñ½ αñ¬αñíαñúαÑç',
    bn: 'αªÿαª¿ αª╣αª▓αºüαªª αª¼αª╛ αª╕αª¼αºüαª£ αªòαª½ αª¼αºçαª░ αª╣αªôαºƒαª╛'
  },
  pink_frothy_blood: {
    en: 'Coughing up Pink Frothy Sputum or Blood Spots',
    hi: 'αñùαÑüαñ▓αñ╛αñ¼αÑÇ αñ¥αñ╛αñùαñªαñ╛αñ░ αñ¼αñ▓αñùαñ« αñ»αñ╛ αñûαÑéαñ¿ αñòαÑç αñºαñ¼αÑìαñ¼αÑç αñåαñ¿αñ╛',
    ta: 'α«çα«│α«₧α»ìα«Üα«┐α«╡α«¬α»ìα«¬α»ü α«¿α»üα«░α»ê α«Üα«│α«┐ α«àα«▓α»ìα«▓α«ñα»ü α«░α«ñα»ìα«ñ α«¬α»üα«│α»ìα«│α«┐α«òα«│α»ì',
    te: 'α░ùα▒üα░▓α░╛α░¼α▒Ç α░░α░éα░ùα▒ü α░¿α▒üα░░α▒üα░ùα▒ü α░òα░½α░é α░▓α▒çα░ªα░╛ α░░α░òα▒ìα░ñα░é α░Üα▒üα░òα▒ìα░òα░▓α▒ü α░░α░╛α░╡α░íα░é',
    mr: 'αñùαÑüαñ▓αñ╛αñ¼αÑÇ αñ½αÑçαñ╕αñ»αÑüαñòαÑìαññ αñòαñ½ αñòαñ┐αñéαñ╡αñ╛ αñ░αñòαÑìαññαñ╛αñÜαÑç αñíαñ╛αñù αñ»αÑçαñúαÑç',
    bn: 'αªùαºïαª▓αª╛αª¬αºÇ αª½αºçαª¿αª╛αª░ αª«αªñαºï αªòαª½ αª¼αª╛ αª░αªòαºìαªñαºçαª░ αªªαª╛αªù αª¼αºçαª░ αª╣αªôαºƒαª╛'
  },

  // --- HEADACHE ---
  head_onset_character: {
    title: {
      en: 'Step 1: What was the speed of onset and pain character?',
      hi: 'αñÜαñ░αñú 1: αñ╕αñ┐αñ░αñªαñ░αÑìαñª αñòαÑÇ αñ╢αÑüαñ░αÑüαñåαññ αñöαñ░ αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñòαÑêαñ╕αÑÇ αñÑαÑÇ?',
      ta: 'α«¬α«ƒα«┐ 1: α«ñα«▓α»êα«╡α«▓α«┐α«»α«┐α«⌐α»ì α«╡α»çα«òα««α»ì α««α«▒α»ìα«▒α»üα««α»ì α«ñα«⌐α»ìα««α»ê α«Äα«⌐α»ìα«⌐?',
      te: 'α░ªα░╢ 1: α░ñα░▓α░¿α▒èα░¬α▒ìα░¬α░┐ α░¬α▒ìα░░α░╛α░░α░éα░¡α░é α░«α░░α░┐α░»α▒ü α░╕α▒ìα░╡α░¡α░╛α░╡α░é α░Äα░▓α░╛ α░ëα░éα░ªα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αñíαÑïαñòαÑçαñªαÑüαñûαÑÇαñÜαÑÇ αñ╕αÑüαñ░αÑüαñ╡αñ╛αññ αñåαñúαñ┐ αñ╕αÑìαñ╡αñ░αÑéαñ¬ αñòαñ╕αÑç αñ╣αÑïαññαÑç?',
      bn: 'αªºαª╛αª¬ αºº: αª«αª╛αªÑαª╛αª¼αºìαª»αªÑαª╛ αª╢αºüαª░αºü αª╣αªôαºƒαª╛αª░ αªùαªñαª┐ αªô αªºαª░αª¿ αªòαºçαª«αª¿?'
    },
    subtitle: {
      en: 'Intracranial pain pattern analysis',
      hi: 'αñªαñ░αÑìαñª αñòαÑç αñ¬αÑìαñ░αñòαñ╛αñ░ αñòαñ╛ αñ╡αñ┐αñ╢αÑìαñ▓αÑçαñ╖αñú αñòαñ░αÑçαñé',
      ta: 'α«ñα«▓α»êα«╡α«▓α«┐ α««α»üα«▒α»ê α«¬α«òα»üα«¬α»ìα«¬α«╛α«»α»ìα«╡α»ü',
      te: 'α░¿α▒èα░¬α▒ìα░¬α░┐ α░╕α▒ìα░╡α░¡α░╛α░╡ α░╡α░┐α░╢α▒ìα░▓α▒çα░╖α░ú',
      mr: 'αñ╡αÑçαñªαñ¿αñ╛ αñ¬αÑìαñ░αñòαñ╛αñ░αñ╛αñÜαÑç αñ╡αñ┐αñ╢αÑìαñ▓αÑçαñ╖αñú',
      bn: 'αª¼αºìαª»αªÑαª╛αª░ αªºαª░αª¿αºçαª░ αª¼αª┐αª╢αºìαª▓αºçαª╖αªú'
    }
  },
  thunderclap_sudden: {
    en: 'Sudden "Thunderclap" Explosion (Worst Headache of Life)',
    hi: 'αñàαñÜαñ╛αñ¿αñò αñ¼αñ┐αñ£αñ▓αÑÇ αñ£αÑêαñ╕αñ╛ αñºαñ«αñ╛αñòαñ╛ (αñ£αÑÇαñ╡αñ¿ αñòαñ╛ αñ╕αñ¼αñ╕αÑç αñ¡αñ»αñ╛αñ¿αñò αñ╕αñ┐αñ░αñªαñ░αÑìαñª)',
    ta: 'α«ñα«┐α«ƒα»Çα«░α»ì α«çα«ƒα«┐ α«¬α»ïα«⌐α»ìα«▒ α«ñα«▓α»êα«╡α«▓α«┐',
    te: 'α░╣α░áα░╛α░ñα▒ìα░ñα▒üα░ùα░╛ α░¬α░┐α░íα▒üα░ùα▒ü α░¬α░íα░┐α░¿α░ƒα▒ìα░▓α▒ü α░ñα░▓α░¿α▒èα░¬α▒ìα░¬α░┐ (α░£α▒Çα░╡α░┐α░ñα░éα░▓α▒ï α░àα░ñα▒ìα░»α░éα░ñ α░¡α░»α░éα░òα░░α░«α▒êα░¿α░ªα░┐)',
    mr: 'αñàαñÜαñ╛αñ¿αñò αñ╡αñ┐αñ£αÑçαñ╕αñ╛αñ░αñûαñ╛ αñ¥αñƒαñòαñ╛ (αñ£αÑÇαñ╡αñ¿αñ╛αññαÑÇαñ▓ αñ╕αñ░αÑìαñ╡αñ╛αññ αñ¡αñ»αñ╛αñ¿αñò αñíαÑïαñòαÑçαñªαÑüαñûαÑÇ)',
    bn: 'αª╣αªáαª╛αºÄ αª¼αª╛αª£ αª¬αº£αª╛αª░ αª«αªñαºï αªñαºÇαª¼αºìαª░ αª«αª╛αªÑαª╛αª¼αºìαª»αªÑαª╛ (αª£αºÇαª¼αª¿αºçαª░ αª╕αª¼αªÜαºçαºƒαºç αªûαª╛αª░αª╛αª¬ αª¼αºìαª»αªÑαª╛αºƒ)'
  },
  one_sided_throbbing: {
    en: 'One-Sided Throbbing Pain with Nausea & Light Sensitivity',
    hi: 'αñÅαñò αññαñ░αñ½αñ╛ αñƒαñ¬αñòαññαñ╛ αñªαñ░αÑìαñª, αñ«αñ┐αñÜαñ▓αÑÇ αñöαñ░ αñ░αÑïαñ╢αñ¿αÑÇ αñ╕αÑç αññαñòαñ▓αÑÇαñ½',
    ta: 'α«Æα«░α»ü α«¬α«òα»ìα«ò α«ñα«▓α»êα«╡α«▓α«┐ α««α«▒α»ìα«▒α»üα««α»ì α«òα»üα««α«ƒα»ìα«ƒα«▓α»ì',
    te: 'α░Æα░òα░╡α▒êα░¬α▒üα░¿ α░¿α░░α░é α░▓α░╛α░ùα▒üα░ñα▒üα░¿α▒ìα░¿α░ƒα▒ìα░▓α▒ü α░¿α▒èα░¬α▒ìα░¬α░┐ α░«α░░α░┐α░»α▒ü α░╡α▒åα░▓α▒üα░ùα▒üα░¿α▒ü α░Üα▒éα░íα░▓α▒çα░òα░¬α▒ïα░╡α░íα░é',
    mr: 'αñÅαñòαñ╛ αñ¼αñ╛αñ£αÑéαñ▓αñ╛ αñ╣αÑïαñúαñ╛αñ░αÑÇ αñòαñ╕αñòαñ╕ αñåαñúαñ┐ αñ¬αÑìαñ░αñòαñ╛αñ╢αñ╛αñÜαñ╛ αññαÑìαñ░αñ╛αñ╕',
    bn: 'αªÅαªòαª¬αª╛αª╢αºç αªªαª¬αªªαª¬ αªòαª░αª╛ αª¼αºìαª»αªÑαª╛ αªô αªåαª▓αºïαªñαºç αªòαª╖αºìαªƒ αª╣αªôαª»αª╝αª╛'
  },
  tight_band_forehead: {
    en: 'Constant Tight Squeezing Band Around Temples & Forehead',
    hi: 'αñ«αñ╛αñÑαÑç αñöαñ░ αñòαñ¿αñ¬αñƒαÑÇ αñòαÑç αñÜαñ╛αñ░αÑïαñé αñôαñ░ αñòαñ╕αññαñ╛ αñ╣αÑüαñå αññαñ¿αñ╛αñ╡αñ»αÑüαñòαÑìαññ αñªαñ░αÑìαñª',
    ta: 'α«¿α»åα«▒α»ìα«▒α«┐α«»α»êα«Üα»ì α«Üα»üα«▒α»ìα«▒α«┐ α«çα«▒α»üα«òα»ìα«òα««α«╛α«⌐ α«¬α«ƒα»ìα«ƒα»ê α«¬α»ïα«⌐α»ìα«▒ α«╡α«▓α«┐',
    te: 'α░¿α▒üα░ªα▒üα░░α▒ü α░«α░░α░┐α░»α▒ü α░╢α░éα░ûα░«α▒ü α░Üα▒üα░ƒα▒ìα░ƒα▒é α░¼α░┐α░ùα▒üα░ñα▒üα░ùα░╛ α░ëα░éα░íα▒ç α░¿α▒èα░¬α▒ìα░¬α░┐',
    mr: 'αñòαñ¬αñ╛αñ│αñ╛αñ¡αÑïαñ╡αññαÑÇ αñÿαñƒαÑìαñƒ αñ¬αñƒαÑìαñƒαÑÇ αñ¼αñ╛αñéαñºαñ▓αÑìαñ»αñ╛αñ╕αñ╛αñ░αñûαÑÇ αñ╡αÑçαñªαñ¿αñ╛',
    bn: 'αªòαª¬αª╛αª▓αºçαª░ αªÜαª╛αª░αª¬αª╛αª╢αºç αª╢αªòαºìαªñ αª¼αºìαª»αª╛αª¿αºìαªíαºçαª░ αª«αªñαºï αªÜαª╛αª¬αª»αºüαªòαºìαªñ αª¼αºìαª»αªÑαª╛'
  },
  head_neuro_deficits: {
    title: {
      en: 'Step 2: Are you experiencing any neurological red flags?',
      hi: 'αñÜαñ░αñú 2: αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ¿αñ«αÑçαñé αñ╕αÑç αñòαÑïαñê αñ¿αÑìαñ»αÑéαñ░αÑïαñ▓αÑëαñ£αñ┐αñòαñ▓ αñåαñ¬αñ╛αññαñòαñ╛αñ▓αÑÇαñ¿ αñ▓αñòαÑìαñ╖αñú αñ╣αÑêαñé?',
      ta: 'α«¬α«ƒα«┐ 2: α«¿α«░α««α»ìα«¬α«┐α«»α«▓α»ì α«àα«╡α«Üα«░ α«àα«▒α«┐α«òα»üα«▒α«┐α«òα«│α»ì α«ëα«│α»ìα«│α«⌐α«╡α«╛?',
      te: 'α░ªα░╢ 2: α░¿α▒ìα░»α▒éα░░α▒ïα░▓α░╛α░£α░┐α░òα░▓α▒ì α░àα░ñα▒ìα░»α░╡α░╕α░░ α░▓α░òα▒ìα░╖α░úα░╛α░▓α▒ü α░ëα░¿α▒ìα░¿α░╛α░»α░╛?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 2: αñòαñ╛αñ╣αÑÇ αñ¿αÑìαñ»αÑéαñ░αÑïαñ▓αÑëαñ£αñ┐αñòαñ▓ αñåαñúαÑÇαñ¼αñ╛αñúαÑÇαñÜαÑÇ αñ▓αñòαÑìαñ╖αñúαÑç αñåαñ╣αÑçαññ αñòαñ╛?',
      bn: 'αªºαª╛αª¬ αº¿: αªòαºïαª¿αºï αª¿αª┐αªëαª░αºïαª▓αª£αª┐αªòαºìαª»αª╛αª▓ αª£αª░αºüαª░αª┐ αª▓αªòαºìαª╖αªú αªåαª¢αºç αªòαª┐?'
    },
    subtitle: {
      en: 'FAST stroke & meningeal sign screening',
      hi: 'αñ▓αñòαñ╡αñ╛ (αñ╕αÑìαñƒαÑìαñ░αÑïαñò) αñöαñ░ αñªαñ┐αñ«αñ╛αñùαÑÇ αñ¼αÑüαñûαñ╛αñ░ αñòαÑÇ αñ£αñ╛αñéαñÜ',
      ta: 'α«¬α«òα»ìα«òα«╡α«╛α«ñα««α»ì α««α«▒α»ìα«▒α»üα««α»ì α««α»éα«│α»êα«òα»ìα«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α»ì α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░¬α░òα▒ìα░╖α░╡α░╛α░ñα░é α░«α░░α░┐α░»α▒ü α░«α▒åα░ªα░íα▒ü α░£α▒ìα░╡α░░α░é α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αñ¬αñòαÑìαñ╖αñ╛αñÿαñ╛αññ αñåαñúαñ┐ αñ«αÑçαñéαñªαÑéαñ£αÑìαñ╡αñ░ αññαñ¬αñ╛αñ╕αñúαÑÇ',
      bn: 'αª¬αªòαºìαª╖αª╛αªÿαª╛αªñ αªô αª«αª╕αºìαªñαª┐αª╖αºìαªòαºçαª░ αª£αºìαª¼αª░αºçαª░ αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  stroke_facial_droop: {
    en: 'Facial Droop, Arm Weakness, or Slurred Speech',
    hi: 'αñÜαÑçαñ╣αñ░αñ╛ αñƒαÑçαñóαñ╝αñ╛ αñ╣αÑïαñ¿αñ╛, αñ╣αñ╛αñÑ αñ«αÑçαñé αñòαñ«αñ£αÑïαñ░αÑÇ αñ»αñ╛ αñåαñ╡αñ╛αñ£ αññαÑüαññαñ▓αñ╛αñ¿αñ╛',
    ta: 'α««α»üα«òα««α»ì α«òα»ïα«úα»üα«ñα«▓α»ì, α«òα»ê α«¬α«▓α«╡α»Çα«⌐α««α»ì α«àα«▓α»ìα«▓α«ñα»ü α«ñα»åα«│α«┐α«╡α«▒α»ìα«▒ α«¬α»çα«Üα»ìα«Üα»ü',
    te: 'α░«α▒üα░ûα░é α░╡α░éα░òα░░α░¬α▒ïα░╡α░íα░é, α░Üα▒çα░»α░┐ α░¼α░▓α░╣α▒Çα░¿α░¬α░íα░ƒα░é α░▓α▒çα░ªα░╛ α░«α░╛α░ƒ α░ñα▒èα░ƒα▒ìα░░α▒éα░¬α░íα░ƒα░é',
    mr: 'αñÜαÑçαñ╣αñ░αñ╛ αñ╡αñ╛αñòαñíαñ╛ αñ╣αÑïαñúαÑç, αñ╣αñ╛αññαñ╛αññ αñàαñ╢αñòαÑìαññαñ¬αñúαñ╛ αñòαñ┐αñéαñ╡αñ╛ αñ¼αÑïαñ▓αñúαÑç αññαÑïαññαñ░αÑç αñ╣αÑïαñúαÑç',
    bn: 'αª«αºüαªû αª¼αºçαªüαªòαºç αª»αª╛αªôαºƒαª╛, αª╣αª╛αªñαºç αªªαºüαª░αºìαª¼αª▓αªñαª╛ αª¼αª╛ αªàαª╕αºìαª¬αª╖αºìαªƒ αªòαªÑαª╛'
  },
  stiff_neck_fever: {
    en: 'Stiff Neck + High Fever + Sensitivity to Light',
    hi: 'αñùαñ░αÑìαñªαñ¿ αñ«αÑçαñé αñàαñòαñíαñ╝αñ¿ + αññαÑçαñ£ αñ¼αÑüαñûαñ╛αñ░ + αñ░αÑïαñ╢αñ¿αÑÇ αñ╕αÑç αñíαñ░ αñ▓αñùαñ¿αñ╛',
    ta: 'α«òα«┤α»üα«ñα»ìα«ñα»ü α«╡α«┐α«▒α»êα«¬α»ìα«¬α»ü + α«àα«ñα«┐α«ò α«òα«╛α«»α»ìα«Üα»ìα«Üα«▓α»ì',
    te: 'α░«α▒åα░í α░¼α░┐α░ùα▒üα░ñα▒üα░ùα░╛ α░ëα░éα░íα░ƒα░é + α░ñα▒Çα░╡α▒ìα░░α░«α▒êα░¿ α░£α▒ìα░╡α░░α░é + α░╡α▒åα░▓α▒üα░ùα▒üα░¿α▒ü α░Üα▒éα░íα░▓α▒çα░òα░¬α▒ïα░╡α░íα░é',
    mr: 'αñ«αñ╛αñ¿ αñòαñíαñò αñ╣αÑïαñúαÑç + αññαÑÇαñ╡αÑìαñ░ αññαñ╛αñ¬ + αñ¬αÑìαñ░αñòαñ╛αñ╢αñ╛αñÜαÑÇ αñ¡αÑÇαññαÑÇ',
    bn: 'αªÿαª╛αº£ αª╢αªòαºìαªñ αª╣αªôαºƒαª╛ + αªñαºÇαª¼αºìαª░ αª£αºìαª¼αª░ + αªåαª▓αºïαªñαºç αªòαª╖αºìαªƒ αª╣αªôαºƒαª╛'
  },
  vision_loss_double: {
    en: 'Sudden Vision Loss, Double Vision, or Dizziness',
    hi: 'αñàαñÜαñ╛αñ¿αñò αñåαñéαñûαÑïαñé αñ╕αÑç αñºαÑüαñéαñºαñ▓αñ╛ αñªαñ┐αñûαñ¿αñ╛, αñªαÑï-αñªαÑï αñªαñ┐αñûαñ¿αñ╛ αñ»αñ╛ αñÜαñòαÑìαñòαñ░',
    ta: 'α«ñα«┐α«ƒα»Çα«░α»ì α«¬α«╛α«░α»ìα«╡α»êα«»α«┐α«┤α«¬α»ìα«¬α»ü α«àα«▓α»ìα«▓α«ñα»ü α«çα«░α«ƒα»ìα«ƒα»êα«¬α»ì α«¬α«╛α«░α»ìα«╡α»ê',
    te: 'α░╣α░áα░╛α░ñα▒ìα░ñα▒üα░ùα░╛ α░Üα▒éα░¬α▒ü α░«α░╕α░òα░¼α░╛α░░α░íα░é, α░░α▒åα░éα░íα▒çα░╕α░┐α░ùα░╛ α░òα░¿α░┐α░¬α░┐α░éα░Üα░íα░é α░▓α▒çα░ªα░╛ α░«α▒êα░òα░é',
    mr: 'αñàαñÜαñ╛αñ¿αñò αñàαñéαñºαÑüαñò αñªαñ┐αñ╕αñúαÑç, αñªαÑïαñ¿-αñªαÑïαñ¿ αñªαñ┐αñ╕αñúαÑç αñòαñ┐αñéαñ╡αñ╛ αñÜαñòαÑìαñòαñ░ αñ»αÑçαñúαÑç',
    bn: 'αª╣αªáαª╛αºÄ αªÜαºïαªûαºç αª¿αª╛ αªªαºçαªûαª╛, αªªαºüαªƒαºï αªªαºüαªƒαºï αªªαºçαªûαª╛ αª¼αª╛ αª«αª╛αªÑαª╛ αªÿαºïαª░αª╛'
  },

  // --- AYUSH WELLNESS ---
  ayush_dosha: {
    title: {
      en: 'Step 1: Dominant Body Constitution (Prakriti Pariksha)',
      hi: 'αñÜαñ░αñú 1: αñåαñ¬αñòαÑÇ αñ«αÑüαñûαÑìαñ» αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñ¬αÑìαñ░αñòαÑâαññαñ┐ (αññαÑìαñ░αñ┐αñªαÑïαñ╖ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú)',
      ta: 'α«¬α«ƒα«┐ 1: α«ëα«Öα»ìα«òα«│α»ì α««α»üα«ñα«⌐α»ìα««α»ê α«ëα«ƒα«▓α»ì α«ñα«ñα»ìα«ñα»üα«╡α««α»ì (α«¬α«┐α«░α«òα«┐α«░α»üα«ñα«┐ α«¬α«░α«┐α«Üα»ïα«ñα«⌐α»ê)',
      te: 'α░ªα░╢ 1: α░«α▒Ç α░¬α▒ìα░░α░ºα░╛α░¿ α░╢α░░α▒Çα░░ α░ñα░ñα▒ìα░╡α░é (α░¬α▒ìα░░α░òα▒âα░ñα░┐ α░¬α░░α▒Çα░òα▒ìα░╖)',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αññαÑüαñ«αñÜαÑç αñ«αÑüαñûαÑìαñ» αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñ╕αÑìαñ╡αñ░αÑéαñ¬ (αññαÑìαñ░αñ┐αñªαÑïαñ╖ αñ¬αñ░αÑÇαñòαÑìαñ╖αñ╛)',
      bn: 'αªºαª╛αª¬ αºº: αªåαª¬αª¿αª╛αª░ αª¬αºìαª░αªºαª╛αª¿ αª╢αª╛αª░αºÇαª░αª┐αªò αªùαªáαª¿ (αª¬αºìαª░αªòαºâαªñαª┐ αª¬αª░αºÇαªòαºìαª╖αª╛)'
    },
    subtitle: {
      en: 'Ayurvedic tridosha assessment',
      hi: 'αñåαñ»αÑüαñ░αÑìαñ╡αÑçαñªαñ┐αñò αñ╡αñ╛αññ, αñ¬αñ┐αññαÑìαññ, αñòαñ½ αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñ¿αñ┐αñ░αÑìαñºαñ╛αñ░αñú',
      ta: 'α«åα«»α»üα«░α»ìα«╡α»çα«ñ α«╡α«╛α«ñ, α«¬α«┐α«ñα»ìα«ñ, α«òα«¬ α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░åα░»α▒üα░░α▒ìα░╡α▒çα░ª α░╡α░╛α░ñ, α░¬α░┐α░ñα▒ìα░ñ, α░òα░½ α░¬α░░α▒Çα░òα▒ìα░╖',
      mr: 'αñåαñ»αÑüαñ░αÑìαñ╡αÑçαñªαñ┐αñò αñ╡αñ╛αññ, αñ¬αñ┐αññαÑìαññ, αñòαñ½ αñ«αÑéαñ▓αÑìαñ»αñ«αñ╛αñ¬αñ¿',
      bn: 'αªåαª»αª╝αºüαª░αºìαª¼αºçαªªαª┐αªò αª¼αª╛αªñ, αª¬αª┐αªñαºìαªñ, αªòαª½ αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  vata_prakriti: {
    en: 'Vata Dominant (Light build, dry skin, active mind, irregular digestion)',
    hi: 'αñ╡αñ╛αññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ╣αñ▓αÑìαñòαñ╛ αñ╢αñ░αÑÇαñ░, αñ░αÑéαñûαÑÇ αññαÑìαñ╡αñÜαñ╛, αñÜαñéαñÜαñ▓ αñ«αñ¿, αñàαñ¿αñ┐αñ╢αÑìαñÜαñ┐αññ αñ¬αñ╛αñÜαñ¿)',
    ta: 'α«╡α«╛α«ñ α«¬α«┐α«░α«ñα«╛α«⌐α««α»ì (α««α»åα«▓α»ìα«▓α«┐α«» α«ëα«ƒα«▓α»ì, α«╡α«▒α«úα»ìα«ƒ α«ñα»ïα«│α»ì, α«Üα»üα«▒α»üα«Üα»üα«▒α»üα«¬α»ìα«¬α«╛α«⌐ α««α«⌐α««α»ì)',
    te: 'α░╡α░╛α░ñ α░¬α▒ìα░░α░ºα░╛α░¿α░é (α░▓α▒çα░ñ α░╢α░░α▒Çα░░α░é, α░¬α▒èα░íα░┐ α░Üα░░α▒ìα░«α░é, α░Üα░éα░Üα░▓α░«α▒êα░¿ α░«α░¿α░╕α▒ìα░╕α▒ü)',
    mr: 'αñ╡αñ╛αññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ╣αñ│αÑüαñ╡αñ╛αñ░ αñ╢αñ░αÑÇαñ░, αñòαÑïαñ░αñíαÑÇ αññαÑìαñ╡αñÜαñ╛, αñÜαñéαñÜαñ▓ αñ«αñ¿)',
    bn: 'αª¼αª╛αªñ αª¬αºìαª░αªºαª╛αª¿ (αª╣αª╛αª▓αªòαª╛ αªùαªáαª¿, αª╢αºüαª╖αºìαªò αªñαºìαª¼αªò, αªÜαª₧αºìαªÜαª▓ αª«αª¿)'
  },
  pitta_prakriti: {
    en: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp focus)',
    hi: 'αñ¬αñ┐αññαÑìαññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñºαÑìαñ»αñ« αñ╢αñ░αÑÇαñ░, αñùαñ░αÑìαñ« αññαÑìαñ╡αñÜαñ╛, αññαÑçαñ£ αñ¬αñ╛αñÜαñ¿, αñÅαñòαñ╛αñùαÑìαñ░ αñ¼αÑüαñªαÑìαñºαñ┐)',
    ta: 'α«¬α«┐α«ñα»ìα«ñ α«¬α«┐α«░α«ñα«╛α«⌐α««α»ì (α«¿α«ƒα»üα«ñα»ìα«ñα«░ α«ëα«ƒα«▓α»ì, α«Üα»éα«ƒα«╛α«⌐ α«ñα»ïα«│α»ì, α«òα»éα«░α»ìα««α»êα«»α«╛α«⌐ α«òα«╡α«⌐α««α»ì)',
    te: 'α░¬α░┐α░ñα▒ìα░ñ α░¬α▒ìα░░α░ºα░╛α░¿α░é (α░«α░ºα▒ìα░»α░╕α▒ìα░Ñ α░╢α░░α▒Çα░░α░é, α░╡α▒åα░Üα▒ìα░Üα░¿α░┐ α░Üα░░α▒ìα░«α░é, α░ñα░òα▒ìα░╖α░ú α░£α▒Çα░░α▒ìα░úα░òα▒ìα░░α░┐α░»)',
    mr: 'αñ¬αñ┐αññαÑìαññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñºαÑìαñ»αñ« αñ╢αñ░αÑÇαñ░, αñëαñ╖αÑìαñú αññαÑìαñ╡αñÜαñ╛, αññαÑÇαñòαÑìαñ╖αÑìαñú αñ¼αÑüαñªαÑìαñºαÑÇ)',
    bn: 'αª¬αª┐αªñαºìαªñ αª¬αºìαª░αªºαª╛αª¿ (αª«αª╛αª¥αª╛αª░αª┐ αªùαªáαª¿, αªëαª╖αºìαªú αªñαºìαª¼αªò, αªñαºÇαªòαºìαª╖αºìαªú αª«αª¿)'
  },
  kapha_prakriti: {
    en: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady endurance)',
    hi: 'αñòαñ½ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñ£αñ¼αÑéαññ αñ╢αñ░αÑÇαñ░, αñÜαñ┐αñòαñ¿αÑÇ αññαÑìαñ╡αñÜαñ╛, αñ╢αñ╛αñéαññ αñ╕αÑìαñ╡αñ¡αñ╛αñ╡, αñ╕αñ╣αñ¿αñ╢αÑÇαñ▓αññαñ╛)',
    ta: 'α«òα«¬ α«¬α«┐α«░α«ñα«╛α«⌐α««α»ì (α«ëα«▒α»üα«ñα«┐α«»α«╛α«⌐ α«ëα«ƒα«▓α»ì, α««α»åα«⌐α»ìα««α»êα«»α«╛α«⌐ α«ñα»ïα«│α»ì, α«àα««α»êα«ñα«┐α«»α«╛α«⌐ α«òα»üα«úα««α»ì)',
    te: 'α░òα░½ α░¬α▒ìα░░α░ºα░╛α░¿α░é (α░¼α░▓α░«α▒êα░¿ α░╢α░░α▒Çα░░α░é, α░«α▒âα░ªα▒üα░╡α▒êα░¿ α░Üα░░α▒ìα░«α░é, α░¬α▒ìα░░α░╢α░╛α░éα░ñ α░«α░¿α░╕α▒ìα░╕α▒ü)',
    mr: 'αñòαñ½ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñ£αñ¼αÑéαññ αñ╢αñ░αÑÇαñ░, αñùαÑüαñ│αñùαÑüαñ│αÑÇαññ αññαÑìαñ╡αñÜαñ╛, αñ╢αñ╛αñéαññ αñ╕αÑìαñ╡αñ¡αñ╛αñ╡)',
    bn: 'αªòαª½ αª¬αºìαª░αªºαª╛αª¿ (αª╢αªòαºìαªñαª┐αª╢αª╛αª▓αºÇ αªùαªáαª¿, αª«αª╕αºâαªú αªñαºìαª¼αªò, αª╢αª╛αª¿αºìαªñ αª╕αºìαª¼αª¡αª╛αª¼)'
  },
  ayush_agni: {
    title: {
      en: 'Step 2: Digestive Fire Capacity (Agni Pariksha)',
      hi: 'αñÜαñ░αñú 2: αñ£αñáαñ░αñ╛αñùαÑìαñ¿αñ┐ αñÅαñ╡αñé αñ¬αñ╛αñÜαñ¿ αñòαÑìαñ╖αñ«αññαñ╛ (αñàαñùαÑìαñ¿αñ┐ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú)',
      ta: 'α«¬α«ƒα«┐ 2: α«Üα»åα«░α«┐α««α«╛α«⌐α«ñα»ì α«ñα«┐α«▒α«⌐α»ì α«Üα»ïα«ñα«⌐α»ê (α«àα«òα»ìα«⌐α«┐ α«¬α«░α«┐α«Üα»ïα«ñα«⌐α»ê)',
      te: 'α░ªα░╢ 2: α░£α▒Çα░░α▒ìα░úα░òα▒ìα░░α░┐α░» α░╕α░╛α░«α░░α▒ìα░Ñα▒ìα░»α░é (α░àα░ùα▒ìα░¿α░┐ α░¬α░░α▒Çα░òα▒ìα░╖)',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 2: αñ¬αñÜαñ¿ αñòαÑìαñ╖αñ«αññαñ╛ (αñàαñùαÑìαñ¿αÑÇ αñ¬αñ░αÑÇαñòαÑìαñ╖αñ╛)',
      bn: 'αªºαª╛αª¬ αº¿: αª╣αª£αª« αªòαºìαª╖αª«αªñαª╛ (αªàαªùαºìαª¿αª┐ αª¬αª░αºÇαªòαºìαª╖αª╛)'
    },
    subtitle: {
      en: 'Metabolic capacity evaluation',
      hi: 'αñ¬αñ╛αñÜαñ¿ αñÅαñ╡αñé αñÜαñ»αñ╛αñ¬αñÜαñ» αñòαÑìαñ╖αñ«αññαñ╛ αñòαñ╛ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú',
      ta: 'α«Üα»åα«░α«┐α««α«╛α«⌐ α«ñα«┐α«▒α«⌐α»ì α««α«ñα«┐α«¬α»ìα«¬α»Çα«ƒα»ü',
      te: 'α░£α▒Çα░░α▒ìα░ú α░╕α░╛α░«α░░α▒ìα░Ñα▒ìα░» α░«α▒éα░▓α▒ìα░»α░╛α░éα░òα░¿α░é',
      mr: 'αñ¬αñÜαñ¿ αñòαÑìαñ╖αñ«αññαñ╛ αññαñ¬αñ╛αñ╕αñúαÑÇ',
      bn: 'αª«αºçαªƒαª╛αª¼αª▓αª┐αªò αªòαºìαª╖αª«αªñαª╛ αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  samagni: {
    en: 'Sama Agni (Normal, smooth digestion without acidity or bloating)',
    hi: 'αñ╕αñ« αñàαñùαÑìαñ¿αñ┐ (αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ», αñ╕αÑüαñÜαñ╛αñ░αÑé αñ¬αñ╛αñÜαñ¿, αñ¼αñ┐αñ¿αñ╛ αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ αñòαÑç)',
    ta: 'α«Üα«« α«àα«òα»ìα«⌐α«┐ (α«çα«»α«▓α»ìα«¬α«╛α«⌐ α«Üα»åα«░α«┐α««α«╛α«⌐α««α»ì)',
    te: 'α░╕α░« α░àα░ùα▒ìα░¿α░┐ (α░╕α░╛α░ºα░╛α░░α░ú α░«α░░α░┐α░»α▒ü α░╕α▒üα░▓α░¡α░«α▒êα░¿ α░£α▒Çα░░α▒ìα░úα░òα▒ìα░░α░┐α░»)',
    mr: 'αñ╕αñ« αñàαñùαÑìαñ¿αÑÇ (αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñåαñúαñ┐ αñ╕αÑüαñ░αñ│αÑÇαññ αñ¬αñÜαñ¿)',
    bn: 'αª╕αª« αªàαªùαºìαª¿αª┐ (αª╕αºìαª¼αª╛αª¡αª╛αª¼αª┐αªò αªô αª«αª╕αºâαªú αª╣αª£αª«)'
  },
  mandagni: {
    en: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)',
    hi: 'αñ«αñéαñª αñàαñùαÑìαñ¿αñ┐ (αñºαÑÇαñ«αÑÇ αñ¬αñ╛αñÜαñ¿ αñ╢αñòαÑìαññαñ┐, αñûαñ╛αñ¿αÑç αñòαÑç αñ¼αñ╛αñª αñ¡αñ╛αñ░αÑÇαñ¬αñ¿, αñòαñ« αñ¡αÑéαñû)',
    ta: 'α««α«¿α»ìα«ñ α«àα«òα»ìα«⌐α«┐ (α««α«¿α»ìα«ñα««α«╛α«⌐ α«Üα»åα«░α«┐α««α«╛α«⌐α««α»ì, α«Üα«╛α«¬α»ìα«¬α«┐α«ƒα»ìα«ƒ α«¬α«┐α«⌐α»ì α«¬α«╛α«░α««α»ì)',
    te: 'α░«α░éα░ª α░àα░ùα▒ìα░¿α░┐ (α░¿α▒åα░«α▒ìα░«α░ªα▒êα░¿ α░£α▒Çα░░α▒ìα░úα░òα▒ìα░░α░┐α░», α░ñα░┐α░¿α▒ìα░¿ α░ñα░░α▒ìα░╡α░╛α░ñ α░¼α░░α▒üα░╡α▒üα░ùα░╛ α░àα░¿α░┐α░¬α░┐α░éα░Üα░íα░é)',
    mr: 'αñ«αñéαñª αñàαñùαÑìαñ¿αÑÇ (αñ«αñéαñª αñ¬αñÜαñ¿αñ╢αñòαÑìαññαÑÇ, αñ£αÑçαñ╡αñúαñ╛αñ¿αñéαññαñ░ αñ£αñíαñ¬αñúαñ╛)',
    bn: 'αª«αª¿αºìαªª αªàαªùαºìαª¿αª┐ (αªºαºÇαª░αªùαªñαª┐αª░ αª╣αª£αª«, αªûαª╛αªôαºƒαª╛αª░ αª¬αª░ αª¡αª╛αª░αºÇ αª¡αª╛αª¼)'
  },
  tikshnagni: {
    en: 'Tikshna Agni (Hyperactive digestion, frequent burning hunger, heartburn)',
    hi: 'αññαÑÇαñòαÑìαñ╖αÑìαñú αñàαñùαÑìαñ¿αñ┐ (αñàαññαÑìαñ»αñºαñ┐αñò αññαÑÇαñ╡αÑìαñ░ αñ¡αÑéαñû, αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñ£αñ▓αñ¿, αññαÑçαñ£ αññαÑçαñ£αñ╛αñ¼αñ┐αñ»αññ)',
    ta: 'α«ñα»Çα«òα»ìα«╖α»ìα«ú α«àα«òα»ìα«⌐α«┐ (α«àα«ñα«┐α«ò α«¬α«Üα«┐, α«¿α»åα«₧α»ìα«Üα»åα«░α«┐α«Üα»ìα«Üα«▓α»ì)',
    te: 'α░ñα▒Çα░òα▒ìα░╖α░ú α░àα░ùα▒ìα░¿α░┐ (α░àα░ºα░┐α░ò α░åα░òα░▓α░┐, α░ùα▒üα░éα░íα▒åα░▓α▒ìα░▓α▒ï α░«α░éα░ƒ, α░»α░╛α░╕α░┐α░íα░┐α░ƒα▒Ç)',
    mr: 'αññαÑÇαñòαÑìαñ╖αÑìαñú αñàαñùαÑìαñ¿αÑÇ (αñàαññαñ┐ αññαÑÇαñ╡αÑìαñ░ αñ¡αÑéαñò, αñ¢αñ╛αññαÑÇαññ αñ£αñ│αñ£αñ│)',
    bn: 'αªñαºÇαªòαºìαª╖αºìαªú αªàαªùαºìαª¿αª┐ (αªàαªñαª┐αª░αª┐αªòαºìαªñ αªñαºÇαª¼αºìαª░ αªòαºìαª╖αºüαªºαª╛, αª¼αºüαªòαºç αª£αºìαª¼αª╛αª▓αª╛)'
  },

  // --- ROUTINE CHECKUP ---
  routine_purpose: {
    title: {
      en: 'Step 1: What is the primary purpose of today\'s visit?',
      hi: 'αñÜαñ░αñú 1: αñåαñ£ αñòαÑç αñàαñ╕αÑìαñ¬αññαñ╛αñ▓ αñåαñùαñ«αñ¿ αñòαñ╛ αñ«αÑüαñûαÑìαñ» αñòαñ╛αñ░αñú αñòαÑìαñ»αñ╛ αñ╣αÑê?',
      ta: 'α«¬α«ƒα«┐ 1: α«çα«⌐α»ìα«▒α»êα«» α«╡α«░α»üα«òα»êα«»α«┐α«⌐α»ì α««α»üα«òα»ìα«òα«┐α«» α«¿α»ïα«òα»ìα«òα««α»ì α«Äα«⌐α»ìα«⌐?',
      te: 'α░ªα░╢ 1: α░¿α▒çα░ƒα░┐ α░åα░╕α▒üα░¬α░ñα▒ìα░░α░┐ α░░α░╛α░òα░òα▒ü α░¬α▒ìα░░α░ºα░╛α░¿ α░òα░╛α░░α░úα░é α░Åα░«α░┐α░ƒα░┐?',
      mr: 'αñƒαñ¬αÑìαñ¬αñ╛ 1: αñåαñ£αñÜαÑìαñ»αñ╛ αñ╣αÑëαñ╕αÑìαñ¬αñ┐αñƒαñ▓ αñ¡αÑçαñƒαÑÇαñÜαÑç αñ«αÑüαñûαÑìαñ» αñòαñ╛αñ░αñú αñòαñ╛αñ» αñåαñ╣αÑç?',
      bn: 'αªºαª╛αª¬ αºº: αªåαª£αªòαºçαª░ αª╣αª╛αª╕αª¬αª╛αªñαª╛αª▓αºç αªåαª╕αª╛αª░ αª¬αºìαª░αªºαª╛αª¿ αªòαª╛αª░αªú αªòαºÇ?'
    },
    subtitle: {
      en: 'General preventive OPD checkup',
      hi: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñ╕αÑìαñ╡αñ╛αñ╕αÑìαñÑαÑìαñ» αñ¬αñ░αÑÇαñòαÑìαñ╖αñú αñÅαñ╡αñé αñ¬αñ░αñ╛αñ«αñ░αÑìαñ╢',
      ta: 'α«¬α»èα«ñα»ü α«Üα»üα«òα«╛α«ñα«╛α«░ α«Üα»ïα«ñα«⌐α»ê',
      te: 'α░╕α░╛α░ºα░╛α░░α░ú α░åα░░α▒ïα░ùα▒ìα░» α░ñα░¿α░┐α░ûα▒Ç',
      mr: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñåαñ░αÑïαñùαÑìαñ» αññαñ¬αñ╛αñ╕αñúαÑÇ',
      bn: 'αª╕αª╛αªºαª╛αª░αªú αª╕αºìαª¼αª╛αª╕αºìαªÑαºìαª» αª¬αª░αºÇαªòαºìαª╖αª╛'
    }
  },
  general_wellness: {
    en: 'General Health & Vital Screening (BP, Sugar, Weight)',
    hi: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñ╕αÑìαñ╡αñ╛αñ╕αÑìαñÑαÑìαñ» αñ¬αñ░αÑÇαñòαÑìαñ╖αñú (αñ¼αÑÇαñ¬αÑÇ, αñ╢αÑüαñùαñ░, αñ╡αñ£αñ¿ αñ£αñ╛αñéαñÜ)',
    ta: 'α«¬α»èα«ñα»ü α«Üα»üα«òα«╛α«ñα«╛α«░ α«Üα»ïα«ñα«⌐α»ê (α«¬α«┐α«¬α«┐, α«Üα»üα«òα«░α»ì, α«Äα«ƒα»ê)',
    te: 'α░╕α░╛α░ºα░╛α░░α░ú α░åα░░α▒ïα░ùα▒ìα░» α░ñα░¿α░┐α░ûα▒Ç (BP, α░╖α▒üα░ùα░░α▒ì, α░¼α░░α▒üα░╡α▒ü α░ñα░¿α░┐α░ûα▒Ç)',
    mr: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñåαñ░αÑïαñùαÑìαñ» αññαñ¬αñ╛αñ╕αñúαÑÇ (αñ¼αÑÇαñ¬αÑÇ, αñ╢αÑüαñùαñ░, αñ╡αñ£αñ¿)',
    bn: 'αª╕αª╛αªºαª╛αª░αªú αª╕αºìαª¼αª╛αª╕αºìαªÑαºìαª» αª¬αª░αºÇαªòαºìαª╖αª╛ (αª¼αª┐αª¬αª┐, αª╢αºüαªùαª╛αª░, αªôαª£αª¿)'
  },
  med_refill: {
    en: 'Routine Prescription Medication Refill / Follow-up',
    hi: 'αñ¿αñ┐αñ»αñ«αñ┐αññ αñªαñ╡αñ╛αñçαñ»αÑïαñé αñòαñ╛ αñ¬αñ░αñÜαñ╛ αñªαÑïαñ¼αñ╛αñ░αñ╛ αñ▓αñ┐αñûαñ╡αñ╛αñ¿αñ╛ / αñ½αÑëαñ▓αÑï-αñàαñ¬',
    ta: 'α«╡α«┤α«òα»ìα«òα««α«╛α«⌐ α««α«░α»üα«¿α»ìα«ñα»ü α««α«▒α»üα«¬α«ñα«┐α«╡α»ü / α«¬α«┐α«⌐α»ìα«ñα»èα«ƒα«░α»ìα«ñα«▓α»ì',
    te: 'α░░α▒åα░ùα▒ìα░»α▒üα░▓α░░α▒ì α░«α░éα░ªα▒üα░▓ α░¬α▒ìα░░α░┐α░╕α▒ìα░òα▒ìα░░α░┐α░¬α▒ìα░╖α░¿α▒ì α░░α░╛α░»α░┐α░éα░¬α▒ü / α░½α░╛α░▓α▒ï-α░àα░¬α▒ì',
    mr: 'αñ¿αñ┐αñ»αñ«αñ┐αññ αñöαñ╖αñºαñ╛αñéαñÜαÑç αñ¬αÑìαñ░αñ┐αñ╕αÑìαñòαÑìαñ░αñ┐αñ¬αÑìαñ╢αñ¿ αñ¬αÑüαñ¿αÑìαñ╣αñ╛ αñ▓αñ┐αñ╣αñ┐αñúαÑç / αñ½αÑëαñ▓αÑï-αñàαñ¬',
    bn: 'αª¿αª┐αºƒαª«αª┐αªñ αªôαª╖αºüαªºαºçαª░ αª¬αºìαª░αºçαª╕αªòαºìαª░αª┐αª¬αª╢αª¿ αª¿αªñαºüαª¿ αªòαª░αºç αª¿αºçαªôαºƒαª╛ / αª½αª▓αºï-αªåαª¬'
  },
  blood_report_review: {
    en: 'Reviewing Pathology Blood / Lab Test Reports',
    hi: 'αñûαÑéαñ¿ αñ╡ αñ▓αÑêαñ¼ αñ£αñ╛αñéαñÜ αñ░αñ┐αñ¬αÑïαñ░αÑìαñƒ αñíαÑëαñòαÑìαñƒαñ░ αñòαÑï αñªαñ┐αñûαñ╛αñ¿αñ╛',
    ta: 'α«░α«ñα»ìα«ñα«¬α»ì α«¬α«░α«┐α«Üα»ïα«ñα«⌐α»ê α«àα«▒α«┐α«òα»ìα«òα»êα«òα«│α»ê α«åα«»α»ìα«╡α»ü α«Üα»åα«»α»ìα«ñα«▓α»ì',
    te: 'α░░α░òα▒ìα░ñ α░¬α░░α▒Çα░òα▒ìα░╖ / α░▓α▒ìα░»α░╛α░¼α▒ì α░¿α░┐α░╡α▒çα░ªα░┐α░òα░▓α░¿α▒ü α░íα░╛α░òα▒ìα░ƒα░░α▒ìΓÇîα░òα▒ü α░Üα▒éα░¬α░┐α░éα░Üα░íα░é',
    mr: 'αñ░αñòαÑìαññ αñåαñúαñ┐ αñ▓αÑàαñ¼ αññαñ¬αñ╛αñ╕αñúαÑÇ αñàαñ╣αñ╡αñ╛αñ▓ αñíαÑëαñòαÑìαñƒαñ░αñ╛αñéαñ¿αñ╛ αñªαñ╛αñûαñ╡αñúαÑç',
    bn: 'αª░αªòαºìαªñ αªô αª▓αºìαª»αª╛αª¼ αªƒαºçαª╕αºìαªƒ αª░αª┐αª¬αºïαª░αºìαªƒ αªíαª╛αªòαºìαªñαª╛αª░αªòαºç αªªαºçαªûαª╛αª¿αºï'
  }
};

/**
 * Get dynamic language text for an option, step title, or step subtitle.
 */
export function getOptionLabel(opt, currentLang = 'en') {
  if (!opt) return '';
  const optId = typeof opt === 'string' ? opt : opt.id;
  if (TREE_TRANSLATIONS[optId]) {
    const entry = TREE_TRANSLATIONS[optId];
    if (typeof entry === 'string') return entry;
    if (entry[currentLang]) return entry[currentLang];
    if (entry.en) return entry.en;
  }
  // Fallbacks if not found in dictionary
  if (currentLang === 'hi' && opt.label_hi) return opt.label_hi;
  return opt.label || opt.name || optId;
}

export function getStepTitle(step, currentLang = 'en') {
  if (!step) return '';
  const stepId = typeof step === 'string' ? step : step.id;
  if (TREE_TRANSLATIONS[stepId] && TREE_TRANSLATIONS[stepId].title) {
    const titles = TREE_TRANSLATIONS[stepId].title;
    if (titles[currentLang]) return titles[currentLang];
    if (titles.en) return titles.en;
  }
  if (currentLang === 'hi' && step.title_hi) return step.title_hi;
  return step.title || '';
}

export function getStepSubtitle(step, currentLang = 'en') {
  if (!step) return '';
  const stepId = typeof step === 'string' ? step : step.id;
  if (TREE_TRANSLATIONS[stepId] && TREE_TRANSLATIONS[stepId].subtitle) {
    const subs = TREE_TRANSLATIONS[stepId].subtitle;
    if (subs[currentLang]) return subs[currentLang];
    if (subs.en) return subs.en;
  }
  if (currentLang === 'hi' && step.subtitle_hi) return step.subtitle_hi;
  return step.subtitle || '';
}

