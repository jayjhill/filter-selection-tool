import { useState } from 'react';
import SystemDesignerForm, { type UserInputs } from './components/SystemDesignerForm';
import OutputDisplay from './components/OutputDisplay';
import type { Filter } from './data/filters'; // Type import
import { filtersData } from './data/filters';   // Value import
import './App.css'; // Make sure this imports your new theme styles

// --- Placeholder Components (You'll build these out properly) ---
const AppHeader = () => (
  <header className="app-header">
    <div className="header-left-links">
      <a href="#products">PRODUCTS</a>
      <a href="#literature">LITERATURE</a>
      <a href="#training">TRAINING & EDUCATION</a>
    </div>
    <div className="header-right-links">
      <a href="#login" className="login-link">Log In »</a> {/* Basic login link */}
    </div>
  </header>
);

const AppSidebar = ({ onClearInputs }: { onClearInputs: () => void }) => (
  <aside className="app-sidebar">
    <button className="button button-clear-inputs" onClick={onClearInputs}>
      « Clear Inputs {/* Using HTML entities for arrows */}
    </button>
    <nav className="sidebar-nav">
      {/* Example Nav Item Structure - you'll map over your actual nav items */}
      <div className="nav-item">
        <a href="#system-designer">System Designer</a>
        {/* If it's an accordion, you'd have more logic here */}
      </div>
      <div className="nav-item">
        <a href="#pumps">Pumps</a>
      </div>
      <div className="nav-item">
        <a href="#suction-diffuser">Suction Diffuser Plus</a>
      </div>
      {/* ... more placeholder nav items based on the screenshot ... */}
      <div className="nav-item">
        <a href="#projects">Projects</a>
      </div>
      <div className="nav-item">
        <a href="#revit-file">REVIT FILE</a>
      </div>
      <div className="nav-item nav-item-bottom"> {/* For items at the bottom */}
        <a href="#login-sidebar">Log In</a>
      </div>
      <div className="nav-item nav-item-bottom">
        <a href="#knowledge-center">Knowledge Center</a>
      </div>
    </nav>
  </aside>
);
// --- End Placeholder Components ---


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
    const hasValidTonnage = inputs.tonnage !== undefined && inputs.tonnage >= 0;
    const hasValidRecirc = inputs.recirc !== undefined && inputs.recirc > 0;

    if (!hasValidTonnage && !hasValidRecirc) {
      return undefined;
    }
    let basePotentialFilters = filtersData.filter(f => f['Filter Type'] === type);
    if (hasValidRecirc) {
      const config = SIDE_STREAM_PERCENTAGES[type as keyof typeof SIDE_STREAM_PERCENTAGES];
      if (config) {
        const minTargetSideStreamFlow = inputs.recirc! * config.min;
        basePotentialFilters = basePotentialFilters.filter(f => f['Flow Rate'] >= minTargetSideStreamFlow);
      } else {
        console.error(`OPEN: No side-stream percentage config for type: ${type}`);
      }
    }
    let finalPotentialFilters = basePotentialFilters.filter(f => {
      let tonnageMatch = false;
      if (hasValidTonnage) {
        tonnageMatch = inputs.tonnage! >= f['Tonnage Min'] && inputs.tonnage! <= f['Tonnage Max'];
      }
      let recircMatch = false;
      if (inputs.recirc !== undefined && inputs.recirc >=0) {
          recircMatch = inputs.recirc! >= f['Min Recirc (gallons)'] && inputs.recirc! <= f['Max Recirc (gallons)'];
      }
      if (hasValidTonnage && !hasValidRecirc && inputs.recirc === undefined) return tonnageMatch;
      if (!hasValidTonnage && hasValidRecirc && inputs.tonnage === undefined) return recircMatch;
      return tonnageMatch || recircMatch;
    });
    finalPotentialFilters.sort((a, b) => a['Flow Rate'] - b['Flow Rate']);
    return finalPotentialFilters.length > 0 ? finalPotentialFilters[0] : undefined;
  } else {
    if (inputs.systemVolume === undefined || inputs.systemVolume < 0) {
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
  
  // State to control form reset for SystemDesignerForm
  const [formKey, setFormKey] = useState<number>(0); 

  const handleFormSubmit = (inputs: UserInputs) => {
    const newSelectedFilters: SelectedFilters = {};
    newSelectedFilters.Separator = findMatchingFilter('Separator', inputs);
    newSelectedFilters.VAF = findMatchingFilter('VAF', inputs);
    newSelectedFilters.Vortisand = findMatchingFilter('Vortisand', inputs);
    
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

  const handleClearInputs = () => {
    setSelectedFilters({});
    setElectricalCost(0);
    setDisplayTonnage(undefined);
    setDisplayRecirc(undefined);
    setFormKey(prevKey => prevKey + 1); // Change key to force re-mount of SystemDesignerForm
  };

  return (
    <div className="app-layout"> {/* Main layout container */}
      <AppHeader />
      <AppSidebar onClearInputs={handleClearInputs} />
      
      <main className="app-main-content">
        {/* The title "Pump Selection" from the screenshot is the overall page title */}
        {/* Your app is "Filter Selection", so let's adapt */}
        <h1 className="page-main-title">Filter Selection</h1>
        
        {/* This is where your SystemDesignerForm and OutputDisplay will go,
            wrapped in the new section styling */}
        <div className="content-section-box">
          <div className="section-title-bar">
            {/* The title here matches "Selection Options" in the screenshot.
                You can adapt it to your form's purpose. */}
            <h2>
              System Parameters 
              <i className="info-icon" title="Define your cooling system parameters">i</i>
            </h2>
          </div>
          <div className="section-content">
            {/* Pass a key to SystemDesignerForm to allow resetting it */}
            <SystemDesignerForm key={formKey} onSubmit={handleFormSubmit} />
          </div>
        </div>

        {electricalCost > 0 && Object.keys(selectedFilters).some(key => selectedFilters[key as keyof SelectedFilters]) && (
          <div className="content-section-box results-section"> {/* Added class for specific styling */}
            <div className="section-title-bar">
              <h2>
                Recommended Filters
                <i className="info-icon" title="Based on your inputs">i</i>
              </h2>
            </div>
            <div className="section-content">
              <OutputDisplay 
                  selectedFilters={selectedFilters} 
                  electricalCost={electricalCost}
                  userInputTonnage={displayTonnage}
                  userInputRecirc={displayRecirc}
              />
            </div>
          </div>
        )}
        
        {/* The Xylem footer is not part of the esp-systemwize design,
            so you might remove it or style it differently if you keep it.
            For now, let's comment it out to focus on the new design.
        <footer className="footer">
          <img src="/xylem-logo.png" alt="Xylem Logo" />
          <span>Let's Solve Water</span>
        </footer>
        */}
      </main>
    </div>
  );
}

export default App;