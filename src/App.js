// src/App.js
import React, { useState } from 'react';
import { FormProvider } from './context/FormContext';
import FormTabs from './components/Tabs';
import KidsModal from './components/Modal';
import ViewClients from './components/ViewClients';
import { Container, Button, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import FormCard from './components/FormCard';

function AppContent() {
  const location = useLocation();
  const [openKidsModal, setOpenKidsModal] = useState(false);

  const handleOpenKidsModal = () => {
    setOpenKidsModal(true);
  };

  const handleCloseKidsModal = () => {
    setOpenKidsModal(false);
  };

  return (
    <>
      {/* Header full width */}
      <Header />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {/* Condicionalmente se muestran los botones solo si no estamos en la vista de clientes */}
        {location.pathname === "/" && (
          <>
            <Button component={Link} to="/clients" variant="contained" color="primary" sx={{ mt: 2 }}>
              Ver Clientes
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleOpenKidsModal} sx={{ mt: 2, ml: 2 }}>
              Add Kids
            </Button>
          </>
        )}
        <Routes>
          {/* Envolvemos FormTabs dentro de un FormCard */}
          <Route
            path="/"
            element={
              <FormCard>
                <FormTabs />
              </FormCard>
            }
          />
          <Route path="/clients" element={<ViewClients />} />
        </Routes>
        <KidsModal open={openKidsModal} handleClose={handleCloseKidsModal} />
      </Container>
    </>
  );
}

function App() {
  return (
    <FormProvider>
      <Router>
        <AppContent />
      </Router>
    </FormProvider>
  );
}

export default App;
