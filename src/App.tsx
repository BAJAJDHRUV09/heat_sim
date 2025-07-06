import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BoundaryLayerAnalysis from './pages/BoundaryLayerAnalysis.jsx';
import ThermalBoundaryLayer from './pages/ThermalBoundaryLayer.jsx';
import NaturalConvection from './pages/NaturalConvection.tsx';
import FourierModes from './pages/FourierModes.jsx';
import LinearTransformation from './pages/LinearTransformation.jsx';
import VectorFieldDivergence from './pages/VectorFieldDivergence.jsx';
import StartupShearFlow from './pages/StartupShearFlow.jsx';
import PulsatileFlow from './pages/PulsatileFlow.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boundary-layer" element={<BoundaryLayerAnalysis />} />
        <Route path="/thermal-boundary-layer" element={<ThermalBoundaryLayer />} />
        <Route path="/natural-convection" element={<NaturalConvection />} />
        <Route path="/fourier-modes" element={<FourierModes />} />
        <Route path="/linear-transformation" element={<LinearTransformation />} />
        <Route path="/vector-field-divergence" element={<VectorFieldDivergence />} />
        <Route path="/startup-shear-flow" element={<StartupShearFlow />} />
        <Route path="/pulsatile-flow" element={<PulsatileFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
