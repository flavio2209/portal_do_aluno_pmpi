
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { MOCK_DASHBOARD } from './services/mockData';
import { getEducationalAdvice } from './services/geminiService';
import { Subject, Notice } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiAdvice, setAiAdvice] = useState<string>('Carregando análise da IA...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await getEducationalAdvice(MOCK_DASHBOARD.student.name, MOCK_DASHBOARD.subjects);
      setAiAdvice(advice || "");
    };
    fetchAdvice();
  }, []);

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
          <div className="absolute top-0 right-0 p-4">
            <svg className="w-12 h-12 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2 .712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-indigo-900 font-bold text-lg mb-2 flex items-center">
            <span className="mr-2">✨</span> Análise da IA Educativa
          </h3>
          <p className="text-indigo-800 leading-relaxed text-sm italic">
            "{aiAdvice}"
          </p>
          <button className="mt-4 text-indigo-700 font-semibold text-sm hover:underline">Ver plano de estudos sugerido →</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Avisos Recentes</h3>
        <div className="space-y-4">
          {MOCK_DASHBOARD.notices.map(notice => (
            <div key={notice.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
              <div className={`p-2 rounded-lg ${notice.type === 'school' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {notice.type === 'school' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900">{notice.title}</h4>
                  <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                <p className="text-xs text-indigo-600 mt-2 font-medium">De: {notice.sender}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGrades = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold">Boletim Escolar Eletrônico</h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          Baixar PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Disciplina</th>
              <th className="px-6 py-4">Professor</th>
              <th className="px-6 py-4 text-center">1º Bim</th>
              <th className="px-6 py-4 text-center">2º Bim</th>
              <th className="px-6 py-4 text-center">Faltas</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_DASHBOARD.subjects.map(subject => (
              <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{subject.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{subject.teacher}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-sm font-semibold ${subject.grades.bimester1! >= 7 ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.grades.bimester1}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-sm font-semibold ${subject.grades.bimester2! >= 7 ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.grades.bimester2}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  {Math.floor((100 - subject.attendance) * 0.2)} aulas
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${subject.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {subject.attendance >= 75 ? 'Frequente' : 'Risco de Reprovação'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6">Solicitar Novo Documento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Declaração de Matrícula', 'Histórico Escolar Parcial', 'Atestado de Frequência', 'Carteirinha Estudantil'].map((doc) => (
            <button key={doc} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
              <span className="font-medium text-gray-700">{doc}</span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Minhas Solicitações</h3>
        <div className="space-y-3">
          {MOCK_DASHBOARD.requests.map(req => (
            <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${req.status === 'ready' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{req.type}</p>
                  <p className="text-xs text-gray-500">Solicitado em: {req.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'ready' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {req.status === 'ready' ? 'Disponível' : 'Em Processamento'}
                </span>
                {req.status === 'ready' && (
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white h-20 border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Visão Geral'}
              {activeTab === 'grades' && 'Notas e Frequência'}
              {activeTab === 'notices' && 'Central de Avisos'}
              {activeTab === 'requests' && 'Documentação e Secretaria'}
            </h2>
            <p className="text-sm text-gray-500">Bem-vindo(a) ao seu portal acadêmico</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{MOCK_DASHBOARD.student.name}</p>
              <p className="text-xs text-gray-500">{MOCK_DASHBOARD.student.grade}</p>
            </div>
            <img src={MOCK_DASHBOARD.student.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm" />
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'grades' && renderGrades()}
          {activeTab === 'notices' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold mb-4">Quadro de Avisos</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {MOCK_DASHBOARD.notices.map(notice => (
                    <div key={notice.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative">
                       <span className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase ${notice.type === 'school' ? 'bg-purple-200 text-purple-700' : 'bg-blue-200 text-blue-700'}`}>
                         {notice.type === 'school' ? 'Geral' : 'Turma'}
                       </span>
                       <h4 className="font-bold text-gray-900 pr-12">{notice.title}</h4>
                       <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-3">{notice.content}</p>
                       <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-indigo-600">{notice.sender}</span>
                          <span className="text-gray-400">{notice.date}</span>
                       </div>
                       <button className="mt-4 w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Ler Mais</button>
                    </div>
                 ))}
               </div>
            </div>
          )}
          {activeTab === 'requests' && renderRequests()}
        </main>
      </div>
    </div>
  );
};

export default App;
