import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BoundaryLayerAnalysis from './pages/BoundaryLayerAnalysis.jsx';
import ThermalBoundaryLayer from './pages/ThermalBoundaryLayer.jsx';
import FourierModes from './pages/FourierModes.jsx';
import LinearTransformation from './pages/LinearTransformation.jsx';
import VectorFieldDivergence from './pages/VectorFieldDivergence.jsx';
import StartupShearFlow from './pages/StartupShearFlow.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boundary-layer" element={<BoundaryLayerAnalysis />} />
        <Route path="/thermal-boundary-layer" element={<ThermalBoundaryLayer />} />
        <Route path="/fourier-modes" element={<FourierModes />} />
        <Route path="/linear-transformation" element={<LinearTransformation />} />
        <Route path="/vector-field-divergence" element={<VectorFieldDivergence />} />
        <Route path="/startup-shear-flow" element={<StartupShearFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
