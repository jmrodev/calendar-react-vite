class NotificationService {
    constructor() {
        this.baseUrl = 'http://localhost:3001/api/notifications';
    }

    async sendNotification(notificationData) {
        // Lógica para enviar una notificación
    }

    async getNotifications(userId) {
        // Lógica para obtener notificaciones de un usuario
    }
}

export default new NotificationService(); 