// src/context/FormContext.js
import React, { createContext, useState, useEffect } from 'react';

export const FormContext = createContext();

export const initialState = {
  personalInfo: {
    client1: {
      fullName: '',
      email: '',
      phone: '',
      state: '',
      dob: '', // Formato: "YYYY-MM-DD"
      smoker: '',
      medicalCondition: '',
      trust: '',
      will: '',
      taxRefund: '',
      agent: '' // Se asignará en AdditionalInfo
    },
    client2: null, // Se agregará cuando se pulse "Add Another Client"
    kids: [] // Arreglo para la información de los kids
  },
  insurableNeeds: {
    client1: {
      debt: 0,
      income: 0,
      education: 0,
      subtractInsurances: 0,
      mortgage: 0,
    },
    client2: null,
  },
  retirementGoals: {
    client1: {
      goals: '',
      retireAge: 0,
      retiredYears: 0,
      monthlyIncome: 0,
    },
    client2: null,
  },
  taxInformation: {
    taxNow: {
      checking: 0,
      savings: 0,
      other: 0,
      total: 0, // Total = checking + savings + other
    },
    taxLater: {
      iras: 0,
      retirementPlan: 0, // Representa 401(k)/403(b)
      other: 0,
      total: 0, // Total = iras + retirementPlan + other
    },
    taxAdvantaged: {
      rothIras: 0,
      plan529: 0,
      lifeInsurance: 0,
      total: 0, // Total = rothIras + plan529 + lifeInsurance
    },
    monthlySavings: [],
    planOption: '',
  },
  additionalInfo: {
    financialGoals: '',
    recommendations: '',
    nextAppointment: '',
  },
  isEdit: false,
  editingClientId: ""
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    return storedData ? JSON.parse(storedData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
