import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const timePoints = [0.01, 0.031, 0.052, 0.073, 0.094, 0.116, 0.137, 0.158, 0.179, 0.2];
const modes = [1, 2, 3];

const FourierModes: React.FC = () => {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState(1);
  const currentTime = timePoints[selectedTimeIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Title level={2} className="text-center mb-8">Fourier Modes Analysis</Title>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Cooling Profile */}
          <Card title="Cooling Profile" className="shadow-lg">
            <div className="h-[400px] flex items-center justify-center">
              <img 
                src={`/fourier_modes/cooling_t${currentTime.toFixed(3)}_n${selectedMode}.png`}
                alt={`Cooling profile for mode ${selectedMode} at t = ${currentTime}`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 px-4">
              <Text strong>Select Mode:</Text>
              <div className="w-4/5 mx-auto">
                <Slider
                  min={1}
                  max={3}
                  step={1}
                  value={selectedMode}
                  onChange={setSelectedMode}
                  marks={{
                    1: 'Mode 1',
                    2: 'Mode 2',
                    3: 'Mode 3'
                  }}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Time Selection */}
          <Card title="Time Selection" className="shadow-lg">
            <div className="p-4">
              <Text strong>Time:</Text>
              <div className="w-4/5 mx-auto">
                <Slider
                  min={0}
                  max={9}
                  step={1}
                  value={selectedTimeIndex}
                  onChange={setSelectedTimeIndex}
                  marks={timePoints.reduce((acc, time, index) => ({
                    ...acc,
                    [index]: time.toFixed(3)
                  }), {})}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Modes Plot */}
          <Card title="Fourier Modes" className="shadow-lg">
            <div className="h-[400px] flex items-center justify-center">
              <img 
                src={`/fourier_modes/modes_t${currentTime.toFixed(3)}.png`}
                alt={`Fourier modes at t = ${currentTime}`}
                className="w-full h-full object-contain"
              />
            </div>
          </Card>

          {/* Info Card */}
          <Card title="About Fourier Modes" className="shadow-lg">
            <div className="p-4">
              <div className="space-y-4">
                <Text>
                  This visualization shows the evolution of temperature profiles using Fourier series decomposition. The cooling profiles demonstrate how different modes contribute to the overall temperature distribution over time.
                </Text>
                <Text>
                  The left plot shows individual mode contributions (n=1,2,3) to the cooling process, while the right plot displays the combined effect of all modes at different time points. The simulation tracks the temperature evolution from t=0.01 to t=0.2.
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FourierModes; 