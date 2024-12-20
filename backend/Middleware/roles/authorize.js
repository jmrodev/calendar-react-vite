import { PERMISSIONS } from "../../config/role.config.js";

export const authorize = (resource, action) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          error: "No autorizado - Usuario o rol no encontrado",
        });
      }

      const userRole = req.user.role;
      const rolePermissions = PERMISSIONS[userRole];

      if (!rolePermissions) {
        return res.status(403).json({
          error: "Rol no válido",
        });
      }

      const hasPermission = rolePermissions[resource]?.[action];

      if (!hasPermission) {
        return res.status(403).json({
          error: `No tienes permiso para ${action} en ${resource}`,
          requiredRole: Object.keys(PERMISSIONS).find(role => 
            PERMISSIONS[role][resource]?.[action]
          )
        });
      }

      // Agregar información de auditoría
      req.audit = {
        userId: req.user.id,
        username: req.user.username,
        role: userRole,
        action: action,
        resource: resource,
        timestamp: new Date()
      };

      return next();
    } catch (error) {
      console.error("Error en autorización:", error);
      return res.status(500).json({
        error: "Error interno del servidor durante la autorización",
      });
    }
  };
};
