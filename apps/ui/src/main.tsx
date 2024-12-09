// index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import Home from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import "./main.css";

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
    <Route path="/login" element={<LoginPage />} />
    <Route path="/logout" element={<LogoutPage />} />
    <Route path="/register" element={<SignInPage />} />
  </Routes>
);

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Layout>
          <Main />
        </Layout>
      </AuthProvider>
    </Router>
  </StrictMode>,
);
