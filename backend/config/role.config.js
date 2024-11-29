export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STAFF: 'staff',
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
      appointments: {
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
          update: true,  
          delete: false
      },
      appointments: {
          create: true,
          read: true,
          update: true,  
          delete: true   
      },
      system: {
          manageSettings: false,
          viewLogs: false
      }
  },
  [ROLES.STAFF]: {
      users: {
          create: false,
          read: true,
          update: false,
          delete: false
      },
      appointments: {
          create: true,
          read: true,
          update: true,
          delete: false
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
      appointments: {
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

export function checkPermission(role, resource, action) {
  return PERMISSIONS[role]?.[resource]?.[action] || false;
}