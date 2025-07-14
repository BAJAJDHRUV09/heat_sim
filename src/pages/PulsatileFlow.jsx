import React, { useState } from 'react';

const fluidOptions = [
  {
    label: 'Air',
    folder: '01_Air_rho=1_mu=1e-05_Wo=6.14',
  },
  {
    label: 'Water',
    folder: '02_Water_rho=1000_mu=1e-03_Wo=17.72',
  },
  {
    label: 'Mercury',
    folder: '03_Mercury_rho=13500_mu=1e+00_Wo=2.06',
  },
];

const timeSteps = [
  { idx: 1, t: '0.000' },
  { idx: 2, t: '0.033' },
  { idx: 3, t: '0.067' },
  { idx: 4, t: '0.100' },
  { idx: 5, t: '0.133' },
  { idx: 6, t: '0.167' },
  { idx: 7, t: '0.200' },
  { idx: 8, t: '0.233' },
  { idx: 9, t: '0.267' },
  { idx: 10, t: '0.300' },
  { idx: 11, t: '0.333' },
  { idx: 12, t: '0.367' },
  { idx: 13, t: '0.400' },
  { idx: 14, t: '0.433' },
  { idx: 15, t: '0.467' },
];

function getImagePath(fluidIdx, timeIdx) {
  const folder = fluidOptions[fluidIdx].folder;
  const tObj = timeSteps[timeIdx];
  return `/snapshots2/${folder}/snapshot_${String(tObj.idx).padStart(2,'0')}_t=${tObj.t}s.png`;
}

const PulsatileFlow = () => {
  const [fluidIdx, setFluidIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(0);

  const imagePath = getImagePath(fluidIdx, timeIdx);

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
                alt={`Pulsatile flow for ${fluidOptions[fluidIdx].label}, time ${timeSteps[timeIdx].t}s`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '500px', maxWidth: '800px' }}
                onError={e => {
                  e.currentTarget.style.opacity = '0.2';
                }}
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

        {/* Fluid Selector - Below Time slider */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Fluid: {fluidOptions[fluidIdx].label}
              </label>
              <input
                type="range"
                value={fluidIdx}
                onChange={e => setFluidIdx(Number(e.target.value))}
                min={0}
                max={fluidOptions.length - 1}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {fluidOptions.map((fluid, idx) => <span key={fluid.label}>{fluid.label}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsatileFlow; 