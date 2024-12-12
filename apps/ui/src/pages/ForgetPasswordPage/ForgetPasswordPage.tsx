import { useState } from "react";

import ForgetPasswordForm from "../../components/ForgetPasswordForm/ForgetPasswordForm";
import { forgotPasswordService } from "../../services/user.service";

const ForgetPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (email: string) => {
    setError(null);
    try {
      const resp = await forgotPasswordService(email);
      setResponse(resp);
    } catch (error_) {
      setError("Une erreur est survenue.");
      console.error("Forget password failed:", error_);
    }
  };

  return (
    <div className="auth-form">
      <h1>Mot de passe oublié</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {response ? (
        <p>{response}</p>
      ) : (
        <ForgetPasswordForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default ForgetPasswordPage;
