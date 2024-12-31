import {
  completeAppointmentRepository,
  confirmAppointmentRepository,
  createAppointmentRepository,
  deleteAppointmentRepository,
  getAllAppointmentsRepository,
  getAppointmentByDateRepository,
  getAppointmentByIdRepository,
  getConfirmedAppointmentsRepository,
  updateAppointmentRepository,
  getAppointmentsByWeekDayRepository,
} from "../Repository/appointmentRepository.js";
import { newAppointmentId } from "../Utils/id/appointment.js";
import {
  createStructuredDate,
  formatStructuredDate,
  standardizeDate,
} from "../Utils/date/dateUtils.js";

export const completeAppointmentService = async (appointmentId) => {
  try {
    return await completeAppointmentRepository(appointmentId);
  } catch (error) {
    throw new Error(`Error in confirm appointment service: ${error.message}`);
  }
};

export const confirmAppointmentService = async (appointmentId) => {
  try {
    const appointment = await confirmAppointmentRepository(appointmentId);
    if (!appointment) {
      throw new Error("No se encontró la cita");
    }
    return appointment;
  } catch (error) {
    console.error("Error en confirmAppointmentService:", error);
    throw new Error(`Error al confirmar la cita: ${error.message}`);
  }
};

export const createAppointmentService = async (
  appointmentData,
  secretaryId,
  secretaryName
) => {
  console.log('🔵 Iniciando creación de cita');
  console.log('Datos recibidos:', {
    appointmentData,
    secretaryId,
    secretaryName
  });
  
  try {
    const { date, appointmentTime, appointment } = appointmentData;

    // Validación de campos requeridos
    console.log('🔍 Validando campos requeridos...');
    const camposFaltantes = [];
    if (!date) camposFaltantes.push('date');
    if (!appointmentTime) camposFaltantes.push('appointmentTime');
    if (!appointment?.name) camposFaltantes.push('appointment.name');

    if (camposFaltantes.length > 0) {
      console.log('❌ Error: Campos faltantes:', camposFaltantes);
      throw new Error(`Campos requeridos faltantes: ${camposFaltantes.join(', ')}`);
    }

    console.log('🔄 Estructurando fecha...');
    const structuredDate = createStructuredDate(date);
    if (!structuredDate) {
      console.log('❌ Error: Formato de fecha inválido:', date);
      throw new Error("Invalid date format");
    }

    const newAppointment = {
      _id: newAppointmentId(),
      ...appointmentData,
      date: structuredDate,
    };

    console.log('📝 Creando nueva cita:', newAppointment);
    const result = await createAppointmentRepository(
      newAppointment,
      secretaryId,
      secretaryName
    );
    console.log('✅ Cita creada exitosamente:', result);
    return result;

  } catch (error) {
    console.error('❌ Error en createAppointmentService:', {
      mensaje: error.message,
      tipo: error.name,
      stack: error.stack,
      datos: {
        appointmentData,
        secretaryId,
        secretaryName
      }
    });
    throw new Error(`Error in create appointment service: ${error.message}`);
  }
};

export const deleteAppointmentService = async (id) => {
  try {
    return await deleteAppointmentRepository(id);
  } catch (error) {
    throw new Error(`Error in delete appointment service: ${error.message}`);
  }
};

export const getAllAppointmentsService = async () => {
  try {
    return await getAllAppointmentsRepository();
  } catch (error) {
    throw new Error(`Error in get all appointments service: ${error.message}`);
  }
};

export const getAppointmentByDateService = async (date) => {
  try {
    const structuredDate = createStructuredDate(date);
    if (!structuredDate) {
      throw new Error("Invalid date format");
    }

    const appointments = await getAppointmentByDateRepository(structuredDate);
    return {
      status: 200,
      data: appointments,
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: error.message },
    };
  }
};

export const getAppointmentById = async (id) => {
  try {
    return await getAppointmentByIdRepository(id);
  } catch (error) {
    throw new Error(`Error in get appointment by id service: ${error.message}`);
  }
};

export const getConfirmedAppointmentsService = async () => {
  try {
    return await getConfirmedAppointmentsRepository();
  } catch (error) {
    throw new Error(
      `Error in get confirmed appointments service: ${error.message}`
    );
  }
};

export const updateAppointmentService = async (id, data, secretaryId) => {
  try {
    return await updateAppointmentRepository(id, data, secretaryId);
  } catch (error) {
    throw new Error(`Error in update appointment service: ${error.message}`);
  }
};

export const getAppointmentsByWeekDayService = async (dayOfWeek) => {
  try {
    const currentDate = standardizeDate(new Date());
    if (!currentDate) {
      throw new Error("Fecha inválida");
    }

    const appointments = await getAppointmentsByWeekDayRepository(
      dayOfWeek,
      currentDate
    );
    return appointments;
  } catch (error) {
    console.error("Error en getAppointmentsByWeekDayService:", error);
    throw new Error(
      `Error al obtener citas por día de la semana: ${error.message}`
    );
  }
};
