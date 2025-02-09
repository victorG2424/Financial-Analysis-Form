// src/components/PersonalInfo.js
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { personalInfoSchema } from '../utils/validationSchema';
import { FormContext } from '../context/FormContext';
import { Button, Grid, TextField, MenuItem } from '@mui/material';
import AutoSave from './AutoSave';

const PersonalInfo = () => {
    const { formData, setFormData } = useContext(FormContext);

    const initialValuesClient1 = formData.personalInfo.client1;
    const initialValuesClient2 = formData.personalInfo.client2 || {
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
    };

    const onSubmitClient1 = (values) => {
        console.log("Client 1 info submitted", values);
        // Lógica adicional (por ejemplo, navegación)
    };

    const onSubmitClient2 = (values) => {
        console.log("Client 2 info submitted", values);
    };

    // Función para agregar Client 2 (actualiza todas las secciones relacionadas)
    const handleAddClient2 = () => {
        if (!formData.personalInfo.client2) {
            setFormData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    client2: {
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
                    },
                },
                insurableNeeds: {
                    ...prev.insurableNeeds,
                    client2: {
                        debt: 0,
                        income: 0,
                        education: 0,
                        subtractInsurances: 0,
                    },
                },
                retirementGoals: {
                    ...prev.retirementGoals,
                    client2: {
                        goals: '',
                        retireAge: 0,
                        retiredYears: 0,
                        monthlyIncome: 0,
                    },
                }
            }));
        }
    };

    const handleRemoveClient2 = () => {
        setFormData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                client2: null,
            },
            insurableNeeds: {
                ...prev.insurableNeeds,
                client2: null,
            },
            retirementGoals: {
                ...prev.retirementGoals,
                client2: null,
            }
        }));
    };

    const handleAutoSaveClient1 = (values) => {
        // Comparar usando JSON.stringify (método simple para una comparación profunda)
        if (JSON.stringify(values) === JSON.stringify(formData.personalInfo.client1)) return;
      
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            client1: values,
          },
        }));
      };
      

      const handleAutoSaveClient2 = (values) => {
        if (JSON.stringify(values) === JSON.stringify(formData.personalInfo.client2)) return;
      
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            client2: values,
          },
        }));
      };
      

    return (
        <div>
            <h2>Personal Information - Client 1</h2>
            <Formik
                initialValues={initialValuesClient1}
                validationSchema={personalInfoSchema}
                onSubmit={onSubmitClient1}
                enableReinitialize
            >
                {({ values, handleChange, errors, touched }) => (
                    <Form>
                        <Grid container spacing={2}>
                            {/* Campos del formulario */}
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullName"
                                    value={values.fullName}
                                    onChange={handleChange}
                                    error={touched.fullName && Boolean(errors.fullName)}
                                    helperText={touched.fullName && errors.fullName}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="State"
                                    name="state"
                                    value={values.state}
                                    onChange={handleChange}
                                    error={touched.state && Boolean(errors.state)}
                                    helperText={touched.state && errors.state}
                                >
                                    {['California', 'New York', 'Texas', 'Florida'].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date of Birth"
                                    name="dob"
                                    InputLabelProps={{ shrink: true }}
                                    value={values.dob}
                                    onChange={handleChange}
                                    error={touched.dob && Boolean(errors.dob)}
                                    helperText={touched.dob && errors.dob}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Smoker"
                                    name="smoker"
                                    value={values.smoker}
                                    onChange={handleChange}
                                    error={touched.smoker && Boolean(errors.smoker)}
                                    helperText={touched.smoker && errors.smoker}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Do you have a trust?"
                                    name="trust"
                                    value={values.trust}
                                    onChange={handleChange}
                                    error={touched.trust && Boolean(errors.trust)}
                                    helperText={touched.trust && errors.trust}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Do you have a will?"
                                    name="will"
                                    value={values.will}
                                    onChange={handleChange}
                                    error={touched.will && Boolean(errors.will)}
                                    helperText={touched.will && errors.will}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Did you get a tax refund?"
                                    name="taxRefund"
                                    value={values.taxRefund}
                                    onChange={handleChange}
                                    error={touched.taxRefund && Boolean(errors.taxRefund)}
                                    helperText={touched.taxRefund && errors.taxRefund}
                                >
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Medical Condition"
                                    name="medicalCondition"
                                    value={values.medicalCondition}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <AutoSave save={handleAutoSaveClient1} />
                        <div style={{ marginTop: '20px' }}>
                            <Button variant="contained" color="primary" type="submit">
                                Next Form
                            </Button>
                            {!formData.personalInfo.client2 && (
                                <Button variant="outlined" color="secondary" onClick={handleAddClient2} style={{ marginLeft: '10px' }}>
                                    Add Another Client
                                </Button>
                            )}
                            {formData.personalInfo.client2 && (
                                <Button variant="outlined" color="error" onClick={handleRemoveClient2} style={{ marginLeft: '10px' }}>
                                    Remove Client 2
                                </Button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>

            {formData.personalInfo.client2 && (
                <div style={{ marginTop: '40px' }}>
                    <h2>Personal Information - Client 2</h2>
                    <Formik
                        initialValues={initialValuesClient2}
                        validationSchema={personalInfoSchema}
                        onSubmit={onSubmitClient2}
                        enableReinitialize
                    >
                        {({ values, handleChange, errors, touched }) => (
                            <Form>
                                {/* Campos de Client 2 */}
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="fullName"
                                            value={values.fullName}
                                            onChange={handleChange}
                                            error={touched.fullName && Boolean(errors.fullName)}
                                            helperText={touched.fullName && errors.fullName}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={values.phone}
                                            onChange={handleChange}
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="State"
                                            name="state"
                                            value={values.state}
                                            onChange={handleChange}
                                            error={touched.state && Boolean(errors.state)}
                                            helperText={touched.state && errors.state}
                                        >
                                            {['California', 'New York', 'Texas', 'Florida'].map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Date of Birth"
                                            name="dob"
                                            InputLabelProps={{ shrink: true }}
                                            value={values.dob}
                                            onChange={handleChange}
                                            error={touched.dob && Boolean(errors.dob)}
                                            helperText={touched.dob && errors.dob}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Smoker"
                                            name="smoker"
                                            value={values.smoker}
                                            onChange={handleChange}
                                            error={touched.smoker && Boolean(errors.smoker)}
                                            helperText={touched.smoker && errors.smoker}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Do you have a trust?"
                                            name="trust"
                                            value={values.trust}
                                            onChange={handleChange}
                                            error={touched.trust && Boolean(errors.trust)}
                                            helperText={touched.trust && errors.trust}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Do you have a will?"
                                            name="will"
                                            value={values.will}
                                            onChange={handleChange}
                                            error={touched.will && Boolean(errors.will)}
                                            helperText={touched.will && errors.will}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Did you get a tax refund?"
                                            name="taxRefund"
                                            value={values.taxRefund}
                                            onChange={handleChange}
                                            error={touched.taxRefund && Boolean(errors.taxRefund)}
                                            helperText={touched.taxRefund && errors.taxRefund}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Medical Condition"
                                            name="medicalCondition"
                                            value={values.medicalCondition}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <AutoSave save={handleAutoSaveClient2} />
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
};

export default PersonalInfo;
