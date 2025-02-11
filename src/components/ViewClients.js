// src/components/ViewClients.js
import React, { useState, useEffect, useContext } from 'react';
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormContext, initialState } from '../context/FormContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Función para formatear fecha en formato USA (mm/dd/yyyy)
const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date)) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Función para traer datos de la subcolección "relatedPeople" para un cliente
const fetchRelatedPeople = async (clientId) => {
  const relatedPeopleRef = collection(db, "clients", clientId, "relatedPeople");
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
  return { client2Data, kidsData };
};

// Función para generar el HTML con la información del cliente
const generateHTMLForClient = (fullData) => {
  // Generamos un bloque de estilos en línea para simular "páginas"
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
      .page { padding: 20px; margin: 0 auto; max-width: 800px; border-bottom: 1px solid #ccc; page-break-after: always; }
      h1, h2, h3, h4, h5, p { margin: 5px 0; }
      .section { margin-bottom: 20px; }
    </style>
  `;
  
  // Página 1: Portada
  const page1 = `
    <div class="page">
      <h1>${fullData.fullName}</h1>
      <h2>Agente: ${fullData.Agent}</h2>
      <h1>Financial Analysis</h1>
      <p>${fullData.savedAt ? formatDate(fullData.savedAt) : formatDate(new Date())}</p>
    </div>
  `;

  // Página 2: Información Personal
  const client1Info = `
    <div class="section">
      <h2>Client 1 Information</h2>
      <p><strong>Name:</strong> ${fullData.fullName}</p>
      <p><strong>Email:</strong> ${fullData.email}</p>
      <p><strong>Phone Number:</strong> ${fullData.phone}</p>
      <p><strong>State:</strong> ${fullData.state}</p>
      <p><strong>Date of Birth:</strong> ${formatDate(fullData.dob)}</p>
      <p><strong>Smoker:</strong> ${fullData.smoker}</p>
      <p><strong>Medical Condition:</strong> ${fullData.medicalCondition}</p>
      <p><strong>Do you have a trust?:</strong> ${fullData.trust}</p>
      <p><strong>Do you have a will?:</strong> ${fullData.will}</p>
      <p><strong>Did you get a tax refund?:</strong> ${fullData.taxRefund}</p>
    </div>
  `;

  const client2Info = fullData.client2 ? `
    <div class="section">
      <h2>Client 2 Information</h2>
      <p><strong>Name:</strong> ${fullData.client2.fullName}</p>
      <p><strong>Email:</strong> ${fullData.client2.email}</p>
      <p><strong>Phone Number:</strong> ${fullData.client2.phone}</p>
      <p><strong>State:</strong> ${fullData.client2.state}</p>
      <p><strong>Date of Birth:</strong> ${formatDate(fullData.client2.dob)}</p>
      <p><strong>Smoker:</strong> ${fullData.client2.smoker}</p>
      <p><strong>Medical Condition:</strong> ${fullData.client2.medicalCondition}</p>
      <p><strong>Do you have a trust?:</strong> ${fullData.client2.trust}</p>
      <p><strong>Do you have a will?:</strong> ${fullData.client2.will}</p>
      <p><strong>Did you get a tax refund?:</strong> ${fullData.client2.taxRefund}</p>
    </div>
  ` : '';

  const kidsInfo = (fullData.kids && fullData.kids.length > 0) ? `
    <div class="section">
      <h2>Kids Information</h2>
      ${fullData.kids.map((kid, index) => `
        <p><strong>Kid ${index + 1} Name:</strong> ${kid.fullName}</p>
        <p><strong>Kid ${index + 1} Date of Birth:</strong> ${formatDate(kid.dob)}</p>
      `).join('')}
    </div>
  ` : '';

  const page2 = `
    <div class="page">
      ${client1Info}
      ${client2Info}
      ${kidsInfo}
    </div>
  `;

  // Página 3: Insurable Needs
  const insurable1 = fullData.insurableData ? `
    <div class="section">
      <h2>Insurable Needs - Client 1</h2>
      <p><strong>Debt:</strong> ${fullData.insurableData.debt}</p>
      <p><strong>Income:</strong> ${fullData.insurableData.income}</p>
      <p><strong>Education:</strong> ${fullData.insurableData.education}</p>
      <p><strong>Subtract Current Insurances:</strong> ${fullData.insurableData.subtractInsurances}</p>
      <p><strong>Mortgage:</strong> ${fullData.insurableData.mortgage}</p>
      <p><strong>Total Insurable Need:</strong> ${Number(fullData.insurableData.debt) + Number(fullData.insurableData.income) + Number(fullData.insurableData.education) - Number(fullData.insurableData.subtractInsurances)}</p>
    </div>
  ` : '<p>No insurable data for Client 1.</p>';

  const insurable2 = (fullData.client2 && fullData.client2.insurableData) ? `
    <div class="section">
      <h2>Insurable Needs - Client 2</h2>
      <p><strong>Debt:</strong> ${fullData.client2.insurableData.debt}</p>
      <p><strong>Income:</strong> ${fullData.client2.insurableData.income}</p>
      <p><strong>Education:</strong> ${fullData.client2.insurableData.education}</p>
      <p><strong>Subtract Current Insurances:</strong> ${fullData.client2.insurableData.subtractInsurances}</p>
      <p><strong>Mortgage:</strong> ${fullData.client2.insurableData.mortgage}</p>
      <p><strong>Total Insurable Need:</strong> ${Number(fullData.client2.insurableData.debt) + Number(fullData.client2.insurableData.income) + Number(fullData.client2.insurableData.education) - Number(fullData.client2.insurableData.subtractInsurances)}</p>
    </div>
  ` : '';

  const page3 = `
    <div class="page">
      ${insurable1}
      ${insurable2}
    </div>
  `;

  // Página 4: Retirement Goals
  const retirement1 = fullData.retirementgoals ? `
    <div class="section">
      <h2>Retirement Goals - Client 1</h2>
      <p><strong>Goals & Dreams in Retirement:</strong> ${fullData.retirementgoals.goals}</p>
      <p><strong>Age to Retire:</strong> ${fullData.retirementgoals.retireAge}</p>
      <p><strong>Years Retired:</strong> ${fullData.retirementgoals.retiredYears}</p>
      <p><strong>Monthly Income:</strong> ${fullData.retirementgoals.monthlyIncome}</p>
      <p><strong>Total Needed for Retirement:</strong> ${Number(fullData.retirementgoals.retiredYears) * Number(fullData.retirementgoals.monthlyIncome) * 12}</p>
    </div>
  ` : '<p>No retirement goals for Client 1.</p>';

  const retirement2 = (fullData.client2 && fullData.client2.retirementgoals) ? `
    <div class="section">
      <h2>Retirement Goals - Client 2</h2>
      <p><strong>Goals & Dreams in Retirement:</strong> ${fullData.client2.retirementgoals.goals}</p>
      <p><strong>Age to Retire:</strong> ${fullData.client2.retirementgoals.retireAge}</p>
      <p><strong>Years Retired:</strong> ${fullData.client2.retirementgoals.retiredYears}</p>
      <p><strong>Monthly Income:</strong> ${fullData.client2.retirementgoals.monthlyIncome}</p>
      <p><strong>Total Needed for Retirement:</strong> ${Number(fullData.client2.retirementgoals.retiredYears) * Number(fullData.client2.retirementgoals.monthlyIncome) * 12}</p>
    </div>
  ` : '';

  const page4 = `
    <div class="page">
      ${retirement1}
      ${retirement2}
    </div>
  `;

  // Página 5: Tax Information (Solo para Client 1, según tu estructura)
  const taxInfo = fullData.taxData ? `
    <div class="section">
      <h2>Tax Information - Client 1</h2>
      <h3>Tax Now:</h3>
      <p><strong>Checking:</strong> ${fullData.taxData.taxNow.checking}</p>
      <p><strong>Savings:</strong> ${fullData.taxData.taxNow.savings}</p>
      <p><strong>Other:</strong> ${fullData.taxData.taxNow.other}</p>
      <h3>Tax Later:</h3>
      <p><strong>IRAs:</strong> ${fullData.taxData.taxLater.iras}</p>
      <p><strong>Retirement Plan:</strong> ${fullData.taxData.taxLater.retirementPlan}</p>
      <p><strong>Other:</strong> ${fullData.taxData.taxLater.other}</p>
      <h3>Tax Advantaged:</h3>
      <p><strong>Roth IRAs:</strong> ${fullData.taxData.taxAdvantaged.rothIras}</p>
      <p><strong>Plan 529:</strong> ${fullData.taxData.taxAdvantaged.plan529}</p>
      <p><strong>Life Insurance:</strong> ${fullData.taxData.taxAdvantaged.lifeInsurance}</p>
      <p><strong>Monthly Savings Option:</strong> ${fullData.taxData.planOption}</p>
    </div>
  ` : '<p>No tax information available.</p>';

  const page5 = `
    <div class="page">
      ${taxInfo}
    </div>
  `;

  // Página 6: Additional Information
  const additional = fullData.AdditionalInfo ? `
    <div class="section">
      <h2>Additional Information</h2>
      <p><strong>Financial Goals:</strong> ${fullData.AdditionalInfo.financialGoals}</p>
      <p><strong>GFI Recommendations:</strong> ${fullData.AdditionalInfo.recommendations}</p>
      <p><strong>Date Next Appointment:</strong> ${formatDate(fullData.AdditionalInfo.nextAppointment)}</p>
    </div>
  ` : '<p>No additional information available.</p>';

  const page6 = `
    <div class="page">
      ${additional}
    </div>
  `;

  // Combinar todas las páginas en un HTML completo
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Financial Analysis Export</title>
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

const ViewClients = () => {
  const { setFormData } = useContext(FormContext);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "clients"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsData);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = async (client) => {
    let client2Data = client.client2 || null;
    let kidsData = client.kids || [];

    if (client.hasClient2 && !client.client2) {
      try {
        const { client2Data: fetchedClient2, kidsData: fetchedKids } = await fetchRelatedPeople(client.id);
        client2Data = fetchedClient2;
        if (!client.kids || client.kids.length === 0) {
          kidsData = fetchedKids;
        }
      } catch (error) {
        console.error("Error fetching related people:", error);
      }
    }

    const newData = {
      personalInfo: {
        client1: {
          fullName: client.fullName || '',
          email: client.email || '',
          phone: client.phone || '',
          state: client.state || '',
          dob: client.dob || '',
          smoker: client.smoker || '',
          medicalCondition: client.medicalCondition || '',
          trust: client.trust || '',
          will: client.will || '',
          taxRefund: client.taxRefund || '',
          agent: client.Agent || '',
        },
        client2: client2Data,
        kids: kidsData,
      },
      insurableNeeds: {
        client1: {
          debt: client.insurableData?.debt || 0,
          income: client.insurableData?.income || 0,
          education: client.insurableData?.education || 0,
          subtractInsurances: client.insurableData?.subtractInsurances || 0,
          mortgage: client.insurableData?.mortgage || 0,
        },
        client2: client2Data && client2Data.insurableData
          ? {
              debt: client2Data.insurableData.debt,
              income: client2Data.insurableData.income,
              education: client2Data.insurableData.education,
              subtractInsurances: client2Data.insurableData.subtractInsurances,
              mortgage: client2Data.insurableData.mortgage || 0,
            }
          : { debt: 0, income: 0, education: 0, subtractInsurances: 0, mortgage: 0 },
      },
      retirementGoals: {
        client1: client.retirementgoals || { goals: '', retireAge: 0, retiredYears: 0, monthlyIncome: 0 },
        client2: client2Data && client2Data.retirementgoals
          ? client2Data.retirementgoals
          : { goals: '', retireAge: 0, retiredYears: 0, monthlyIncome: 0 },
      },
      taxInformation: client.taxData || {
        taxNow: { checking: 0, savings: 0, other: 0 },
        taxLater: { iras: 0, retirementPlan: 0, other: 0 },
        taxAdvantaged: { rothIras: 0, plan529: 0, lifeInsurance: 0 },
        monthlySavings: [],
        planOption: '',
      },
      additionalInfo: client.AdditionalInfo || { financialGoals: '', recommendations: '', nextAppointment: '' },
      isEdit: true,
      editingClientId: client.id,
    };

    setFormData(newData);
    navigate("/");
  };

  // Nueva función de exportación: abre una nueva pestaña con un HTML generado
  const handleExport = async (client) => {
    try {
      // Si es necesario, obtenemos información extra desde la subcolección:
      let client2Data = client.client2 || null;
      let kidsData = client.kids || [];
      if (client.hasClient2 && !client.client2) {
        const { client2Data: fetchedClient2, kidsData: fetchedKids } = await fetchRelatedPeople(client.id);
        client2Data = fetchedClient2;
        if (!client.kids || client.kids.length === 0) {
          kidsData = fetchedKids;
        }
      }
      const fullData = {
        ...client,
        client2: client2Data,
        kids: kidsData,
      };

      // Generamos el HTML con la función definida
      const htmlString = generateHTMLForClient(fullData);
      // Abrir nueva pestaña y escribir el HTML
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(htmlString);
        newWindow.document.close();
      } else {
        console.error("No se pudo abrir la ventana de exportación.");
      }
    } catch (error) {
      console.error("Error exporting HTML:", error);
    }
  };

  const handleCreateClient = () => {
    setFormData(initialState);
    navigate("/");
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleCreateClient} sx={{ mb: 2 }}>
        Crear Cliente
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name (Client 1)</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Client 2</TableCell>
              <TableCell>Kids</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.fullName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.Agent || '-'}</TableCell>
                <TableCell>{client.hasClient2 ? 'Yes' : 'No'}</TableCell>
                <TableCell>{client.kids && client.kids.length > 0 ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(client)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleExport(client)} sx={{ ml: 1 }}>
                    Export
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewClients;
