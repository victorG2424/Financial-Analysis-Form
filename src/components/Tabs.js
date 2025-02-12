// src/components/FormTabs.js
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import PersonalInfo from './PersonalInfo';
import InsurableNeeds from './InsurableNeeds';
import RetirementGoals from './RetirementGoals';
import TaxInformation from './TaxInformation';
import AdditionalInfo from './AdditionalInfo';

const FormTabs = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const tabLabels = [
    "Personal Information",
    "Insurable Needs",
    "Retirement Goals",
    "Tax Information",
    "Additional Information"
  ];

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={handleChange} variant="scrollable">
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            sx={index !== tabLabels.length - 1 ? {
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                height: '50%',
                width: '2px',
                backgroundColor: 'rgba(19,56,87,0.5)',
              },
            } : {}}
          />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && <PersonalInfo />}
        {currentTab === 1 && <InsurableNeeds />}
        {currentTab === 2 && <RetirementGoals />}
        {currentTab === 3 && <TaxInformation />}
        {currentTab === 4 && <AdditionalInfo />}
      </Box>
    </Box>
  );
};

export default FormTabs;
