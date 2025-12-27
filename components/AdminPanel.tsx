
import React, { useState } from 'react';
import { User, Role, AccessProfile, Permission } from '../types';
import { MOCK_DASHBOARD } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const AVAILABLE_PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  { id: 'view_grades', label: 'Visualizar Notas', description: 'Permite ver o boletim e histórico dos alunos.' },
  { id: 'edit_grades', label: 'Lançar Notas', description: 'Permite editar notas e frequências no i-Diário.' },
  { id: 'manage_users', label: 'Gerenciar Usuários', description: 'Criar, editar e remover contas de acesso.' },
  { id: 'manage_notices', label: 'Publicar Avisos', description: 'Enviar comunicados para turmas ou escola toda.' },
  { id: 'approve_documents', label: 'Aprovar Documentos', description: 'Analisar e liberar solicitações da secretaria.' },
  { id: 'view_reports', label: 'Acessar Relatórios', description: 'Visualizar dados consolidados e estatísticas.' },
];

const PERMISSION_GROUPS = [
  {
    id: 'pedagogico',
    title: 'Pedagógico',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    perms: ['view_grades', 'edit_grades'] as Permission[]
  },
  {
    id: 'administrativo',
    title: 'Administrativo',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    perms: ['manage_users', 'approve_documents'] as Permission[]
  },
  {
    id: 'gestao',
    title: 'Gestão e Comunicação',
    icon: 'M11 5.882V19.297A8.609 8.609 0 0112 19c2.107 0 4.087.743 5.636 1.986.322.257.864.124.864-.285V4.692c0-.189-.102-.362-.266-.457A12.627 12.627 0 0012 3c-2.107 0-4.087.743-5.636 1.986A.486.486 0 016 5.25v14.335c0 .409.542.542.864.285A8.609 8.609 0 0112 19c.403 0 .794.032 1.177.094',
    perms: ['manage_notices', 'view_reports'] as Permission[]
  }
];

const INITIAL_PROFILES: AccessProfile[] = [
  { id: 'p1', name: 'Secretaria Geral', sector: 'Administrativo', permissions: ['manage_users', 'approve_documents', 'view_reports'] },
  { id: 'p2', name: 'Corpo Docente', sector: 'Pedagógico', permissions: ['view_grades', 'edit_grades', 'manage_notices'] },
  { id: 'p3', name: 'Diretoria', sector: 'Gestão', permissions: ['view_reports', 'manage_users', 'manage_notices'] },
];

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@escola.com', role: 'admin', profileId: 'p3' },
  { id: '2', name: 'Guilherme Silva Santos', email: 'aluno@escola.com', role: 'student', registration: '2024.0001.0023' },
  { id: '3', name: 'Maria Souza (Mãe)', email: 'maria.souza@email.com', role: 'parent' },
  { id: '4', name: 'Ricardo Nunes', email: 'ricardo.docente@escola.com', role: 'admin', profileId: 'p2' },
];

