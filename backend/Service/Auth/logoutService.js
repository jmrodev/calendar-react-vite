export const logoutService = async (session) => {
    try {
        if (session) {
            await session.destroy();
        }
    } catch (error) {
        throw new Error(`Logout error: ${error.message}`);
    }
}; 