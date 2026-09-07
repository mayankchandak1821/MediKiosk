# Regression fixture: the ACTUAL OCR stream from the phone-camera test, typos and all.
import sys
sys.path.insert(0, r"C:\Users\LENOVO\Documents\SIH2026\medikiosk-mayank\backend")
import importlib, ocr_parser
importlib.reload(ocr_parser)

RAW = """irritation, mild fever for 3 days
Medications :
1 Tab Augmestin 625mg 1 tab thrice daily
(td) x 5 days After food (2 59 total)
2 Syr Benadryl DR: 2 tsp (10mi) hid x 5 days
3 Tab. Calpol 650mg 1 fab SOS (when
i needed) for fever/pain Max 3/day
Advice: Steam inhalation twice daily.
Drink warm fluids. Rest."""

WANT = {"augmentin", "benadryl", "calpol"}

r = ocr_parser.parse_medical_text(RAW)
meds = r["medications"]
got = {m["name"].lower() for m in meds}

print("MEDICATIONS FOUND:", len(meds))
for m in meds:
    print(f"   {m['name']:14} {m.get('dosage',''):10} freq={m.get('frequency','')!r:22} dur={m.get('duration','')}")
print()
missing = WANT - {g.split()[0] for g in got}
print("expected:", sorted(WANT))
print("missing :", sorted(missing) or "none")
print()
print("CLINICAL NOTES:")
for n in r.get("clinical_notes", r.get("clinicalNotes", [])):
    print("   ", n)
