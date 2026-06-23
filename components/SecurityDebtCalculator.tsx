import { useState } from 'react';

export function SecurityDebtCalculator() {
  const [endpoints, setEndpoints] = useState(10);
  const RISK_PER_ENDPOINT = 25000;
  const maintenanceCost = endpoints * 150 * 5; 
  const breachRisk = endpoints * RISK_PER_ENDPOINT;
  
  return (
    <div className="p-8 bg-slate-900 text-white rounded-xl border border-violet-500">
      <h3 className="text-2xl font-bold">Security Debt Calculator</h3>
      <input 
        type="range" min="1" max="100" 
        value={endpoints} 
        onChange={(e) => setEndpoints(Number(e.target.value))}
        className="w-full mt-4"
      />
      <div className="mt-6 flex justify-between">
        <span>Public Endpoints: <strong>{endpoints}</strong></span>
        <span>Monthly "Debt": <strong>${(maintenanceCost + breachRisk).toLocaleString()}</strong></span>
      </div>
    </div>
  );
}
