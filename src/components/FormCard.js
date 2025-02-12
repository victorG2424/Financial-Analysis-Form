// src/components/FormCard.js
import React from 'react';
import { Card, CardContent } from '@mui/material';

const FormCard = ({ children }) => {
  return (
    <Card
      sx={{
        borderRadius: '10px',           // Bordes redondeados
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Sombra sutil
        m: 2,                           // Margin (espacio alrededor)
        p: 2,                           // Padding interno (opcional, se recomienda usar CardContent para padding)
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormCard;
