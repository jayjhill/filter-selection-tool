import React, { useState } from 'react';

interface SystemDesignerFormProps {
  onSubmit: (inputs: UserInputs) => void;
}

export interface UserInputs {
  systemType: 'open' | 'closed';
  tonnage?: number;
  recirc?: number;
  systemVolume?: number;
  electricalCost: number;
}

const SystemDesignerForm: React.FC<SystemDesignerFormProps> = ({ onSubmit }) => {
  const [systemType, setSystemType] = useState<'open' | 'closed'>('open');
  const [tonnage, setTonnage] = useState<string>('');
  const [recirc, setRecirc] = useState<string>('');
  const [systemVolume, setSystemVolume] = useState<string>('');
  const [electricalCost, setElectricalCost] = useState<string>(''); // $PKW
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pkw = parseFloat(electricalCost);
    if (isNaN(pkw) || pkw <= 0) {
      setError('Electrical cost must be a positive number.');
      return;
    }

    const inputs: UserInputs = { systemType, electricalCost: pkw };

    if (systemType === 'open') {
      const ton = parseFloat(tonnage);
      const rec = parseFloat(recirc);
      if (isNaN(ton) || ton < 0) {
        setError('Tonnage must be a non-negative number for open systems.');
        return;
      }
      if (isNaN(rec) || rec < 0) {
        setError('Recirculation must be a non-negative number for open systems.');
        return;
      }
      inputs.tonnage = ton;
      inputs.recirc = rec;
    } else { // closed
      const vol = parseFloat(systemVolume);
      if (isNaN(vol) || vol < 0) {
        setError('System Volume must be a non-negative number for closed systems.');
        return;
      }
      inputs.systemVolume = vol;
    }
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <div className="prompt-header" style={{ backgroundColor: '#00A9E0', color: 'white', padding: '10px', marginBottom: '20px' }}>
        Select "Open" or "Closed"
      </div>
      <div className="form-group radio-group">
        <label>
          <input
            type="radio"
            name="systemType"
            value="open"
            checked={systemType === 'open'}
            onChange={() => setSystemType('open')}
          /> Open
        </label>
        <label>
          <input
            type="radio"
            name="systemType"
            value="closed"
            checked={systemType === 'closed'}
            onChange={() => setSystemType('closed')}
          /> Closed
        </label>
      </div>

      {systemType === 'open' && (
        <div className="input-group">
          <div className="prompt-header" style={{ backgroundColor: '#ADD8E6', color: 'black', padding: '8px', marginBottom: '15px' }}>
            This prompt appear if "open" is selected
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="tonnage">Tonnage</label>
              <input
                type="number"
                id="tonnage"
                value={tonnage}
                onChange={(e) => setTonnage(e.target.value)}
                placeholder="e.g., 3300"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="recirc">Recirc (gallons)</label>
              <input
                type="number"
                id="recirc"
                value={recirc}
                onChange={(e) => setRecirc(e.target.value)}
                placeholder="e.g., 7200"
                required
              />
            </div>
          </div>
        </div>
      )}

      {systemType === 'closed' && (
        <div className="input-group">
           <div className="prompt-header" style={{ backgroundColor: '#ADD8E6', color: 'black', padding: '8px', marginBottom: '15px' }}>
            This prompt appear if "closed" is selected
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="systemVolume">System Volume (gallons)</label>
              <input
                type="number"
                id="systemVolume"
                value={systemVolume}
                onChange={(e) => setSystemVolume(e.target.value)}
                placeholder="e.g., 100000"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div className="input-group">
        <div className="prompt-header" style={{ backgroundColor: '#ADD8E6', color: 'black', padding: '8px', marginBottom: '15px' }}>
            This prompt appears for both
        </div>
        <div className="form-grid">
            <div className="form-group">
            <label htmlFor="electricalCost">Electrical Cost ($/kWh)</label>
            <input
                type="number"
                id="electricalCost"
                value={electricalCost}
                onChange={(e) => setElectricalCost(e.target.value)}
                placeholder="e.g., 0.20"
                step="0.01"
                required
            />
            </div>
        </div>
      </div>
      
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="calculate-button">Find Filters</button>
    </form>
  );
};

export default SystemDesignerForm;