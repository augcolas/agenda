import { AxiosError } from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

import ResetPasswordForm from "../../components/ResetPasswordForm/ResetPasswordForm";
import { resetPasswordService } from "../../services/user.service";

const ResetPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const { token } = useParams();

  const handleSubmit = async (password: string) => {
    setError(null);
    try {
      if (!token) {
        throw new Error("Token manquant.");
      }
      const resp = await resetPasswordService(password, token);
      setResponse(resp);
    } catch (error_) {
      if (error_ instanceof AxiosError) {
        console.log(error_.response?.data.message);
        setError(error_.response?.data.message);
      } else {
        setError("Une erreur est survenue.");
        console.error("Forget password failed:", error_);
      }
    }
  };

  return (
    <div className="auth-form">
      <h1>Changer de mot de passe</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {response ? (
        <p>{response}</p>
      ) : (
        <ResetPasswordForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default ResetPasswordPage;
