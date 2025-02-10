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

  // Función para generar el PDF exportado con la estructura solicitada.
  const generatePDF = () => {
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
    });

    const marginTop = 20;
    const marginLeft = 20;
    const marginBottom = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    let currentY = marginTop;

    // Página 1: Portada
    doc.setFontSize(16);
    doc.text(`${formData.personalInfo.client1.fullName}`, marginLeft, currentY);
    currentY += lineHeight;

    doc.setFontSize(12);
    doc.text(`Agente: ${formData.personalInfo.client1.agent}`, marginLeft, currentY);
    currentY += lineHeight;

    doc.setFontSize(18);
    doc.text("Financial Analysis", marginLeft, currentY);
    currentY += lineHeight;

    const savedDate = formData.savedAt ? formatDate(formData.savedAt) : formatDate(new Date());
    doc.setFontSize(12);
    doc.text(`${savedDate}`, marginLeft, currentY);
    currentY += lineHeight;

    if (currentY > pageHeight - marginBottom) {
      // Se podría agregar una nueva página si fuese necesario.
    }

    // Página 2 y siguientes: Información Detallada
    doc.addPage();
    currentY = marginTop;

    const addTextLine = (text) => {
      if (currentY + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        currentY = marginTop;
      }
      doc.text(text, marginLeft, currentY);
      currentY += lineHeight;
    };

    addTextLine("Client 1 Information:");
    addTextLine(`Name: ${formData.personalInfo.client1.fullName}`);
    addTextLine(`Email: ${formData.personalInfo.client1.email}`);
    addTextLine(`Phone Number: ${formData.personalInfo.client1.phone}`);
    addTextLine(`State: ${formData.personalInfo.client1.state}`);
    addTextLine(`Date of Birth: ${formatDate(formData.personalInfo.client1.dob)}`);
    addTextLine(`Smoker: ${formData.personalInfo.client1.smoker}`);
    addTextLine(`Medical Condition: ${formData.personalInfo.client1.medicalCondition}`);
    addTextLine(`Do you have a trust?: ${formData.personalInfo.client1.trust}`);
    addTextLine(`Do you have a will?: ${formData.personalInfo.client1.will}`);
    addTextLine(`Did you get a tax refund?: ${formData.personalInfo.client1.taxRefund}`);
    addTextLine("");

    if (formData.personalInfo.client2) {
      addTextLine("Client 2 Information:");
      addTextLine(`Name: ${formData.personalInfo.client2.fullName}`);
      addTextLine(`Email: ${formData.personalInfo.client2.email}`);
      addTextLine(`Phone Number: ${formData.personalInfo.client2.phone}`);
      addTextLine(`State: ${formData.personalInfo.client2.state}`);
      addTextLine(`Date of Birth: ${formatDate(formData.personalInfo.client2.dob)}`);
      addTextLine(`Smoker: ${formData.personalInfo.client2.smoker}`);
      addTextLine(`Medical Condition: ${formData.personalInfo.client2.medicalCondition}`);
      addTextLine(`Do you have a trust?: ${formData.personalInfo.client2.trust}`);
      addTextLine(`Do you have a will?: ${formData.personalInfo.client2.will}`);
      addTextLine(`Did you get a tax refund?: ${formData.personalInfo.client2.taxRefund}`);
      addTextLine("");
    }

    if (formData.personalInfo.kids && formData.personalInfo.kids.length > 0) {
      addTextLine("Kids Information:");
      formData.personalInfo.kids.forEach((kid, index) => {
        addTextLine(`Kid ${index + 1} Name: ${kid.fullName}`);
        addTextLine(`Kid ${index + 1} Date of Birth: ${formatDate(kid.dob)}`);
      });
      addTextLine("");
    }

    // Secciones adicionales se pueden agregar aquí...

    doc.save("financial_analysis.pdf");
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
              <Button variant="outlined" color="secondary" onClick={generatePDF} style={{ marginLeft: '10px' }}>
                Export PDF
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
