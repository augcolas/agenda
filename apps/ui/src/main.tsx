// index.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import Home from './pages/HomePage/HomePage';
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

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </Router>
  </StrictMode>
);
