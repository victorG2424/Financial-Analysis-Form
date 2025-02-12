// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white', // Color de fondo (puedes cambiarlo si lo deseas)
        boxShadow: '1 4px 6px -1px #133857', // Sombra inferior con color #133857
        marginBottom: '5%', // Margen inferior de 2em
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', position: 'relative', minHeight: '80px' }}>
        {/* Logo a la izquierda */}
        <Box
          sx={{
            position: 'absolute',
            left: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="https://financiegroup.com/logo-gfi.svg"
            alt="Logo"
            style={{ height: '3em' }}
          />
        </Box>
        {/* Título centrado */}
        <Typography
          variant="h1"
          sx={{
            fontSize: '3em',
            color: '#133857',
            fontWeight: 600,
          }}
        >
          Financial Analysis Form
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
