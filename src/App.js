// src/App.js
import React, { useState } from 'react';
import { FormProvider } from './context/FormContext';
import FormTabs from './components/Tabs';
import KidsModal from './components/Modal';
import AgentModal from './components/AgentModal';
import AgentDisplay from './components/AgentDisplay';
import AgentModalManager from './components/AgentModalManager';
import ViewClients from './components/ViewClients';
import { Container, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [openKidsModal, setOpenKidsModal] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(true);

  const handleOpenKidsModal = () => {
    setOpenKidsModal(true);
  };

  const handleCloseKidsModal = () => {
    setOpenKidsModal(false);
  };

  const handleCloseAgentModal = () => {
    setAgentModalOpen(false);
  };

  return (
    <FormProvider>
      <Router>
        <Container maxWidth="md">
          <h1>Financial Analysis Form</h1>
          {/* Se muestra el nombre del agente en la esquina superior derecha */}
          <AgentDisplay />
          {/* Revisa si el agente está vacío para mostrar el modal */}
          <AgentModalManager setAgentModalOpen={setAgentModalOpen} />
          {/* Modal obligatorio para seleccionar agente */}
          <AgentModal open={agentModalOpen} onClose={handleCloseAgentModal} />
          {/* Botón "Ver Clientes" para navegar a la tabla de clientes */}
          <Button component={Link} to="/clients" variant="contained" color="primary" sx={{ mt: 2 }}>
            Ver Clientes
          </Button>
          {/* Botón para abrir el modal de Kids */}
          <Button variant="outlined" color="secondary" onClick={handleOpenKidsModal} sx={{ mt: 2, ml: 2 }}>
            Add Kids
          </Button>
          <Routes>
            <Route path="/" element={<FormTabs />} />
            <Route path="/clients" element={<ViewClients />} />
          </Routes>
          <KidsModal open={openKidsModal} handleClose={handleCloseKidsModal} />
        </Container>
      </Router>
    </FormProvider>
  );
}

export default App;
