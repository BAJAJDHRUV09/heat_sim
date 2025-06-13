import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BoundaryLayerAnalysis from './pages/BoundaryLayerAnalysis';
import ThermalBoundaryLayer from './pages/ThermalBoundaryLayer';
import FourierModes from './pages/FourierModes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boundary-layer" element={<BoundaryLayerAnalysis />} />
        <Route path="/thermal-boundary-layer" element={<ThermalBoundaryLayer />} />
        <Route path="/fourier-modes" element={<FourierModes />} />
      </Routes>
    </Router>
  );
}

export default App;
