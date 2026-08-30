import React, { useState, useEffect } from 'react';

type Role = 'RETAILER' | 'DISPATCHER' | 'RIDER';
type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';

interface Delivery {
  id: number;
  customer_name: string;
  delivery_address: string;
  status: DeliveryStatus;
  rider_id: number | null;
}

const API_BASE = '';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('RETAILER');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<number | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // Form state for retailer
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    itemDescription: ''
  });

  // Fetch deliveries on mount
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setDeliveries(data);
    } catch (err) {
      console.error('Failed to fetch deliveries:', err);
      setMessage('❌ Failed to load deliveries: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDispatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('API_BASE:', API_BASE);
      console.log('Sending request to:', `${API_BASE}/api/deliveries`);
      
      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          delivery_address: formData.deliveryAddress,
          item_description: formData.itemDescription
        })
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        setMessage('✅ Delivery request dispatched successfully!');
        setFormData({ customerName: '', customerPhone: '', deliveryAddress: '', itemDescription: '' });
        await fetchDeliveries();
      } else {
        setMessage(`❌ ${data.error || 'Failed to create delivery request'}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRoute = async () => {
    if (!selectedDeliveryId || !selectedRiderId) {
      setMessage('❌ Please select both delivery and rider');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/deliveries/${selectedDeliveryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ASSIGNED' })
      });

      if (res.ok) {
        setMessage('✅ Route confirmed and rider assigned!');
        setSelectedDeliveryId(null);
        setSelectedRiderId('');
        await fetchDeliveries();
      } else {
        setMessage('❌ Failed to confirm route');
      }
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPickedUp = async (deliveryId: number) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/deliveries/${deliveryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PICKED_UP' })
      });

      if (res.ok) {
        setMessage('✅ Package marked as picked up!');
        await fetchDeliveries();
      } else {
        setMessage('❌ Failed to mark as picked up');
      }
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (deliveryId: number) => {
    if (!verificationCode) {
      setMessage('❌ Please enter verification code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/deliveries/${deliveryId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_code: verificationCode })
      });

      if (res.ok) {
        setMessage('✅ Delivery confirmed and completed!');
        setVerificationCode('');
        await fetchDeliveries();
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error}`);
      }
    } catch (err) {
      setMessage('❌ Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800';
      case 'PICKED_UP': return 'bg-amber-100 text-amber-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar navigation container */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col p-6 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-8">🚚 DeliFlow</h1>
          <nav className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-2">Active View</p>
            <div className="bg-indigo-800 p-3 rounded-lg font-medium">{currentRole} Dashboard</div>
          </nav>
        </div>
        
        {/* Persona toggle panel for team demo presentation sessions */}
        <div className="bg-indigo-950 p-3 rounded-lg border border-indigo-700">
          <label className="block text-xs text-indigo-300 font-bold mb-2">SWITCH ROLE (DEMO ONLY)</label>
          <select 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value as Role)}
            className="w-full bg-indigo-800 text-white rounded p-1 text-sm border-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="RETAILER">Retailer Staff</option>
            <option value="DISPATCHER">Dispatcher Desk</option>
            <option value="RIDER">Motorcycle Rider</option>
          </select>
        </div>
      </aside>

      {/* Main interactive interface canvas */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">{currentRole} Operational Workspace</h2>
        </header>

        {message && (
          <div className={`mb-4 p-3 rounded-lg border ${message.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message}
          </div>
        )}

        {currentRole === 'RETAILER' && (
          <form onSubmit={handleDispatchRequest} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Log New Delivery Request</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Customer Name" 
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
                className="w-full p-2 border border-gray-300 rounded" 
              />
              <input 
                type="text" 
                placeholder="Customer Phone" 
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                required
                className="w-full p-2 border border-gray-300 rounded" 
              />
              <textarea 
                placeholder="Delivery Destination Address" 
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                required
                className="w-full p-2 border border-gray-300 rounded" 
                rows={3} 
              />
              <input 
                type="text" 
                placeholder="Item Package Contents Description" 
                value={formData.itemDescription}
                onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
                required
                className="w-full p-2 border border-gray-300 rounded" 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition"
              >
                {loading ? 'Dispatching...' : 'Dispatch Request'}
              </button>
            </div>
          </form>
        )}

        {currentRole === 'DISPATCHER' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Open Retail Requests Dispatch Queue</h3>
              {deliveries.filter(d => d.status === 'PENDING').map(delivery => (
                <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50 mb-3">
                  <div>
                    <p className="font-bold text-gray-900">Order #{delivery.id} — {delivery.customer_name}</p>
                    <p className="text-sm text-gray-500">To: {delivery.delivery_address}</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Rider ID"
                      value={selectedDeliveryId === delivery.id ? selectedRiderId : ''}
                      onChange={(e) => {
                        setSelectedDeliveryId(delivery.id);
                        setSelectedRiderId(e.target.value);
                      }}
                      className="p-2 border border-gray-300 rounded text-sm w-24"
                    />
                    <button 
                      onClick={() => {
                        setSelectedDeliveryId(delivery.id);
                        handleConfirmRoute();
                      }}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-bold"
                    >
                      {loading && selectedDeliveryId === delivery.id ? 'Confirming...' : 'Confirm Route'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentRole === 'RIDER' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Your Assigned Active Shipments</h3>
              {deliveries.filter(d => d.status === 'ASSIGNED' || d.status === 'PICKED_UP').map(delivery => (
                <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 space-y-4 mb-4">
                  <div>
                    <span className={`${getStatusBadgeColor(delivery.status)} text-xs font-bold px-2 py-1 rounded`}>
                      {delivery.status}
                    </span>
                    <p className="font-bold mt-2 text-gray-900">Order #{delivery.id}</p>
                    <p className="text-sm text-gray-600">{delivery.customer_name}</p>
                    <p className="text-sm text-gray-500">Delivery: {delivery.delivery_address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleMarkPickedUp(delivery.id)}
                      disabled={loading || delivery.status === 'PICKED_UP'}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded font-bold text-sm"
                    >
                      {loading ? 'Updating...' : 'Mark Picked Up'}
                    </button>
                    <div className={delivery.status === 'PICKED_UP' ? '' : 'opacity-50'}>
                      {delivery.status === 'PICKED_UP' ? (
                        <input
                          type="password"
                          placeholder="Verification Code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        />
                      ) : null}
                      <button 
                        onClick={() => handleConfirmDelivery(delivery.id)}
                        disabled={loading || delivery.status !== 'PICKED_UP'}
                        className={`w-full py-2 rounded font-bold text-sm ${
                          delivery.status === 'PICKED_UP' 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {loading ? 'Confirming...' : 'Confirm Delivery'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
