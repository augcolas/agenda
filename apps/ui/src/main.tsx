// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import LoginPage from './pages/LoginPage/LoginPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';

const Main: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <CalendarPage />
        </ProtectedRoute>
      }
    />
    <Route path='/login' element={<LoginPage/>} />
    <Route path="/logout" element={<LogoutPage />} />
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
