// src/components/InsurableNeeds.js
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import { Button, Grid, TextField, Typography  } from '@mui/material';
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

const InsurableNeeds = () => {
  const { formData, setFormData } = useContext(FormContext);

  const client1Values = formData.insurableNeeds.client1;
  const client2Values = formData.insurableNeeds.client2 || {
    debt: 0,
    income: 0,
    education: 0,
    subtractInsurances: 0
  };

  const onSubmitClient1 = (values) => {
    console.log("Insurable Needs Client 1 submitted", values);
  };

  const onSubmitClient2 = (values) => {
    console.log("Insurable Needs Client 2 submitted", values);
  };

  const calculateTotal = (values) => {
    return (
      Number(values.debt) +
      Number(values.income) +
      Number(values.education) -
      Number(values.subtractInsurances)
    );
  };

  const handleAutoSaveClient1 = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.insurableNeeds.client1)) return;

    setFormData(prev => ({
      ...prev,
      insurableNeeds: {
        ...prev.insurableNeeds,
        client1: values,
      },
    }));
  };

  const handleAutoSaveClient2 = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.insurableNeeds.client2)) return;

    setFormData(prev => ({
      ...prev,
      insurableNeeds: {
        ...prev.insurableNeeds,
        client2: values,
      },
    }));
  };


  return (
    <div>
      <h2>Insurable Needs</h2>
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
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Debt ($)"
                      name="debt"
                      type="number"
                      value={values.debt}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Income ($)"
                      name="income"
                      type="number"
                      value={values.income}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Education ($)"
                      name="education"
                      type="number"
                      value={values.education}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="Subtract Current Insurances ($)"
                      name="subtractInsurances"
                      type="number"
                      value={values.subtractInsurances}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      <span style={spanStyle}>
                        Total Insurable Need: ${calculateTotal(values)}
                      </span>
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
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Debt ($)"
                        name="debt"
                        type="number"
                        value={values.debt}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Income ($)"
                        name="income"
                        type="number"
                        value={values.income}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Education ($)"
                        name="education"
                        type="number"
                        value={values.education}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Current Insurances ($)"
                        name="subtractInsurances"
                        type="number"
                        value={values.subtractInsurances}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant="h6">
                      <span style={spanStyle}>
                        Total Insurable Need: ${calculateTotal(values)}
                      </span>
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

export default InsurableNeeds;
