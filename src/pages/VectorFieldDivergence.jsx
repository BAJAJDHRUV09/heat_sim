import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Select } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const VectorFieldDivergence = () => {
  const [selectedField, setSelectedField] = useState('converging');
  const canvasRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth - 100;
        // Trigger redraw
        const event = new Event('resize');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simplified vector field functions
  const vectorFields = {
    'converging': {
      name: 'Converging Field',
      description: 'Arrows point toward origin',
      function: (x, y) => [-x, -y],
      color: '#ef4444',
      formula: 'F(x,y) = (-x, -y)',
      divergence: -2
    },
    'diverging': {
      name: 'Diverging Field',
      description: 'Arrows point away from origin',
      function: (x, y) => [x, y],
      color: '#10b981',
      formula: 'F(x,y) = (x, y)',
      divergence: 2
    },
    'saddle': {
      name: 'Saddle Point',
      description: 'Mixed convergence/divergence',
      function: (x, y) => [x, -y],
      color: '#f59e0b',
      formula: 'F(x,y) = (x, -y)',
      divergence: 0
    },
    'rotational': {
      name: 'Rotational Field',
      description: 'Arrows rotate around origin',
      function: (x, y) => [-y, x],
      color: '#3b82f6',
      formula: 'F(x,y) = (-y, x)',
      divergence: 0
    },
    'spiral_in': {
      name: 'Spiral In',
      description: 'Arrows spiral toward origin',
      function: (x, y) => [-x - y, x - y],
      color: '#8b5cf6',
      formula: 'F(x,y) = (-x-y, x-y)',
      divergence: -2
    },
    'spiral_out': {
      name: 'Spiral Out',
      description: 'Arrows spiral away from origin',
      function: (x, y) => [x - y, x + y],
      color: '#ec4899',
      formula: 'F(x,y) = (x-y, x+y)',
      divergence: 2
    }
  };

  // Draw the vector field visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawCanvas = () => {
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) / 20; // Responsive scale based on canvas size

      // Clear canvas with simple background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw simple grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      
      // Vertical lines (fewer)
      for (let x = 0; x <= width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines (fewer)
      for (let y = 0; y <= height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Draw simple axis labels
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      
      // X-axis labels (fewer)
      const xRange = Math.floor(width / scale);
      for (let i = -Math.floor(xRange/2); i <= Math.floor(xRange/2); i += 2) {
        const x = centerX + i * scale;
        if (x >= 0 && x <= width) {
          ctx.fillText(i.toString(), x, centerY + 20);
        }
      }
      
      // Y-axis labels (fewer)
      const yRange = Math.floor(height / scale);
      for (let i = -Math.floor(yRange/2); i <= Math.floor(yRange/2); i += 2) {
        const y = centerY - i * scale;
        if (y >= 0 && y <= height) {
          ctx.textAlign = 'right';
          ctx.fillText(i.toString(), centerX - 10, y + 4);
        }
      }
      
      ctx.textAlign = 'center';

      // Draw axis labels
      ctx.fillText('X', width - 20, centerY + 35);
      ctx.fillText('Y', centerX - 20, 25);

      // Draw vector field (simplified - fewer arrows)
      const field = vectorFields[selectedField];
      const fieldFunction = field.function;
      const fieldColor = field.color;

      // Use larger grid spacing for fewer arrows
      const gridSpacing = scale * 1.5; // Fewer arrows

      for (let x = 0; x <= width; x += gridSpacing) {
        for (let y = 0; y <= height; y += gridSpacing) {
          // Convert pixel coordinates to mathematical coordinates
          const mathX = (x - centerX) / scale;
          const mathY = (centerY - y) / scale;

          // Calculate vector at this point
          const [vx, vy] = fieldFunction(mathX, mathY);
          
          // Skip if vector is too small
          const magnitude = Math.sqrt(vx * vx + vy * vy);
          if (magnitude < 0.1) continue;

          // Normalize and scale vector
          const normalizedVx = vx / magnitude;
          const normalizedVy = vy / magnitude;
          const scaledLength = Math.min(magnitude * 15, 20); // Shorter arrows

          // Calculate arrow end point
          const endX = x + normalizedVx * scaledLength;
          const endY = y + normalizedVy * scaledLength;

          // Draw simple arrow (no shadows)
          ctx.strokeStyle = fieldColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Draw simple arrowhead
          const angle = Math.atan2(normalizedVy, normalizedVx);
          const arrowheadLength = 6;
          const arrowheadAngle = Math.PI / 6;

          ctx.fillStyle = fieldColor;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowheadLength * Math.cos(angle - arrowheadAngle),
            endY - arrowheadLength * Math.sin(angle - arrowheadAngle)
          );
          ctx.lineTo(
            endX - arrowheadLength * Math.cos(angle + arrowheadAngle),
            endY - arrowheadLength * Math.sin(angle + arrowheadAngle)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    };

    drawCanvas();

    // Listen for resize events
    const handleResize = () => drawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [selectedField]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Title level={2} className="text-center mb-8">
        Vector Field Divergence Visualization
      </Title>
      
      <div className="max-w-6xl mx-auto">
        {/* Controls Section */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <div className="p-6">
              <Text strong className="text-lg mb-4 block">
                Select Vector Field
              </Text>
              <Select
                value={selectedField}
                onChange={setSelectedField}
                className="w-full"
                size="large"
              >
                {Object.entries(vectorFields).map(([key, field]) => (
                  <Option key={key} value={key}>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: field.color }}
                      ></div>
                      {field.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
          </Card>
        </div>

        {/* Graph Section */}
        <div className="w-full">
          <Card className="shadow-lg">
            <div className="p-6">
              <Text strong className="text-lg mb-4 block">
                Vector Field Visualization
              </Text>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={window.innerWidth - 100}
                  height={500}
                  className="border border-gray-300 rounded w-full max-w-none"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Field Information */}
        <div className="mt-8">
          <Card className="shadow-lg">
            <div className="p-6">
              <Text strong className="text-lg mb-4 block">
                Field Information
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Text strong>Selected Field:</Text>
                  <Text className="ml-2 font-semibold">
                    {vectorFields[selectedField].name}
                  </Text>
                  <br />
                  <Text className="text-gray-600 mt-2 block">
                    {vectorFields[selectedField].description}
                  </Text>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <Text strong className="text-sm text-gray-700 mb-1 block">
                      Vector Field Formula:
                    </Text>
                    <Text className="font-mono text-lg font-bold text-blue-600">
                      {vectorFields[selectedField].formula}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text strong>Divergence Types:</Text>
                  <div className="mt-2 space-y-1">
                    <Text className="text-sm">
                      • <span className="font-semibold text-red-500">Red:</span> Converging (negative divergence)
                    </Text>
                    <Text className="text-sm">
                      • <span className="font-semibold text-green-500">Green:</span> Diverging (positive divergence)
                    </Text>
                    <Text className="text-sm">
                      • <span className="font-semibold text-blue-500">Blue:</span> Rotational (zero divergence)
                    </Text>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Text strong className="text-sm text-gray-700 mb-1 block">
                      Numerical Divergence Value:
                    </Text>
                    <Text className="font-mono text-xl font-bold text-blue-600">
                      ∇ · F = {vectorFields[selectedField].divergence}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1 block">
                      {vectorFields[selectedField].divergence > 0 ? 'Positive divergence (source)' : 
                       vectorFields[selectedField].divergence < 0 ? 'Negative divergence (sink)' : 
                       'Zero divergence (solenoidal)'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VectorFieldDivergence; 