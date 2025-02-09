// src/components/AgentModal.js
import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FormContext } from '../context/FormContext';

const AgentModal = ({ open, onClose }) => {
  const { setFormData } = useContext(FormContext);

  const handleSelectAgent = (agentName) => {
    // Actualiza el campo 'agent' de client1
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        client1: {
          ...prev.personalInfo.client1,
          agent: agentName,
        },
      },
    }));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }}
      disableEscapeKeyDown
    >
      <DialogTitle>Seleccione un Agente</DialogTitle>
      <DialogContent>
        Por favor, seleccione su agente:
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSelectAgent("Bianca Garcia")} variant="contained" color="primary">
          Bianca Garcia
        </Button>
        <Button onClick={() => handleSelectAgent("Francisco Garcia")} variant="contained" color="secondary">
          Francisco Garcia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentModal;
