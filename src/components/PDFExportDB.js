// src/components/PDFExportDB.js
import React from 'react';

// Helper para formatear fecha a mm/dd/yyyy
const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date)) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Calcula Total Insurable Need: (debt + income + education - subtractInsurances)
const calculateInsurableTotal = (data) => {
  return Number(data.debt) + Number(data.income) + Number(data.education) - Number(data.subtractInsurances);
};

// Calcula Total Needed for Retirement: (retiredYears * monthlyIncome * 12)
const calculateRetirementTotal = (data) => {
  return Number(data.retiredYears) * Number(data.monthlyIncome) * 12;
};

// Función para obtener toda la información del cliente (documento principal y subcolección relatedPeople)
const fetchClientFullData = async (clientId) => {
  // Importación dinámica de funciones Firestore y la configuración de la BD.
  const { doc, getDoc, collection, getDocs } = await import('firebase/firestore');
  const { db } = await import('../firebase/config');

  const clientDocRef = doc(db, "clients", clientId);
  const clientSnap = await getDoc(clientDocRef);
  if (!clientSnap.exists()) {
    throw new Error("Client not found");
  }
  const clientData = clientSnap.data();

  // Obtenemos la subcolección "relatedPeople"
  const relatedPeopleRef = collection(clientDocRef, "relatedPeople");
  const snapshot = await getDocs(relatedPeopleRef);
  let client2Data = null;
  let kidsData = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (docSnap.id === "Cliente2") {
      client2Data = data;
    } else if (docSnap.id.startsWith("Kid")) {
      kidsData.push(data);
    }
  });

  return {
    ...clientData,
    client2: client2Data,
    kids: kidsData,
  };
};

