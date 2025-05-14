import React from 'react';
import { type Filter, h2oQualityMap, filterImageMap } from '../data/filters';

interface FilterCardProps {
  filter: Filter;
  opex: number;
}

const FilterCard: React.FC<FilterCardProps> = ({ filter, opex }) => {
  return (
    <div className="filter-card">
      <div>
        <h3>{filter['Filter Type']}</h3>
        <img src={filterImageMap[filter['Filter Type']]} alt={filter['Filter Type']} />
        <p><span className="model-name">{filter.Model}</span></p>
        <p><span className="label">Filter OPEX:</span> <span className="opex">${opex.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/year</span></p>
        <p><span className="label">Flow Rate:</span> {filter['Flow Rate']} gpm</p>
        <p><span className="label">HP:</span> {filter.hp} hp</p>
        <p><span className="label">Basis:</span> @${(opex / (filter.hp * 0.7457 * 8760)).toFixed(2)}/kwh</p> {/* Calculate back the pkw for display */}
      </div>
      <div className="h2o-quality">
        {h2oQualityMap[filter['Filter Type']]}
      </div>
    </div>
  );
};

export default FilterCard;