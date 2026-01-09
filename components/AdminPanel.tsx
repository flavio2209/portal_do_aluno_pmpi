
import React, { useState, useEffect, useRef } from 'react';
import { User, AccessProfile, Permission, DocumentRequest, Notice, SyncLog, IntegrationStatus } from '../types';
import { MOCK_DASHBOARD, MOCK_ADMIN_REQUESTS } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AVAILABLE_PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  { id: 'view_grades', label: 'Visualizar Notas', description: 'Ver boletim e histórico.' },
  { id: 'edit_grades', label: 'Lançar Notas', description: 'Editar dados no i-Diário.' },
  { id: 'manage_users', label: 'Gerenciar Usuários', description: 'Controle de contas e acessos.' },
  { id: 'manage_notices', label: 'Publicar Avisos', description: 'Enviar comunicados no portal.' },
  { id: 'approve_documents', label: 'Aprovar Documentos', description: 'Liberar documentos da secretaria.' },
  { id: 'view_reports', label: 'Acessar Relatórios', description: 'Dados e estatísticas escolares.' },
];

const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'users' | 'profiles' | 'requests' | 'notices' | 'integration'>('dashboard');
  
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin Principal', email: 'admin@escola.com', role: 'admin', profileId: 'p3' },
    { id: '2', name: 'Guilherme Silva Santos', email: 'aluno@escola.com', role: 'student', registration: '2024.0001.0023' },
    { id: '4', name: 'Ricardo Nunes', email: 'ricardo.docente@escola.com', role: 'admin', profileId: 'p2' },
  ]);
  const [profiles, setProfiles] = useState<AccessProfile[]>([
    { id: 'p1', name: 'Secretaria Geral', sector: 'Administrativo', permissions: ['manage_users', 'approve_documents'] },
    { id: 'p2', name: 'Corpo Docente', sector: 'Pedagógico', permissions: ['view_grades', 'edit_grades', 'manage_notices'] },
    { id: 'p3', name: 'Diretoria', sector: 'Gestão', permissions: ['view_reports', 'manage_users', 'manage_notices'] },
  ]);
  const [requests, setRequests] = useState<DocumentRequest[]>(MOCK_ADMIN_REQUESTS);
  const [notices, setNotices] = useState<Notice[]>(MOCK_DASHBOARD.notices);

  const [integration, setIntegration] = useState<IntegrationStatus>({
    lastSync: '18/05/2024 10:30',
    status: 'online',
    apiVersion: 'v2.5.4'
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [syncLogs]);

  const addLog = (message: string, type: SyncLog['type'] = 'info') => {
    setSyncLogs(prev => [...prev, {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const handleStartSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncLogs([]);
    
    const steps = [
      { msg: 'Iniciando conexão com i-Educar Core...', p: 10, type: 'info' as const },
      { msg: 'Handshake de segurança validado.', p: 20, type: 'success' as const },
      { msg: 'Mapeando tabelas de Matrícula e Alunos...', p: 35, type: 'info' as const },
      { msg: 'Baixando registros (1.240 alunos encontrados)...', p: 50, type: 'info' as const },
      { msg: 'Sincronizando i-Diário: Notas do 2º Bimestre...', p: 70, type: 'info' as const },
      { msg: 'Processando Frequências e Ocorrências...', p: 85, type: 'info' as const },
      { msg: 'Limpando cache e finalizando persistência...', p: 95, type: 'info' as const },
      { msg: 'Sincronização concluída com sucesso!', p: 100, type: 'success' as const },
    ];

    for (const step of steps) {
      addLog(step.msg, step.type);
      setSyncProgress(step.p);
      await new Promise(r => setTimeout(r, 600));
    }

    setIntegration({ ...integration, lastSync: new Date().toLocaleString(), status: 'online' });
    setIsSyncing(false);
  };

  const generatePDFReport = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      const reportContent = `RELATÓRIO DE GESTÃO - EDUCONNECT\nData: ${new Date().toLocaleDateString()}\nStatus: ${integration.status}\nUltima Sinc: ${integration.lastSync}`;
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_Sync_${Date.now()}.pdf`;
      link.click();
      setIsGeneratingPDF(false);
    }, 1500);
  };

  const handleSaveUser = (e: React.FormEvent) => { e.preventDefault(); setShowUserModal(false); };
  const confirmUpload = () => { let p = 0; const inv = setInterval(() => { p += 25; setUploadProgress(p); if (p >= 100) { clearInterval(inv); setShowProcessModal(false); } }, 200); };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
          {[
            { id: 'dashboard', label: 'Resumo', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z' },
            { id: 'integration', label: 'Integração', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'users', label: 'Usuários', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z' },
            { id: 'requests', label: 'Documentos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeSubTab === 'dashboard' && (
          <button onClick={generatePDFReport} disabled={isGeneratingPDF} className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black bg-rose-600 text-white hover:bg-rose-700 shadow-lg disabled:opacity-50">
            <svg className={`w-5 h-5 ${isGeneratingPDF ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>{isGeneratingPDF ? 'Gerando...' : 'Relatório PDF'}</span>
          </button>
        )}
      </div>

      {activeSubTab === 'integration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black mb-6">Configurar Conexão</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Endpoint i-Educar</label>
                  <input className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold bg-gray-50" defaultValue="https://api.ieducar.escola.gov.br/v1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Token de Acesso</label>
                  <input type="password" placeholder="••••••••••••••••" className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold bg-gray-50" />
                </div>
                <div className="pt-4">
                  <button className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">Testar Conexão</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black">Processador de Dados</h3>
                <p className="text-sm text-gray-500">Sincronize alunos, notas e faltas do i-Educar e i-Diário.</p>
              </div>
              <button onClick={handleStartSync} disabled={isSyncing} className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}>
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </button>
            </div>
            {isSyncing && (
              <div className="mb-6 animate-in fade-in">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${syncProgress}%` }} />
                </div>
              </div>
            )}
            <div className="flex-1 bg-slate-900 rounded-[32px] p-6 font-mono text-[11px] overflow-y-auto shadow-inner border border-slate-800">
                <div className="space-y-1.5">
                  {syncLogs.map(log => (
                    <div key={log.id} className="flex space-x-3">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={`${log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-rose-400' : 'text-indigo-300'}`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'dashboard' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Usuários Totais</h4>
              <div className="text-3xl font-black text-indigo-600">{users.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Status i-Educar</h4>
              <div className="text-emerald-600 font-black">CONECTADO</div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-8">Atividade de Carga</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Alunos', value: 1240 },
                    { name: 'Notas', value: 5600 },
                    { name: 'Faltas', value: 3200 },
                    { name: 'Docs', value: 450 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
