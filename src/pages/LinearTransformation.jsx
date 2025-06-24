import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input } from 'antd';

const { Title, Text } = Typography;

const LinearTransformation = () => {
  const [matrix, setMatrix] = useState([[1, 0], [0, 1]]);
  const [matrixInputValues, setMatrixInputValues] = useState([['1', '0'], ['0', '1']]);
  const [initialVector, setInitialVector] = useState([2, 1]);
  const [transformedVector, setTransformedVector] = useState([2, 1]);
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

  // Matrix transformation function
  const multiplyMatrixVector = (matrix, vector) => {
    const [a, b] = matrix[0];
    const [c, d] = matrix[1];
    const [x, y] = vector;
    
    return [
      a * x + b * y,
      c * x + d * y
    ];
  };

  // Update transformed vector when matrix changes
  useEffect(() => {
    const transformed = multiplyMatrixVector(matrix, initialVector);
    setTransformedVector(transformed);
  }, [matrix, initialVector]);

  // Update matrix from input values
  useEffect(() => {
    const newMatrix = matrixInputValues.map(row => 
      row.map(val => parseFloat(val) || 0)
    );
    
    // Only update if there's a real change in numeric values
    if (JSON.stringify(newMatrix) !== JSON.stringify(matrix)) {
      setMatrix(newMatrix);
    }
  }, [matrixInputValues]);

  // Handle matrix input changes
  const handleMatrixInputChange = (row, col, value) => {
    const newInputValues = matrixInputValues.map(r => [...r]);
    newInputValues[row][col] = value;
    setMatrixInputValues(newInputValues);
  };

  // Draw the visualization
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

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw axes with better styling
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Draw axis labels and tick marks
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      
      // X-axis labels and ticks
      const xRange = Math.floor(width / scale);
      for (let i = -Math.floor(xRange/2); i <= Math.floor(xRange/2); i += 2) {
        const x = centerX + i * scale;
        if (x >= 0 && x <= width) {
          // Draw tick mark
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, centerY - 5);
          ctx.lineTo(x, centerY + 5);
          ctx.stroke();
          
          // Draw label
          ctx.fillStyle = '#1e293b';
          ctx.fillText(i.toString(), x, centerY + 20);
        }
      }
      
      // Y-axis labels and ticks
      const yRange = Math.floor(height / scale);
      for (let i = -Math.floor(yRange/2); i <= Math.floor(yRange/2); i += 2) {
        const y = centerY - i * scale;
        if (y >= 0 && y <= height) {
          // Draw tick mark
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - 5, y);
          ctx.lineTo(centerX + 5, y);
          ctx.stroke();
          
          // Draw label
          ctx.fillStyle = '#1e293b';
          ctx.textAlign = 'right';
          ctx.fillText(i.toString(), centerX - 10, y + 4);
        }
      }
      
      // Reset text alignment
      ctx.textAlign = 'center';

      // Draw axis labels
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 18px Arial';
      
      // X-axis label
      ctx.fillText('X', width - 30, centerY + 40);
      
      // Y-axis label (straight, not rotated)
      ctx.fillText('Y', centerX - 30, 30);

      // Draw initial vector (blue)
      const x1 = centerX + initialVector[0] * scale;
      const y1 = centerY - initialVector[1] * scale;
      
      // Draw vector line with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw initial vector arrowhead
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - 12, y1 - 6);
      ctx.lineTo(x1 - 12, y1 + 6);
      ctx.closePath();
      ctx.fill();

      // Draw transformed vector (red)
      const x2 = centerX + transformedVector[0] * scale;
      const y2 = centerY - transformedVector[1] * scale;
      
      // Draw vector line with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw transformed vector arrowhead
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12, y2 - 6);
      ctx.lineTo(x2 - 12, y2 + 6);
      ctx.closePath();
      ctx.fill();

      // Draw labels with better styling
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      
      // Initial vector label
      ctx.fillText(`(${initialVector[0]}, ${initialVector[1]})`, x1 + 25, y1 + 5);
      
      // Transformed vector label
      ctx.fillText(`(${transformedVector[0].toFixed(2)}, ${transformedVector[1].toFixed(2)})`, x2 + 25, y2 + 5);
    };

    drawCanvas();

    // Listen for resize events
    const handleResize = () => drawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [initialVector, transformedVector, matrix]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <Title level={2} className="text-center mb-8 text-slate-800">
        Linear Transformation Visualization
      </Title>
      
      <div className="max-w-7xl mx-auto">
        {/* Controls Section - Above Graph */}
        <div className="mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="p-6">
              <Text strong className="text-lg text-slate-700 mb-4 block">
                Transformation Matrix
              </Text>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Text className="text-slate-600 mb-2 block">Matrix Elements:</Text>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm text-slate-500">a:</Text>
                      <Input
                        type="number"
                        value={matrixInputValues[0][0]}
                        onChange={(e) => handleMatrixInputChange(0, 0, e.target.value)}
                        className="w-24 text-center font-semibold"
                      />
                    </div>
                    <div>
                      <Text className="text-sm text-slate-500">b:</Text>
                      <Input
                        type="number"
                        value={matrixInputValues[0][1]}
                        onChange={(e) => handleMatrixInputChange(0, 1, e.target.value)}
                        className="w-24 text-center font-semibold"
                      />
                    </div>
                    <div>
                      <Text className="text-sm text-slate-500">c:</Text>
                      <Input
                        type="number"
                        value={matrixInputValues[1][0]}
                        onChange={(e) => handleMatrixInputChange(1, 0, e.target.value)}
                        className="w-24 text-center font-semibold"
                      />
                    </div>
                    <div>
                      <Text className="text-sm text-slate-500">d:</Text>
                      <Input
                        type="number"
                        value={matrixInputValues[1][1]}
                        onChange={(e) => handleMatrixInputChange(1, 1, e.target.value)}
                        className="w-24 text-center font-semibold"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Text className="text-slate-600 mb-2 block">Current Matrix:</Text>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-center font-mono text-lg">
                      [{matrix[0][0]} {matrix[0][1]}]
                      <br />
                      [{matrix[1][0]} {matrix[1][1]}]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Graph Section - Full Width */}
        <div className="w-full">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="p-6">
              <Text strong className="text-lg text-slate-700 mb-4 block">
                Vector Visualization
              </Text>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={window.innerWidth - 100}
                  height={600}
                  className="rounded-lg border border-slate-200 w-full max-w-none"
                />
              </div>
              <div className="mt-4 flex justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <Text className="text-slate-600">Initial Vector</Text>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <Text className="text-slate-600">Transformed Vector</Text>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Vector Information */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="p-6">
              <Text strong className="text-lg text-slate-700 mb-4 block">
                Vector Information
              </Text>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex justify-between items-center">
                  <Text className="text-slate-600">Initial Vector:</Text>
                  <Text strong className="font-mono">({initialVector[0]}, {initialVector[1]})</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-slate-600">Transformed Vector:</Text>
                  <Text strong className="font-mono">
                    ({transformedVector[0].toFixed(3)}, {transformedVector[1].toFixed(3)})
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LinearTransformation; 