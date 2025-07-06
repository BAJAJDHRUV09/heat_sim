import React, { useState, useEffect } from 'react';

// Parameter options - updated to match new folder structure
const densities = [1, 1000, 13500]; // kg/m^3 (air, water, mercury)
const viscosities = [1e-5, 1e-3, 1e+0]; // Pa.s (low, medium, high)
const densityLabels = ['Air', 'Water', 'Mercury'];
const viscosityLabels = ['Low', 'Medium', 'High'];
const timeSteps = [
  { idx: 1, t: '0.000' },
  { idx: 2, t: '0.056' },
  { idx: 3, t: '0.111' },
  { idx: 4, t: '0.167' },
  { idx: 5, t: '0.222' },
  { idx: 6, t: '0.278' },
  { idx: 7, t: '0.333' },
  { idx: 8, t: '0.389' },
  { idx: 9, t: '0.444' },
  { idx: 10, t: '0.500' },
];

// Case mapping based on new folder structure (3x3 grid: density x viscosity)
const caseMapping = {
  // Air cases
  '1_1e-5': 'case_01_rho=1_mu=1e-05_Wo=6.14',
  '1_1e-3': 'case_02_rho=1_mu=1e-03_Wo=0.61',
  '1_1e+0': 'case_03_rho=1_mu=1e+00_Wo=0.02',
  
  // Water cases
  '1000_1e-5': 'case_04_rho=1000_mu=1e-05_Wo=177.25',
  '1000_1e-3': 'case_05_rho=1000_mu=1e-03_Wo=17.72',
  '1000_1e+0': 'case_06_rho=1000_mu=1e+00_Wo=0.56',
  
  // Mercury cases
  '13500_1e-5': 'case_07_rho=13500_mu=1e-05_Wo=651.24',
  '13500_1e-3': 'case_08_rho=13500_mu=1e-03_Wo=65.12',
  '13500_1e+0': 'case_09_rho=13500_mu=1e+00_Wo=2.06',
};

function getCaseFolder(density, viscosity) {
  // Convert viscosity back to the exact format used in caseMapping
  let viscosityKey;
  if (viscosity === 1e-5) viscosityKey = '1e-5';
  else if (viscosity === 1e-3) viscosityKey = '1e-3';
  else if (viscosity === 1e+0) viscosityKey = '1e+0';
  else viscosityKey = viscosity.toString();
  
  const key = `${density}_${viscosityKey}`;
  const folder = caseMapping[key] || 'case_01_rho=1_mu=1e-05_Wo=6.14';
  console.log('getCaseFolder:', { density, viscosity, key, folder });
  return folder;
}

function getImagePath(density, viscosity, timeIdx) {
  const folder = getCaseFolder(density, viscosity);
  const tObj = timeSteps[timeIdx];
  const path = `/snapshots/${folder}/snapshot_${String(tObj.idx).padStart(2,'0')}_t=${tObj.t}s.png`;
  console.log('getImagePath:', { density, viscosity, timeIdx, folder, path });
  return path;
}

const PulsatileFlow = () => {
  const [density, setDensity] = useState(densities[0]);
  const [viscosity, setViscosity] = useState(viscosities[0]);
  const [timeIdx, setTimeIdx] = useState(0);

  const imagePath = getImagePath(density, viscosity, timeIdx);

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Pulsatile Flow Simulation
          </h1>
        </div>

        {/* Information Section - Top */}
        <div className="bg-gray-50 rounded-lg p-4 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulation Information</h3>
          <p className="text-gray-600">
            This simulation visualizes pulsatile flow through a circular pipe driven by a sinusoidal pressure gradient, similar to blood flow in arteries. The flow is governed by the unsteady Navier-Stokes equation and uses the Womersley analytical solution with Bessel functions. The key parameter is the Womersley number Wo = R√(ωρ/μ), which determines whether flow is dominated by viscous effects (low Wo) or inertia (high Wo). We vary density and viscosity to explore different flow regimes, showing instantaneous velocity profiles that reveal time-dependent phenomena including blunt profiles, phase lag, and flow reversal near the walls.
          </p>
          <p className="text-gray-600 mt-3">
            <strong>What you're seeing:</strong> The plot shows a cross-sectional view of a circular pipe. The horizontal axis represents the radial distance from the pipe center (r = 0) to the wall (r = R), and the vertical axis shows the axial velocity magnitude. The curve represents the instantaneous velocity profile across the pipe diameter at the selected time, showing how fast the fluid is moving at each radial position. The shape of this profile changes dramatically throughout the pulsation cycle, revealing the complex dynamics of oscillatory flow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Plot Section */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Velocity Profile Snapshot</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={imagePath}
                alt={`Pulsatile flow for density ${density}, viscosity ${viscosity}, time ${timeSteps[timeIdx].t}s`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '500px', maxWidth: '800px' }}
                onError={e => {
                  console.log('Image failed to load:', imagePath);
                  e.currentTarget.style.opacity = '0.2';
                }}
                onLoad={() => console.log('Image loaded successfully:', imagePath)}
              />
            </div>
          </div>
        </div>



        {/* Time Slider - Below plot */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Time: {timeSteps[timeIdx].t} s
            </label>
            <input
              type="range"
              value={timeIdx}
              onChange={e => setTimeIdx(Number(e.target.value))}
              min={0}
              max={timeSteps.length - 1}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {timeSteps.map((step, idx) => 
                idx % 3 === 0 || idx === timeSteps.length - 1 ? <span key={step.t}>{step.t}s</span> : null
              )}
            </div>
          </div>
        </div>

        {/* Parameter Sliders - Below Time slider */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md space-y-4">
            {/* Density Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Density: {densityLabels[densities.indexOf(density)]} ({density} kg/m³)
              </label>
              <input
                type="range"
                value={densities.indexOf(density)}
                onChange={e => setDensity(densities[Number(e.target.value)])}
                min={0}
                max={densities.length - 1}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {densityLabels.map((label, idx) => <span key={label}>{label}</span>)}
              </div>
            </div>
            {/* Viscosity Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Viscosity: {viscosityLabels[viscosities.indexOf(viscosity)]} ({viscosity} Pa·s)
              </label>
              <input
                type="range"
                value={viscosities.indexOf(viscosity)}
                onChange={e => setViscosity(viscosities[Number(e.target.value)])}
                min={0}
                max={viscosities.length - 1}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {viscosityLabels.map((label, idx) => <span key={label}>{label}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsatileFlow; 