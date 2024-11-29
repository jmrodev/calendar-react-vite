import { checkPermission } from '../../config/role.config.js';

export const authorize = (resource, action) => {
    return (req, res, next) => {
        try {
            
            if (!req.user || !req.user.role) {
                return res.status(401).json({
                    error: 'No autorizado - Usuario o rol no encontrado'
                });
            }

            const userRole = req.user.role;
            
            if (checkPermission(userRole, resource, action)) {
                return next();
            } else {
                return res.status(403).json({
                    error: 'No tienes permiso para realizar esta acción'
                });
            }
        } catch (error) {
            console.error('Error en autorización:', error);
            return res.status(500).json({
                error: 'Error interno del servidor durante la autorización'
            });
        }
    };
};