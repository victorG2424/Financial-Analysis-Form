# Financial Analysis Form

Este proyecto es una aplicación web fullstack (sin backend tradicional) desarrollada en ReactJS que utiliza Firebase Firestore para almacenar la información de un formulario de registro denominado "Financial Analysis".

## Funcionalidades
- Formulario multistep dividido en 5 tabs:
  - Personal Information
  - Insurable Needs
  - Retirement Goals
  - Tax Information
  - Additional Information
- Registro de usuarios con ID único.
- Navegación entre tabs sin pérdida de información.
- Búsqueda y edición de usuarios almacenados.
- Agregar un segundo cliente (Client 2) y hasta 4 hijos (Kids).
- Exportación a PDF al finalizar el formulario.

## Tecnologías utilizadas
- ReactJS (Hooks y Context API)
- React Router
- Firebase Firestore
- Material-UI para la interfaz de usuario
- Formik y Yup para validación de formularios
- jsPDF para generación de PDF

## Configuración
1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Configura el archivo **.env** con tus credenciales de Firebase.
4. Ejecuta `npm start` para iniciar el servidor de desarrollo.
