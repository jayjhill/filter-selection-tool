// src/App.tsx

import React, { useState } from 'react';
import SystemDesignerForm, { type UserInputs } from './components/SystemDesignerForm';
import OutputDisplay from './components/OutputDisplay';
import type { Filter } from './data/filters'; // Type import
import { filtersData } from './data/filters';   // Value import
import './App.css';

// Define side-stream percentage targets for OPEN systems
const SIDE_STREAM_PERCENTAGES = {
  Separator: { min: 0.20, max: 0.25 }, // 20-25%
  VAF: { min: 0.05, max: 0.10 },       // 5-10%
  Vortisand: { min: 0.01, max: 0.05 }, // 1-5%
};

interface SelectedFilters {
  Separator?: Filter;
  VAF?: Filter;
  Vortisand?: Filter;
}

const findMatchingFilter = (
  type: Filter['Filter Type'],
  inputs: UserInputs
): Filter | undefined => {
  if (inputs.systemType === 'open') {
    // --- OPEN SYSTEM LOGIC ---
    if (inputs.tonnage === undefined || inputs.recirc === undefined || inputs.recirc <= 0) {
      // console.log(`OPEN: Skipping ${type} - Tonnage or Recirc missing/invalid.`);
      return undefined;
    }

    const config = SIDE_STREAM_PERCENTAGES[type as keyof typeof SIDE_STREAM_PERCENTAGES];
    if (!config) {
      console.error(`OPEN: No side-stream percentage config for type: ${type}`);
      return undefined;
    }

    const minTargetSideStreamFlow = inputs.recirc * config.min;

    let potentialFilters = filtersData
      .filter(f => f['Filter Type'] === type)
      // Rule 1: Filter's own flow rate must be >= calculated minimum side-stream requirement
      .filter(f => f['Flow Rate'] >= minTargetSideStreamFlow);

    // Rule 2: Apply additional criteria based on filter type, informed by Output.png behavior
    if (type === 'VAF') {
      // For VAF, Output.png implies Tonnage and Total Recirc ranges from CSV are important
      potentialFilters = potentialFilters.filter(f =>
        inputs.tonnage! >= f['Tonnage Min'] && inputs.tonnage! <= f['Tonnage Max'] &&
        inputs.recirc! >= f['Min Recirc (gallons)'] && inputs.recirc! <= f['Max Recirc (gallons)']
      );
    } else if (type === 'Separator') {
      // For Separator, Output.png (CTS1600 for 3300 tons) implies Total Recirc range matters,
      // but Tonnage Min/Max from CSV might not be for the main system tonnage in side-stream.
      // CTS1600 (Tonnage 1584-2667) was chosen for 3300 tons.
      // CTS1600 (Recirc 4751-8000) was chosen for 7200 total recirc.
      potentialFilters = potentialFilters.filter(f =>
        inputs.recirc! >= f['Min Recirc (gallons)'] && inputs.recirc! <= f['Max Recirc (gallons)']
        // We are *not* strictly filtering by f['Tonnage Min/Max'] here for Separators in open loops
        // to align with Output.png example. The primary driver is side-stream flow and total system size.
      );
    }
    // For Vortisand (open loop), Output.png (VC350 for 3300 tons) implies
    // its Tonnage Min/Max and Recirc Min/Max from CSV are not for the main system criteria.
    // Selection is primarily by its own 'Flow Rate' meeting the 1-5% side-stream target.
    // So, no additional filtering on Tonnage/Recirc Min/Max for Vortisand here.

    // Sort by the filter's flow rate (smallest suitable model first)
    potentialFilters.sort((a, b) => a['Flow Rate'] - b['Flow Rate']);
    
    // console.log(`OPEN: For ${type}, target side-stream >= ${minTargetSideStreamFlow.toFixed(0)}gpm. Candidates: ${potentialFilters.map(f=>f.Model).join(', ')}`);
    return potentialFilters.length > 0 ? potentialFilters[0] : undefined;

  } else {
    // --- CLOSED SYSTEM LOGIC ---
    if (inputs.systemVolume === undefined) {
      // console.log(`CLOSED: Skipping ${type} - System Volume missing.`);
      return undefined;
    }

    let candidateFilters: Filter[];
    if (type === 'Vortisand') {
      candidateFilters = filtersData.filter(f =>
        f['Filter Type'] === type &&
        f['Loop Min'] !== null && f['Loop Max'] !== null &&
        inputs.systemVolume! >= f['Loop Min'] && inputs.systemVolume! <= f['Loop Max']
      );
    } else { // Separator or VAF for closed loop
      candidateFilters = filtersData.filter(f =>
        f['Filter Type'] === type &&
        inputs.systemVolume! >= f['Min Recirc (gallons)'] && inputs.systemVolume! <= f['Max Recirc (gallons)']
      );
    }
    // Sort by HP (smallest first) if multiple models match the volume criteria
    candidateFilters.sort((a, b) => a.hp - b.hp);
    // console.log(`CLOSED: For ${type}, volume: ${inputs.systemVolume}. Candidates: ${candidateFilters.map(f=>f.Model).join(', ')}`);
    return candidateFilters.length > 0 ? candidateFilters[0] : undefined;
  }
};


function App() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [electricalCost, setElectricalCost] = useState<number>(0);
  const [displayTonnage, setDisplayTonnage] = useState<number | undefined>();
  const [displayRecirc, setDisplayRecirc] = useState<number | undefined>();

  const handleFormSubmit = (inputs: UserInputs) => {
    console.log("Form Submitted with inputs:", inputs);
    const newSelectedFilters: SelectedFilters = {};

    newSelectedFilters.Separator = findMatchingFilter('Separator', inputs);
    newSelectedFilters.VAF = findMatchingFilter('VAF', inputs);
    newSelectedFilters.Vortisand = findMatchingFilter('Vortisand', inputs);
    
    console.log("Selected Filters:", newSelectedFilters);
    setSelectedFilters(newSelectedFilters);
    setElectricalCost(inputs.electricalCost);

    if (inputs.systemType === 'open') {
        setDisplayTonnage(inputs.tonnage);
        setDisplayRecirc(inputs.recirc);
    } else {
        setDisplayTonnage(undefined); // System volume is used for closed, not tonnage/recirc
        setDisplayRecirc(undefined);
    }
  };

  return (
    <div className="app-container">
      <div className="header-bar">
        System Designer
      </div>
      
      <div className="input-section">
        <h2>What is the building load for heating and/or cooling?</h2> 
        <SystemDesignerForm onSubmit={handleFormSubmit} />
      </div>

      {/* Display output only if a calculation has been attempted (electricalCost will be > 0) */}
      {electricalCost > 0 && (
         <OutputDisplay 
            selectedFilters={selectedFilters} 
            electricalCost={electricalCost}
            userInputTonnage={displayTonnage}
            userInputRecirc={displayRecirc}
        />
      )}

      <footer className="footer">
        <img src="/xylem-logo.png" alt="Xylem Logo" />
        <span></span>
      </footer>
    </div>
  );
}

export default App;