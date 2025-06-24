import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const fluids = [
  { name: 'Air', nu: 1.5e-5 },
  { name: 'Water', nu: 1.0e-6 },
  { name: 'Mercury', nu: 1.2e-7 },
  { name: 'Honey', nu: 1.0e-3 }
];

// 10 time steps from the startup_shear_fixed folder
const timeSteps = [
  { t: 100.0, tstar_air: 0.0015, tstar_water: 0.0001, tstar_mercury: 0.0000, tstar_honey: 0.1000 },
  { t: 166.8, tstar_air: 0.0025, tstar_water: 0.0002, tstar_mercury: 0.0000, tstar_honey: 0.1668 },
  { t: 278.3, tstar_air: 0.0042, tstar_water: 0.0003, tstar_mercury: 0.0000, tstar_honey: 0.2783 },
  { t: 464.2, tstar_air: 0.0070, tstar_water: 0.0005, tstar_mercury: 0.0001, tstar_honey: 0.4642 },
  { t: 774.3, tstar_air: 0.0116, tstar_water: 0.0008, tstar_mercury: 0.0001, tstar_honey: 0.7743 },
  { t: 1291.5, tstar_air: 0.0194, tstar_water: 0.0013, tstar_mercury: 0.0002, tstar_honey: 1.2915 },
  { t: 2154.4, tstar_air: 0.0323, tstar_water: 0.0022, tstar_mercury: 0.0003, tstar_honey: 2.1544 },
  { t: 3593.8, tstar_air: 0.0539, tstar_water: 0.0036, tstar_mercury: 0.0004, tstar_honey: 3.5938 },
  { t: 5994.8, tstar_air: 0.0899, tstar_water: 0.0060, tstar_mercury: 0.0007, tstar_honey: 5.9948 },
  { t: 10000.0, tstar_air: 0.1500, tstar_water: 0.0100, tstar_mercury: 0.0012, tstar_honey: 10.0000 }
];

const StartupShearFlow = () => {
  const [selectedFluidIndex, setSelectedFluidIndex] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const selectedFluid = fluids[selectedFluidIndex];
  const currentTimeStep = timeSteps[selectedTimeIndex];

  // Get dimensionless time for the selected fluid
  const getDimensionlessTime = (fluidName) => {
    switch(fluidName) {
      case 'Air': return currentTimeStep.tstar_air;
      case 'Water': return currentTimeStep.tstar_water;
      case 'Mercury': return currentTimeStep.tstar_mercury;
      case 'Honey': return currentTimeStep.tstar_honey;
      default: return 0;
    }
  };

  const dimensionlessTime = getDimensionlessTime(selectedFluid.name);

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Startup Shear Flow Analysis
          </h1>
        </div>

        {/* Information Section - Top */}
        <div className="bg-gray-50 rounded-lg p-4 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulation Information</h3>
          <p className="text-gray-600">
            This visualization shows the startup of shear flow in different fluids with fixed boundary conditions. The analysis demonstrates how velocity profiles develop over time when a sudden shear stress is applied. The simulation tracks the flow development from t = 100.0s to t = 10000.0s for four different fluids (Air, Water, Mercury, Honey) with varying kinematic viscosities, showing the transition from initial conditions to fully developed flow. Each fluid has 10 time steps showing the detailed evolution of the velocity profile.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Main Plot Section */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Velocity Profile Development</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/startup_shear_fixed/${selectedFluid.name}_t${currentTimeStep.t.toFixed(1)}s_tstar${dimensionlessTime.toFixed(4)}.png`}
                alt={`Startup shear flow for ${selectedFluid.name} at t = ${currentTimeStep.t}s, t* = ${dimensionlessTime}`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '500px', maxWidth: '800px' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
          </div>
        </div>

        {/* Time Slider - Below plot */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Physical Time (t): {currentTimeStep.t.toFixed(1)}s
            </label>
            <input
              type="range"
              value={selectedTimeIndex}
              onChange={e => setSelectedTimeIndex(Number(e.target.value))}
              min={0}
              max={timeSteps.length - 1}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {timeSteps.map((step, index) => 
                index % 2 === 0 || index === timeSteps.length - 1 ? <span key={step.t}>{step.t.toFixed(0)}s</span> : null
              )}
            </div>
          </div>
        </div>

        {/* Fluid Selection Slider - Below Time slider */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Fluid: {selectedFluid.name} (ν = {selectedFluid.nu.toExponential(2)} m²/s)
              </label>
              <input
                type="range"
                value={selectedFluidIndex}
                onChange={e => setSelectedFluidIndex(Number(e.target.value))}
                min={0}
                max={fluids.length - 1}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {fluids.map((fluid, index) => <span key={fluid.name}>{fluid.nu.toExponential(2)}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Display */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Current Parameters</h3>
            <div className="text-center space-y-1">
              <Text>Fluid: {selectedFluid.name}</Text><br />
              <Text>Kinematic Viscosity (ν): {selectedFluid.nu.toExponential(2)} m²/s</Text><br />
              <Text>Physical Time (t): {currentTimeStep.t.toFixed(1)} s</Text><br />
              <Text>Dimensionless Time (t*): {dimensionlessTime.toFixed(4)}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupShearFlow; 