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
import { jsPDF } from "jspdf";
import generateHTMLForClient from './PDFExportDB'; // Asegúrate de que PDFExportDB.js esté en la misma carpeta

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
        taxNow: { checking: 0, savings: 0, other: 0, total: 0 },
        taxLater: { iras: 0, retirementPlan: 0, other: 0, total: 0 },
        taxAdvantaged: { rothIras: 0, plan529: 0, lifeInsurance: 0, total: 0 },
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

  // Función para exportar: abre una nueva pestaña con el HTML generado
  const handleExport = async (client) => {
    try {
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

      // Genera el HTML usando la función generateHTMLForClient
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

  // Función para descargar el PDF con la misma información
// Dentro de ViewClients.js, reemplaza la función handleDownload existente por la siguiente:

const handleDownload = async (client) => {
  try {
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

    // Genera el HTML usando la función generateHTMLForClient importada
    const htmlString = generateHTMLForClient(fullData);
    
    // Abrir una nueva ventana con el HTML generado
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlString);
      newWindow.document.close();
      newWindow.focus();
      // Esperamos un breve lapso para asegurarnos de que el contenido se renderice y luego se llama a window.print()
      setTimeout(() => {
        newWindow.print();
      }, 1000);
    } else {
      console.error("No se pudo abrir la ventana para descarga.");
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
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
                  <Button variant="outlined" color="success" onClick={() => handleDownload(client)} sx={{ ml: 1 }}>
                    Download File
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
