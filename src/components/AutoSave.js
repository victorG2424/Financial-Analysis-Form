// src/components/AutoSave.js
import { useFormikContext } from 'formik';
import { useEffect } from 'react';

const AutoSave = ({ save }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    save(values);
    // Se ejecuta cada vez que cambian los valores
  }, [values, save]);

  return null;
};

export default AutoSave;
