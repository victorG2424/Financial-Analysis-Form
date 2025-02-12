// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import theme from './theme'; // Asegúrate de tener definido tu tema personalizado en src/theme.js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'; // Tus estilos globales

// Obtiene el elemento root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación usando createRoot, envolviendo App con ThemeProvider y CssBaseline
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
