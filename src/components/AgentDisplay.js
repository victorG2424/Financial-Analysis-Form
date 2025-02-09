// src/components/AgentDisplay.js
import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { FormContext } from '../context/FormContext';

const AgentDisplay = () => {
  const { formData } = useContext(FormContext);
  const agent = formData.personalInfo.client1.agent;
  return (
    <Box sx={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 1300,
      backgroundColor: 'white',
      padding: '8px',
      borderRadius: '4px',
      boxShadow: 3
    }}>
      <Typography variant="subtitle1">
        Agente: {agent ? agent : 'No seleccionado'}
      </Typography>
    </Box>
  );
};

export default AgentDisplay;
