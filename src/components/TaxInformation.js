// src/components/TaxInformation.js
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { FormContext } from '../context/FormContext';
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { useFormikContext } from 'formik';
import AutoSave from './AutoSave';

const TaxInformation = () => {
  const { formData, setFormData } = useContext(FormContext);
  const initialValues = formData.taxInformation;

  const onSubmit = (values) => {
    console.log("Tax Information submitted", values);
    // Puedes agregar lógica adicional si es necesario.
  };

  // Función de autosave
  const handleAutoSave = (values) => {
    if (JSON.stringify(values) === JSON.stringify(formData.taxInformation)) return;
    setFormData(prev => ({
      ...prev,
      taxInformation: values,
    }));
  };

  // Dentro de Formik usaremos un componente auxiliar para manejar los cambios y recalcular totales.
  const TaxNowFields = () => {
    const { values, setFieldValue } = useFormikContext();
    const handleChange = (field, value) => {
      const newVal = Number(value) || 0;
      setFieldValue(`taxNow.${field}`, newVal);
      // Recalcular total Tax Now
      const total = Number(values.taxNow.checking) + Number(values.taxNow.savings) + Number(values.taxNow.other);
      setFieldValue('taxNow.total', total);
    };
    return (
      <>
        <TextField
          fullWidth
          label="Checking ($)"
          name="taxNow.checking"
          type="number"
          value={values.taxNow.checking}
          onChange={(e) => handleChange('checking', e.target.value)}
        />
        <TextField
          fullWidth
          label="Savings ($)"
          name="taxNow.savings"
          type="number"
          value={values.taxNow.savings}
          onChange={(e) => handleChange('savings', e.target.value)}
        />
        <TextField
          fullWidth
          label="Other ($)"
          name="taxNow.other"
          type="number"
          value={values.taxNow.other}
          onChange={(e) => handleChange('other', e.target.value)}
        />
        <TextField
          fullWidth
          label="Total ($)"
          name="taxNow.total"
          type="number"
          value={values.taxNow.total}
          InputProps={{ readOnly: true }}
        />
      </>
    );
  };

  const TaxLaterFields = () => {
    const { values, setFieldValue } = useFormikContext();
    const handleChange = (field, value) => {
      const newVal = Number(value) || 0;
      setFieldValue(`taxLater.${field}`, newVal);
      const total = Number(values.taxLater.iras) + Number(values.taxLater.retirementPlan) + Number(values.taxLater.other);
      setFieldValue('taxLater.total', total);
    };
    return (
      <>
        <TextField
          fullWidth
          label="IRAs ($)"
          name="taxLater.iras"
          type="number"
          value={values.taxLater.iras}
          onChange={(e) => handleChange('iras', e.target.value)}
        />
        <TextField
          fullWidth
          label="401(k)/403(b) ($)"
          name="taxLater.retirementPlan"
          type="number"
          value={values.taxLater.retirementPlan}
          onChange={(e) => handleChange('retirementPlan', e.target.value)}
        />
        <TextField
          fullWidth
          label="Other ($)"
          name="taxLater.other"
          type="number"
          value={values.taxLater.other}
          onChange={(e) => handleChange('other', e.target.value)}
        />
        <TextField
          fullWidth
          label="Total ($)"
          name="taxLater.total"
          type="number"
          value={values.taxLater.total}
          InputProps={{ readOnly: true }}
        />
      </>
    );
  };

  const TaxAdvantagedFields = () => {
    const { values, setFieldValue } = useFormikContext();
    const handleChange = (field, value) => {
      const newVal = Number(value) || 0;
      setFieldValue(`taxAdvantaged.${field}`, newVal);
      const total = Number(values.taxAdvantaged.rothIras) + Number(values.taxAdvantaged.plan529) + Number(values.taxAdvantaged.lifeInsurance);
      setFieldValue('taxAdvantaged.total', total);
    };
    return (
      <>
        <TextField
          fullWidth
          label="Roth IRAs ($)"
          name="taxAdvantaged.rothIras"
          type="number"
          value={values.taxAdvantaged.rothIras}
          onChange={(e) => handleChange('rothIras', e.target.value)}
        />
        <TextField
          fullWidth
          label="529 Plan ($)"
          name="taxAdvantaged.plan529"
          type="number"
          value={values.taxAdvantaged.plan529}
          onChange={(e) => handleChange('plan529', e.target.value)}
        />
        <TextField
          fullWidth
          label="Life Ins/Other ($)"
          name="taxAdvantaged.lifeInsurance"
          type="number"
          value={values.taxAdvantaged.lifeInsurance}
          onChange={(e) => handleChange('lifeInsurance', e.target.value)}
        />
        <TextField
          fullWidth
          label="Total ($)"
          name="taxAdvantaged.total"
          type="number"
          value={values.taxAdvantaged.total}
          InputProps={{ readOnly: true }}
        />
      </>
    );
  };

  return (
    <div>
      <h2>Tax Information - Client 1</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Tax Now */}
              <Grid item xs={4}>
                <h4>Tax Now</h4>
                <TaxNowFields />
              </Grid>
              {/* Tax Later */}
              <Grid item xs={4}>
                <h4>Tax Later</h4>
                <TaxLaterFields />
              </Grid>
              {/* Tax Advantaged */}
              <Grid item xs={4}>
                <h4>Tax Advantaged</h4>
                <TaxAdvantagedFields />
              </Grid>
              {/* Checkbox options */}
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
              {/* Radio buttons */}
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
              <Button variant="contained" color="primary" type="submit">
                Next Form
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TaxInformation;
