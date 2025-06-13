import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface Fluid {
  name: string;
  Pr: number;
  nu: number;
  k: number;
}

const fluids: Fluid[] = [
  { name: 'Air', Pr: 0.7, nu: 1.5e-5, k: 0.026 },
  { name: 'Water', Pr: 7.0, nu: 1e-6, k: 0.6 },
  { name: 'Liquid_Metal', Pr: 0.01, nu: 1.5e-7, k: 30 },
  { name: 'Engine_Oil', Pr: 1.0, nu: 2.5e-5, k: 0.145 }
];

const x_locs = [0.5, 2.5, 4.5];

const ThermalBoundaryLayer: React.FC = () => {
  const [selectedFluidIndex, setSelectedFluidIndex] = useState(0);
  const [selectedXIndex, setSelectedXIndex] = useState(0);
  const selectedFluid = fluids[selectedFluidIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Title level={2} className="text-center mb-8">Thermal Boundary Layer Analysis</Title>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Velocity Profile */}
          <Card title="Velocity Profile" className="shadow-lg">
            <div className="h-[400px] flex items-center justify-center">
              <img 
                src={`/temp_boundary_layer/${selectedFluid.name}_x${x_locs[selectedXIndex]}.png`}
                alt={`Velocity profile for ${selectedFluid.name} at x = ${x_locs[selectedXIndex]}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 px-4">
              <Text strong>X Location:</Text>
              <div className="w-4/5 mx-auto">
                <Slider
                  min={0}
                  max={2}
                  step={1}
                  value={selectedXIndex}
                  onChange={setSelectedXIndex}
                  marks={{
                    0: '0.5',
                    1: '2.5',
                    2: '4.5'
                  }}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Prandtl Number Slider */}
          <Card title="Fluid Properties" className="shadow-lg">
            <div className="p-4">
              <div className="mb-4">
                <Text strong>Select Fluid:</Text>
                <Slider
                  min={0}
                  max={3}
                  step={1}
                  value={selectedFluidIndex}
                  onChange={setSelectedFluidIndex}
                  marks={{
                    0: 'Air',
                    1: 'Water',
                    2: 'Liquid Metal',
                    3: 'Engine Oil'
                  }}
                  className="mt-2"
                />
              </div>
              <div className="mt-4">
                <Text strong>Properties:</Text>
                <div className="mt-2">
                  <Text>Prandtl Number (Pr): {selectedFluid.Pr}</Text><br />
                  <Text>Kinematic Viscosity (ν): {selectedFluid.nu.toExponential(2)} m²/s</Text><br />
                  <Text>Thermal Conductivity (k): {selectedFluid.k} W/(m·K)</Text>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Heat Transfer Coefficient */}
          <Card title="Heat Transfer Coefficient (h) vs x" className="shadow-lg">
            <div className="h-[400px] flex items-center justify-center">
              <img 
                src={`/temp_boundary_layer/${selectedFluid.name}_hx.png`}
                alt={`Heat transfer profile for ${selectedFluid.name}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="h-[80px]"></div> {/* Spacer to match left card height */}
          </Card>

          {/* Info Card */}
          <Card title="About Thermal Boundary Layer" className="shadow-lg">
            <div className="p-4">
              <div className="space-y-4">
                <Text>
                  We simulated laminar thermal boundary layer development over a flat plate using similarity solutions of the Blasius equation. The velocity profile was computed using a numerical shooting method, and the thermal boundary layer was modeled assuming a parabolic temperature profile within the thermal thickness.
                </Text>
                <Text>
                  Simulations were conducted for four fluids (Air, Water, Liquid Metal, and a Prandtl-1 fluid) with varying Prandtl numbers. Temperature contours were generated alongside velocity and thermal boundary layer thicknesses for different streamwise locations.
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThermalBoundaryLayer; 