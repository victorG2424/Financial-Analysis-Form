import React, { useState } from 'react';
import { FormProvider } from './context/FormContext';
import FormTabs from './components/Tabs';
import KidsModal from './components/Modal';
import { Container, Button } from '@mui/material';

function App() {
  const [openKidsModal, setOpenKidsModal] = useState(false);

  const handleOpenKidsModal = () => {
    setOpenKidsModal(true);
  };

  const handleCloseKidsModal = () => {
    setOpenKidsModal(false);
  };

  return (
    <FormProvider>
      <Container maxWidth="md">
        <h1>Financial Analysis Form</h1>
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
