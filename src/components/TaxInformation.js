// src/components/TaxInformation.js
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { Button, Grid, TextField, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { FormContext } from '../context/FormContext';
import AutoSave from './AutoSave';

const TaxInformation = () => {
  const { formData, setFormData } = useContext(FormContext);
  const initialValues = formData.taxInformation;

  const onSubmit = (values) => {
    console.log("Tax Information submitted", values);
  };

  const handleAutoSave = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.taxInformation)) return;
  
    setFormData(prev => ({
      ...prev,
      taxInformation: values,
    }));
  };
  

  return (
    <div>
      <h2>Tax Information - Client 1</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Sección Superior: Tax Now */}
              <Grid item xs={4}>
                <h4>Tax Now</h4>
                <TextField
                  fullWidth
                  label="Checking ($)"
                  name="taxNow.checking"
                  type="number"
                  value={values.taxNow.checking}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Savings ($)"
                  name="taxNow.savings"
                  type="number"
                  value={values.taxNow.savings}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Other ($)"
                  name="taxNow.other"
                  type="number"
                  value={values.taxNow.other}
                  onChange={handleChange}
                />
                <h5>
                  Total: ${Number(values.taxNow.checking) + Number(values.taxNow.savings) + Number(values.taxNow.other)}
                </h5>
              </Grid>
              {/* Sección Superior: Tax Later */}
              <Grid item xs={4}>
                <h4>Tax Later</h4>
                <TextField
                  fullWidth
                  label="IRAs ($)"
                  name="taxLater.iras"
                  type="number"
                  value={values.taxLater.iras}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="401(k)/403(b) ($)"
                  name="taxLater.retirementPlan"
                  type="number"
                  value={values.taxLater.retirementPlan}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Other ($)"
                  name="taxLater.other"
                  type="number"
                  value={values.taxLater.other}
                  onChange={handleChange}
                />
                <h5>
                  Total: ${Number(values.taxLater.iras) + Number(values.taxLater.retirementPlan) + Number(values.taxLater.other)}
                </h5>
              </Grid>
              {/* Sección Superior: Tax Advantaged */}
              <Grid item xs={4}>
                <h4>Tax Advantaged</h4>
                <TextField
                  fullWidth
                  label="Roth IRAs ($)"
                  name="taxAdvantaged.rothIras"
                  type="number"
                  value={values.taxAdvantaged.rothIras}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="529 Plan ($)"
                  name="taxAdvantaged.plan529"
                  type="number"
                  value={values.taxAdvantaged.plan529}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Life Ins/Other ($)"
                  name="taxAdvantaged.lifeInsurance"
                  type="number"
                  value={values.taxAdvantaged.lifeInsurance}
                  onChange={handleChange}
                />
                <h5>
                  Total: ${Number(values.taxAdvantaged.rothIras) + Number(values.taxAdvantaged.plan529) + Number(values.taxAdvantaged.lifeInsurance)}
                </h5>
              </Grid>
              {/* Sección Inferior 1: Checkbox options */}
              <Grid item xs={12}>
                <h4>How much money can you comfortably put aside each month?</h4>
                {["200", "500", "1000", "1500", "2500", "5000", "10000", "10000+"].map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        name="monthlySavings"
                        value={option}
                        checked={values.monthlySavings.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFieldValue("monthlySavings", [...values.monthlySavings, option]);
                          } else {
                            setFieldValue("monthlySavings", values.monthlySavings.filter(val => val !== option));
                          }
                        }}
                      />
                    }
                    label={`$${option}`}
                  />
                ))}
              </Grid>
              {/* Sección Inferior 2: Radio buttons */}
              <Grid item xs={12}>
                <h4>If we can put together a plan to show you how to achieve all this, would that be something you would take advantage of?</h4>
                <RadioGroup row name="planOption" value={values.planOption} onChange={handleChange}>
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </Grid>
            </Grid>
            <AutoSave save={handleAutoSave} />
            <div style={{ marginTop: '20px' }}>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaxInformation;
