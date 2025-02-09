// src/components/AgentModalManager.js
import { useContext, useEffect } from 'react';
import { FormContext } from '../context/FormContext';

const AgentModalManager = ({ setAgentModalOpen }) => {
  const { formData } = useContext(FormContext);

  useEffect(() => {
    if (!formData.personalInfo.client1.agent) {
      setAgentModalOpen(true);
    }
  }, [formData.personalInfo.client1.agent, setAgentModalOpen]);

  return null;
};

export default AgentModalManager;
