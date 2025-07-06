import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const fluids = [
  { name: 'Mercury', nu: 1.2e-7 },
  { name: 'Water', nu: 1.0e-6 },
  { name: 'Air', nu: 1.5e-5 },
  { name: 'Honey', nu: 1.0e-3 }
];

// 15 time steps from the shear_flow_fixed_physical_time_corrected folder
const timeSteps = [
  { t: 10.0000, folder: 't_10.0000s' },
  { t: 22.7585, folder: 't_22.7585s' },
  { t: 51.7947, folder: 't_51.7947s' },
  { t: 117.8769, folder: 't_117.8769s' },
  { t: 268.2696, folder: 't_268.2696s' },
  { t: 610.5402, folder: 't_610.5402s' },
  { t: 1389.4955, folder: 't_1389.4955s' },
  { t: 3162.2777, folder: 't_3162.2777s' },
  { t: 7196.8567, folder: 't_7196.8567s' },
  { t: 16378.9371, folder: 't_16378.9371s' },
  { t: 37275.9372, folder: 't_37275.9372s' },
  { t: 84834.2898, folder: 't_84834.2898s' },
  { t: 193069.7729, folder: 't_193069.7729s' },
  { t: 439397.0561, folder: 't_439397.0561s' },
  { t: 1000000.0000, folder: 't_1000000.0000s' }
];

const StartupShearFlow = () => {
  const [selectedFluidIndex, setSelectedFluidIndex] = useState(3); // Honey (highest viscosity)
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0); // t = 10.0000s (lowest time)
  const selectedFluid = fluids[selectedFluidIndex];
  const currentTimeStep = timeSteps[selectedTimeIndex];

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
            This visualization shows the startup of shear flow in different fluids with fixed boundary conditions. The analysis demonstrates how velocity profiles develop over time when a sudden shear stress is applied. The simulation tracks the flow development from t = 10.0s to t = 1,000,000.0s for four different fluids (Mercury, Water, Air, Honey) with varying kinematic viscosities, showing the transition from initial conditions to fully developed flow. Each fluid has 15 time steps showing the detailed evolution of the velocity profile.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Main Plot Section */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Velocity Profile Development</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/shear_flow_fixed_physical_time_corrected/${currentTimeStep.folder}/${selectedFluid.name}_t${currentTimeStep.t.toFixed(4)}s.png`}
                alt={`Startup shear flow for ${selectedFluid.name} at t = ${currentTimeStep.t}s`}
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
              Physical Time (t): {currentTimeStep.t.toFixed(4)}s
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
                index % 3 === 0 || index === timeSteps.length - 1 ? <span key={step.t}>{step.t.toFixed(1)}s</span> : null
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
              <Text>Physical Time (t): {currentTimeStep.t.toFixed(4)} s</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupShearFlow; 