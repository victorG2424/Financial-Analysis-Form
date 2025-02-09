// src/components/InsurableNeeds.js
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import { Button, Grid, TextField } from '@mui/material';
import AutoSave from './AutoSave';

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
    setFormData(prev => ({
      ...prev,
      insurableNeeds: {
        ...prev.insurableNeeds,
        client1: values,
      },
    }));
  };

  const handleAutoSaveClient2 = (values) => {
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
                    <h4>Total Insurable Need: ${calculateTotal(values)}</h4>
                  </Grid>
                </Grid>
                <AutoSave save={handleAutoSaveClient1} />
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }}>
                  Save Client 1
                </Button>
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
                        label="Subtract Current Insurances ($)"
                        name="subtractInsurances"
                        type="number"
                        value={values.subtractInsurances}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <h4>Total Insurable Need: ${calculateTotal(values)}</h4>
                    </Grid>
                  </Grid>
                  <AutoSave save={handleAutoSaveClient2} />
                  <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }}>
                    Save Client 2
                  </Button>
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
