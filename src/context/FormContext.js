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
      dob: '',
      smoker: '',
      medicalCondition: '',
      trust: '',
      will: '',
      taxRefund: '',
      agent: '' // Se asignará en el formulario de Additional Information
    },
    client2: null,
    kids: [] // Arreglo de kids; se actualizará mediante el modal "Add Kids"
  },
  insurableNeeds: {
    client1: {
      debt: 0,
      income: 0,
      education: 0,
      subtractInsurances: 0,
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
    },
    taxLater: {
      iras: 0,
      retirementPlan: 0,
      other: 0,
    },
    taxAdvantaged: {
      rothIras: 0,
      plan529: 0,
      lifeInsurance: 0,
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
