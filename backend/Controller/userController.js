import { userService } from "../Service/userService.js";

export const createUserController = async (req, res) => {
  try {
    const { username, password, role, personalInfo } = req.body;
    const user = await userService.createUser(username, password, role, personalInfo);
    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error en createUser:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: "Usuario eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      status: req.query.status,
      search: req.query.search,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      }
    };

    const result = await userService.getAllUsers(filters);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error en getUserById:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await userService.updateUser(id, updateData);
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
