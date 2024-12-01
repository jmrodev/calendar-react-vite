class UserService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api/users';
    }

    async registerUser(userData) {
        // Lógica para registrar un usuario
    }

    async loginUser(credentials) {
        // Lógica para iniciar sesión
    }

    async getUserProfile(userId) {
        // Lógica para obtener el perfil de un usuario
    }
}

export default new UserService(); 