// src/components/AdditionalInfo.js
import React, { useContext, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { FormContext, initialState } from '../context/FormContext';
import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AutoSave from './AutoSave';
import saveClientData from '../utils/saveClientData';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

// Helper para formatear una fecha al formato USA (mm/dd/yyyy)
const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date)) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const AdditionalInfo = () => {
  const { formData, setFormData } = useContext(FormContext);
  const navigate = useNavigate();
  const initialValues = formData.additionalInfo;
  const [openModal, setOpenModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Estado local para el select de Agent.
  const [selectedAgent, setSelectedAgent] = useState(
    formData.personalInfo.client1.agent || 'Bianca Garcia'
  );

  // Sincronizamos el estado local con el contexto, actualizando solo si es distinto.
  useEffect(() => {
    setFormData((prev) => {
      if (prev.personalInfo.client1.agent === selectedAgent) {
        return prev;
      }
      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          client1: {
            ...prev.personalInfo.client1,
            agent: selectedAgent,
          },
        },
      };
    });
  }, [selectedAgent, setFormData]);

  // Función para reiniciar el formulario (se mantiene en el archivo, pero ya no se invoca al cerrar el modal)
  const handleResetForm = () => {
    setFormData(initialState);
    setSelectedAgent(initialState.personalInfo.client1.agent);
  };

  // Función onSubmit para guardar el formulario.
  const onSubmit = async (values) => {
    const updatedFormData = {
      ...formData,
      additionalInfo: values,
    };
    setFormData(updatedFormData);
    try {
      await saveClientData(updatedFormData);
      setSaveMessage('Se ha guardado su formulario exitosamente en Firestore.');
      setOpenModal(true);
      if (updatedFormData.editingClientId) {
        // En modo edición, se guarda la información y se muestra el modal.
      }
    } catch (error) {
      console.error('Error al guardar el formulario:', error);
      setSaveMessage('Error al guardar el formulario en Firestore.');
      setOpenModal(true);
    }
  };

  // Función de autosave para actualizar el contexto conforme se escribe.
  const handleAutoSave = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.additionalInfo))
      return;
    setFormData((prev) => ({
      ...prev,
      additionalInfo: values,
    }));
  };


  // Al cerrar el modal, solo se cierra el modal (no se reinicia ni navega).
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <h2>Additional Information - Client 1</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
        {({ values, handleChange }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Financial Goals"
                  name="financialGoals"
                  multiline
                  rows={4}
                  value={values.financialGoals}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="GFI Recommendations"
                  name="recommendations"
                  multiline
                  rows={4}
                  value={values.recommendations}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date next appointment"
                  name="nextAppointment"
                  InputLabelProps={{ shrink: true }}
                  value={values.nextAppointment}
                  onChange={handleChange}
                />
              </Grid>
              {/* Select para elegir el Agent */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="agent-select-label">Agente</InputLabel>
                  <Select
                    labelId="agent-select-label"
                    id="agent-select"
                    value={selectedAgent}
                    label="Agente"
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <MenuItem value="Bianca Garcia">Bianca Garcia</MenuItem>
                    <MenuItem value="Francisco Garcia">Francisco Garcia</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <AutoSave save={handleAutoSave} />
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                {formData.isEdit ? "Update Form" : "Save Form"}
              </Button>

            </div>
          </Form>
        )}
      </Formik>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>{saveMessage}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdditionalInfo;
