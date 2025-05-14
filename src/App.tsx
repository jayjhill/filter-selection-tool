import { useState } from 'react'; // Removed 'React' from import
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
      .filter(f => f['Flow Rate'] >= minTargetSideStreamFlow);

    if (type === 'VAF') {
      potentialFilters = potentialFilters.filter(f =>
        inputs.tonnage! >= f['Tonnage Min'] && inputs.tonnage! <= f['Tonnage Max'] &&
        inputs.recirc! >= f['Min Recirc (gallons)'] && inputs.recirc! <= f['Max Recirc (gallons)']
      );
    } else if (type === 'Separator') {
      potentialFilters = potentialFilters.filter(f =>
        inputs.recirc! >= f['Min Recirc (gallons)'] && inputs.recirc! <= f['Max Recirc (gallons)']
      );
    }

    potentialFilters.sort((a, b) => a['Flow Rate'] - b['Flow Rate']);
    return potentialFilters.length > 0 ? potentialFilters[0] : undefined;

  } else {
    // --- CLOSED SYSTEM LOGIC ---
    if (inputs.systemVolume === undefined) {
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
    candidateFilters.sort((a, b) => a.hp - b.hp);
    return candidateFilters.length > 0 ? candidateFilters[0] : undefined;
  }
};


function App() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [electricalCost, setElectricalCost] = useState<number>(0);
  const [displayTonnage, setDisplayTonnage] = useState<number | undefined>();
  const [displayRecirc, setDisplayRecirc] = useState<number | undefined>();

  const handleFormSubmit = (inputs: UserInputs) => {
    console.log("Form Submitted with inputs:", inputs); // Keep for debugging if needed
    const newSelectedFilters: SelectedFilters = {};

    newSelectedFilters.Separator = findMatchingFilter('Separator', inputs);
    newSelectedFilters.VAF = findMatchingFilter('VAF', inputs);
    newSelectedFilters.Vortisand = findMatchingFilter('Vortisand', inputs);
    
    console.log("Selected Filters:", newSelectedFilters); // Keep for debugging if needed
    setSelectedFilters(newSelectedFilters);
    setElectricalCost(inputs.electricalCost);

    if (inputs.systemType === 'open') {
        setDisplayTonnage(inputs.tonnage);
        setDisplayRecirc(inputs.recirc);
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
        <img src="/xylem_logo.png" alt="Xylem Logo" />
        <span>Let's Solve Water</span>
      </footer>
    </div>
  );
}

export default App;