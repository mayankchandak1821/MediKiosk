import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from abdm_service import abdm_client

def test_abdm_suite():
    print("Testing ABDM V3 Service and Flask Routes...")
    client = app.test_client()

    # 1. Health check
    res = client.get('/api/health')
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. Backend Health Check OK")

    # 2. Aadhaar OTP Request (Section 3.0 Step 1)
    res = client.post('/api/abdm/enroll/request-otp', json={"aadhaar": "548291034829"})
    assert res.status_code == 200, f"OTP request failed: {res.json}"
    data = res.json
    assert data["success"] is True
    assert "txnId" in data
    txn_id = data["txnId"]
    print(f"[PASS] 2. Aadhaar OTP Request OK (txnId: {txn_id[:8]}...)")

    # 3. Enrol ABHA without consent - MUST FAIL (DPDP Compliance check)
    res = client.post('/api/abdm/enroll/verify-otp', json={
        "txnId": txn_id,
        "otp": "123456",
        "consent": None
    })
    assert res.status_code == 400
    assert "DPDP Compliance Error" in res.json.get("error", "")
    print("[PASS] 3. DPDP Act Mandatory Consent v1.4 Guardrail Verified (Blocked invalid request)")

    # 4. Enrol ABHA with valid v1.4 consent (Section 3.0 Step 3)
    res = client.post('/api/abdm/enroll/verify-otp', json={
        "txnId": txn_id,
        "otp": "123456",
        "mobile": "9876543210",
        "full_name": "Priyanka Sudhir Varude",
        "consent": {
            "code": "abha-enrollment",
            "version": "1.4"
        }
    })
    assert res.status_code == 200, f"Enrol failed: {res.json}"
    enrol_data = res.json
    assert enrol_data["success"] is True
    profile = enrol_data["ABHAProfile"]
    abha_number = profile["ABHANumber"]
    assert abha_number.startswith("91-")
    assert profile["kycVerified"] is True
    print(f"[PASS] 4. ABHA Enrolment Successful! Generated ABHA: {abha_number}")

    # 5. Get Handle Suggestions (Section 3.0 Step 6a)
    res = client.get(f'/api/abdm/enroll/suggestions?txnId={txn_id}&name=Priyanka%20Varude')
    assert res.status_code == 200
    suggestions = res.json.get("abhaAddressList", [])
    assert len(suggestions) > 0
    print(f"[PASS] 5. ABHA Address Suggestions OK: {suggestions[:3]}")

    # 6. Create Custom ABHA Address (Section 3.0 Step 6b)
    res = client.post('/api/abdm/enroll/create-address', json={
        "txnId": txn_id,
        "abhaAddress": "priyanka.varude@sbx"
    })
    assert res.status_code == 200
    assert res.json["preferredAbhaAddress"] == "priyanka.varude@sbx"
    print("[PASS] 6. Custom ABHA Address linked: priyanka.varude@sbx")

    # 7. Mobile OTP Login (Section 6.3)
    res = client.post('/api/abdm/login/request-otp', json={
        "identifier": "9876543210",
        "loginHint": "mobile"
    })
    assert res.status_code == 200
    login_txn_id = res.json["txnId"]
    print(f"[PASS] 7. Login OTP Requested OK (txnId: {login_txn_id[:8]}...)")

    # 8. Verify Login OTP (Section 6.3 Step 2)
    res = client.post('/api/abdm/login/verify-otp', json={
        "txnId": login_txn_id,
        "otp": "123456"
    })
    assert res.status_code == 200
    login_data = res.json
    assert len(login_data["accounts"]) > 0
    print(f"[PASS] 8. Login OTP Verified! Found {len(login_data['accounts'])} linked account(s)")

    # 9. Generate ABHA Card Payload (Section 10.0)
    res = client.post('/api/abdm/card', json=profile)
    assert res.status_code == 200
    card = res.json["card"]
    assert card["abhaNumber"] == abha_number
    assert "hid:" in card["qrPayload"]
    print("[PASS] 9. Digital ABHA Health Card & QR Payload OK")

    print("\nALL 9 ABDM V3 END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_abdm_suite()
