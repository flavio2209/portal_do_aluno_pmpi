
import React, { useState, useEffect, useRef } from 'react';
import { User, AccessProfile, Permission, DocumentRequest, Notice, SyncLog, IntegrationStatus } from '../types.ts';
import { MOCK_DASHBOARD, MOCK_ADMIN_REQUESTS } from '../services/mockData.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'integration'>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);

  const handleStartSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const steps = [
      "Conectando ao i-Educar...",
      "Sincronizando Alunos...",
      "Obtendo notas do i-Diário...",
      "Processando Frequência...",
      "Finalizado!"
    ];
    for(let i=0; i<steps.length; i++) {
      setSyncLogs(p => [...p, { id: Math.random().toString(), timestamp: new Date().toLocaleTimeString(), message: steps[i], type: 'info' }]);
      setSyncProgress(((i+1)/steps.length)*100);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 bg-white p-2 rounded-2xl border border-gray-100 w-fit">
        <button onClick={() => setActiveSubTab('dashboard')} className={`px-4 py-2 rounded-xl text-xs font-bold ${activeSubTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400'}`}>Resumo</button>
        <button onClick={() => setActiveSubTab('integration')} className={`px-4 py-2 rounded-xl text-xs font-bold ${activeSubTab === 'integration' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400'}`}>Sincronização</button>
      </div>

      {activeSubTab === 'integration' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Integração i-Educar</h3>
            <button onClick={handleStartSync} disabled={isSyncing} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[10px] text-indigo-400 h-64 overflow-y-auto">
            {syncLogs.map(l => <div key={l.id} className="mb-1">[{l.timestamp}] {l.message}</div>)}
          </div>
        </div>
      )}

      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Carga de Dados</h4>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[{n: 'Alunos', v: 1240}, {n: 'Notas', v: 5600}, {n: 'Faltas', v: 3200}]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="n" fontSize={10} axisLine={false} tickLine={false} />
                     <Bar dataKey="v" fill="#6366f1" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Status da API</p>
              <p className="text-green-500 font-black text-2xl tracking-tighter">ONLINE</p>
              <p className="text-gray-400 text-[10px] mt-2 italic">v2.5.4-stable</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
