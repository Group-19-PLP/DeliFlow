import { useState } from 'react';
import OrderScanner from './OrderScanner';

interface TaskProps {
  deliveryId: number;
  customerName: string;
  initialStatus: 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';
}

export default function ActiveRiderTasks({ deliveryId, customerName, initialStatus }: TaskProps) {
  const [status, setStatus] = useState(initialStatus);
  const [showScanner, setShowScanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const transitionToPickedUp = async () => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PICKED_UP' })
      });
      if (!response.ok) throw new Error('State transition rejected by network controller');
      setStatus('PICKED_UP');
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network failure updating order state');
    }
  };

  const handleVerificationScan = async (scannedCodeString: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_code: scannedCodeString })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification token hash mismatch');
      }
      
      setStatus('DELIVERED');
      setShowScanner(false);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification execution halted');
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 max-w-md">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-gray-900">Task for {customerName}</h4>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">ID: #{deliveryId}</span>
      </div>

      {errorMessage && (
        <div className="text-xs bg-rose-50 border border-rose-200 text-rose-700 p-2 rounded">❌ {errorMessage}</div>
      )}

      {status === 'ASSIGNED' && (
        <button onClick={transitionToPickedUp} className="w-full bg-indigo-600 text-white font-bold py-2 rounded text-sm hover:bg-indigo-700 transition">
          Confirm Package Pick Up
        </button>
      )}

      {status === 'PICKED_UP' && !showScanner && (
        <button onClick={() => setShowScanner(true)} className="w-full bg-emerald-600 text-white font-bold py-2 rounded text-sm hover:bg-emerald-700 transition">
          Open Camera Scanner to Deliver
        </button>
      )}

      {status === 'PICKED_UP' && showScanner && (
        <OrderScanner requestId={deliveryId} onVerificationComplete={handleVerificationScan} />
      )}

      {status === 'DELIVERED' && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-center font-bold text-sm">
          ✓ Delivery Completed & Verified
        </div>
      )}
    </div>
  );
}
