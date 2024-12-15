export const createUserController = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newUser = await createUser(username, password, role);
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
}; 

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUser(id);
        res.json({
            success: true,
            deletedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 

