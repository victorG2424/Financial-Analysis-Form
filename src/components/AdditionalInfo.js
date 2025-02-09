// src/components/AdditionalInformation.js

// 1. Importaciones necesarias
import React, { useContext, useState } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import { Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AutoSave from './AutoSave';
// Importamos la función que se encargará de transformar y guardar la data en Firestore
import saveClientData from '../utils/saveClientData';

const AdditionalInfo = () => {
  // 2. Extraemos formData y setFormData desde el Context
  const { formData, setFormData } = useContext(FormContext);
  // Los valores iniciales para este formulario son los que ya tenemos en additionalInfo
  const initialValues = formData.additionalInfo;
  
  // Estado local para manejar el diálogo de confirmación
  const [openModal, setOpenModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 3. Función que se ejecutará al enviar el formulario (Save Form)
  const onSubmit = async (values) => {
    // Creamos un nuevo objeto actualizado con la parte de additionalInfo modificada
    const updatedFormData = { 
      ...formData, 
      additionalInfo: values 
    };

    // Actualizamos el Context con los nuevos valores
    setFormData(updatedFormData);

    // Llamamos a la función saveClientData para transformar y guardar los datos en Firestore
    try {
      await saveClientData(updatedFormData);
      setSaveMessage("Se ha guardado su formulario exitosamente en Firestore.");
      setOpenModal(true);
    } catch (error) {
      console.error("Error al guardar el formulario:", error);
      setSaveMessage("Error al guardar el formulario en Firestore.");
      setOpenModal(true);
    }
  };

  // 4. Función de AutoSave para actualizar el Context conforme se escriba
  // Se compara con los valores actuales para evitar actualizaciones infinitas
  const handleAutoSave = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.additionalInfo)) return;
    setFormData(prev => ({
      ...prev,
      additionalInfo: values,
    }));
  };

  // 5. Función para exportar los datos a PDF (opcional)
  const handleExport = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF();
      doc.text(JSON.stringify(formData, null, 2), 10, 10);
      doc.save("financial_analysis.pdf");
    });
  };

  return (
    <div>
      <h2>Additional Information - Client 1</h2>
      {/* 6. Usamos Formik para el manejo del formulario */}
      <Formik 
        initialValues={initialValues} 
        onSubmit={onSubmit} 
        enableReinitialize
      >
        {({ values, handleChange }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Campo para Financial Goals */}
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
              {/* Campo para GFI Recommendations */}
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
              {/* Campo para la fecha de la próxima cita */}
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
            </Grid>
            {/* 7. El componente AutoSave se encarga de actualizar el Context en tiempo real */}
            <AutoSave save={handleAutoSave} />
            <div style={{ marginTop: '20px' }}>
              {/* Botón para enviar el formulario y guardar en Firestore */}
              <Button variant="contained" color="primary" type="submit">
                Save Form
              </Button>
              {/* Botón para exportar a PDF */}
              <Button variant="outlined" color="secondary" onClick={handleExport} style={{ marginLeft: '10px' }}>
                Export
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {/* 8. Diálogo de confirmación para mostrar el mensaje de guardado */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>{saveMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdditionalInfo;
