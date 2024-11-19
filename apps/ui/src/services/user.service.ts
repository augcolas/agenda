//export const createUserService = () => {}

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
