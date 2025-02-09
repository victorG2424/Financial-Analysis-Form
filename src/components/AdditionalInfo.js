// src/components/AdditionalInformation.js
import React, { useContext, useState } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import { Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { db } from '../firebase/config';
import { collection, addDoc } from "firebase/firestore";
import AutoSave from './AutoSave';

const AdditionalInfo = () => {
  const { formData, setFormData } = useContext(FormContext);
  const initialValues = formData.additionalInfo;
  const [openModal, setOpenModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const onSubmit = async (values) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: values
    }));

    // Guardar en Firestore
    try {
      const docRef = await addDoc(collection(db, "financialAnalysis"), {
        ...formData,
        additionalInfo: values,
        createdAt: new Date()
      });
      setSaveMessage("Se ha guardado su formulario");
      setOpenModal(true);
      console.log("Documento guardado con ID: ", docRef.id);
    } catch (e) {
      console.error("Error al guardar el formulario: ", e);
      setSaveMessage("Error al guardar el formulario");
      setOpenModal(true);
    }
  };

  const handleAutoSave = (values) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: values
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
