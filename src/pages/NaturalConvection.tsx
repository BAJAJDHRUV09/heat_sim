import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface Fluid {
  name: string;
  Pr: number;
  description: string;
}

const fluids: Fluid[] = [
  { name: 'Air', Pr: 0.7, description: 'Air with Prandtl number of 0.7' },
  { name: 'Benchmark', Pr: 1.0, description: 'Benchmark fluid with Prandtl number of 1.0' },
  { name: 'Oil', Pr: 10.0, description: 'Oil with Prandtl number of 10.0' }
];

const NaturalConvection: React.FC = () => {
  const [selectedFluidIndex, setSelectedFluidIndex] = useState(0);
  const selectedFluid = fluids[selectedFluidIndex];

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Natural Convection Analysis
          </h1>
        </div>

        {/* Information Section - Top */}
        <div className="bg-gray-50 rounded-lg p-4 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulation Information</h3>
          <p className="text-gray-600">
            This visualization shows natural convection over a <b>vertical plate</b> (the plate is oriented vertically) with velocity contours. The Prandtl number (Pr) characterizes 
            the relative importance of momentum diffusivity to thermal diffusivity. Natural convection occurs when fluid motion is driven by 
            buoyancy forces resulting from density differences caused by temperature variations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Main Plot Section */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Velocity Contour Plot</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/natural_convection/${selectedFluid.name}_Pr${selectedFluid.Pr}.png`}
                alt={`Velocity contour for ${selectedFluid.name} (Pr = ${selectedFluid.Pr})`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '700px', maxWidth: '1000px' }}
              />
            </div>
          </div>
        </div>

        {/* Fluid Selection Slider - Below plot */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Fluid: {selectedFluid.name} (Pr = {selectedFluid.Pr})
            </label>
            <input
              type="range"
              value={selectedFluidIndex}
              onChange={e => setSelectedFluidIndex(Number(e.target.value))}
              min={0}
              max={2}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Air (0.7)</span>
              <span>Benchmark (1.0)</span>
              <span>Oil (10.0)</span>
            </div>
          </div>
        </div>

        {/* Parameters Display */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Current Parameters</h3>
            <div className="text-center space-y-1">
              <Text>Fluid: {selectedFluid.name}</Text><br />
              <Text>Prandtl Number (Pr): {selectedFluid.Pr}</Text><br />
              <Text>Geometry: Vertical plate</Text><br />
              <Text>Flow Type: Laminar natural convection</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaturalConvection; 