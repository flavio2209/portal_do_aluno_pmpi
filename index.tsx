
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Index.tsx: Iniciando montagem do React...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root para montar o app.");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Index.tsx: App renderizado com sucesso.');
} catch (error) {
  console.error('Erro durante a renderização inicial:', error);
}
