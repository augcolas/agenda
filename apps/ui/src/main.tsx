import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home/Home';

const Main = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    {/* Ajoute d'autres routes ici si nécessaire */}
  </Routes>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Main />
    </Router>
  </StrictMode>
);
