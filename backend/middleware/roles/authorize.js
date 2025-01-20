import { PERMISSIONS } from "../../config/role.config.js";

export const authorize = (resource, action) => {
  return (req, res, next) => {
    try {
      if (!req.user?.role) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Usuario o rol no encontrado"
        });
      }

      const userRole = req.user.role;
      const rolePermissions = PERMISSIONS[userRole];

      if (!rolePermissions) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Rol no válido"
        });
      }

      const hasPermission = rolePermissions[resource]?.[action];

      if (!hasPermission) {
        const requiredRole = Object.keys(PERMISSIONS).find(role => 
          PERMISSIONS[role][resource]?.[action]
        );
        
        return res.status(403).json({
          error: "Forbidden",
          message: `No tienes permiso para ${action} en ${resource}`,
          requiredRole
        });
      }

      // Extender información de auditoría
      req.audit = {
        ...req.audit,
        role: userRole,
        action,
        resource
      };

      next();
    } catch (error) {
      console.error("Error en autorización:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Error en la autorización"
      });
    }
  };
};
