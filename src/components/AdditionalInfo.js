// src/components/AdditionalInformation.js
import React, { useContext, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
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
  MenuItem 
} from '@mui/material';
import AutoSave from './AutoSave';
import saveClientData from '../utils/saveClientData';

const AdditionalInfo = () => {
  const { formData, setFormData } = useContext(FormContext);
  const initialValues = formData.additionalInfo;
  const [openModal, setOpenModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Estado local para el select del agente, con valor por defecto "Bianca Garcia" si aún no se ha elegido.
  const [selectedAgent, setSelectedAgent] = useState(
    formData.personalInfo.client1.agent || "Bianca Garcia"
  );

  // Sincronizar el valor local con el contexto
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        client1: {
          ...prev.personalInfo.client1,
          agent: selectedAgent,
        },
      },
    }));
  }, [selectedAgent, setFormData]);

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
      // Si estamos en modo edición, reiniciamos las banderas
      if (updatedFormData.editingClientId) {
        setFormData(prev => ({ ...prev, isEdit: false, editingClientId: "" }));
      }
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
              {/* Financial Goals */}
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
              {/* GFI Recommendations */}
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
              {/* Date next appointment */}
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
              {/* Nuevo select para Agent */}
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
                    <MenuItem value="Francisco Velazquez">Francisco Velazquez</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <AutoSave save={handleAutoSave} />
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" type="submit">
                {formData.isEdit ? "Update Form" : "Save Form"}
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
