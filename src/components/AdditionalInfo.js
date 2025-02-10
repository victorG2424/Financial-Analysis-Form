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
  MenuItem,
} from '@mui/material';
import AutoSave from './AutoSave';
import saveClientData from '../utils/saveClientData';
import { jsPDF } from 'jspdf';

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
  const initialValues = formData.additionalInfo;
  const [openModal, setOpenModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Estado local para el select de Agent.
  // Se inicializa con el valor actual del contexto o, si es nuevo, con "Bianca Garcia".
  const [selectedAgent, setSelectedAgent] = useState(
    formData.personalInfo.client1.agent || 'Bianca Garcia'
  );

  // Sincronizamos el estado local con el contexto.
  useEffect(() => {
    setFormData((prev) => ({
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

  // Función onSubmit para guardar el formulario
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
        setFormData((prev) => ({ ...prev, isEdit: false, editingClientId: '' }));
      }
    } catch (error) {
      console.error('Error al guardar el formulario:', error);
      setSaveMessage('Error al guardar el formulario en Firestore.');
      setOpenModal(true);
    }
  };

  // Función de autosave para actualizar el contexto conforme se escriba
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

    // Configuración de márgenes y lineHeight
    const marginTop = 20;
    const marginLeft = 20;
    const marginBottom = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    let currentY = marginTop;

    // --- Página 1: Portada ---
    // Nombre de Cliente 1 (sin etiqueta)
    doc.setFontSize(16);
    doc.text(`${formData.personalInfo.client1.fullName}`, marginLeft, currentY);
    currentY += lineHeight;
    // Nombre de Agente (con etiqueta "Agente:")
    doc.setFontSize(12);
    doc.text(`Agente: ${formData.personalInfo.client1.agent}`, marginLeft, currentY);
    currentY += lineHeight;
    // Título: Financial Analysis (sin etiqueta "Título")
    doc.setFontSize(18);
    doc.text("Financial Analysis", marginLeft, currentY);
    currentY += lineHeight;
    // SavedAt: Solo la fecha en formato USA
    const savedDate = formData.savedAt
      ? formatDate(formData.savedAt)
      : formatDate(new Date());
    doc.setFontSize(12);
    doc.text(`${savedDate}`, marginLeft, currentY);
    currentY += lineHeight;
    // Aseguramos un margen inferior
    if (currentY > pageHeight - marginBottom) {
      // Raramente se alcanzaría este caso en la portada
    }

    // Agregamos una nueva página para la información detallada.
    doc.addPage();
    currentY = marginTop;

    // Función auxiliar para agregar líneas y gestionar saltos de página.
    const addTextLine = (text) => {
      if (currentY + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        currentY = marginTop;
      }
      doc.text(text, marginLeft, currentY);
      currentY += lineHeight;
    };

    // --- Sección: Client 1 Personal Info ---
    addTextLine("Client 1 Information:");
    addTextLine(`Name: ${formData.personalInfo.client1.fullName}`);
    addTextLine(`Email: ${formData.personalInfo.client1.email}`);
    addTextLine(`Phone Number: ${formData.personalInfo.client1.phone}`);
    addTextLine(`State: ${formData.personalInfo.client1.state}`);
    addTextLine(`Date of Birth: ${formatDate(formData.personalInfo.client1.dob)}`);
    addTextLine(`Smoker: ${formData.personalInfo.client1.smoker}`);
    addTextLine(
      `Medical Condition: ${formData.personalInfo.client1.medicalCondition}`
    );
    addTextLine(`Do you have a trust?: ${formData.personalInfo.client1.trust}`);
    addTextLine(`Do you have a will?: ${formData.personalInfo.client1.will}`);
    addTextLine(
      `Did you get a tax refund?: ${formData.personalInfo.client1.taxRefund}`
    );
    addTextLine("");

    // --- Sección: Client 2 Personal Info (si existe) ---
    if (formData.personalInfo.client2) {
      addTextLine("Client 2 Information:");
      addTextLine(`Name: ${formData.personalInfo.client2.fullName}`);
      addTextLine(`Email: ${formData.personalInfo.client2.email}`);
      addTextLine(`Phone Number: ${formData.personalInfo.client2.phone}`);
      addTextLine(`State: ${formData.personalInfo.client2.state}`);
      addTextLine(
        `Date of Birth: ${formatDate(formData.personalInfo.client2.dob)}`
      );
      addTextLine(`Smoker: ${formData.personalInfo.client2.smoker}`);
      addTextLine(
        `Medical Condition: ${formData.personalInfo.client2.medicalCondition}`
      );
      addTextLine(`Do you have a trust?: ${formData.personalInfo.client2.trust}`);
      addTextLine(`Do you have a will?: ${formData.personalInfo.client2.will}`);
      addTextLine(
        `Did you get a tax refund?: ${formData.personalInfo.client2.taxRefund}`
      );
      addTextLine("");
    }

    // --- Sección: Kids (si existen) ---
    if (formData.personalInfo.kids && formData.personalInfo.kids.length > 0) {
      addTextLine("Kids Information:");
      formData.personalInfo.kids.forEach((kid, index) => {
        addTextLine(`Kid ${index + 1} Name: ${kid.fullName}`);
        addTextLine(
          `Kid ${index + 1} Date of Birth: ${formatDate(kid.dob)}`
        );
      });
      addTextLine("");
    }

    // --- Sección: Insurable Needs Client 1 ---
    addTextLine("Insurable Needs - Client 1:");
    const in1 = formData.insurableNeeds.client1;
    addTextLine(`Debt: ${in1.debt}`);
    addTextLine(`Income: ${in1.income}`);
    addTextLine(`Education: ${in1.education}`);
    addTextLine(`Subtract Current Insurances: ${in1.subtractInsurances}`);
    addTextLine(`Mortgage: ${in1.mortgage}`);
    const totalInsurable1 =
      Number(in1.debt) + Number(in1.income) + Number(in1.education) - Number(in1.subtractInsurances);
    addTextLine(`Total Insurable Need: ${totalInsurable1}`);
    addTextLine("");

    // --- Sección: Insurable Needs Client 2 (si existe) ---
    if (formData.insurableNeeds.client2) {
      addTextLine("Insurable Needs - Client 2:");
      const in2 = formData.insurableNeeds.client2;
      addTextLine(`Debt: ${in2.debt}`);
      addTextLine(`Income: ${in2.income}`);
      addTextLine(`Education: ${in2.education}`);
      addTextLine(`Subtract Current Insurances: ${in2.subtractInsurances}`);
      addTextLine(`Mortgage: ${in2.mortgage}`);
      const totalInsurable2 =
        Number(in2.debt) + Number(in2.income) + Number(in2.education) - Number(in2.subtractInsurances);
      addTextLine(`Total Insurable Need: ${totalInsurable2}`);
      addTextLine("");
    }

    // --- Sección: Retirement Goals Client 1 ---
    addTextLine("Retirement Goals - Client 1:");
    const rt1 = formData.retirementGoals.client1;
    addTextLine(`Goals & Dreams in Retirement: ${rt1.goals}`);
    addTextLine(`Age to Retire: ${rt1.retireAge}`);
    addTextLine(`Years Retired: ${rt1.retiredYears}`);
    addTextLine(`Monthly Income: ${rt1.monthlyIncome}`);
    const totalRetirement1 =
      Number(rt1.retiredYears) * Number(rt1.monthlyIncome) * 12;
    addTextLine(`Total Needed for Retirement: ${totalRetirement1}`);
    addTextLine("");

    // --- Sección: Retirement Goals Client 2 (si existe) ---
    if (formData.retirementGoals.client2) {
      addTextLine("Retirement Goals - Client 2:");
      const rt2 = formData.retirementGoals.client2;
      addTextLine(`Goals & Dreams in Retirement: ${rt2.goals}`);
      addTextLine(`Age to Retire: ${rt2.retireAge}`);
      addTextLine(`Years Retired: ${rt2.retiredYears}`);
      addTextLine(`Monthly Income: ${rt2.monthlyIncome}`);
      const totalRetirement2 =
        Number(rt2.retiredYears) * Number(rt2.monthlyIncome) * 12;
      addTextLine(`Total Needed for Retirement: ${totalRetirement2}`);
      addTextLine("");
    }

    // --- Sección: Tax Information Client 1 ---
    addTextLine("Tax Information - Client 1:");
    const taxNow = formData.taxInformation.taxNow;
    addTextLine("Tax Now:");
    addTextLine(`  Checking: ${taxNow.checking}`);
    addTextLine(`  Savings: ${taxNow.savings}`);
    addTextLine(`  Other: ${taxNow.other}`);
    const taxLater = formData.taxInformation.taxLater;
    addTextLine("Tax Later:");
    addTextLine(`  IRAs: ${taxLater.iras}`);
    addTextLine(`  Retirement Plan: ${taxLater.retirementPlan}`);
    addTextLine(`  Other: ${taxLater.other}`);
    const taxAdv = formData.taxInformation.taxAdvantaged;
    addTextLine("Tax Advantaged:");
    addTextLine(`  Roth IRAs: ${taxAdv.rothIras}`);
    addTextLine(`  Plan 529: ${taxAdv.plan529}`);
    addTextLine(`  Life Insurance: ${taxAdv.lifeInsurance}`);
    addTextLine("");

    // --- Sección: Additional Information ---
    addTextLine("Additional Information:");
    addTextLine(`Financial Goals: ${formData.additionalInfo.financialGoals}`);
    addTextLine(`GFI Recommendations: ${formData.additionalInfo.recommendations}`);
    addTextLine(
      `Date Next Appointment: ${formatDate(formData.additionalInfo.nextAppointment)}`
    );

    doc.save("financial_analysis.pdf");
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
