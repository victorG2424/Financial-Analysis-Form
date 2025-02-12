// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            border: '2px solid rgba(217,217,217,0.5)', // Borde normal
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '2px solid rgba(217,217,217,0.5)', // Borde al pasar el mouse
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid rgba(217,217,217,0.5)', // Borde cuando el input está enfocado
          },
          '& .MuiInputBase-input': {
            fontFamily: '"Montserrat", sans-serif',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: '"Montserrat", sans-serif',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'inherit',
          '&.Mui-selected': {
            color: '#133857',
          },
          borderBottom: '2px solid rgba(217,217,217,0.5)', // Separador debajo de cada tab
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#133857',
        },
      },
    },
  },
});

export default theme;
