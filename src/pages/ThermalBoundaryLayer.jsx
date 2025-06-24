import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const fluids = [
  { name: 'Liquid_Metal', Pr: 0.01, nu: 1.5e-7, k: 30 },
  { name: 'Air', Pr: 0.7, nu: 1.5e-5, k: 0.026 },
  { name: 'Engine_Oil', Pr: 1.0, nu: 2.5e-5, k: 0.145 },
  { name: 'Water', Pr: 7.0, nu: 1e-6, k: 0.6 }
];

const x_locs = [0.5, 0.9, 1.4, 1.8, 2.3, 2.7, 3.2, 3.6, 4.1, 4.5]; // 10 locations

const ThermalBoundaryLayer = () => {
  const [selectedFluidIndex, setSelectedFluidIndex] = useState(0);
  const [selectedXIndex, setSelectedXIndex] = useState(0);
  const selectedFluid = fluids[selectedFluidIndex];

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Thermal Boundary Layer Analysis
          </h1>
        </div>

        {/* Information Section - Top */}
        <div className="bg-gray-50 rounded-lg p-4 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulation Information</h3>
          <p className="text-gray-600">
            We simulated laminar thermal boundary layer development over a flat plate using similarity solutions of the Blasius equation. The velocity profile was computed using a numerical shooting method, and the thermal boundary layer was modeled assuming a parabolic temperature profile within the thermal thickness. Simulations were conducted for four fluids (Air, Water, Liquid Metal, Engine Oil) with varying Prandtl numbers across 10 x-locations from 0.5 to 4.5 m.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Velocity Profile */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Velocity Profile (u vs y)</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/boundary_layer_plots/${selectedFluid.name}_x${x_locs[selectedXIndex]}.png`}
                alt={`Velocity profile for ${selectedFluid.name} at x = ${x_locs[selectedXIndex]} m`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
          </div>

          {/* Right Section - Heat Transfer Coefficient */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Heat Transfer Coefficient (h vs x)</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/boundary_layer_plots/${selectedFluid.name}_hx.png`}
                alt={`Heat transfer profile for ${selectedFluid.name}`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
          </div>
        </div>

        {/* X Location Slider - Below both plots */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              X Location: {x_locs[selectedXIndex]} m
            </label>
            <input
              type="range"
              value={selectedXIndex}
              onChange={e => setSelectedXIndex(Number(e.target.value))}
              min={0}
              max={x_locs.length - 1}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {x_locs.map((val, index) => 
                index % 3 === 0 || index === x_locs.length - 1 ? <span key={val}>{val}</span> : null
              )}
            </div>
          </div>
        </div>

        {/* Fluid Selection Slider - Below X slider */}
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
              <Text>Prandtl Number (Pr): {selectedFluid.Pr}</Text><br />
              <Text>Kinematic Viscosity (ν): {selectedFluid.nu.toExponential(2)} m²/s</Text><br />
              <Text>Thermal Conductivity (k): {selectedFluid.k} W/(m·K)</Text><br />
              <Text>X Location: {x_locs[selectedXIndex]} m</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalBoundaryLayer; 