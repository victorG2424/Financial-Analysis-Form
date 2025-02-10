// src/components/KidsModal.js
import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import { FormContext } from '../context/FormContext';

const KidsModal = ({ open, handleClose }) => {
  const { setFormData } = useContext(FormContext);
  const [numKids, setNumKids] = useState(1);

  const handleSave = () => {
    // Crea un arreglo con 'numKids' objetos (cada uno con fullName y dob vacíos)
    const kidsArray = Array.from({ length: numKids }, () => ({ fullName: '', dob: '' }));
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        kids: kidsArray,
      },
    }));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>How many kids do you have?</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Number of Kids"
          value={numKids}
          onChange={(e) => setNumKids(Number(e.target.value))}
          fullWidth
        >
          {[1, 2, 3, 4].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KidsModal;
