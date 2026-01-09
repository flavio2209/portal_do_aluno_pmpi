
import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Login from './components/Login.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import InstallationWizard from './components/InstallationWizard.tsx';
import { MOCK_DASHBOARD, MOCK_ADMIN_REQUESTS } from './services/mockData.ts';
import { getEducationalAdvice } from './services/geminiService.ts';
import { Role } from './types.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const App: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>('student');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiAdvice, setAiAdvice] = useState<string>('Analisando desempenho...');

  useEffect(() => {
    try {
      const installed = localStorage.getItem('educonnect_installed') === 'true';
      setIsInstalled(installed);
    } catch (e) {
      console.error("Erro localStorage:", e);
      setIsInstalled(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      getEducationalAdvice(MOCK_DASHBOARD.student.name, MOCK_DASHBOARD.subjects)
        .then(advice => setAiAdvice(advice || "Continue focado nos estudos!"))
        .catch(() => setAiAdvice("Análise temporariamente indisponível."));
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isInstalled) {
    return <InstallationWizard onComplete={handleInstallComplete} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

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
              {activeTab === 'admin-dashboard' && 'Gestão Administrativa'}
            </h2>
            <p className="text-xs text-gray-400 hidden sm:block">Portal EduConnect | Integrado ao i-Educar</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{userRole === 'admin' ? 'Administrador' : MOCK_DASHBOARD.student.name}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{userRole}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                {userRole === 'admin' ? 'AD' : 'AL'}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-10 text-center text-gray-400">Carregando conteúdo...</div>}>
            {userRole === 'admin' ? (
              <AdminPanel />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="bg-green-50 p-4 rounded-xl text-green-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase">Média Geral</p><p className="text-xl font-black text-gray-900">7.8</p></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase">Frequência</p><p className="text-xl font-black text-gray-900">94%</p></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="bg-orange-50 p-4 rounded-xl text-orange-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase">Novos Avisos</p><p className="text-xl font-black text-gray-900">2</p></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-8 rounded-3xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Desempenho por Bimestre</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_DASHBOARD.subjects}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                              <Bar dataKey="grades.bimester1" name="1º Bim" fill="#6366f1" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="grades.bimester2" name="2º Bim" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-2xl">🤖</span>
                          <h3 className="font-black text-lg">Sugestão da IA</h3>
                        </div>
                        <p className="text-indigo-100 italic leading-relaxed text-sm">"{aiAdvice}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'grades' && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <div>
                        <h3 className="text-lg font-bold">Boletim Escolar</h3>
                        <p className="text-xs text-gray-400">Ano Letivo 2024</p>
                      </div>
                      <button className="bg-white text-gray-700 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 shadow-sm hover:bg-gray-50">Baixar PDF</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <tr><th className="px-8 py-5">Disciplina</th><th className="px-8 py-5">1º Bim</th><th className="px-8 py-5">2º Bim</th><th className="px-8 py-5">Freq.</th><th className="px-8 py-5">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {MOCK_DASHBOARD.subjects.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5"><p className="font-bold text-gray-900">{s.name}</p><p className="text-[10px] text-gray-400">{s.teacher}</p></td>
                              <td className="px-8 py-5 font-black text-indigo-600">{s.grades.bimester1}</td>
                              <td className="px-8 py-5 font-black text-indigo-600">{s.grades.bimester2 || '-'}</td>
                              <td className="px-8 py-5 font-medium text-gray-500">{s.attendance}%</td>
                              <td className="px-8 py-5"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-bold">APROVADO</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;
