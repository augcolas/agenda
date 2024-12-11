import { type UserInterface } from "../interfaces/user.interface";

export const createUserService = async (
  email: string,
  password: string,
): Promise<string> => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return "User created successfully";
    } else {
      const errorData = await response.json();
      return `Error: ${errorData.message || "Unknown error"}`;
    }
  } catch (error) {
    return `Network error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
};

export const logUserService = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  try {
    const response = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`,
      );
    }

    const { token }: { token: string } = await response.json();
    return { token };
  } catch (error) {
    console.error("Error logging in the user:", error);
    throw error;
  }
};


export const logoutUserService = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Error logging out the user:", error);
    throw error;
  }
}

export const getUsersService = async (token: string): Promise<UserInterface[]> => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    const users: UserInterface[] = data.data;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
