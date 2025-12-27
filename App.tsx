
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { MOCK_DASHBOARD } from './services/mockData';
import { getEducationalAdvice } from './services/geminiService';
import { Role, DocumentRequest } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>('student');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiAdvice, setAiAdvice] = useState<string>('Carregando análise da IA...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const getStatusConfig = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'ready':
        return { label: 'Pronto', color: 'bg-green-100 text-green-700 border-green-200', icon: 'M5 13l4 4L19 7' };
      case 'pending':
        return { label: 'Pendente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'rejected':
        return { label: 'Rejeitado', color: 'bg-red-100 text-red-700 border-red-200', icon: 'M6 18L18 6M6 6l12 12' };
      default:
        return { label: 'Desconhecido', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '' };
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-xl">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Média Global</p>
            <p className="text-2xl font-bold text-gray-900">7.8</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Frequência</p>
            <p className="text-2xl font-bold text-gray-900">94%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-orange-100 p-4 rounded-xl">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avisos Novos</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Desempenho por Matéria</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DASHBOARD.subjects}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="grades.bimester1" fill="#6366f1" radius={[4, 4, 0, 0]} name="1º Bim" />
                <Bar dataKey="grades.bimester2" fill="#a5b4fc" radius={[4, 4, 0, 0]} name="2º Bim" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-indigo-200">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
          </div>
          <h3 className="text-indigo-900 font-bold text-lg mb-2">✨ Análise da IA Educativa</h3>
          <p className="text-indigo-800 leading-relaxed text-sm italic">"{aiAdvice}"</p>
        </div>
      </div>
    </div>
  );

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
            <p className="text-sm text-gray-500">
              {userRole === 'admin' ? 'Painel de Controle Escolar' : 'Portal do Aluno e Responsável'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">
                {userRole === 'admin' ? 'Administrador i-Educar' : MOCK_DASHBOARD.student.name}
              </p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
              {userRole === 'admin' ? 'A' : 'G'}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {userRole === 'admin' ? (
            activeTab === 'admin-dashboard' ? <AdminPanel /> : <div className="text-center py-20 text-gray-400 font-medium">Módulo em desenvolvimento...</div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'grades' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Boletim Eletrônico</h3>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">Baixar PDF</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Disciplina</th>
                          <th className="px-6 py-4 text-center">1º Bim</th>
                          <th className="px-6 py-4 text-center">2º Bim</th>
                          <th className="px-6 py-4 text-center">Frequência</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {MOCK_DASHBOARD.subjects.map(subject => (
                          <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900">{subject.name}</td>
                            <td className="px-6 py-4 text-center text-indigo-600 font-bold">{subject.grades.bimester1}</td>
                            <td className="px-6 py-4 text-center text-indigo-600 font-bold">{subject.grades.bimester2 || '-'}</td>
                            <td className="px-6 py-4 text-center font-medium">{subject.attendance}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === 'notices' && (
                <div className="space-y-4">
                  {MOCK_DASHBOARD.notices.map(notice => (
                    <div key={notice.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{notice.type}</span>
                        <span className="text-xs text-gray-400">{notice.date}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{notice.title}</h4>
                      <p className="text-gray-600 mt-2">{notice.content}</p>
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center space-x-2 text-xs text-indigo-600 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>{notice.sender}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'requests' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Solicitar Novo Documento
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'Declaração de Matrícula', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        { name: 'Histórico Escolar', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                        { name: 'Atestado de Frequência', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { name: 'Passe Escolar', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' }
                      ].map(doc => (
                        <button key={doc.name} className="p-5 border border-gray-100 rounded-3xl text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex flex-col justify-between h-40 bg-gray-50">
                          <div className="bg-white p-3 rounded-2xl w-fit shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-indigo-700">{doc.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-1">Clique para solicitar</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Minhas Solicitações Atuais
                    </h3>
                    <div className="space-y-4">
                      {MOCK_DASHBOARD.requests.length > 0 ? (
                        MOCK_DASHBOARD.requests.map((req) => {
                          const config = getStatusConfig(req.status);
                          return (
                            <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <div className={`p-3 rounded-2xl ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">{req.type}</h4>
                                  <p className="text-xs text-gray-500">Solicitado em: {req.date}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${config.color}`}>
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                                  </svg>
                                  <span>{config.label}</span>
                                </div>

                                {req.status === 'ready' && (
                                  <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>Download</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12 text-gray-400">
                          <p>Nenhuma solicitação encontrada.</p>
                        </div>
                      )}
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
