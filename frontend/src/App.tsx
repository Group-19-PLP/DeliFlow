import React, { useState } from 'react';

type Role = 'RETAILER' | 'DISPATCHER' | 'RIDER';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('RETAILER');

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar navigation container */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col p-6 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-8">Reflex Control</h1>
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

        {currentRole === 'RETAILER' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Log New Delivery Request</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Customer Name" className="w-full p-2 border border-gray-300 rounded" />
              <input type="text" placeholder="Customer Phone" className="w-full p-2 border border-gray-300 rounded" />
              <textarea placeholder="Delivery Destination Address" className="w-full p-2 border border-gray-300 rounded" rows={3} />
              <input type="text" placeholder="Item Package Contents Description" className="w-full p-2 border border-gray-300 rounded" />
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition">Dispatch Request</button>
            </div>
          </div>
        )}

        {currentRole === 'DISPATCHER' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Open Retail Requests Dispatch Queue</h3>
            <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
              <div>
                <p className="font-bold text-gray-900">Order #1042 — Electronics Hub</p>
                <p className="text-sm text-gray-500">To: Moi Avenue, Nairobi</p>
              </div>
              <div className="flex gap-2">
                <select className="p-2 border border-gray-300 rounded text-sm bg-white">
                  <option>Select Available Rider...</option>
                  <option>Rider Juma (Boda ID: 442)</option>
                  <option>Rider Kamau (Boda ID: 109)</option>
                </select>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">Confirm Route</button>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'RIDER' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Your Assigned Active Shipments</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">ASSIGNED</span>
                <p className="font-bold mt-2 text-gray-900">Pickup: Kamukunji Hardware</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-600 text-white py-2 rounded font-bold text-sm">Mark Picked Up</button>
                <button className="bg-gray-200 text-gray-400 py-2 rounded font-bold text-sm cursor-not-allowed" disabled>Confirm Delivery</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
