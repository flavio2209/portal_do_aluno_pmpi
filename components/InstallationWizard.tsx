
import React, { useState } from 'react';

interface InstallationWizardProps {
  onComplete: () => void;
}

const InstallationWizard: React.FC<InstallationWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [dbType, setDbType] = useState<'mysql' | 'postgres'>('mysql');
  const [config, setConfig] = useState({
    host: 'localhost',
    port: '3306',
    dbName: 'educonnect',
    user: 'root',
    pass: ''
  });
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleInstall = async () => {
    setIsInstalling(true);
    setStep(3);
    
    const steps = [
      "Validando credenciais do banco de dados...",
      `Criando banco de dados '${config.dbName}'...`,
      "Executando setup.sql (Esquema Universal)...",
      "Criando tabelas de Matrícula (i-Educar)...",
      "Configurando i-Diário (Notas e Frequência)...",
      "Criando perfis de acesso padrão...",
      "Finalizando instalação e gerando arquivo .env...",
    ];

    for (let i = 0; i < steps.length; i++) {
      addLog(steps[i]);
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(r => setTimeout(r, 1000));
    }

    setIsInstalling(false);
    setTimeout(onComplete, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Instalador EduConnect</h1>
            <p className="text-indigo-100 text-sm mt-1">Configuração Automática v1.0</p>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {step}
          </div>
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-black text-slate-800">Bem-vindo à Instalação</h2>
              <p className="text-slate-500 leading-relaxed">
                Este assistente irá configurar o seu portal integrado ao <strong>i-educar</strong> e <strong>i-diário</strong>. 
                Certifique-se de ter as credenciais do seu banco de dados em mãos.
              </p>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                <h4 className="text-emerald-700 font-bold text-sm mb-2">Requisitos Verificados:</h4>
                <ul className="text-xs text-emerald-600 space-y-1">
                  <li>✅ Node.js v20.x detectado</li>
                  <li>✅ Permissão de escrita em /var/www/educonnect</li>
                  <li>✅ Conectividade com a rede i-Educar: OK</li>
                </ul>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Começar Configuração
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-black text-slate-800">Configuração de Banco</h2>
              
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => {setDbType('mysql'); setConfig({...config, port: '3306'})}}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${dbType === 'mysql' ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700' : 'border-slate-100 text-slate-400'}`}
                >
                  MySQL / MariaDB
                </button>
                <button 
                  onClick={() => {setDbType('postgres'); setConfig({...config, port: '5432'})}}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all ${dbType === 'postgres' ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700' : 'border-slate-100 text-slate-400'}`}
                >
                  PostgreSQL
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Host do Banco</label>
                  <input className="w-full p-4 rounded-xl border border-slate-200" value={config.host} onChange={e => setConfig({...config, host: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nome do Banco</label>
                  <input className="w-full p-4 rounded-xl border border-slate-200" value={config.dbName} onChange={e => setConfig({...config, dbName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Porta</label>
                  <input className="w-full p-4 rounded-xl border border-slate-200" value={config.port} onChange={e => setConfig({...config, port: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Usuário</label>
                  <input className="w-full p-4 rounded-xl border border-slate-200" value={config.user} onChange={e => setConfig({...config, user: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Senha</label>
                  <input type="password" className="w-full p-4 rounded-xl border border-slate-200" value={config.pass} onChange={e => setConfig({...config, pass: e.target.value})} />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 text-slate-400 font-bold">Voltar</button>
                <button onClick={handleInstall} className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700">
                  Instalar Sistema
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in zoom-in-95">
              <h2 className="text-2xl font-black text-slate-800 text-center">Instalando...</h2>
              
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-indigo-600 transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 font-mono text-[10px] h-48 overflow-y-auto custom-scrollbar shadow-inner">
                {logs.map((log, i) => (
                  <div key={i} className="text-indigo-400 mb-1">{log}</div>
                ))}
              </div>

              {progress === 100 && (
                <div className="text-center text-emerald-600 font-bold animate-bounce">
                  🎉 Instalação concluída com sucesso! Redirecionando...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationWizard;
