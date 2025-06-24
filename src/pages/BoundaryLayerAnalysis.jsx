import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import { Radio } from 'antd';

const BoundaryLayerAnalysis = () => {
  const [data, setData] = useState([]);
  const [boundaryLayerData, setBoundaryLayerData] = useState([]);
  const [selectedX, setSelectedX] = useState(0.5);
  const U_inf = 1.0;

  // Updated parameters to match Blasius_plots
  const nu_vals = [1e-5, 2e-5, 3e-5];  // Mercury, Water, Air [m^2/s]
  const U_inf_vals = [0.1, 0.15, 0.20];    // [m/s]
  const x_locs = [0.5, 0.94, 1.39, 1.83, 2.28, 2.72, 3.17, 3.61, 4.06, 4.5];     // [m]

  // State for common parameters
  const [selectedNu, setSelectedNu] = useState(nu_vals[0]);
  const [selectedUInf, setSelectedUInf] = useState(U_inf_vals[0]);
  const [plotType, setPlotType] = useState('v');

  useEffect(() => {
    // Load and parse CSV data
    fetch('/data.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const parsedData = results.data;
            setData(parsedData);

            // Calculate boundary layer thickness
            const blData = [];
            const uniqueX = [...new Set(parsedData.map(d => d.x))];
            
            uniqueX.forEach(x => {
              const subset = parsedData.filter(d => d.x === x);
              const yAt99 = subset.find(d => d.u >= 0.99 * U_inf)?.y;
              const Re = subset[0]?.Re;
              if (yAt99 && Re) {
                blData.push({ 
                  x: Number(x), 
                  delta: Number(yAt99),
                  Re: Number(Re)
                });
              }
            });
            
            setBoundaryLayerData(blData);
          }
        });
      });
  }, []);

  // Helper to format numbers for filenames
  const formatNumber = (num) => {
    if (num === 1e-5) return '1e-05';
    if (num === 2e-5) return '2e-05';
    if (num === 3e-5) return '3e-05';
    return num.toString().replace('.', '');
  };

  // Helper for U_inf
  const formatU = (num) => {
    return num.toFixed(2);
  };

  // Helper for x
  const formatX = (num) => {
    return num.toFixed(2);
  };

  // Get image path for left plot
  const getLeftPlotPath = () => {
    return `/Blasius_Plots/u_x${formatX(selectedX)}_nu${formatNumber(selectedNu)}_U${formatU(selectedUInf)}.png`;
  };

  // Get image path for right plot
  const getRightPlotPath = () => {
    if (plotType === 'v') {
      return `/Blasius_Plots/v_nu${formatNumber(selectedNu)}_U${formatU(selectedUInf)}.png`;
    } else {
      return `/Blasius_Plots/tau_nu${formatNumber(selectedNu)}_U${formatU(selectedUInf)}.png`;
    }
  };

  // Get fluid name based on nu value
  const getFluidName = (nu) => {
    switch(nu) {
      case 1e-5: return 'Mercury';
      case 2e-5: return 'Water';
      case 3e-5: return 'Air';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Boundary Layer Analysis
          </h1>
        </div>

        {/* Information Section - Top */}
        <div className="bg-gray-50 rounded-lg p-4 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulation Information</h3>
          <p className="text-gray-600">
            This simulation shows the development of a boundary layer over a flat plate. The analysis includes velocity profiles, wall shear stress, and transverse velocity components for different fluids (Mercury, Water, and Air) at various free stream velocities (0.1, 0.15, 0.20 m/s) across 10 x-locations from 0.5 to 4.5 m.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Horizontal Velocity Profile */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Horizontal Velocity (u vs y)</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={getLeftPlotPath()} 
                alt="u vs y profile"
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
          </div>

          {/* Right Section - Vertical Velocity or Wall Shear Stress */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Vertical Velocity (v vs x)</h2>
            <div className="flex-1 w-full flex items-center justify-center mb-2">
              <img 
                src={getRightPlotPath()} 
                alt={plotType === 'v' ? 'V vs X' : 'Wall Shear Stress'}
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
            <div className="flex justify-center">
              <Radio.Group 
                value={plotType} 
                onChange={e => setPlotType(e.target.value)}
                buttonStyle="solid"
                size="large"
              >
                <Radio.Button value="v">V vs X</Radio.Button>
                <Radio.Button value="tau">Wall Shear Stress</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>

        {/* X Location Slider - Below both plots */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              X Location: {selectedX} m
            </label>
            <input
              type="range"
              value={x_locs.indexOf(selectedX)}
              onChange={e => {
                const index = Number(e.target.value);
                setSelectedX(x_locs[index]);
              }}
              min={0}
              max={x_locs.length - 1}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {x_locs.map((val, index) => 
                index % 2 === 0 ? <span key={val}>{val}</span> : null
              )}
            </div>
          </div>
        </div>

        {/* Parameter Sliders - Below X slider */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <div className="space-y-4">
              {/* Fluid Slider */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kinematic Viscosity (ν = {selectedNu.toExponential(2)} m²/s)
                </label>
                <input
                  type="range"
                  value={nu_vals.indexOf(selectedNu)}
                  onChange={e => {
                    const index = Number(e.target.value);
                    setSelectedNu(nu_vals[index]);
                  }}
                  min={0}
                  max={nu_vals.length - 1}
                  step={1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {nu_vals.map(val => <span key={val}>{val.toExponential(2)}</span>)}
                </div>
              </div>

              {/* Velocity Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Free Stream Velocity (U∞): {selectedUInf} m/s
                </label>
                <input
                  type="range"
                  value={U_inf_vals.indexOf(selectedUInf)}
                  onChange={e => {
                    const index = Number(e.target.value);
                    setSelectedUInf(U_inf_vals[index]);
                  }}
                  min={0}
                  max={U_inf_vals.length - 1}
                  step={1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {U_inf_vals.map(val => <span key={val}>{val}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoundaryLayerAnalysis; 