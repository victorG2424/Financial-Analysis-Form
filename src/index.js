import React from 'react';
import ReactDOM from 'react-dom/client';  // ← Importa desde 'react-dom/client'
import App from './App';

// Obtiene el elemento root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación usando createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
