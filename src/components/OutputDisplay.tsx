// src/components/OutputDisplay.tsx
import React from 'react';
import type { Filter } from '../data/filters'; // Assuming Filter type is needed by FilterCard
import { calculateOpex } from '../data/filters';
import FilterCard from './FilterCard';

interface OutputDisplayProps {
  selectedFilters: {
    Separator?: Filter;
    VAF?: Filter;
    Vortisand?: Filter;
  };
  electricalCost: number;
  userInputTonnage?: number;
  userInputRecirc?: number;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  selectedFilters,
  electricalCost,
  // userInputTonnage, // Not directly used in this component's rendering logic below
  // userInputRecirc,  // Not directly used in this component's rendering logic below
}) => {
  const hasResults = selectedFilters.Separator || selectedFilters.VAF || selectedFilters.Vortisand;

  if (!hasResults && electricalCost === 0) { // Only hide if no calculation AND no results
    return null;
  }

  return (
    <> {/* Using a fragment to group grid and tagline */}
      {hasResults ? (
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
      ) : (
        <p className="no-results-message">No suitable filters found for the given criteria. Please adjust your inputs.</p>
      )}

      {/* Tagline Section - placed after the grid or no-results message */}
      <div className="chevron-tagline-container">
        <div className="chevron-tagline">
          <span className="tagline-segment">Improving Water</span>
          <span className="tagline-segment">Less Chemistry</span>
          <span className="tagline-segment">Better Heat Transfer</span>
        </div>
      </div>
    </>
  );
};

export default OutputDisplay;