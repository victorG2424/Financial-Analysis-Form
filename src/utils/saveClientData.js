// src/utils/saveClientData.js
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

// Función para calcular el total necesario para el retiro
const calculateTotalRetirement = (retirementData) => {
  const years = Number(retirementData.retiredYears) || 0;
  const monthlyIncome = Number(retirementData.monthlyIncome) || 0;
  return years * monthlyIncome * 12;
};

// Función principal para guardar los datos
const saveClientData = async (formData) => {
  try {
    // Prepara los datos de Cliente1
    const client1Data = {
      fullName: formData.personalInfo.client1.fullName,
      email: formData.personalInfo.client1.email,
      phone: formData.personalInfo.client1.phone,
      state: formData.personalInfo.client1.state,
      insurableData: {
        debt: formData.insurableNeeds.client1.debt,
        income: formData.insurableNeeds.client1.income,
        // Si tienes un campo "mortgage", de lo contrario asigna 0 o algún valor predeterminado
        mortgage: formData.insurableNeeds.client1.mortgage || 0,
      },
      retirementgoals: {
        ...formData.retirementGoals.client1,
        totalNeededForRetirement: calculateTotalRetirement(formData.retirementGoals.client1),
      },
      taxData: formData.taxInformation,
      AdditionalInfo: formData.additionalInfo,
    };

    // Guarda Cliente1 en la colección "clients"
    const clientDocRef = await addDoc(collection(db, "clients"), client1Data);
    console.log("Cliente1 guardado con ID:", clientDocRef.id);

    // Prepara la subcolección "relatedPeople"
    const relatedPeopleCollection = collection(clientDocRef, "relatedPeople");

    // Guarda Cliente2 (si existe)
    if (formData.personalInfo.client2) {
      const client2Data = {
        fullName: formData.personalInfo.client2.fullName,
        email: formData.personalInfo.client2.email,
        phone: formData.personalInfo.client2.phone,
        insurableData: {
          debt: formData.insurableNeeds.client2.debt,
          income: formData.insurableNeeds.client2.income,
          mortgage: formData.insurableNeeds.client2.mortgage || 0,
        },
        retirementgoals: {
          ...formData.retirementGoals.client2,
          totalNeededForRetirement: calculateTotalRetirement(formData.retirementGoals.client2),
        },
      };

      // Usamos setDoc para crear un documento con ID "Cliente2"
      await setDoc(doc(relatedPeopleCollection, "Cliente2"), client2Data);
      console.log("Cliente2 guardado en relatedPeople");
    }

    // Guarda los datos de los Kids (si existen)
    if (formData.personalInfo.kids && formData.personalInfo.kids.length > 0) {
      formData.personalInfo.kids.forEach(async (kid, index) => {
        const kidData = {
          fullName: kid.fullName,
          dob: kid.dob,
        };
        // Creamos documentos con IDs "Kid1", "Kid2", etc.
        await setDoc(doc(relatedPeopleCollection, `Kid${index + 1}`), kidData);
        console.log(`Kid${index + 1} guardado en relatedPeople`);
      });
    }

    console.log("Todos los datos se han guardado con éxito en Firestore.");
  } catch (error) {
    console.error("Error al guardar los datos:", error);
  }
};

export default saveClientData;
