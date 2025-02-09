import * as Yup from 'yup';

export const personalInfoSchema = Yup.object().shape({
  fullName: Yup.string().required('Este campo es obligatorio'),
  email: Yup.string().email('Email inválido').required('Este campo es obligatorio'),
  phone: Yup.string().required('Este campo es obligatorio'),
  state: Yup.string().required('Este campo es obligatorio'),
  dob: Yup.date().required('Este campo es obligatorio'),
  smoker: Yup.string().required('Este campo es obligatorio'),
  trust: Yup.string().required('Este campo es obligatorio'),
  will: Yup.string().required('Este campo es obligatorio'),
  taxRefund: Yup.string().required('Este campo es obligatorio'),
});
