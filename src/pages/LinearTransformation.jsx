import React from 'react';

const LinearTransformation = () => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#f4f7f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <iframe
        src="/Linear-Transformation-main/index.html"
        title="2D Linear Transformation Explorer"
        style={{ width: '100%', height: '95vh', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        allowFullScreen
      />
    </div>
  );
};

export default LinearTransformation; 