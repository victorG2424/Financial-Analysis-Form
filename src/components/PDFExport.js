// src/components/PDFExport.js
import React from 'react';
import { jsPDF } from "jspdf";

// Helper: Formatea una fecha (o cadena de fecha) a mm/dd/yyyy
const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date)) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const PDFExport = ({ formData }) => {

  const generatePDF = () => {
    // Creamos una instancia de jsPDF en orientación vertical, usando unidades 'mm' y tamaño A4.
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });
    
    // Definimos márgenes y line height
    const marginTop = 20;
    const marginLeft = 20;
    const marginBottom = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7; // espacio entre líneas en mm
    
    let currentY = marginTop;
    
    // ===== Página 1: Portada =====
    // (No mostramos etiquetas, solo el contenido)
    
    // Nombre de Cliente 1 (solo el valor)
    doc.setFontSize(16);
    doc.text(`${formData.personalInfo.client1.fullName}`, marginLeft, currentY);
    currentY += lineHeight;
    
    // Nombre de Agente (mostrar "Agente: <nombre>")
    doc.setFontSize(12);
    doc.text(`Agente: ${formData.personalInfo.client1.agent}`, marginLeft, currentY);
    currentY += lineHeight;
    
    // Título: "Financial Analysis"
    doc.setFontSize(18);
    doc.text("Financial Analysis", marginLeft, currentY);
    currentY += lineHeight;
    
    // SavedAt: solo la fecha en formato USA  
    // Asumiremos que formData.savedAt existe (si no, usamos la fecha actual)
    const savedDate = formData.savedAt ? formatDate(formData.savedAt) : formatDate(new Date());
    doc.setFontSize(12);
    doc.text(`${savedDate}`, marginLeft, currentY);
    currentY += lineHeight;
    
    // Aseguramos que el contenido de la portada no se sobrepase del margen inferior.
    if (currentY > pageHeight - marginBottom) {
      // Si excede, se puede agregar una página, pero en este ejemplo es poco probable.
    }
    
    // Agregamos una nueva página para la información detallada.
    doc.addPage();
    currentY = marginTop;
    
    // ===== Página 2: Información Detallada =====
    // Definiremos una función auxiliar para agregar líneas de texto y saltar de página si es necesario.
    const addTextLine = (text) => {
      // Si el siguiente salto de línea sobrepasa el margen inferior, se añade una nueva página.
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
    addTextLine(`Medical Condition: ${formData.personalInfo.client1.medicalCondition}`);
    addTextLine(`Do you have a trust?: ${formData.personalInfo.client1.trust}`);
    addTextLine(`Do you have a will?: ${formData.personalInfo.client1.will}`);
    addTextLine(`Did you get a tax refund?: ${formData.personalInfo.client1.taxRefund}`);
    addTextLine(""); // Línea en blanco

    // --- Sección: Client 2 Personal Info (si existe) ---
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
    
    // --- Sección: Kids (si existen) ---
    if (formData.personalInfo.kids && formData.personalInfo.kids.length > 0) {
      addTextLine("Kids Information:");
      formData.personalInfo.kids.forEach((kid, index) => {
        addTextLine(`Kid ${index + 1} Name: ${kid.fullName}`);
        addTextLine(`Kid ${index + 1} Date of Birth: ${formatDate(kid.dob)}`);
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
    const totalInsurable1 = Number(in1.debt) + Number(in1.income) + Number(in1.education) - Number(in1.subtractInsurances);
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
      const totalInsurable2 = Number(in2.debt) + Number(in2.income) + Number(in2.education) - Number(in2.subtractInsurances);
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
    const totalRetirement1 = Number(rt1.retiredYears) * Number(rt1.monthlyIncome) * 12;
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
      const totalRetirement2 = Number(rt2.retiredYears) * Number(rt2.monthlyIncome) * 12;
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
    
    // --- Sección: Monthly Savings Option and Plan Option ---
    addTextLine(`How much money can you comfortably put aside each month?: ${formData.taxInformation.planOption}`);
    addTextLine(`Would you take advantage of a plan to achieve this?: ${formData.taxInformation.planOption}`);  // Aquí se podría ajustar si hay un campo distinto para esta opción.
    addTextLine("");
    
    // --- Sección: Additional Information ---
    addTextLine("Additional Information:");
    addTextLine(`Financial Goals: ${formData.additionalInfo.financialGoals}`);
    addTextLine(`GFI Recommendations: ${formData.additionalInfo.recommendations}`);
    addTextLine(`Date Next Appointment: ${formatDate(formData.additionalInfo.nextAppointment)}`);
    
    // Finalmente, guardamos el PDF
    doc.save("financial_analysis.pdf");
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={generatePDF}>
        Export PDF
      </Button>
    </div>
  );
};

export default PDFExport;
