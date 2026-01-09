
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import InstallationWizard from './components/InstallationWizard';
import { MOCK_DASHBOARD, MOCK_ADMIN_REQUESTS } from './services/mockData';
import { getEducationalAdvice } from './services/geminiService';
import { Role, DocumentRequest } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const App: React.FC = () => {
  // Simulação de check de instalação (Em produção verificaria um arquivo config.json ou .env)
  const [isInstalled, setIsInstalled] = useState(() => {
    return localStorage.getItem('educonnect_installed') === 'true';
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>('student');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiAdvice, setAiAdvice] = useState<string>('Carregando análise da IA...');
  
  const pendingRequestsCount = MOCK_ADMIN_REQUESTS.filter(r => r.status === 'pending').length;

  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      const fetchAdvice = async () => {
        const advice = await getEducationalAdvice(MOCK_DASHBOARD.student.name, MOCK_DASHBOARD.subjects);
        setAiAdvice(advice || "");
      };
      fetchAdvice();
    }
  }, [isAuthenticated, userRole]);

  const handleLogin = (role: Role, email: string) => {
    setUserRole(role);
    setUserEmail(email);
    setIsAuthenticated(true);
    setActiveTab(role === 'admin' ? 'admin-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('student');
    setUserEmail('');
  };

  const handleInstallComplete = () => {
    localStorage.setItem('educonnect_installed', 'true');
    setIsInstalled(true);
  };

  // Se não estiver instalado, mostra o Wizard
  if (!isInstalled) {
    return <InstallationWizard onComplete={handleInstallComplete} />;
  }

  // Se não estiver logado, mostra Login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const getStatusConfig = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'ready': return { label: 'Pronto', color: 'bg-green-100 text-green-700 border-green-200', icon: 'M5 13l4 4L19 7' };
      case 'pending': return { label: 'Pendente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'rejected': return { label: 'Rejeitado', color: 'bg-red-100 text-red-700 border-red-200', icon: 'M6 18L18 6M6 6l12 12' };
      case 'processing': return { label: 'Processando', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' };
      default: return { label: 'Status', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '' };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white h-20 border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'dashboard' && 'Visão Geral'}
              {activeTab === 'grades' && 'Notas e Frequência'}
              {activeTab === 'notices' && 'Central de Avisos'}
              {activeTab === 'requests' && 'Documentação'}
              {activeTab === 'admin-dashboard' && 'Portal Administrativo i-Educar'}
            </h2>
            <p className="text-sm text-gray-500 hidden sm:block">
              {userRole === 'admin' ? 'Controle de Secretaria e Pedagógico' : 'Portal do Aluno e Responsável'}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            {userRole === 'admin' && (
              <div className="relative cursor-pointer group">
                <div className={`p-2 rounded-xl transition-all ${pendingRequestsCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center">
                    {pendingRequestsCount}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-4 border-l pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">
                  {userRole === 'admin' ? 'Administrador' : MOCK_DASHBOARD.student.name}
                </p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
                {userRole === 'admin' ? 'AD' : 'AL'}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {userRole === 'admin' ? (
            activeTab === 'admin-dashboard' ? <AdminPanel /> : <div className="text-center py-20 text-gray-400 font-medium italic">Selecione uma opção no menu lateral...</div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                      <div className="bg-green-100 p-4 rounded-xl text-green-600"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                      <div><p className="text-sm text-gray-500 font-medium">Média Global</p><p className="text-2xl font-bold text-gray-900">7.8</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                      <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                      <div><p className="text-sm text-gray-500 font-medium">Frequência</p><p className="text-2xl font-bold text-gray-900">94%</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                      <div className="bg-orange-100 p-4 rounded-xl text-orange-600"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
                      <div><p className="text-sm text-gray-500 font-medium">Avisos</p><p className="text-2xl font-bold text-gray-900">2</p></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100">
                      <h3 className="text-lg font-bold mb-6">Notas por Bimestre</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={MOCK_DASHBOARD.subjects}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="grades.bimester1" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="grades.bimester2" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col justify-center">
                      <h3 className="text-indigo-900 font-bold mb-4 flex items-center"><span className="mr-2">✨</span> Análise da IA</h3>
                      <p className="text-indigo-800 italic leading-relaxed">"{aiAdvice}"</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'grades' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Boletim do Aluno</h3>
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Imprimir Oficial</button>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <tr><th className="px-8 py-5">Disciplina</th><th className="px-8 py-5">1º Bim</th><th className="px-8 py-5">2º Bim</th><th className="px-8 py-5">Faltas</th><th className="px-8 py-5">Situação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_DASHBOARD.subjects.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-8 py-5 font-bold">{s.name}</td>
                          <td className="px-8 py-5 text-indigo-600 font-black">{s.grades.bimester1}</td>
                          <td className="px-8 py-5 text-indigo-600 font-black">{s.grades.bimester2 || '-'}</td>
                          <td className="px-8 py-5 font-medium">{100 - s.attendance}%</td>
                          <td className="px-8 py-5"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Frequente</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'notices' && (
                <div className="space-y-6">
                  {MOCK_DASHBOARD.notices.map(notice => (
                    <div key={notice.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">{notice.type}</span>
                        <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 mb-2">{notice.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{notice.content}</p>
                      <div className="mt-6 pt-6 border-t border-gray-50 text-xs font-bold text-indigo-600">{notice.sender}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-black mb-8">Solicitar Novo Documento</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {['Declaração de Matrícula', 'Histórico Escolar', 'Atestado Frequência', 'Passe Escolar'].map(doc => (
                        <button key={doc} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <span className="font-bold text-sm block">{doc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-black mb-8">Meus Documentos</h3>
                    <div className="space-y-4">
                      {MOCK_DASHBOARD.requests.map(req => {
                        const config = getStatusConfig(req.status);
                        return (
                          <div key={req.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} /></svg>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{req.type}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{req.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-tighter ${config.color}`}>
                                {config.label}
                              </span>
                              {req.status === 'ready' && (
                                <button className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
