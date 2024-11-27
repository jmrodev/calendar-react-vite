// roles.config.js
export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
  };
  
  export const PERMISSIONS = {
    [ROLES.ADMIN]: {
      users: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      events: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      system: {
        manageSettings: true,
        viewLogs: true
      }
    },
    [ROLES.USER]: {
      users: {
        create: false,
        read: false,
        update: true,  // Puede actualizar su propio perfil
        delete: false
      },
      events: {
        create: true,
        read: true,
        update: true,  // Puede actualizar sus propios eventos
        delete: true   // Puede eliminar sus propios eventos
      },
      system: {
        manageSettings: false,
        viewLogs: false
      }
    },
    [ROLES.GUEST]: {
      users: {
        create: false,
        read: false,
        update: false,
        delete: false
      },
      events: {
        create: false,
        read: false,
        update: false,
        delete: false
      },
      system: {
        manageSettings: false,
        viewLogs: false
      }
    }
  };
  
  // Función de utilidad para verificar permisos
  export function checkPermission(role, resource, action) {
    return PERMISSIONS[role]?.[resource]?.[action] || false;
  }