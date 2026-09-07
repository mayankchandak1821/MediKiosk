import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, FileText, Upload, Sparkles, RefreshCw, CheckCircle2, 
  ShieldCheck, Tag, Video, VideoOff, Aperture, RotateCcw, AlertCircle, Edit3, Play
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SAMPLE_OCR_TEMPLATES, ocrEngine } from '../services/ocrEngine';

export default function VisualDocumentScanner({ scannedDoc, onDocScan, language = 'hi' }) {
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
      } else {
        // PDF or non-image document file
        setCapturedImage(null);
        const data = await ocrEngine.processDocumentImage(file, null, (prog) => setOcrProgress(prog));
        if (data?.rawText) setManualText(data.rawText);
        onDocScan(data);
      }
    } catch (err) {
      console.error("File upload OCR error:", err);
    } finally {
      setIsScanning(false);
      setOcrProgress(100);
    }
  };

  // Handle Preset Selection
  const handleScanPreset = async (preset) => {
    setActivePreset(preset);
    setCapturedImage(null);
    try {
      setIsScanning(true);
      setOcrProgress(50);
      const data = await ocrEngine.processDocumentImage(null, preset.id);
      if (data?.rawText) setManualText(data.rawText);
      onDocScan(data);
    } catch (err) {
      console.error("Preset scan error:", err);
    } finally {
      setIsScanning(false);
      setOcrProgress(100);
    }
  };

  // Parse Manually Typed / Edited Text
  const handleParseManualText = () => {
    if (!manualText.trim()) return;
    try {
      setIsScanning(true);
      const data = ocrEngine.transformRawTextToEntities(manualText);
      onDocScan(data);
    } finally {
      setIsScanning(false);
      setOcrProgress(100);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Camera className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Live OCR & PDF Prescription Scanner</h4>
            <p className="text-xs text-slate-400 font-mono text-teal-300">Upload PDF, image, or scan live with camera</p>
          </div>
        </div>

        {/* Scan Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { setScanMode('webcam'); handleRetake(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              scanMode === 'webcam' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Live Camera
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              scanMode === 'upload' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload File/PDF
          </button>
          <button
            onClick={() => setScanMode('preset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              scanMode === 'preset' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Demo Presets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Camera / Captured Image Viewfinder (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            1. Document Camera Viewfinder
          </span>

          <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center p-2 shadow-inner">
            {/* Viewfinder Target Frame Overlay */}
            <div className="absolute inset-4 border-2 border-dashed border-teal-400/50 rounded-xl pointer-events-none z-20 flex flex-col justify-between p-3">
              <div className="flex justify-between text-[10px] text-teal-300 font-mono uppercase bg-slate-950/70 px-2 py-0.5 rounded w-fit">
                <span>[ALIGN DOCUMENT INSIDE FRAME]</span>
              </div>
              <div className="flex justify-between text-[10px] text-teal-300 font-mono uppercase bg-slate-950/70 px-2 py-0.5 rounded w-fit self-end">
                <span>OCR & PDF TEXT PARSER READY</span>
              </div>
            </div>

            {/* Laser Line Scanning Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400 animate-bounce top-1/2 z-30" />
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
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center space-y-2 z-10">
                    <VideoOff className="w-8 h-8 text-slate-500" />
                    <p className="text-xs text-slate-400 font-medium">
                      {cameraError || 'Camera initializing or stream inactive.'}
                    </p>
                    <button
                      onClick={() => setScanMode('preset')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold rounded-lg"
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
                    <Upload className="w-10 h-10 text-teal-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-bold">Upload PDF document or prescription image</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-teal-400"
                    >
                      Select File (.pdf / .png / .jpg)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODE C: DEMO PRESETS PREVIEW */}
            {scanMode === 'preset' && !capturedImage && (
              <div className="w-full max-w-xs p-4 bg-slate-950/90 border border-slate-800 rounded-xl text-left space-y-2 font-mono text-[11px] text-slate-300 z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-teal-300 text-xs">{activePreset.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400">{activePreset.type}</span>
                </div>
                <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono max-h-32 overflow-hidden leading-relaxed">
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
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-xl hover:scale-105 transition-all"
                >
                  <Aperture className="w-4 h-4 animate-spin-slow" /> Capture & Scan Document
                </button>
              )}

              {capturedImage && (
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 shadow-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-400" /> Retake / Scan Another
                </button>
              )}

              {scanMode === 'preset' && !capturedImage && (
                <div className="flex items-center gap-2">
                  {SAMPLE_OCR_TEMPLATES.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleScanPreset(preset)}
                      disabled={isScanning}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        activePreset.id === preset.id
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
                          : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:bg-slate-800'
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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            2. Extracted Document Intelligence & OCR Text
          </span>

          {isScanning ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
              <p className="text-xs font-bold text-slate-200">Reading Document Text & PDF Streams...</p>
              <div className="w-48 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${ocrProgress || 30}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-teal-300 font-bold">{ocrProgress || 30}% Completed</span>
            </div>
          ) : scannedDoc ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-sm text-teal-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {scannedDoc.docType} Digitized Entities
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-bold">
                    ⚡ {scannedDoc.confidenceScore || 90}% AI Confidence
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Date: {scannedDoc.date}</span>
                </div>
              </div>

              {/* Extracted Vitals Written on Paper */}
              {scannedDoc.vitalsFromDoc && Object.keys(scannedDoc.vitalsFromDoc).length > 0 && (
                <div className="space-y-2 p-3 bg-teal-950/30 border border-teal-500/20 rounded-xl">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block flex items-center gap-1.5">
                    🩺 Extracted Vitals (Written on Document)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {scannedDoc.vitalsFromDoc.blood_pressure && (
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                        <span className="font-bold text-teal-300">{scannedDoc.vitalsFromDoc.blood_pressure}</span>
                      </div>
                    )}
                    {scannedDoc.vitalsFromDoc.pulse_rate && (
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Pulse Rate</span>
                        <span className="font-bold text-teal-300">{scannedDoc.vitalsFromDoc.pulse_rate}</span>
                      </div>
                    )}
                    {scannedDoc.vitalsFromDoc.spo2_percent && (
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Oxygen (SpO2)</span>
                        <span className="font-bold text-teal-300">{scannedDoc.vitalsFromDoc.spo2_percent}</span>
                      </div>
                    )}
                    {scannedDoc.vitalsFromDoc.temperature && (
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Temperature</span>
                        <span className="font-bold text-teal-300">{scannedDoc.vitalsFromDoc.temperature}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extracted Written Clinical Notes & Doctor Advice */}
              {scannedDoc.clinicalNotes?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Written Clinical Notes & OPD Impressions
                  </span>
                  <div className="space-y-1.5">
                    {scannedDoc.clinicalNotes.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-medium">
                        📝 {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Active Medications */}
              {scannedDoc.medications?.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                    Prescribed Active Medications Extracted
                  </span>
                  <div className="space-y-2">
                    {scannedDoc.medications.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold text-xs">
                            💊
                          </span>
                          <div>
                            <span className="font-bold text-slate-100">{m.name} {m.dosage}</span>
                            <span className="text-slate-400 block text-[11px]">{m.frequency} ({m.duration})</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-mono font-bold">
                          ACTIVE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <AlertCircle className="w-4 h-4" /> No specific medication patterns detected in scanned text
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    You can view the raw scanned text below or edit/paste your prescription text directly to extract entities instantly.
                  </p>
                </div>
              )}

              {/* Extracted Lab Values */}
              {scannedDoc.investigations?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Pathology Laboratory Findings
                  </span>
                  <div className="space-y-2">
                    {scannedDoc.investigations.map((l, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-200">{l.testName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-100 font-bold">{l.value}</span>
                          {l.isAbnormal && (
                            <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold rounded text-[10px]">
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
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-400" /> Scanned Document Text (OCR Stream)
                  </span>
                  <button
                    onClick={() => setIsEditingText(!isEditingText)}
                    className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-teal-500 h-28"
                    />
                    <button
                      onClick={handleParseManualText}
                      className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-teal-400 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Parse Prescription Text Now
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
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
