// index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage/ForgetPasswordPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LogoutPage from "./pages/LogoutPage/LogoutPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import "./main.css";

const Main: React.FC = () => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <CalendarPage />
        </ProtectedRoute>
      }
    />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/logout" element={<LogoutPage />} />
    <Route path="/register" element={<SignInPage />} />
    <Route path="/forget-password" element={<ForgetPasswordPage />} />
    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    <Route path="*" element={<NotFoundPage />} />
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
