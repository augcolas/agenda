export const createUserService = async (email: string, password: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        // Si la réponse est réussie, retourne un message de succès
        return 'User created successfully';
      } else {
        // Si la réponse n'est pas réussie, retourne l'erreur du serveur
        const errorData = await response.json();
        return `Error: ${errorData.message || 'Unknown error'}`;
      }
    } catch (error) {
      // Si une erreur de réseau ou autre se produit
      return `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };
  

export const logUserService = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        console.log('ici')
        const response = await fetch(`http://localhost:3000/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const { token }: { token: string } = await response.json();
        return { token };
    } catch (error) {
        console.error("Error logging in the user:", error);
        throw error;
    }
};
