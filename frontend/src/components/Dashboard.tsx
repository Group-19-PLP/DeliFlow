import { useState, useEffect } from 'react';

interface Delivery {
  id: number;
  customer_name: string;
  delivery_address: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';
  rider_id: number | null;
}

export default function Dashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const fetchOperationalState = async () => {
    try {
      const response = await fetch('/api/deliveries');
      if (!response.ok) throw new Error('Backend tracking cluster unreachable');
      const data = await response.json();
      setDeliveries(data);
      setNetworkError(null); // Clear any existing connection alerts on successful sync
    } catch (err: any) {
      setNetworkError('Sync interrupted. Retrying in 10s... Check connection.');
    }
  };

  useEffect(() => {
    // Immediate execution upon dashboard window initialization
    fetchOperationalState();

    // Establishes a predictable 10-second polling loop interval
    const schedulerId = setInterval(fetchOperationalState, 10000);

    // Completely destroys background timers if the user navigates away or logs out
    return () => clearInterval(schedulerId);
  }, []);

  return (
    <div className="space-y-4">
      {networkError && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-3 text-rose-900 font-medium text-sm rounded animate-pulse">
          ⚠️ {networkError}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Live Delivery Active Feed</h3>
        {deliveries.length === 0 ? (
          <p className="text-gray-400 text-sm">No active dispatch entries logged in system tracking registry.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {deliveries.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">#{item.id}</span>
                  <span className="font-semibold text-gray-900">{item.customer_name}</span>
                  <p className="text-xs text-gray-500">{item.delivery_address}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  item.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                  item.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'PICKED_UP' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
