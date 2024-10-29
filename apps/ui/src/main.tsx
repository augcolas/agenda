// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MyCalendar from './pages/MyCalendar/MyCalendar';

const Main: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <MyCalendar />
        </ProtectedRoute>
      }
    />

  </Routes>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </Router>
  </StrictMode>
);
