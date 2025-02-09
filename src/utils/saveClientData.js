// src/utils/saveClientData.js
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

// Función para calcular el total necesario para el retiro.
// Fórmula: totalNeededForRetirement = retiredYears * monthlyIncome * 12
const calculateTotalRetirement = (retirementData) => {
  const years = Number(retirementData.retiredYears) || 0;
  const monthlyIncome = Number(retirementData.monthlyIncome) || 0;
  return years * monthlyIncome * 12;
};

const saveClientData = async (formData) => {
  try {
    // Datos de Client 1 (incluye los nuevos campos y la propiedad "Agent")
    const client1Data = {
      fullName: formData.personalInfo.client1.fullName,
      email: formData.personalInfo.client1.email,
      phone: formData.personalInfo.client1.phone,
      state: formData.personalInfo.client1.state,
      smoker: formData.personalInfo.client1.smoker,
      medicalCondition: formData.personalInfo.client1.medicalCondition,
      trust: formData.personalInfo.client1.trust,
      will: formData.personalInfo.client1.will,
      taxRefund: formData.personalInfo.client1.taxRefund,
      Agent: formData.personalInfo.client1.agent, // Guardamos el agente elegido
      insurableData: {
        debt: formData.insurableNeeds.client1.debt,
        income: formData.insurableNeeds.client1.income,
        mortgage: formData.insurableNeeds.client1.mortgage || 0,
      },
      retirementgoals: {
        ...formData.retirementGoals.client1,
        totalNeededForRetirement: calculateTotalRetirement(formData.retirementGoals.client1),
      },
      taxData: formData.taxInformation,
      AdditionalInfo: formData.additionalInfo,
      savedAt: new Date(), // Fecha y hora del guardado (hora local)
    };

    // Guardamos Client 1 en la colección "clients"
    const clientDocRef = await addDoc(collection(db, "clients"), client1Data);
    console.log("Client 1 guardado con ID:", clientDocRef.id);

    // Preparamos la subcolección "relatedPeople" dentro del documento de Client 1
    const relatedPeopleCollection = collection(clientDocRef, "relatedPeople");

    // Si existe Client 2, se guarda su información
    if (formData.personalInfo.client2) {
      const client2Data = {
        fullName: formData.personalInfo.client2.fullName,
        email: formData.personalInfo.client2.email,
        phone: formData.personalInfo.client2.phone,
        smoker: formData.personalInfo.client2.smoker,
        medicalCondition: formData.personalInfo.client2.medicalCondition,
        trust: formData.personalInfo.client2.trust,
        will: formData.personalInfo.client2.will,
        taxRefund: formData.personalInfo.client2.taxRefund,
        insurableData: {
          debt: formData.insurableNeeds.client2.debt,
          income: formData.insurableNeeds.client2.income,
          mortgage: formData.insurableNeeds.client2.mortgage || 0,
        },
        retirementgoals: {
          ...formData.retirementGoals.client2,
          totalNeededForRetirement: calculateTotalRetirement(formData.retirementGoals.client2),
        },
        savedAt: new Date(), // Fecha y hora para Client 2
      };

      await setDoc(doc(relatedPeopleCollection, "Cliente2"), client2Data);
      console.log("Client 2 guardado en relatedPeople");
    }

    // Si existen datos de los Kids, se guardan individualmente
    if (formData.personalInfo.kids && formData.personalInfo.kids.length > 0) {
      formData.personalInfo.kids.forEach(async (kid, index) => {
        const kidData = {
          fullName: kid.fullName,
          dob: kid.dob,
        };
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
