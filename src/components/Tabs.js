import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import PersonalInfo from './PersonalInfo';
import InsurableNeeds from './InsurableNeeds';
import RetirementGoals from './RetirementGoals';
import TaxInformation from './TaxInformation';
import AdditionalInfo from './AdditionalInfo';

const FormTabs = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={handleChange} variant="scrollable">
        <Tab label="Personal Information" />
        <Tab label="Insurable Needs" />
        <Tab label="Retirement Goals" />
        <Tab label="Tax Information" />
        <Tab label="Additional Information" />
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
