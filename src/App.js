// src/App.js
import React, { useState } from 'react';
import { FormProvider } from './context/FormContext';
import FormTabs from './components/Tabs';
import KidsModal from './components/Modal';
import AgentModal from './components/AgentModal';
import AgentDisplay from './components/AgentDisplay';
import { Container, Button } from '@mui/material';

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
      <Container maxWidth="md">
        <h1>Financial Analysis Form</h1>
        {/* Muestra el agente en la esquina superior derecha */}
        <AgentDisplay />
        {/* Modal obligatorio para seleccionar agente */}
        <AgentModal open={agentModalOpen} onClose={handleCloseAgentModal} />
        {/* Botón para abrir el modal de Kids */}
        <Button variant="outlined" color="secondary" onClick={handleOpenKidsModal}>
          Add Kids
        </Button>
        <FormTabs />
        <KidsModal open={openKidsModal} handleClose={handleCloseKidsModal} />
      </Container>
    </FormProvider>
  );
}

export default App;
