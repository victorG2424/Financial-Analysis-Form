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

const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date)) return '';
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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

  const handleEdit = async (client) => {
    // Creamos el objeto base para Client 1 a partir del documento principal.
    let newData = {
      personalInfo: {
        client1: {
          fullName: client.fullName || '',
          email: client.email || '',
          phone: client.phone || '',
          state: client.state || '',
          // Si el documento principal no tiene dob, se deja vacío.
          dob: client.dob || '',
          smoker: client.smoker || '',
          medicalCondition: client.medicalCondition || '',
          trust: client.trust || '',
          will: client.will || '',
          taxRefund: client.taxRefund || '',
          agent: client.Agent || '',
        },
        // Inicialmente se asignan null/empty; luego se actualizarán si existen en la subcolección.
        client2: null,
        kids: []
      },
      insurableNeeds: {
        client1: {
          debt: client.insurableData?.debt || 0,
          income: client.insurableData?.income || 0,
          education: 0,
          subtractInsurances: 0,
          mortgage: client.insurableData?.mortgage || 0,
        },
        client2: null,
      },
      retirementGoals: {
        client1: client.retirementgoals || { goals: '', retireAge: 0, retiredYears: 0, monthlyIncome: 0 },
        client2: null,
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

    // Traemos los datos de la subcolección "relatedPeople"
    try {
      const { client2Data, kidsData } = await fetchRelatedPeople(client.id);
      newData.personalInfo.client2 = client2Data;
      newData.personalInfo.kids = kidsData;
    } catch (error) {
      console.error("Error fetching related people:", error);
    }

    setFormData(newData);
    navigate("/");
  };

  const handleExport = (client) => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text("Client 1 Information:", 20, y);
    y += 7;
    doc.setFontSize(12);
    doc.text(`Name: ${client.fullName}`, 20, y);
    y += 7;
    doc.text(`Email: ${client.email}`, 20, y);
    y += 7;
    doc.text(`Phone: ${client.phone}`, 20, y);
    y += 7;
    doc.text(`State: ${client.state}`, 20, y);
    y += 7;
    doc.text(`Agent: ${client.Agent}`, 20, y);
    y += 7;
    doc.text(`Smoker: ${client.smoker}`, 20, y);
    y += 7;
    doc.text(`Medical Condition: ${client.medicalCondition}`, 20, y);
    y += 7;
    doc.text(`Trust: ${client.trust}`, 20, y);
    y += 7;
    doc.text(`Will: ${client.will}`, 20, y);
    y += 7;
    doc.text(`Tax Refund: ${client.taxRefund}`, 20, y);
    y += 7;
    doc.save(`client_${client.id}.pdf`);
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
                <TableCell>{client.hasKids ? 'Yes' : 'No'}</TableCell>
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
