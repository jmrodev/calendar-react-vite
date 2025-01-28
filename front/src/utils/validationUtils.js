export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
  }
  if (!hasUpperCase) {
    errors.push('La contraseña debe contener al menos una mayúscula');
  }
  if (!hasLowerCase) {
    errors.push('La contraseña debe contener al menos una minúscula');
  }
  if (!hasNumbers) {
    errors.push('La contraseña debe contener al menos un número');
  }
  if (!hasSpecialChar) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateAppointment = (data) => {
  const errors = {};

  if (!data.patientName || data.patientName.trim().length < 3) {
    errors.patientName = 'El nombre del paciente debe tener al menos 3 caracteres';
  }

  if (!data.reason || data.reason.trim().length < 10) {
    errors.reason = 'El motivo de la consulta debe tener al menos 10 caracteres';
  }

  if (!data.date) {
    errors.date = 'La fecha es requerida';
  }

  return errors;
};

export const validateTimeSlot = (timeSlot) => {
  const errors = {};

  if (!timeSlot.time) {
    errors.time = 'La hora es requerida';
  }

  if (timeSlot.available === undefined) {
    errors.available = 'La disponibilidad es requerida';
  }

  return errors;
};

export const validateWeekDay = (weekDay) => {
  const errors = {};

  if (!weekDay.day) {
    errors.day = 'El día es requerido';
  }

  if (!Array.isArray(weekDay.timeSlots)) {
    errors.timeSlots = 'Los horarios son requeridos';
  }

  return errors;
}; 