// src/utils/saveClientData.js
import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Calcula el total necesario para el retiro
const calculateTotalRetirement = (retirementData) => {
  const years = Number(retirementData.retiredYears) || 0;
  const monthlyIncome = Number(retirementData.monthlyIncome) || 0;
  return years * monthlyIncome * 12;
};

const saveClientData = async (formData) => {
  try {
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
      Agent: formData.personalInfo.client1.agent, // Se guarda el agente seleccionado
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
      savedAt: new Date(), // Hora local
      hasClient2: formData.personalInfo.client2 ? true : false,
      hasKids: formData.personalInfo.kids && formData.personalInfo.kids.length > 0,
    };

    if (formData.editingClientId) {
      const clientDocRef = doc(db, "clients", formData.editingClientId);
      await updateDoc(clientDocRef, client1Data);
      console.log("Client 1 updated with ID:", formData.editingClientId);
    } else {
      const clientDocRef = await addDoc(collection(db, "clients"), client1Data);
      console.log("Client 1 created with ID:", clientDocRef.id);

      const relatedPeopleCollection = collection(clientDocRef, "relatedPeople");

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
          savedAt: new Date(),
        };

        await setDoc(doc(relatedPeopleCollection, "Cliente2"), client2Data);
        console.log("Client 2 saved in relatedPeople");
      }

      if (formData.personalInfo.kids && formData.personalInfo.kids.length > 0) {
        formData.personalInfo.kids.forEach(async (kid, index) => {
          const kidData = {
            fullName: kid.fullName,
            dob: kid.dob,
          };
          await setDoc(doc(relatedPeopleCollection, `Kid${index + 1}`), kidData);
          console.log(`Kid${index + 1} saved in relatedPeople`);
        });
      }
    }
    console.log("All data saved successfully in Firestore.");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export default saveClientData;
