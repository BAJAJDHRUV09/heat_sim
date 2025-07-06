import React, { useRef, useEffect, useState } from 'react';
import { Slider, Row, Col, Typography, Card } from 'antd';

const { Title } = Typography;

// Helper to multiply a 2x2 matrix by a 2D vector
function matVecMul(mat, vec) {
  return [
    mat[0][0] * vec[0] + mat[0][1] * vec[1],
    mat[1][0] * vec[0] + mat[1][1] * vec[1],
  ];
}

const LinearTransformation = () => {
  // Sliders for p and gamma
  const [p, setP] = useState(1);
  const [gamma, setGamma] = useState(0);
  const canvasRef = useRef(null);

  // Matrix is always [[p, gamma], [gamma, p]]
  const matrix = [
    [p, gamma],
    [gamma, p],
  ];

  // Draw the grid and vectors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Set up coordinate system
    const scale = Math.min(width, height) / 8; // 8 units across
    const centerX = width / 2;
    const centerY = height / 2;

    // Helper: draw a line in math coords
    function drawLine(x1, y1, x2, y2, color, width=1) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(centerX + x1 * scale, centerY - y1 * scale);
      ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale);
      ctx.stroke();
      ctx.restore();
    }

    // Draw transformed grid (red for x, blue for y)
    ctx.globalAlpha = 0.5;
    for (let x = -3; x <= 3; x++) {
      // Vertical lines: (x, y) for y in [-3,3]
      const start = matVecMul(matrix, [x, -3]);
      const end = matVecMul(matrix, [x, 3]);
      drawLine(start[0], start[1], end[0], end[1], 'red');
    }
    for (let y = -3; y <= 3; y++) {
      // Horizontal lines: (x, y) for x in [-3,3]
      const start = matVecMul(matrix, [-3, y]);
      const end = matVecMul(matrix, [3, y]);
      drawLine(start[0], start[1], end[0], end[1], 'blue');
    }
    ctx.globalAlpha = 1.0;

    // Draw axes
    drawLine(-3, 0, 3, 0, '#888', 2);
    drawLine(0, -3, 0, 3, '#888', 2);

    // Draw transformed basis vectors as arrows
    function drawArrow(vec, color) {
      const [x, y] = matVecMul(matrix, vec);
      const len = Math.sqrt(x * x + y * y);
      const normX = x / len;
      const normY = y / len;
      // Arrow body
      drawLine(0, 0, x, y, color, 3);
      // Arrow head
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      const arrowSize = 0.15;
      const angle = Math.atan2(y, x);
      ctx.translate(centerX + x * scale, centerY - y * scale);
      ctx.rotate(-angle);
      ctx.moveTo(0, 0);
      ctx.lineTo(-arrowSize * scale, arrowSize * scale / 2);
      ctx.lineTo(-arrowSize * scale, -arrowSize * scale / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // Red: (1,0), Blue: (0,1), Green: (1,1)
    drawArrow([1, 0], 'red');
    drawArrow([0, 1], 'blue');
    drawArrow([1, 1], 'green');

    // Axis labels
    ctx.save();
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('x-axis', centerX + 3 * scale - 30, centerY + 20);
    ctx.fillText('y-axis', centerX - 40, centerY - 3 * scale + 10);
    ctx.restore();
  }, [p, gamma]);

  return (
    <Card style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <Title level={3} style={{ textAlign: 'center' }}>2D Linear Transformation Visualizer</Title>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <div style={{ marginBottom: 8 }}>p</div>
          <Slider min={-2} max={2} step={0.01} value={p} onChange={setP} />
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: 8 }}>γ</div>
          <Slider min={-2} max={2} step={0.01} value={gamma} onChange={setGamma} />
        </Col>
      </Row>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 18 }}>
          Matrix: [[{p.toFixed(2)}, {gamma.toFixed(2)}], [{gamma.toFixed(2)}, {p.toFixed(2)}]]
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ background: '#f0f4f8', border: '1px solid #ccc', borderRadius: 8 }}
        />
      </div>
    </Card>
  );
};

export default LinearTransformation; 