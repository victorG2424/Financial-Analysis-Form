// src/components/AdditionalInformation.js
import React, { useContext, useState } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import { Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AutoSave from './AutoSave';
import saveClientData from '../utils/saveClientData';

const AdditionalInfo = () => {
  const { formData, setFormData } = useContext(FormContext);
  const initialValues = formData.additionalInfo;
  const [openModal, setOpenModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const onSubmit = async (values) => {
    const updatedFormData = { 
      ...formData, 
      additionalInfo: values 
    };

    setFormData(updatedFormData);

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

  const handleAutoSave = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.additionalInfo)) return;
    setFormData(prev => ({
      ...prev,
      additionalInfo: values,
    }));
  };

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
            </Grid>
            <AutoSave save={handleAutoSave} />
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                Save Form
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleExport} style={{ marginLeft: '10px' }}>
                Export
              </Button>
            </div>
          </Form>
        )}
      </Formik>
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