// Función para generar el HTML con la información completa del cliente
const generateHTMLForClient = (fullData) => {
  // Bloque de estilos actualizado con tus estilos finales
  const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
        color: #333;
      }
      .container {
        max-width: 900px;
        margin: 30px auto;
        padding: 20px;
        background: white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
      h1, h2 {
        color: #133857;
        margin-bottom: 10px;
      }
      h1 {
        text-align: center;
        font-size: 28px;
        margin-bottom: 20px;
        border-bottom: 3px solid #133857;
        padding-bottom: 10px;
      }
      h2 {
        font-size: 22px;
        border-left: 5px solid #133857;
        padding-left: 10px;
        margin-top: 30px;
      }
      .section {
        padding: 15px;
        margin-bottom: 20px;
        background: #ffffff;
        border-left: 5px solid #3498db;
        box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
      }
      .section:nth-child(even) {
        border-left: 5px solid #e67e22;
      }
      .info {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .info p {
        width: 48%;
        margin: 5px 0;
        padding: 5px;
        background: #f1f1f1;
        border-radius: 5px;
      }
      .separator {
        height: 2px;
        background: #ddd;
        margin: 30px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f1f1f1;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        margin-top: 30px;
        color: #555;
      }
    </style>
  `;

  // Página 1: Portada
  const page1 = `
    <div class="container">
      <img src="../GFI-Logo-blue.svg" alt="Financial Analysis Report" style="display: block; margin: 0 auto; width: 60%;">
      <h1>Financial Analysis Report</h1>
      <h2>Client: ${fullData.fullName}</h2>
      <p><strong>Agent:</strong> ${fullData.Agent}</p>
      <div class="separator"></div>
    </div>
  `;

  // Página 2: Información Personal
  const client1Info = `
    <div class="section">
      <h2>Información de ${fullData.fullName}</h2>
      <div class="info">
        <p><strong>Email:</strong> ${fullData.email}</p>
        <p><strong>Phone Number:</strong> ${fullData.phone}</p>
        <p><strong>State:</strong> ${fullData.state}</p>
        <p><strong>Date of Birth:</strong> ${fullData.dob ? fullData.dob : ''}</p>
        <p><strong>Smoker:</strong> ${fullData.smoker}</p>
        <p><strong>Medical Condition:</strong> ${fullData.medicalCondition}</p>
        <p><strong>Do you have a trust?:</strong> ${fullData.trust}</p>
        <p><strong>Do you have a will?:</strong> ${fullData.will}</p>
        <p><strong>Did you get a tax refund?:</strong> ${fullData.taxRefund}</p>
      </div>
    </div>
  `;

  const client2Info = fullData.client2 ? `
    <div class="section">
      <h2>Información de ${fullData.client2.fullName}</h2>
      <div class="info">
        <p><strong>Email:</strong> ${fullData.client2.email}</p>
        <p><strong>Phone Number:</strong> ${fullData.client2.phone}</p>
        <p><strong>State:</strong> ${fullData.client2.state}</p>
        <p><strong>Date of Birth:</strong> ${fullData.client2.dob ? fullData.client2.dob : ''}</p>
        <p><strong>Smoker:</strong> ${fullData.client2.smoker}</p>
        <p><strong>Medical Condition:</strong> ${fullData.client2.medicalCondition}</p>
        <p><strong>Do you have a trust?:</strong> ${fullData.client2.trust}</p>
        <p><strong>Do you have a will?:</strong> ${fullData.client2.will}</p>
        <p><strong>Did you get a tax refund?:</strong> ${fullData.client2.taxRefund}</p>
      </div>
    </div>
  ` : '';

  const kidsInfo = (fullData.kids && fullData.kids.length > 0) ? `
    <div class="section">
      <h2>Información de los Hijos</h2>
      <div class="info">
        ${fullData.kids.map((kid, index) => `
          <p><strong>Name:</strong> ${kid.fullName}</p>
          <p><strong>Date of Birth:</strong> ${kid.dob ? kid.dob : ''}</p>
        `).join('')}
      </div>
    </div>
  ` : '';

  const page2 = `
    <div class="container">
      ${client1Info}
      ${client2Info}
      ${kidsInfo}
    </div>
  `;

  // Página 3: Insurable Needs
  const insurable1 = fullData.insurableData ? `
    <div class="section">
      <h2>Insurable Needs de ${fullData.fullName}</h2>
      <div class="info">
        <p><strong>Debt:</strong> ${fullData.insurableData.debt}</p>
        <p><strong>Income:</strong> ${fullData.insurableData.income}</p>
        <p><strong>Education:</strong> ${fullData.insurableData.education}</p>
        <p><strong>Subtract Current Insurances:</strong> ${fullData.insurableData.subtractInsurances}</p>
        <p><strong>Mortgage:</strong> ${fullData.insurableData.mortgage}</p>
        <p><strong>Total Insurable Need:</strong> ${calculateInsurableTotal(fullData.insurableData)}</p>
      </div>
    </div>
  ` : '<div class="section"><p>No insurable data for Client 1.</p></div>';

  const insurable2 = (fullData.client2 && fullData.client2.insurableData) ? `
    <div class="section">
      <h2>Insurable Needs de ${fullData.client2.fullName}</h2>
      <div class="info">
        <p><strong>Debt:</strong> ${fullData.client2.insurableData.debt}</p>
        <p><strong>Income:</strong> ${fullData.client2.insurableData.income}</p>
        <p><strong>Education:</strong> ${fullData.client2.insurableData.education}</p>
        <p><strong>Subtract Current Insurances:</strong> ${fullData.client2.insurableData.subtractInsurances}</p>
        <p><strong>Mortgage:</strong> ${fullData.client2.insurableData.mortgage}</p>
        <p><strong>Total Insurable Need:</strong> ${calculateInsurableTotal(fullData.client2.insurableData)}</p>
      </div>
    </div>
  ` : '';

  const page3 = `
    <div class="container">
      ${insurable1}
      ${insurable2}
    </div>
  `;

  // Página 4: Retirement Goals
  const retirement1 = fullData.retirementgoals ? `
    <div class="section">
      <h2>Retirement Goals de ${fullData.fullName}</h2>
      <div class="info">
        <p><strong>Goals & Dreams in Retirement:</strong> ${fullData.retirementgoals.goals}</p>
        <p><strong>Age to Retire:</strong> ${fullData.retirementgoals.retireAge}</p>
        <p><strong>Years Retired:</strong> ${fullData.retirementgoals.retiredYears}</p>
        <p><strong>Monthly Income:</strong> ${fullData.retirementgoals.monthlyIncome}</p>
        <p><strong>Total Needed for Retirement:</strong> ${calculateRetirementTotal(fullData.retirementgoals)}</p>
      </div>
    </div>
  ` : '<div class="section"><p>No retirement goals for Client 1.</p></div>';

  const retirement2 = (fullData.client2 && fullData.client2.retirementgoals) ? `
    <div class="section">
      <h2>Retirement Goals de ${fullData.client2.fullName}</h2>
      <div class="info">
        <p><strong>Goals & Dreams in Retirement:</strong> ${fullData.client2.retirementgoals.goals}</p>
        <p><strong>Age to Retire:</strong> ${fullData.client2.retirementgoals.retireAge}</p>
        <p><strong>Years Retired:</strong> ${fullData.client2.retirementgoals.retiredYears}</p>
        <p><strong>Monthly Income:</strong> ${fullData.client2.retirementgoals.monthlyIncome}</p>
        <p><strong>Total Needed for Retirement:</strong> ${calculateRetirementTotal(fullData.client2.retirementgoals)}</p>
      </div>
    </div>
  ` : '';

  const page4 = `
    <div class="container">
      ${retirement1}
      ${retirement2}
    </div>
  `;

  // Página 5: Tax Information en tres columnas
  const taxInfo = fullData.taxData ? `
    <div class="container">
      <div class="section">
        <h2>Tax Information - ${fullData.fullName}</h2>
        <table>
          <tr>
            <th>Tax Now</th>
            <th>Tax Later</th>
            <th>Tax Advantaged</th>
          </tr>
          <tr>
            <td>
              <p><strong>Checking:</strong> ${fullData.taxData.taxNow.checking}</p>
              <p><strong>Savings:</strong> ${fullData.taxData.taxNow.savings}</p>
              <p><strong>Other:</strong> ${fullData.taxData.taxNow.other}</p>
              <p><strong>Total:</strong> ${fullData.taxData.taxNow.total}</p>
            </td>
            <td>
              <p><strong>IRAs:</strong> ${fullData.taxData.taxLater.iras}</p>
              <p><strong>401(k)/403(b):</strong> ${fullData.taxData.taxLater.retirementPlan}</p>
              <p><strong>Other:</strong> ${fullData.taxData.taxLater.other}</p>
              <p><strong>Total:</strong> ${fullData.taxData.taxLater.total}</p>
            </td>
            <td>
              <p><strong>Roth IRAs:</strong> ${fullData.taxData.taxAdvantaged.rothIras}</p>
              <p><strong>Plan 529:</strong> ${fullData.taxData.taxAdvantaged.plan529}</p>
              <p><strong>Life Ins/Other:</strong> ${fullData.taxData.taxAdvantaged.lifeInsurance}</p>
              <p><strong>Total:</strong> ${fullData.taxData.taxAdvantaged.total}</p>
            </td>
          </tr>
        </table>
        <div class="info">
          <p><strong>Monthly Savings:</strong> ${
            fullData.taxData.monthlySavings && fullData.taxData.monthlySavings.length > 0 
              ? fullData.taxData.monthlySavings.join(', ')
              : "0"
          }</p>
          <p><strong>Plan Option:</strong> ${fullData.taxData.planOption ? fullData.taxData.planOption : "No"}</p>
        </div>
      </div>
    </div>
  ` : '<div class="container"><div class="section"><p>No tax information available.</p></div></div>';

  const page5 = taxInfo;

  // Página 6: Additional Information
  const additional = fullData.AdditionalInfo ? `
    <div class="container">
      <div class="section">
        <h2>Additional Information</h2>
        <div class="info">
          <p><strong>Financial Goals:</strong> ${fullData.AdditionalInfo.financialGoals}</p>
          <p><strong>GFI Recommendations:</strong> ${fullData.AdditionalInfo.recommendations}</p>
          <p><strong>Date Next Appointment:</strong> ${formatDate(fullData.AdditionalInfo.nextAppointment)}</p>
        </div>
      </div>
      <div class="footer">
        <p>© 2025 Financial Report - All Rights Reserved</p>
      </div>
    </div>
  ` : '<div class="container"><div class="section"><p>No additional information available.</p></div></div>';

  const page6 = additional;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Financial Analysis Report</title>
        ${styles}
      </head>
      <body>
        ${page1}
        ${page2}
        ${page3}
        ${page4}
        ${page5}
        ${page6}
      </body>
    </html>
  `;
  return html;
};

export default generateHTMLForClient;
