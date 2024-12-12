import axios from "axios";

import { type UserInterface } from "../interfaces/user.interface";
import api from "./api.service";

export const createUserService = async (
  email: string,
  password: string,
): Promise<string> => {
  try {
    await api.post("/users", { email, password });

    return "User created successfully";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      return `Error: ${errorData.message || "Unknown error"}`;
    }
    return `Network error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
};

export const logUserService = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  try {
    const response = await api.post("/auth/login", { email, password });

    const { token }: { token: string } = response.data;
    return { token };
  } catch (error) {
    console.error("Error logging in the user:", error);
    throw error;
  }
};

export const logoutUserService = async (): Promise<void> => {
  try {
    await api.post("/auth/logout", {});
  } catch (error) {
    console.error("Error logging out the user:", error);
    throw error;
  }
};

export const getUsersService = async (): Promise<UserInterface[]> => {
  try {
    const response = await api.get("/users");

    const users: UserInterface[] = response.data.data;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const forgotPasswordService = async (email: string): Promise<string> => {
  try {
    await api.post("/auth/forgot-password", { email });

    return "Email envoyé avec succès";
  } catch (error) {
    console.error("Error sending the email:", error);
    throw error;
  }
};

export const resetPasswordService = async (
  password: string,
  token: string,
): Promise<string> => {
  try {
    await api.post(
      "/auth/update-password",
      { password },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return "Mot de passe mis à jour avec succès";
  } catch (error) {
    console.error("Error updating the password:", error);
    throw error;
  }
};
