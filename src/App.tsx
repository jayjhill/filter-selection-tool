import { useState } from 'react';
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
    // Ensure at least one of tonnage or recirc is valid for open system processing
    const hasValidTonnage = inputs.tonnage !== undefined && inputs.tonnage >= 0;
    const hasValidRecirc = inputs.recirc !== undefined && inputs.recirc > 0; // Recirc for side-stream calc usually > 0

    if (!hasValidTonnage && !hasValidRecirc) {
      // console.log(`OPEN: Skipping ${type} - Neither Tonnage nor Recirc is validly provided.`);
      return undefined;
    }

    let basePotentialFilters = filtersData.filter(f => f['Filter Type'] === type);

    // Apply side-stream flow rate requirement if recirc is provided and valid for it
    if (hasValidRecirc) {
      const config = SIDE_STREAM_PERCENTAGES[type as keyof typeof SIDE_STREAM_PERCENTAGES];
      if (!config) {
        console.error(`OPEN: No side-stream percentage config for type: ${type}`);
        // Not returning undefined here, allowing filter to proceed without this specific constraint if config is missing
      } else {
        const minTargetSideStreamFlow = inputs.recirc! * config.min;
        basePotentialFilters = basePotentialFilters.filter(f => f['Flow Rate'] >= minTargetSideStreamFlow);
        // console.log(`OPEN: For ${type}, target side-stream (recirc provided) >= ${minTargetSideStreamFlow.toFixed(0)}gpm. Candidates: ${basePotentialFilters.map(f=>f.Model).join(', ')}`);
      }
    }
    
    // Now filter by Tonnage OR Recirc ranges from the remaining candidates
    let finalPotentialFilters = basePotentialFilters.filter(f => {
      let tonnageMatch = false;
      if (hasValidTonnage) {
        tonnageMatch = inputs.tonnage! >= f['Tonnage Min'] && inputs.tonnage! <= f['Tonnage Max'];
      }

      let recircMatch = false;
      if (inputs.recirc !== undefined && inputs.recirc >=0) { // Use >=0 for general matching, >0 for side-stream calc
          recircMatch = inputs.recirc! >= f['Min Recirc (gallons)'] && inputs.recirc! <= f['Max Recirc (gallons)'];
      }
      
      // If only tonnage is validly provided, it must match.
      if (hasValidTonnage && !hasValidRecirc && inputs.recirc === undefined) return tonnageMatch; // only tonnage was entered
      // If only recirc is validly provided, it must match.
      if (!hasValidTonnage && hasValidRecirc && inputs.tonnage === undefined) return recircMatch; // only recirc was entered
      
      // If both are (potentially) provided (even if one is not valid for matching here but was entered), OR logic applies
      return tonnageMatch || recircMatch;
    });
    
    // Sort by a preferred metric, e.g., smallest suitable Flow Rate or HP
    finalPotentialFilters.sort((a, b) => a['Flow Rate'] - b['Flow Rate']);
    
    // console.log(`OPEN: For ${type}. Final candidates after Tonnage/Recirc OR: ${finalPotentialFilters.map(f=>f.Model).join(', ')}`);
    return finalPotentialFilters.length > 0 ? finalPotentialFilters[0] : undefined;

  } else {
    // --- CLOSED SYSTEM LOGIC ---
    if (inputs.systemVolume === undefined || inputs.systemVolume < 0) {
      // console.log(`CLOSED: Skipping ${type} - System Volume missing or invalid.`);
      return undefined;
    }

    let candidateFilters: Filter[];
    if (type === 'Vortisand') {
      candidateFilters = filtersData.filter(f =>
        f['Filter Type'] === type &&
        f['Loop Min'] !== null && f['Loop Max'] !== null &&
        inputs.systemVolume! >= f['Loop Min'] && inputs.systemVolume! <= f['Loop Max']
      );
    } else { 
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
    // console.log("Form Submitted with inputs:", inputs);
    const newSelectedFilters: SelectedFilters = {};

    newSelectedFilters.Separator = findMatchingFilter('Separator', inputs);
    newSelectedFilters.VAF = findMatchingFilter('VAF', inputs);
    newSelectedFilters.Vortisand = findMatchingFilter('Vortisand', inputs);
    
    // console.log("Selected Filters:", newSelectedFilters);
    setSelectedFilters(newSelectedFilters);
    setElectricalCost(inputs.electricalCost);

    if (inputs.systemType === 'open') {
        setDisplayTonnage(inputs.tonnage); // Will be undefined if not provided
        setDisplayRecirc(inputs.recirc);   // Will be undefined if not provided
    } else {
        setDisplayTonnage(undefined);
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
        <span>Let's Solve Water</span>
      </footer>
    </div>
  );
}

export default App;