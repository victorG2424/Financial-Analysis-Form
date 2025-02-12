// src/components/TaxInformation.js
import React, { useContext } from 'react';
import { Formik, Form, FastField, useFormikContext } from 'formik';
import { FormContext } from '../context/FormContext';
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import AutoSave from './AutoSave';

const TaxNowFields = () => {
  const { values, setFieldValue } = useFormikContext();

  const handleChange = (field, value) => {
    const newVal = Number(value) || 0;
    setFieldValue(`taxNow.${field}`, newVal);
  };

  return (
    <>
      <FastField name="taxNow.checking">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Checking ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('checking', e.target.value)}
          />
        )}
      </FastField>
      <FastField name="taxNow.savings">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Savings ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('savings', e.target.value)}
          />
        )}
      </FastField>
      <FastField name="taxNow.other">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Other ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('other', e.target.value)}
          />
        )}
      </FastField>
      <div style={{ marginTop: '8px' }}>
        <Typography variant="h6">
          Total: ${Number(values.taxNow.checking || 0) + Number(values.taxNow.savings || 0) + Number(values.taxNow.other || 0)}
        </Typography>
      </div>
    </>
  );
};

const TaxLaterFields = () => {
  const { values, setFieldValue } = useFormikContext();

  const handleChange = (field, value) => {
    const newVal = Number(value) || 0;
    setFieldValue(`taxLater.${field}`, newVal);
  };

  return (
    <>
      <FastField name="taxLater.iras">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="IRAs ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('iras', e.target.value)}
          />
        )}
      </FastField>
      <FastField name="taxLater.retirementPlan">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="401(k)/403(b) ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('retirementPlan', e.target.value)}
          />
        )}
      </FastField>
      <FastField name="taxLater.other">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Other ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('other', e.target.value)}
          />
        )}
      </FastField>
      <div style={{ marginTop: '8px' }}>
        <Typography variant="h6">
          Total: ${Number(values.taxLater.iras || 0) + Number(values.taxLater.retirementPlan || 0) + Number(values.taxLater.other || 0)}
        </Typography>
      </div>
    </>
  );
};

const TaxAdvantagedFields = () => {
  const { values, setFieldValue } = useFormikContext();

  const handleChange = (field, value) => {
    const newVal = Number(value) || 0;
    setFieldValue(`taxAdvantaged.${field}`, newVal);
  };

  return (
    <>
      <FastField name="taxAdvantaged.rothIras">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Roth IRAs ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('rothIras', e.target.value)}
          />
        )}
      </FastField>
      <FastField name="taxAdvantaged.plan529">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="529 Plan ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('plan529', e.target.value)}
          />
        )}
      </FastField>
      <FastField name="taxAdvantaged.lifeInsurance">
        {({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Life Ins/Other ($)"
            type="number"
            style={{ marginTop: '10px', marginBottom: '5px' }}
            onChange={(e) => handleChange('lifeInsurance', e.target.value)}
          />
        )}
      </FastField>
      <div style={{ marginTop: '8px' }}>
        <Typography variant="h6">
          Total: ${Number(values.taxAdvantaged.rothIras || 0) + Number(values.taxAdvantaged.plan529 || 0) + Number(values.taxAdvantaged.lifeInsurance || 0)}
        </Typography>
      </div>
    </>
  );
};

const TaxInformation = () => {
  const { formData, setFormData } = useContext(FormContext);
  const initialValues = formData.taxInformation;

  const onSubmit = (values) => {
    console.log("Tax Information submitted", values);
    // Lógica adicional si es necesaria
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
        {({ values, handleChange, setFieldValue }) => {
          // Calcular totales de cada grupo
          const currentTaxNowTotal =
            Number(values.taxNow.checking || 0) +
            Number(values.taxNow.savings || 0) +
            Number(values.taxNow.other || 0);
          const currentTaxLaterTotal =
            Number(values.taxLater.iras || 0) +
            Number(values.taxLater.retirementPlan || 0) +
            Number(values.taxLater.other || 0);
          const currentTaxAdvTotal =
            Number(values.taxAdvantaged.rothIras || 0) +
            Number(values.taxAdvantaged.plan529 || 0) +
            Number(values.taxAdvantaged.lifeInsurance || 0);
          const currentGrandTotal = currentTaxNowTotal + currentTaxLaterTotal + currentTaxAdvTotal;

          return (
            <Form>
              <Grid container spacing={2}>
                {/* Las tres columnas */}
                <Grid item xs={4}>
                  <h4>Tax Now</h4>
                  <TaxNowFields />
                </Grid>
                <Grid item xs={4}>
                  <h4>Tax Later</h4>
                  <TaxLaterFields />
                </Grid>
                <Grid item xs={4}>
                  <h4>Tax Advantaged</h4>
                  <TaxAdvantagedFields />
                </Grid>
 
                {/* Monthly Savings */}
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
                          onChange={handleChange}
                          style={{ marginBottom: '5px' }}
                        />
                      }
                      label={`$${option}`}
                    />
                  ))}
                  <Typography variant="h6" style={{ marginTop: '10px' }}>
                    Monthly Savings: {values.monthlySavings && values.monthlySavings.length > 0 ? values.monthlySavings.join(', ') : "0"}
                  </Typography>
                </Grid>
                {/* Plan Option */}
                <Grid item xs={12}>
                  <h4>If we can put together a plan to show you how to achieve all this, would that be something you would take advantage of?</h4>
                  <RadioGroup row name="planOption" value={values.planOption} onChange={handleChange}>
                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio />} label="No" />
                  </RadioGroup>
                  <Typography variant="h6" style={{ marginTop: '10px' }}>
                    Plan Option: {values.planOption || "No"}
                  </Typography>
                </Grid>
              </Grid>
              <AutoSave save={handleAutoSave} />

            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default TaxInformation;
