export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  SECRETARY: "secretary",
  GUEST: "guest"
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    users: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    appointments: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    logs: {
      create: true,
      read: true,
      delete: true
    }
  },
  [ROLES.DOCTOR]: {
    users: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    appointments: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    logs: {
      create: true,
      read: true,
      delete: false
    }
  },
  [ROLES.SECRETARY]: {
    users: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    appointments: {
      create: true,
      read: true,
      update: true,
      delete: false,
    },
    logs: {
      create: true,
      read: true,
      delete: false
    }
  },
  [ROLES.GUEST]: {
    users: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    appointments: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    logs: {
      create: false,
      read: false,
      delete: false
    }
  }
};

export function checkPermission(role, resource, action) {
  return PERMISSIONS[role]?.[resource]?.[action] || false;
}
