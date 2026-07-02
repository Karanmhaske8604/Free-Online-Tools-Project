import React, { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const CONVERSION_FACTORS = {
  length: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    millimeters: 1000,
    miles: 0.000621371,
    yards: 1.09361,
    feet: 3.28084,
    inches: 39.3701,
  },
  mass: {
    kilograms: 1,
    grams: 1000,
    milligrams: 1000000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  area: {
    sqMeters: 1,
    sqKilometers: 0.000001,
    sqMiles: 0.0000003861,
    sqYards: 1.19599,
    sqFeet: 10.7639,
    sqInches: 1550,
    acres: 0.000247105,
    hectares: 0.0001,
  },
  currency: {
    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 158.2,
    AUD: 1.50,
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('kilometers');
  const [value, setValue] = useState('1');
  const [result, setResult] = useState('0.001');

  // Triggered when category changes to load correct default units
  useEffect(() => {
    const units = Object.keys(CONVERSION_FACTORS[category] || {});
    if (category === 'temperature') {
      setFromUnit('celsius');
      setToUnit('fahrenheit');
    } else if (units.length >= 2) {
      setFromUnit(units[0]);
      setToUnit(units[1]);
    }
  }, [category]);

  const handleConvert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult('Invalid input');
      return;
    }

    if (category === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        setResult(((val * 9) / 5 + 32).toFixed(2));
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        setResult((val + 273.15).toFixed(2));
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        setResult((((val - 32) * 5) / 9).toFixed(2));
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        setResult((((val - 32) * 5) / 9 + 273.15).toFixed(2));
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        setResult((val - 273.15).toFixed(2));
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        setResult((((val - 273.15) * 9) / 5 + 32).toFixed(2));
      } else {
        setResult(val.toString()); // Same units
      }
      return;
    }

    const factors = CONVERSION_FACTORS[category];
    if (!factors || !factors[fromUnit] || !factors[toUnit]) return;

    // Convert from source to base unit, then to target unit
    const valueInBase = val / factors[fromUnit];
    const finalValue = valueInBase * factors[toUnit];
    
    // Format nicely
    if (finalValue === 0) setResult('0');
    else if (Math.abs(finalValue) < 0.00001) setResult(finalValue.toExponential(4));
    else setResult(parseFloat(finalValue.toFixed(6)).toString());
  };

  useEffect(() => {
    handleConvert();
  }, [category, fromUnit, toUnit, value]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getUnitsList = () => {
    if (category === 'temperature') {
      return ['celsius', 'fahrenheit', 'kelvin'];
    }
    return Object.keys(CONVERSION_FACTORS[category] || {});
  };

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Conversion Type</h3>
        
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="glass-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="length">Length</option>
            <option value="mass">Mass / Weight</option>
            <option value="area">Area</option>
            <option value="temperature">Temperature</option>
            <option value="currency">Currency (Baseline Rates)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Input Value</label>
          <input
            type="number"
            className="glass-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-results glass-panel converter-results-panel">
        <h3>Calculator</h3>
        
        <div className="converter-card glass-panel">
          <div className="converter-block">
            <label className="form-label">From</label>
            <select
              className="glass-select"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {getUnitsList().map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
            <div className="display-val">{value || '0'}</div>
          </div>

          <button onClick={handleSwap} className="swap-btn" title="Swap Units">
            <ArrowLeftRight size={18} />
          </button>

          <div className="converter-block">
            <label className="form-label">To</label>
            <select
              className="glass-select"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {getUnitsList().map((unit) => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
            <div className="display-val result-highlight">{result}</div>
          </div>
        </div>

        {category === 'currency' && (
          <div className="rates-disclaimer">
            <p>Exchange rates are baseline estimates relative to USD (USD=1, INR=83.5, EUR=0.92, GBP=0.79, JPY=158.2, AUD=1.50).</p>
          </div>
        )}
      </div>

      <style>{`
        .converter-results-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .converter-card {
          width: 100%;
          max-width: 500px;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: rgba(15, 23, 42, 0.4) !important;
          border-color: rgba(99, 102, 241, 0.15) !important;
          position: relative;
        }
        @media (max-width: 600px) {
          .converter-card {
            flex-direction: column;
          }
          .swap-btn {
            transform: rotate(90deg);
          }
        }
        .converter-block {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 0;
          width: 100%;
        }
        .display-val {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .result-highlight {
          color: var(--primary);
        }
        .swap-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 1.5rem;
        }
        .swap-btn:hover {
          color: white;
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }
        .rates-disclaimer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          max-width: 400px;
        }
      `}</style>
    </div>
  );
}
