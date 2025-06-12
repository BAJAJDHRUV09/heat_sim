import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BoundaryLayerAnalysis from './pages/BoundaryLayerAnalysis';
import ThermalBoundaryLayer from './pages/ThermalBoundaryLayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boundary-layer" element={<BoundaryLayerAnalysis />} />
        <Route path="/thermal-boundary-layer" element={<ThermalBoundaryLayer />} />
      </Routes>
    </Router>
  );
}

export default App;
