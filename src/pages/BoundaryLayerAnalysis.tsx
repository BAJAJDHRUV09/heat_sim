import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import { Radio } from 'antd';

interface DataPoint {
  x: number;
  y: number;
  u: number;
  Re: number;
}

interface BoundaryLayerPoint {
  x: number;
  delta: number;
  Re: number;
}

const BoundaryLayerAnalysis = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [boundaryLayerData, setBoundaryLayerData] = useState<BoundaryLayerPoint[]>([]);
  const [selectedX, setSelectedX] = useState(0.5);
  const U_inf = 1.0;

  // Updated parameters
  const nu_vals = [1e-7, 1e-6, 1.5e-5];  // Mercury, Water, Air [m^2/s]
  const U_inf_vals = [0.1, 0.5, 0.9];    // [m/s]
  const x_locs = [0.5, 1.5, 3, 4.5];     // [m]

  // State for common parameters
  const [selectedNu, setSelectedNu] = useState(nu_vals[0]);
  const [selectedUInf, setSelectedUInf] = useState(U_inf_vals[0]);
  const [plotType, setPlotType] = useState<'v' | 'tau'>('v');

  useEffect(() => {
    // Load and parse CSV data
    fetch('/data.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const parsedData = results.data as DataPoint[];
            setData(parsedData);

            // Calculate boundary layer thickness
            const blData: BoundaryLayerPoint[] = [];
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
  const formatNumber = (num: number) => {
    if (num === 1e-7) return '1e-07';
    if (num === 1e-6) return '1e-06';
    if (num === 1.5e-5) return '2e-05';  // Changed to match the actual file naming
    return num.toString().replace('.', '');
  };

  // Helper for U_inf
  const formatU = (num: number) => {
    return num.toFixed(1);
  };

  // Helper for x
  const formatX = (num: number) => {
    return num.toFixed(1);
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
  const getFluidName = (nu: number) => {
    switch(nu) {
      case 1e-7: return 'Mercury';
      case 1e-6: return 'Water';
      case 1.5e-5: return 'Air';
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Velocity Profile */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">u vs y at x</h2>
            <div className="w-full flex-1 flex items-center justify-center">
              <img 
                src={getLeftPlotPath()} 
                alt="u vs y profile"
                className="w-full h-auto max-h-[450px] object-contain"
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
            <div className="mt-2 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {x_locs.map(val => <span key={val}>{val}</span>)}
              </div>
            </div>
          </div>

          {/* Right Section - v vs x or Wall Shear Stress */}
          <div className="bg-white rounded-lg shadow-xl p-2">
            <div className="w-full h-[450px] flex items-center justify-center mb-2">
              <img 
                src={getRightPlotPath()} 
                alt={plotType === 'v' ? 'V vs X' : 'Wall Shear Stress'}
                className="w-full h-full object-contain"
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

        {/* Common sliders for nu and U_inf */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fluid: {getFluidName(selectedNu)} (ν = {selectedNu.toExponential(2)} m²/s)
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
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {nu_vals.map(val => <span key={val}>{getFluidName(val)}</span>)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Free Stream Velocity (U∞): {selectedUInf} m/s
                </label>
                <input
                  type="range"
                  value={selectedUInf}
                  onChange={e => setSelectedUInf(Number(e.target.value))}
                  min={U_inf_vals[0]}
                  max={U_inf_vals[2]}
                  step={U_inf_vals[1] - U_inf_vals[0]}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {U_inf_vals.map(val => <span key={val}>{val}</span>)}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
            <p className="text-gray-600">
              This simulation shows the development of a boundary layer over a flat plate. The analysis includes velocity profiles, wall shear stress, and transverse velocity components for different fluids (Mercury, Water, and Air) at various free stream velocities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoundaryLayerAnalysis; 