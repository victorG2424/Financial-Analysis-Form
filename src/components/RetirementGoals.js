// src/components/RetirementGoals.js
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import { Grid, TextField, Typography } from '@mui/material';
import AutoSave from './AutoSave';

const spanStyle = {
  backgroundColor: '#77ED8B',
  borderRadius: '5px',
  color: '#118D57',
  padding: '10px',
  display: 'inline-block',
  fontWeight: 600,
  fontSize: '14px',
};

const RetirementGoals = () => {
  const { formData, setFormData } = useContext(FormContext);

  const client1Values = formData.retirementGoals.client1;
  const client2Values = formData.retirementGoals.client2 || {
    goals: '',
    retireAge: 0,
    retiredYears: 0,
    monthlyIncome: 0,
  };

  const onSubmitClient1 = (values) => {
    console.log("Retirement Goals Client 1 submitted", values);
  };

  const onSubmitClient2 = (values) => {
    console.log("Retirement Goals Client 2 submitted", values);
  };

  const calculateTotalRetirement = (values) => {
    const years = Number(values.retiredYears) || 0;
    const monthlyIncome = Number(values.monthlyIncome) || 0;
    return years * monthlyIncome * 12;
  };

  const handleAutoSaveClient1 = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.retirementGoals.client1)) return;
    setFormData(prev => ({
      ...prev,
      retirementGoals: {
        ...prev.retirementGoals,
        client1: values,
      },
    }));
  };

  const handleAutoSaveClient2 = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.retirementGoals.client2)) return;
    setFormData(prev => ({
      ...prev,
      retirementGoals: {
        ...prev.retirementGoals,
        client2: values,
      },
    }));
  };

  return (
    <div>
      <h2>Retirement Goals</h2>
      <Grid container spacing={2}>
        <Grid item xs={formData.personalInfo.client2 ? 6 : 12}>
          <h3>Client 1</h3>
          <Formik
            initialValues={client1Values}
            enableReinitialize={true}
            onSubmit={onSubmitClient1}
          >
            {({ values, handleChange }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Goals & Dreams in Retirement"
                      name="goals"
                      value={values.goals}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Age to Retire"
                      name="retireAge"
                      type="number"
                      value={values.retireAge}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Years Retired"
                      name="retiredYears"
                      type="number"
                      value={values.retiredYears}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Monthly Income Needed ($)"
                      name="monthlyIncome"
                      type="number"
                      value={values.monthlyIncome}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" >
                    <span style={spanStyle}>Total Needed for Retirement: ${calculateTotalRetirement(values)}</span>
                    </Typography>
                  </Grid>
                </Grid>
                <AutoSave save={handleAutoSaveClient1} />
              </Form>
            )}
          </Formik>
        </Grid>
        {formData.personalInfo.client2 && (
          <Grid item xs={6}>
            <h3>Client 2</h3>
            <Formik
              initialValues={client2Values}
              enableReinitialize={true}
              onSubmit={onSubmitClient2}
            >
              {({ values, handleChange }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Goals & Dreams in Retirement"
                        name="goals"
                        value={values.goals}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Age to Retire"
                        name="retireAge"
                        type="number"
                        value={values.retireAge}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Years Retired"
                        name="retiredYears"
                        type="number"
                        value={values.retiredYears}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Monthly Income Needed ($)"
                        name="monthlyIncome"
                        type="number"
                        value={values.monthlyIncome}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="h6" >
                    <span style={spanStyle}>Total Needed for Retirement: ${calculateTotalRetirement(values)}</span>
                    </Typography>
                  </Grid>
                  </Grid>
                  <AutoSave save={handleAutoSaveClient2} />
                </Form>
              )}
            </Formik>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default RetirementGoals;
