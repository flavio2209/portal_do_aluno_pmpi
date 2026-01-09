
import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import InstallationWizard from './components/InstallationWizard';
import { MOCK_DASHBOARD, MOCK_ADMIN_REQUESTS } from './services/mockData';
import { getEducationalAdvice } from './services/geminiService';
import { Role, DocumentRequest } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>('student');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiAdvice, setAiAdvice] = useState<string>('Analisando desempenho com IA...');

  useEffect(() => {
    // Check installation status
    const installed = localStorage.getItem('educonnect_installed') === 'true';
    setIsInstalled(installed);
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      getEducationalAdvice(MOCK_DASHBOARD.student.name, MOCK_DASHBOARD.subjects)
        .then(advice => setAiAdvice(advice || "Continue focado nos seus estudos!"))
        .catch(() => setAiAdvice("Análise indisponível no momento."));
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

  if (isInstalled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isInstalled) {
    return <InstallationWizard onComplete={handleInstallComplete} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const pendingRequestsCount = MOCK_ADMIN_REQUESTS.filter(r => r.status === 'pending').length;

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
          <Suspense fallback={<div className="p-10 text-center">Carregando módulo...</div>}>
            {userRole === 'admin' ? (
              activeTab === 'admin-dashboard' ? <AdminPanel /> : <div className="text-center py-20 text-gray-400">Selecione uma opção administrativa.</div>
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
                              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                              <Tooltip />
                              <Bar dataKey="grades.bimester1" name="1º Bimestre" fill="#6366f1" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="grades.bimester2" name="2º Bimestre" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col justify-center">
                        <h3 className="text-indigo-900 font-bold mb-4 flex items-center"><span className="mr-2">✨</span> Análise da IA (Gemini)</h3>
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
                    <div className="overflow-x-auto">
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
                  </div>
                )}

                {/* Demais Abas permanecem conforme lógica anterior */}
              </>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;
