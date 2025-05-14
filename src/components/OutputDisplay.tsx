import React from 'react';
import { type Filter, calculateOpex } from '../data/filters';
import FilterCard from './FilterCard';

interface OutputDisplayProps {
  selectedFilters: {
    Separator?: Filter;
    VAF?: Filter;
    Vortisand?: Filter;
  };
  electricalCost: number;
  userInputTonnage?: number; // For display in the title
  userInputRecirc?: number; // For display in the title
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ selectedFilters, electricalCost, userInputTonnage, userInputRecirc }) => {
  if (Object.keys(selectedFilters).length === 0 && electricalCost === 0) {
    return null; // Don't display if no calculation has been run
  }

  let title = "Side Stream Filter CAPEX/OPEX";
  if (userInputTonnage !== undefined && userInputRecirc !== undefined) {
    title += ` - ${userInputTonnage} tons (${userInputRecirc} gpm Tower Recirc)`;
  }


  const noResults = !selectedFilters.Separator && !selectedFilters.VAF && !selectedFilters.Vortisand;

  return (
    <div className="output-section">
      <h2>{title}</h2>
      {noResults && <p>No suitable filters found for the given criteria. Please adjust your inputs.</p>}
      <div className="output-grid">
        {selectedFilters.Separator && (
          <FilterCard 
            filter={selectedFilters.Separator} 
            opex={calculateOpex(selectedFilters.Separator.hp, electricalCost)} 
          />
        )}
        {selectedFilters.VAF && (
          <FilterCard 
            filter={selectedFilters.VAF} 
            opex={calculateOpex(selectedFilters.VAF.hp, electricalCost)} 
          />
        )}
        {selectedFilters.Vortisand && (
          <FilterCard 
            filter={selectedFilters.Vortisand} 
            opex={calculateOpex(selectedFilters.Vortisand.hp, electricalCost)} 
          />
        )}
      </div>
      <div style={{marginTop: '20px', textAlign: 'center', color: '#555'}}>
        <p>Improving Water ➡️ Less Chemistry ➡️ Better Heat Transfer</p>
      </div>
    </div>
  );
};

export default OutputDisplay;