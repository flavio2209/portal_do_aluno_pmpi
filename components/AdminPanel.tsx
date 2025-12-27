
import React, { useState } from 'react';
import { User, Role, AccessProfile, Permission, DocumentRequest, Notice } from '../types';
import { MOCK_DASHBOARD, MOCK_ADMIN_REQUESTS } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AVAILABLE_PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  { id: 'view_grades', label: 'Visualizar Notas', description: 'Ver boletim e histórico.' },
  { id: 'edit_grades', label: 'Lançar Notas', description: 'Editar dados no i-Diário.' },
  { id: 'manage_users', label: 'Gerenciar Usuários', description: 'Controle de contas e acessos.' },
  { id: 'manage_notices', label: 'Publicar Avisos', description: 'Enviar comunicados no portal.' },
  { id: 'approve_documents', label: 'Aprovar Documentos', description: 'Liberar documentos da secretaria.' },
  { id: 'view_reports', label: 'Acessar Relatórios', description: 'Dados e estatísticas escolares.' },
];

const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'users' | 'profiles' | 'requests' | 'notices'>('dashboard');
  
  // States Globais do Admin
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

  // States de Modais
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);

  // States de Edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- HANDLERS USUÁRIOS ---
  const openUserModal = (user?: User) => {
    setEditingId(user?.id || null);
    setFormData(user ? { ...user } : { name: '', email: '', role: 'student', profileId: '' });
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
    } else {
      setUsers([...users, { ...formData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setShowUserModal(false);
  };

  const deleteUser = (id: string) => {
    if (confirm('Deseja excluir este usuário?')) setUsers(users.filter(u => u.id !== id));
  };

  // --- HANDLERS PERFIS ---
  const openProfileModal = (profile?: AccessProfile) => {
    setEditingId(profile?.id || null);
    setFormData(profile ? { ...profile } : { name: '', sector: '', permissions: [] });
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProfiles(profiles.map(p => p.id === editingId ? { ...p, ...formData } : p));
    } else {
      setProfiles([...profiles, { ...formData, id: 'p' + (profiles.length + 1) }]);
    }
    setShowProfileModal(false);
  };

  const deleteProfile = (id: string) => {
    if (confirm('Excluir este perfil? Usuários vinculados perderão permissões.')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  // --- HANDLERS AVISOS ---
  const openNoticeModal = (notice?: Notice) => {
    setEditingId(notice?.id || null);
    setFormData(notice ? { ...notice } : { title: '', content: '', type: 'school', date: new Date().toISOString().split('T')[0], sender: 'Admin' });
    setShowNoticeModal(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setNotices(notices.map(n => n.id === editingId ? { ...n, ...formData } : n));
    } else {
      setNotices([...notices, { ...formData, id: 'n' + Date.now() }]);
    }
    setShowNoticeModal(false);
  };

  const deleteNotice = (id: string) => {
    if (confirm('Excluir aviso?')) setNotices(notices.filter(n => n.id !== id));
  };

  // --- HANDLERS DOCUMENTOS ---
  const handleSendDoc = (reqId: string) => {
    setEditingId(reqId);
    setUploadProgress(0);
    setShowProcessModal(true);
  };

  const confirmUpload = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setRequests(requests.map(r => r.id === editingId ? { ...r, status: 'ready', processedBy: 'Secretaria Central' } : r));
        setTimeout(() => setShowProcessModal(false), 500);
      }
    }, 200);
  };

  const deleteRequest = (id: string) => {
    if (confirm('Remover esta solicitação do sistema?')) setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Navegação Sub-Abas */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {[
          { id: 'dashboard', label: 'Resumo', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
          { id: 'users', label: 'Usuários', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
          { id: 'profiles', label: 'Perfis', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { id: 'requests', label: 'Documentos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { id: 'notices', label: 'Avisos', icon: 'M11 5.882V19.297A8.609 8.609 0 0112 19c2.107 0 4.087.743 5.636 1.986.322.257.864.124.864-.285V4.692c0-.189-.102-.362-.266-.457A12.627 12.627 0 0012 3c-2.107 0-4.087.743-5.636 1.986A.486.486 0 016 5.25v14.335c0 .409.542.542.864.285A8.609 8.609 0 0112 19c.403 0 .794.032 1.177.094' },
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

      {/* --- DASHBOARD VIEW --- */}
      {activeSubTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Usuários</h4>
            <div className="text-3xl font-black text-indigo-600">{users.length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Perfis Ativos</h4>
            <div className="text-3xl font-black text-emerald-600">{profiles.length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Pedidos Pendentes</h4>
            <div className="text-3xl font-black text-rose-600">{requests.filter(r => r.status === 'pending').length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Avisos no Portal</h4>
            <div className="text-3xl font-black text-amber-600">{notices.length}</div>
          </div>
        </div>
      )}

      {/* --- USERS LIST --- */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-900">Gestão de Usuários</h3>
            <button onClick={() => openUserModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">+ Novo Usuário</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Papel</th>
                <th className="px-6 py-4">Perfil</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-indigo-50/20 transition-all">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{u.name}</p>
                    <p className="text-[10px] text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">
                    {profiles.find(p => p.id === u.profileId)?.name || 'Padrão'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openUserModal(u)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button onClick={() => deleteUser(u.id)} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- PROFILES LIST --- */}
      {activeSubTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase">{p.sector}</span>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openProfileModal(p)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => deleteProfile(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
              <h4 className="font-black text-gray-900 mb-2">{p.name}</h4>
              <div className="flex flex-wrap gap-1">
                {p.permissions.map(perm => <span key={perm} className="text-[8px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">{AVAILABLE_PERMISSIONS.find(ap => ap.id === perm)?.label}</span>)}
              </div>
            </div>
          ))}
          <button onClick={() => openProfileModal()} className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 transition-all">+ Novo Perfil</button>
        </div>
      )}

      {/* --- NOTICES LIST --- */}
      {activeSubTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-xl">Comunicados Ativos</h3>
            <button onClick={() => openNoticeModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">+ Novo Aviso</button>
          </div>
          {notices.map(n => (
            <div key={n.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${n.type === 'school' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>{n.type}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{n.date}</span>
                </div>
                <h4 className="font-bold text-gray-900">{n.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-1">{n.content}</p>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <button onClick={() => openNoticeModal(n)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                <button onClick={() => deleteNotice(n.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- REQUESTS LIST --- */}
      {activeSubTab === 'requests' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h3 className="font-bold text-gray-900">Processamento de Documentos i-Educar</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Aluno</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{r.studentName}</p>
                    <p className="text-[10px] text-gray-400">Em {r.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span className="text-xs font-medium text-gray-700">{r.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${r.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {r.status === 'pending' && <button onClick={() => handleSendDoc(r.id)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md shadow-indigo-100">Enviar Arq.</button>}
                    <button onClick={() => deleteRequest(r.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL USUÁRIO --- */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSaveUser} className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
            <div className="space-y-4">
              <input required className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold" placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold" placeholder="E-mail" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <select className="p-3 rounded-xl border border-gray-200 text-sm font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="student">Aluno</option>
                  <option value="parent">Pai/Mãe</option>
                  <option value="admin">Admin</option>
                </select>
                <select className="p-3 rounded-xl border border-gray-200 text-sm font-bold" value={formData.profileId} onChange={e => setFormData({...formData, profileId: e.target.value})}>
                  <option value="">Sem Perfil</option>
                  {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-400">Cancelar</button>
              <button type="submit" className="flex-2 bg-indigo-600 text-white py-3 px-8 rounded-xl text-sm font-black">Salvar Alterações</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL PERFIL --- */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black">{editingId ? 'Editar Perfil' : 'Novo Perfil'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required className="p-3 rounded-xl border border-gray-200 text-sm font-bold" placeholder="Nome do Perfil" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required className="p-3 rounded-xl border border-gray-200 text-sm font-bold" placeholder="Setor" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permissões:</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_PERMISSIONS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const perms = formData.permissions || [];
                      setFormData({ ...formData, permissions: perms.includes(p.id) ? perms.filter((id:any) => id !== p.id) : [...perms, p.id] });
                    }}
                    className={`p-3 text-left rounded-xl border text-[10px] font-bold transition-all ${formData.permissions?.includes(p.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-500 border-gray-100'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-400">Cancelar</button>
              <button type="submit" className="flex-2 bg-indigo-600 text-white py-3 px-8 rounded-xl text-sm font-black">Confirmar Perfil</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL AVISO --- */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSaveNotice} className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">{editingId ? 'Editar Aviso' : 'Novo Comunicado'}</h3>
            <div className="space-y-4">
              <input required className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold" placeholder="Título do Aviso" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <textarea required className="w-full p-3 rounded-xl border border-gray-200 text-sm font-medium h-32" placeholder="Conteúdo da mensagem..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              <select className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="school">Escola (Geral)</option>
                <option value="teacher">Professor (Turma)</option>
              </select>
            </div>
            <div className="flex space-x-2 pt-4">
              <button type="button" onClick={() => setShowNoticeModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-400">Cancelar</button>
              <button type="submit" className="flex-2 bg-indigo-600 text-white py-3 px-8 rounded-xl text-sm font-black">Publicar</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL PROCESSAMENTO DOC --- */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-10 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <h3 className="text-lg font-black">Enviar Documento Digital</h3>
            <p className="text-xs text-gray-400">O arquivo será anexado e liberado para o aluno via portal.</p>
            
            {uploadProgress > 0 ? (
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-[10px] font-bold text-indigo-600">Sincronizando com i-Educar...</span>
              </div>
            ) : (
              <button onClick={confirmUpload} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform shadow-xl shadow-indigo-100">Confirmar Upload</button>
            )}
            <button onClick={() => setShowProcessModal(false)} className="text-xs font-bold text-gray-400">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
