import { UserModel } from "../Models/UserModel";
import { newUserId } from "../Utils/createId";



const createUser = async (req, res) => {
        
    try {
        const { username, password, role } = req.body;
        
        if (role !== 'admin') {
            return res.status(400).json({ error: 'Invalid role to create users' });
        }
        
        if(!username || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password too short' });
        }

        const newUser = UserModel.create({
            _id: newUserId(), 
            username,
            password,
            role
        });

        await newUser.hashPassword();
        const objectSaved = await newUser.save();

        res.status(201).json(objectSaved);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.find({ _id: Number(id) });

        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'UserModel not found' });
        }

        res.json(user[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        
        const user = await UserModel.find({ _id: Number(id) })[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'UserModel not found'
            });
        }

        
        const deletedUser = await UserModel.delete({ _id: Number(id) });

        res.json({
            success: true,
            deletedUser
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;

        
        const user = await UserModel.find({ _id: Number(id) })[0];

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'UserModel not found'
            });
        }

        
        user.username = username;
        user.password = password;
        user.role = role;

        await user.save();

        res.json({
            success: true,
            user
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createUser, getAllUsers, getUserById, deleteUser, updateUser };