import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, FileText, Upload, Sparkles, RefreshCw, CheckCircle2, 
  ShieldCheck, Tag, Video, VideoOff, Aperture, RotateCcw, AlertCircle, Edit3, Play
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SAMPLE_OCR_TEMPLATES, ocrEngine } from '../services/ocrEngine';

export default function VisualDocumentScanner({ scannedDoc, onDocScan, language = 'en' }) {
  const { t } = useTranslation();
  // Input Modes: 'webcam' | 'upload' | 'preset' | 'text'
  const [scanMode, setScanMode] = useState('webcam');
  const [isScanning, setIsScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [activePreset, setActivePreset] = useState(SAMPLE_OCR_TEMPLATES[0]);
  const [manualText, setManualText] = useState('');
  const [isEditingText, setIsEditingText] = useState(false);

  // Webcam Stream Refs & State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Initialize or Stop Live Webcam Stream
  useEffect(() => {
    let streamInstance = null;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraActive(true);
        } else {
          setCameraError('Camera API not supported in this browser.');
        }
      } catch (err) {
        console.warn('Webcam Access Error:', err);
        setCameraError('Webcam access permission denied or no camera device found.');
        setIsCameraActive(false);
      }
    };

    if (scanMode === 'webcam' && !capturedImage) {
      startCamera();
    }

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanMode, capturedImage]);

  // Capture Live Snapshot from Video Stream
  const handleCaptureSnapshot = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);

    // Stop camera stream after capture
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }

    try {
      setIsScanning(true);
      setOcrProgress(10);
      const data = await ocrEngine.processDocumentImage(dataUrl, null, (prog) => setOcrProgress(prog));
      if (data?.rawText) setManualText(data.rawText);
      onDocScan(data);
    } catch (err) {
      console.error("Camera scan error:", err);
    } finally {
      setIsScanning(false);
      setOcrProgress(100);
    }
  };

  // Handle File Upload Scanning (PDF or Image)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsScanning(true);
      setOcrProgress(10);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          setCapturedImage(e.target.result);
          try {
            const data = await ocrEngine.processDocumentImage(file, null, (prog) => setOcrProgress(prog));
            if (data?.rawText) setManualText(data.rawText);
            onDocScan(data);
          } finally {
            setIsScanning(false);
            setOcrProgress(100);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.name.endsWith('.pdf')) {
        setCapturedImage(null);
        try {
          const data = await ocrEngine.processDocumentImage(file, null, (prog) => setOcrProgress(prog));
          if (data?.rawText) setManualText(data.rawText);
          onDocScan(data);
        } finally {
          setIsScanning(false);
          setOcrProgress(100);
        }
      } else {
        alert('Please upload a PDF document or prescription image (PNG/JPG).');
        setIsScanning(false);
      }
    } catch (err) {
      console.error('File Upload Error:', err);
      setIsScanning(false);
    }
  };

  // Handle Demo Template Selection
  const handleScanPreset = async (preset) => {
    setActivePreset(preset);
    setIsScanning(true);
    setOcrProgress(20);
    setCapturedImage(null);

    try {
      const interval = setInterval(() => {
        setOcrProgress(p => (p >= 90 ? 90 : p + 25));
      }, 150);

      await new Promise(res => setTimeout(res, 600));
      clearInterval(interval);
      setOcrProgress(100);

      setManualText(preset.rawText);
      onDocScan(preset.extracted);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Manual Text Edit Parse
  const handleParseManualText = () => {
    if (!manualText.trim()) return;
    const parsed = ocrEngine.parsePrescriptionText(manualText, 'MANUAL_ENTRY');
    onDocScan(parsed);
    setIsEditingText(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setScanMode('webcam');
  };

  return (
    <div className="bg-white border border-[#E2DCBE] rounded-3xl p-5 shadow-xs space-y-4">
      {/* Top Scanner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DCBE] pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#59C749]/15 text-[#2B8A1E]">
            <Camera className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-[#142618] flex items-center gap-2">
              Optical Document Scanner (Prescriptions & Lab Reports)
              <span className="px-2 py-0.5 rounded-full bg-[#59C749]/15 text-[#142618] font-mono text-[10px] uppercase border border-[#59C749]/30">
                PyPDF + OCR Engine Active
              </span>
            </h4>
            <p className="text-xs text-[#526857]">
              Hold prior prescription or discharge summary in front of camera or upload file
            </p>
          </div>
        </div>

        {/* Scan Mode Switcher */}
        <div className="flex items-center p-1 bg-[#FFFDF1] rounded-xl border border-[#E2DCBE] text-xs">
          <button
            onClick={() => { setScanMode('webcam'); setCapturedImage(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              scanMode === 'webcam' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Live Camera
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              scanMode === 'upload' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload File/PDF
          </button>
          <button
            onClick={() => setScanMode('preset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              scanMode === 'preset' ? 'bg-[#59C749] text-white shadow-xs' : 'text-[#526857] hover:text-[#142618]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Demo Presets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Camera / Captured Image Viewfinder (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold text-[#526857] uppercase tracking-wider block">
            1. Document Camera Viewfinder
          </span>

          <div className="relative aspect-[4/3] bg-[#FFFDF1] rounded-2xl border-2 border-[#E2DCBE] overflow-hidden flex flex-col items-center justify-center p-2 shadow-inner">
            {/* Viewfinder Target Frame Overlay */}
            <div className="absolute inset-4 border-2 border-dashed border-[#59C749]/60 rounded-xl pointer-events-none z-20 flex flex-col justify-between p-3">
              <div className="flex justify-between text-[10px] text-[#142618] font-mono uppercase bg-white/90 border border-[#E2DCBE] px-2 py-0.5 rounded w-fit">
                <span>[ALIGN DOCUMENT INSIDE FRAME]</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#142618] font-mono uppercase bg-white/90 border border-[#E2DCBE] px-2 py-0.5 rounded w-fit self-end">
                <span>OCR & PDF TEXT PARSER READY</span>
              </div>
            </div>

            {/* Laser Line Scanning Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#59C749] to-transparent shadow-sm top-1/2 z-30" />
            )}

            {/* MODE A: LIVE WEBCAM VIDEO STREAM */}
            {scanMode === 'webcam' && !capturedImage && (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-xl"
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 bg-[#FFFDF1]/95 flex flex-col items-center justify-center p-4 text-center space-y-2 z-10">
                    <VideoOff className="w-8 h-8 text-[#526857]" />
                    <p className="text-xs text-[#526857] font-medium">
                      {cameraError || 'Camera initializing or stream inactive.'}
                    </p>
                    <button
                      onClick={() => setScanMode('preset')}
                      className="px-3 py-1.5 bg-white hover:bg-[#F7F4E1] text-[#142618] border border-[#E2DCBE] text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Use Demo Presets Instead
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODE B: CAPTURED SNAPSHOT OR UPLOADED IMAGE / PDF */}
            {(capturedImage || scanMode === 'upload') && (
              <div className="relative w-full h-full flex items-center justify-center">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Scanned Document Snapshot"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <Upload className="w-10 h-10 text-[#59C749] mx-auto" />
                    <p className="text-xs text-[#142618] font-bold">Upload PDF document or prescription image</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#59C749] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#4EBD3E] cursor-pointer"
                    >
                      Select File (.pdf / .png / .jpg)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODE C: DEMO PRESETS PREVIEW */}
            {scanMode === 'preset' && !capturedImage && (
              <div className="w-full max-w-xs p-4 bg-white/95 border border-[#E2DCBE] rounded-xl text-left space-y-2 font-mono text-[11px] text-[#142618] z-10 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-1.5">
                  <span className="font-bold text-[#142618] text-xs">{activePreset.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FFFDF1] border border-[#E2DCBE] text-[9px] text-[#526857]">{activePreset.type}</span>
                </div>
                <pre className="text-[10px] text-[#526857] whitespace-pre-wrap font-mono max-h-32 overflow-hidden leading-relaxed">
                  {activePreset.rawText}
                </pre>
              </div>
            )}

            {/* Hidden Canvas for Canvas Snapshot */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Control Trigger Bar */}
            <div className="absolute bottom-4 z-40 flex items-center gap-3">
              {scanMode === 'webcam' && !capturedImage && isCameraActive && (
                <button
                  onClick={handleCaptureSnapshot}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#59C749] hover:bg-[#4EBD3E] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Aperture className="w-4 h-4" /> Capture & Scan Document
                </button>
              )}

              {capturedImage && (
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F7F4E1] text-[#142618] font-bold text-xs rounded-xl border border-[#E2DCBE] shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#59C749]" /> Retake / Scan Another
                </button>
              )}

              {scanMode === 'preset' && !capturedImage && (
                <div className="flex items-center gap-2">
                  {SAMPLE_OCR_TEMPLATES.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleScanPreset(preset)}
                      disabled={isScanning}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        activePreset.id === preset.id
                          ? 'bg-[#59C749] text-white border-[#59C749] shadow-xs'
                          : 'bg-white border-[#E2DCBE] text-[#526857] hover:bg-[#F7F4E1]'
                      }`}
                    >
                      Scan {preset.type === 'PRESCRIPTION' ? 'Prescription' : 'Lab Report'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Extracted OCR Entities & Raw Text Inspector (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold text-[#526857] uppercase tracking-wider block">
            2. Extracted Document Intelligence & OCR Text
          </span>

          {isScanning ? (
            <div className="p-8 rounded-2xl bg-[#FFFDF1] border border-[#E2DCBE] flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <RefreshCw className="w-8 h-8 text-[#59C749] animate-spin" />
              <p className="text-xs font-bold text-[#142618]">Reading Document Text & PDF Streams...</p>
              <div className="w-48 bg-[#E2DCBE] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#59C749] h-full transition-all duration-300"
                  style={{ width: `${ocrProgress || 30}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#2B8A1E] font-bold">{ocrProgress || 30}% Completed</span>
            </div>
          ) : scannedDoc ? (
            <div className="p-5 rounded-2xl bg-[#FFFDF1] border border-[#E2DCBE] space-y-4 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-[#E2DCBE] pb-3">
                <span className="font-bold text-sm text-[#142618] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2B8A1E]" /> {scannedDoc.docType} Digitized Entities
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#59C749]/15 border border-[#59C749]/30 text-[#142618] text-[11px] font-mono font-bold">
                    ⚡ {scannedDoc.confidenceScore || 90}% AI Confidence
                  </span>
                  <span className="text-xs text-[#526857] font-mono">Date: {scannedDoc.date}</span>
                </div>
              </div>

              {/* Extracted Vitals Written on Paper */}
              {scannedDoc.vitalsFromDoc && Object.keys(scannedDoc.vitalsFromDoc).length > 0 && (
                <div className="space-y-2 p-3 bg-white border border-[#E2DCBE] rounded-xl">
                  <span className="text-xs font-bold text-[#142618] uppercase tracking-wider block flex items-center gap-1.5">
                    🩺 Extracted Vitals (Written on Document)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {scannedDoc.vitalsFromDoc.blood_pressure && (
                      <div className="bg-[#FFFDF1] p-2 rounded-lg border border-[#E2DCBE]">
                        <span className="text-[#526857] block text-[10px]">Blood Pressure</span>
                        <span className="font-bold text-[#142618]">{scannedDoc.vitalsFromDoc.blood_pressure}</span>
                      </div>
                    )}
                    {scannedDoc.vitalsFromDoc.pulse_rate && (
                      <div className="bg-[#FFFDF1] p-2 rounded-lg border border-[#E2DCBE]">
                        <span className="text-[#526857] block text-[10px]">Pulse Rate</span>
                        <span className="font-bold text-[#142618]">{scannedDoc.vitalsFromDoc.pulse_rate}</span>
                      </div>
                    )}
                    {scannedDoc.vitalsFromDoc.spo2_percent && (
                      <div className="bg-[#FFFDF1] p-2 rounded-lg border border-[#E2DCBE]">
                        <span className="text-[#526857] block text-[10px]">Oxygen (SpO2)</span>
                        <span className="font-bold text-[#2B8A1E]">{scannedDoc.vitalsFromDoc.spo2_percent}</span>
                      </div>
                    )}
                    {scannedDoc.vitalsFromDoc.temperature && (
                      <div className="bg-[#FFFDF1] p-2 rounded-lg border border-[#E2DCBE]">
                        <span className="text-[#526857] block text-[10px]">Temperature</span>
                        <span className="font-bold text-amber-800">{scannedDoc.vitalsFromDoc.temperature}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extracted Written Clinical Notes & Doctor Advice */}
              {scannedDoc.clinicalNotes?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                    Written Clinical Notes & OPD Impressions
                  </span>
                  <div className="space-y-1.5">
                    {scannedDoc.clinicalNotes.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                        📝 {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Active Medications */}
              {scannedDoc.medications?.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#142618] uppercase tracking-wider block">
                    Prescribed Active Medications Extracted
                  </span>
                  <div className="space-y-2">
                    {scannedDoc.medications.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-[#E2DCBE] flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-[#59C749]/15 text-[#2B8A1E] font-bold text-xs">
                            💊
                          </span>
                          <div>
                            <span className="font-bold text-[#142618]">{m.name} {m.dosage}</span>
                            <span className="text-[#526857] block text-[11px]">{m.frequency} ({m.duration})</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#59C749]/15 border border-[#59C749]/30 text-[#2B8A1E] rounded text-[10px] font-mono font-bold">
                          ACTIVE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-white border border-[#E2DCBE] text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <AlertCircle className="w-4 h-4" /> No specific medication patterns detected in scanned text
                  </div>
                  <p className="text-[#526857] text-[11px]">
                    You can view the raw scanned text below or edit/paste your prescription text directly to extract entities instantly.
                  </p>
                </div>
              )}

              {/* Extracted Lab Values */}
              {scannedDoc.investigations?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#142618] uppercase tracking-wider block">
                    Pathology Laboratory Findings
                  </span>
                  <div className="space-y-2">
                    {scannedDoc.investigations.map((l, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-[#E2DCBE] flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#142618]">{l.testName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#142618] font-bold">{l.value}</span>
                          {l.isAbnormal && (
                            <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded text-[10px]">
                              {l.flag}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RAW SCANNED TEXT INSPECTOR & MANUAL EDIT BOX */}
              <div className="pt-3 border-t border-[#E2DCBE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#526857] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#59C749]" /> Scanned Document Text (OCR Stream)
                  </span>
                  <button
                    onClick={() => setIsEditingText(!isEditingText)}
                    className="text-[11px] font-bold text-[#2B8A1E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> {isEditingText ? 'Hide Editor' : 'Edit / Paste Text'}
                  </button>
                </div>

                {isEditingText ? (
                  <div className="space-y-2">
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Paste or type prescription text here (e.g. Tab Lisinopril 10mg once daily...)"
                      className="w-full bg-white border border-[#DED7BD] rounded-xl p-3 text-xs text-[#142618] font-mono focus:outline-none focus:border-[#59C749] focus:ring-1 focus:ring-[#59C749] h-28"
                    />
                    <button
                      onClick={handleParseManualText}
                      className="px-4 py-2 bg-[#59C749] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#4EBD3E] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" /> Parse Prescription Text Now
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white border border-[#E2DCBE] font-mono text-[11px] text-[#142618] max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {scannedDoc.rawText || manualText || 'No text extracted from document file yet.'}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
