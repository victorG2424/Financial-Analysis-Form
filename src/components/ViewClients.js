// src/components/ViewClients.js
import React, { useState, useEffect, useContext } from 'react';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormContext, initialState } from '../context/FormContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const ViewClients = () => {
  const { setFormData } = useContext(FormContext);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Consulta todos los documentos de la colección "clients"
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

  const handleEdit = (client) => {
    // Convertir los datos de Firestore al formato esperado por el formulario.
    setFormData({
      personalInfo: {
        client1: {
          fullName: client.fullName || '',
          email: client.email || '',
          phone: client.phone || '',
          state: client.state || '',
          dob: '',
          smoker: client.smoker || '',
          medicalCondition: client.medicalCondition || '',
          trust: client.trust || '',
          will: client.will || '',
          taxRefund: client.taxRefund || '',
          agent: client.Agent || '',
        },
        client2: null, // Simplificado; para ampliarlo se debe consultar la subcolección.
        kids: []      // Simplificado.
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
      taxInformation: client.taxData || { taxNow: { checking: 0, savings: 0, other: 0 }, taxLater: { iras: 0, retirementPlan: 0, other: 0 }, taxAdvantaged: { rothIras: 0, plan529: 0, lifeInsurance: 0 }, monthlySavings: [], planOption: '' },
      additionalInfo: client.AdditionalInfo || { financialGoals: '', recommendations: '', nextAppointment: '' },
      isEdit: true,
      editingClientId: client.id,
    });
    navigate("/"); // Regresa al formulario para editar.
  };

  const handleExport = (client) => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(client, null, 2), 10, 10);
    doc.save(`client_${client.id}.pdf`);
  };

  const handleCreateClient = () => {
    // Reinicia el contexto a su estado inicial (formulario en blanco)
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
              <TableCell>Client 2</TableCell>
              <TableCell>Kids</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map(client => (
              <TableRow key={client.id}>
                <TableCell>{client.fullName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.hasClient2 ? "Yes" : "No"}</TableCell>
                <TableCell>{client.hasKids ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(client)}>Edit</Button>
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
