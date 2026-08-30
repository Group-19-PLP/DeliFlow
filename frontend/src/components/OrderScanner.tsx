import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
  requestId: number;
  onVerificationComplete: (code: string) => void;
}

export default function OrderScanner({ onVerificationComplete }: ScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    // Initialises camera overlay stream context on component layout mount
    const scanner = new Html5QrcodeScanner(
      "qr-reader-target-canvas",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onVerificationComplete(decodedText);
      },
      (error) => {
        // Suppress verbose scanner engine noise but capture critical camera failures
        if (typeof error === 'string' && error.includes('Permission')) {
          setScanError("Camera access blocked. Please input code manually.");
        }
      }
    );

    // Destroys hardware video capture instances when element layout unmounts
    return () => {
      scanner.clear().catch(err => console.warn("Scanner teardown cleaning note:", err));
    };
  }, [onVerificationComplete]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onVerificationComplete(manualCode.trim());
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Confirm Delivery Order Scan</h4>
      
      {scanError && (
        <p className="text-xs bg-rose-50 text-rose-700 p-2 rounded border border-rose-200">{scanError}</p>
      )}

      {/* Hardware video camera feed layout anchor target */}
      <div id="qr-reader-target-canvas" className="overflow-hidden rounded-lg border border-slate-300 bg-black"></div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-300"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold">OR INPUT MANUALLY</span>
        <div className="flex-grow border-t border-slate-300"></div>
      </div>

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input 
          type="text" 
          placeholder="Enter Delivery Code (e.g. RFX-982)" 
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1 text-sm p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 bg-white"
        />
        <button type="submit" className="bg-slate-800 text-white font-bold px-4 py-2 rounded text-sm hover:bg-slate-900 transition">
          Verify
        </button>
      </form>
    </div>
  );
}
