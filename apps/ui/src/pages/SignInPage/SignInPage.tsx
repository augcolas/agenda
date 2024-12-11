import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SignInForm from "../../components/SignInForm/SignInForm";
import { createUserService } from "../../services/user.service";

const SignInPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFormSubmit = async (email: string, password: string) => {
    setMessage("");
    setIsLoading(true);

    try {
      const result = await createUserService(email, password);

      setIsLoading(false);
      setMessage(result);

      if (result === "User created successfully") {
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      setMessage("Une erreur est survenue lors de votre inscription.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="auth-form">
      <h1>Inscription</h1>

      <SignInForm onSubmit={handleFormSubmit} />

      {isLoading && <p>Chargement...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignInPage;
