import React, { useState } from 'react'; // React import needed for JSX

export interface SystemDesignerFormProps { // Exporting the interface for props
  onSubmit: (inputs: UserInputs) => void;
}

export interface UserInputs {
  systemType: 'open' | 'closed';
  tonnage?: number; // Optional
  recirc?: number;  // Optional
  systemVolume?: number;
  electricalCost: number;
}

const SystemDesignerForm: React.FC<SystemDesignerFormProps> = ({ onSubmit }) => {
  const [systemType, setSystemType] = useState<'open' | 'closed'>('open');
  const [tonnage, setTonnage] = useState<string>(''); // Store as string for input field
  const [recirc, setRecirc] = useState<string>('');   // Store as string
  const [systemVolume, setSystemVolume] = useState<string>('');
  const [electricalCost, setElectricalCost] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pkwInput = electricalCost.trim();
    if (!pkwInput) {
        setError('Electrical cost is required.');
        return;
    }
    const pkw = parseFloat(pkwInput);
    if (isNaN(pkw) || pkw <= 0) {
      setError('Electrical cost must be a positive number.');
      return;
    }

    const currentInputs: UserInputs = { systemType, electricalCost: pkw };

    if (systemType === 'open') {
      const tonString = tonnage.trim();
      const recString = recirc.trim();

      if (!tonString && !recString) { // If BOTH are empty for open system
        setError('For open systems, please provide Tonnage or Recirculation (or both).');
        return;
      }

      if (tonString) {
        const ton = parseFloat(tonString);
        if (isNaN(ton) || ton < 0) {
          setError('Tonnage must be a non-negative number if provided.');
          return;
        }
        currentInputs.tonnage = ton;
      }

      if (recString) {
        const rec = parseFloat(recString);
        if (isNaN(rec) || rec < 0) { // Assuming 0 is a valid recirc value for matching, but not for side-stream % calc
          setError('Recirculation must be a non-negative number if provided.');
          return;
        }
        currentInputs.recirc = rec;
      }
    } else { // closed system
      const volString = systemVolume.trim();
      if (!volString) {
          setError('System Volume is required for closed systems.');
          return;
      }
      const vol = parseFloat(volString);
      if (isNaN(vol) || vol < 0) {
        setError('System Volume must be a non-negative number for closed systems.');
        return;
      }
      currentInputs.systemVolume = vol;
    }
    onSubmit(currentInputs);
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <div className="prompt-header" style={{ backgroundColor: '#00A9E0', color: 'white', padding: '10px', marginBottom: '20px' }}>
        Select "Open" or "Closed"
      </div>
      <div className="form-group radio-group" style={{ marginBottom: '20px' }}>
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
            This prompt appears if "open" is selected (provide Tonnage and/or Recirc)
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
                min="0" // HTML5 validation for non-negative
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
                min="0" // HTML5 validation for non-negative
              />
            </div>
          </div>
        </div>
      )}

      {systemType === 'closed' && (
        <div className="input-group">
           <div className="prompt-header" style={{ backgroundColor: '#ADD8E6', color: 'black', padding: '8px', marginBottom: '15px' }}>
            This prompt appears if "closed" is selected
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
                min="0" // HTML5 validation for non-negative
                required // System volume is strictly required for closed
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
                required // Electrical cost is always required
            />
            </div>
        </div>
      </div>
      
      {error && <p className="error-message" style={{ marginTop: '15px' }}>{error}</p>}
      <button type="submit" className="calculate-button" style={{ marginTop: '20px' }}>Find Filters</button>
    </form>
  );
};

export default SystemDesignerForm;