const AdminPanel: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'users' | 'profiles'>('dashboard');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [profiles, setProfiles] = useState<AccessProfile[]>(INITIAL_PROFILES);
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Forms States
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' as Role, registration: '', profileId: '' });
  const [newProfile, setNewProfile] = useState<Omit<AccessProfile, 'id'>>({ name: '', sector: '', permissions: [] });

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, ...newUser } : u));
    } else {
      const userToAdd: User = { id: Math.random().toString(36).substr(2, 9), ...newUser };
      setUsers([...users, userToAdd]);
    }
    closeUserModal();
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação é irreversível.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const openEditUser = (user: User) => {
    setEditingUserId(user.id);
    setNewUser({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      registration: user.registration || '', 
      profileId: user.profileId || '' 
    });
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUserId(null);
    setNewUser({ name: '', email: '', role: 'student', registration: '', profileId: '' });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfileId) {
      setProfiles(profiles.map(p => p.id === editingProfileId ? { ...p, ...newProfile } : p));
    } else {
      const profileToAdd: AccessProfile = { id: 'p' + (profiles.length + 1), ...newProfile };
      setProfiles([...profiles, profileToAdd]);
    }
    closeProfileModal();
  };

  const openEditProfile = (profile: AccessProfile) => {
    setEditingProfileId(profile.id);
    setNewProfile({ name: profile.name, sector: profile.sector, permissions: profile.permissions });
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setEditingProfileId(null);
    setNewProfile({ name: '', sector: '', permissions: [] });
  };

  const togglePermission = (permId: Permission) => {
    const current = newProfile.permissions;
    if (current.includes(permId)) {
      setNewProfile({ ...newProfile, permissions: current.filter(p => p !== permId) });
    } else {
      setNewProfile({ ...newProfile, permissions: [...current, permId] });
    }
  };

  const toggleGroup = (perms: Permission[]) => {
    const allSelected = perms.every(p => newProfile.permissions.includes(p));
    if (allSelected) {
      setNewProfile({ ...newProfile, permissions: newProfile.permissions.filter(p => !perms.includes(p)) });
    } else {
      const uniqueNewPerms = Array.from(new Set([...newProfile.permissions, ...perms]));
      setNewProfile({ ...newProfile, permissions: uniqueNewPerms });
    }
  };

  const renderDashboard = () => {
    const userRoleData = [
      { name: 'Alunos', value: users.filter(u => u.role === 'student').length, fill: '#6366f1' },
      { name: 'Pais', value: users.filter(u => u.role === 'parent').length, fill: '#10b981' },
      { name: 'Admin', value: users.filter(u => u.role === 'admin').length, fill: '#8b5cf6' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Usuários', value: users.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Perfis de Acesso', value: profiles.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Docentes Ativos', value: users.filter(u => u.profileId === 'p2').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Documentos Pendentes', value: '12', color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-center space-x-3">
                <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${stat.color.replace('text', 'bg')}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Distribuição de Usuários</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userRoleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Solicitações de Documentos (i-Educar)</h3>
            <div className="space-y-4">
              {[
                { name: 'Histórico Escolar', user: 'Ana Paula', status: 'Pendente', date: 'Hoje' },
                { name: 'Declaração de Vaga', user: 'Marcos Silva', status: 'Processando', date: 'Há 2h' },
                { name: 'Passe Livre', user: 'Julia Costa', status: 'Pendente', date: 'Ontem' },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{req.name}</p>
                      <p className="text-xs text-gray-400">Por: {req.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full uppercase tracking-tighter">{req.status}</span>
                    <p className="text-[10px] text-gray-400 mt-1">{req.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Sub-Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Resumo
          </button>
          <button 
            onClick={() => setActiveSubTab('users')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Usuários
          </button>
          <button 
            onClick={() => setActiveSubTab('profiles')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'profiles' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Perfis de Acesso
          </button>
        </div>

        {activeSubTab === 'users' && (
          <button 
            onClick={() => setShowUserModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span>Novo Usuário</span>
          </button>
        )}
      </div>

      {activeSubTab === 'dashboard' && renderDashboard()}

      {activeSubTab === 'users' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-6">Usuário</th>
                  <th className="px-8 py-6">Vínculo</th>
                  <th className="px-8 py-6">Perfil Setorial</th>
                  <th className="px-8 py-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-indigo-50/20 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                        user.role === 'student' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {user.profileId ? (
                        <div className="text-xs">
                          <p className="font-bold text-gray-700">{profiles.find(p => p.id === user.profileId)?.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase">{profiles.find(p => p.id === user.profileId)?.sector}</p>
                        </div>
                      ) : <span className="text-xs text-gray-300 italic">Padrão</span>}
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button 
                        onClick={() => openEditUser(user)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {profiles.map(profile => (
            <div key={profile.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-slate-200">{profile.sector}</span>
                <button 
                  onClick={() => openEditProfile(profile)}
                  className="text-gray-400 hover:text-indigo-600 bg-gray-50 p-2 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{profile.name}</h4>
              <div className="space-y-3 mb-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Permissões Ativas:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.permissions.map(p => (
                    <span key={p} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-indigo-100">
                      {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label}
                    </span>
                  ))}
                  {profile.permissions.length === 0 && <span className="text-xs text-gray-400 italic">Nenhuma definida</span>}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-5">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <span className="font-medium text-gray-500">{users.filter(u => u.profileId === profile.id).length} usuários</span>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => {
              setEditingProfileId(null);
              setNewProfile({ name: '', sector: '', permissions: [] });
              setShowProfileModal(true);
            }}
            className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group min-h-[280px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <span className="font-bold text-lg">Criar Novo Perfil</span>
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[32px] w-full max-w-2xl p-8 my-8 shadow-2xl animate-in zoom-in duration-300 relative">
            <button onClick={closeProfileModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{editingProfileId ? 'Editar Perfil' : 'Novo Perfil'}</h3>
              <p className="text-sm text-gray-500">Configure as permissões de acesso deste grupo.</p>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" placeholder="Nome do Perfil" value={newProfile.name} onChange={e => setNewProfile({...newProfile, name: e.target.value})} />
                <input required className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" placeholder="Setor" value={newProfile.sector} onChange={e => setNewProfile({...newProfile, sector: e.target.value})} />
              </div>
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                      <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={group.icon} /></svg>
                        <span>{group.title}</span>
                      </h4>
                      <button type="button" onClick={() => toggleGroup(group.perms)} className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {group.perms.every(p => newProfile.permissions.includes(p)) ? 'Desmarcar' : 'Marcar Todos'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.perms.map(permId => {
                        const perm = AVAILABLE_PERMISSIONS.find(ap => ap.id === permId)!;
                        const isSelected = newProfile.permissions.includes(permId);
                        return (
                          <button key={permId} type="button" onClick={() => togglePermission(permId)} className={`flex flex-col text-left p-4 rounded-xl border transition-all ${isSelected ? 'bg-white border-indigo-200 ring-1 ring-indigo-50 shadow-sm' : 'bg-white border-gray-200/50 opacity-60'}`}>
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{perm.label}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                {isSelected && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                              </div>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium line-clamp-1">{perm.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={closeProfileModal} className="flex-1 py-4 px-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-2 py-4 px-12 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                  {editingProfileId ? 'Atualizar Perfil' : 'Criar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              {editingUserId ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Nome Completo</label>
                <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-semibold" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-semibold" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Papel</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-bold" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as Role})}>
                    <option value="student">Aluno</option>
                    <option value="parent">Pai/Mãe</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Perfil Setorial</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-bold" value={newUser.profileId} onChange={e => setNewUser({...newUser, profileId: e.target.value})}>
                    <option value="">Nenhum (Padrão)</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-8 pt-4">
                <button type="button" onClick={closeUserModal} className="flex-1 py-4 px-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50">Sair</button>
                <button type="submit" className="flex-1 py-4 px-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
                  {editingUserId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
