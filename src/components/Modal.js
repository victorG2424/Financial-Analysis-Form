import React, { useState, useContext, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField, Grid } from '@mui/material';
import { FormContext } from '../context/FormContext';

const KidsModal = ({ open, handleClose }) => {
  const { formData, setFormData } = useContext(FormContext);
  const [numKids, setNumKids] = useState(1);
  const [kidsInfo, setKidsInfo] = useState([]);

  const handleSave = () => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        kids: kidsInfo
      }
    }));
    handleClose();
  };

  const handleKidChange = (index, field, value) => {
    const updatedKids = [...kidsInfo];
    updatedKids[index] = { ...updatedKids[index], [field]: value };
    setKidsInfo(updatedKids);
  };

  // Inicializa kidsInfo cuando cambia el número de kids
  useEffect(() => {
    setKidsInfo(Array.from({ length: numKids }, () => ({ fullName: '', dob: '' })));
  }, [numKids]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>How many kids do you want to add?</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Number of Kids"
          value={numKids}
          onChange={(e) => setNumKids(Number(e.target.value))}
          fullWidth
        >
          {[1, 2, 3, 4].map(n => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </TextField>
        <Grid container spacing={2} style={{ marginTop: '10px' }}>
          {kidsInfo.map((kid, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={`Kid ${index + 1} Full Name`}
                  value={kid.fullName}
                  onChange={(e) => handleKidChange(index, 'fullName', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={`Kid ${index + 1} Date of Birth`}
                  InputLabelProps={{ shrink: true }}
                  value={kid.dob}
                  onChange={(e) => handleKidChange(index, 'dob', e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Kids Info
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KidsModal;
