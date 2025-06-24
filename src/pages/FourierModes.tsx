import React, { useState } from 'react';
import { Slider, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const timePoints = [0.010, 0.031, 0.052, 0.073, 0.094, 0.116, 0.137, 0.158, 0.179, 0.200, 0.400, 0.600, 0.800, 1.000];
const modes = [1, '1-2', '1-3', '1-10'];
const biotNumbers = [0.1, 5.0, 10.0];

const FourierModes: React.FC = () => {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState<number | string>(1);
  const [selectedBiotIndex, setSelectedBiotIndex] = useState(2); // Default to Bi=10.0
  const currentTime = timePoints[selectedTimeIndex];
  const currentBiot = biotNumbers[selectedBiotIndex];

  // Helper function to get the correct file name based on mode
  const getModeFileName = (mode: number | string) => {
    if (mode === 1) {
      return 'Mode1';
    }
    return `Modes${mode}`;
  };

  // Helper function to get mode display name
  const getModeDisplayName = (mode: number | string) => {
    if (mode === 1) {
      return 'Mode 1';
    }
    return `Modes 1-${mode.toString().split('-')[1]}`;
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Exact Solution Analysis
          </h1>
        </div>

        {/* Information Section - Top */}
        <div className="bg-gray-50 rounded-lg p-4 shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulation Information</h3>
          <p className="text-gray-600">
            This visualization shows the evolution of temperature profiles using exact analytical solutions. The cooling profiles demonstrate how different cumulative modes contribute to the overall temperature distribution over time. The simulation tracks the temperature evolution from t=0.010 to t=1.000 for different Biot numbers (0.1, 5.0, 10.0) representing different boundary conditions. Individual mode (1) and cumulative sums (1-2, 1-3, 1-10) are available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Cooling Profile */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col items-center h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Cooling Profile ({getModeDisplayName(selectedMode)})</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/fourier_modes/cooling_t${currentTime.toFixed(3)}_${getModeFileName(selectedMode)}_Bi${currentBiot.toFixed(1)}.png`}
                alt={`Cooling profile for ${getModeDisplayName(selectedMode)} at t = ${currentTime}, Bi = ${currentBiot}`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
          </div>

          {/* Right Section - Oscillation Plot */}
          <div className="bg-white rounded-lg shadow-xl p-2 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Modes Oscillation</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <img 
                src={`/fourier_modes/cooling_t${currentTime.toFixed(3)}_modes_oscillation_Bi${currentBiot.toFixed(1)}.png`}
                alt={`Modes oscillation at t = ${currentTime}, Bi = ${currentBiot}`}
                className="w-full h-full object-contain"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={e => (e.currentTarget.style.opacity = '0.2')}
              />
            </div>
          </div>
        </div>

        {/* Time Slider - Below both plots */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Time: {currentTime.toFixed(3)}
            </label>
            <input
              type="range"
              value={selectedTimeIndex}
              onChange={e => setSelectedTimeIndex(Number(e.target.value))}
              min={0}
              max={timePoints.length - 1}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {timePoints.map((time, index) => 
                index % 4 === 0 || index === timePoints.length - 1 ? <span key={time}>{time.toFixed(3)}</span> : null
              )}
            </div>
          </div>
        </div>

        {/* Mode and Biot Selection Sliders - Below Time slider */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <div className="space-y-4">
              {/* Mode Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Mode: {getModeDisplayName(selectedMode)}
                </label>
                <input
                  type="range"
                  value={modes.indexOf(selectedMode)}
                  onChange={e => setSelectedMode(modes[Number(e.target.value)])}
                  min={0}
                  max={modes.length - 1}
                  step={1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {modes.map((mode, index) => (
                    <span key={mode}>{mode}</span>
                  ))}
                </div>
              </div>

              {/* Biot Number Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Biot Number (Bi): {currentBiot.toFixed(1)}
                </label>
                <input
                  type="range"
                  value={selectedBiotIndex}
                  onChange={e => setSelectedBiotIndex(Number(e.target.value))}
                  min={0}
                  max={biotNumbers.length - 1}
                  step={1}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {biotNumbers.map(biot => <span key={biot}>{biot.toFixed(1)}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Display */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Current Parameters</h3>
            <div className="text-center space-y-1">
              <Text>Time: {currentTime.toFixed(3)}</Text><br />
              <Text>Mode: {getModeDisplayName(selectedMode)}</Text><br />
              <Text>Biot Number (Bi): {currentBiot.toFixed(1)}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourierModes; 