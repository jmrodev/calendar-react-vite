import {
  completeAppointment,
  createAppointment,
  confirmAppointment,
  updateAppointment,
  deleteAppointment,
} from "./appointmentsService";
import showToast from "../utils/toastUtils";

export const handleCreateAppointment = async (
  slot,
  selectedDate,
  setTimeSlots,
  setError
) => {
  try {
    const patientName = prompt("Ingrese el nombre del paciente:");
    if (!patientName)
      return alert("El nombre del paciente no puede estar vacío.");

    const reason = prompt("Ingrese la razón de la cita:");
    if (!reason) return alert("La razón de la cita no puede estar vacía.");

    const appointmentData = {
      date: selectedDate.toISOString().split("T")[0],
      appointmentTime: slot.appointmentTime,
      realAppointmentTime: slot.appointmentTime,
      available: false,
      status: "pending",
      appointment: {
        confirmAppointment: false,
        name: patientName,
        reason: reason,
      },
    };

    const response = await createAppointment(appointmentData);
    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.appointmentTime === slot.appointmentTime
          ? { ...response, id: response._id }
          : s
      )
    );

    if (response) {
      showToast("Cita creada exitosamente", "success");
    } else {
      showToast("Error al crear la cita", "error");
    }
  } catch (err) {
    setError(err.message);
    showToast("Error al crear la cita: " + err.message, "error");
  }
};

export const handleConfirmClick = async (
  event,
  slot,
  setTimeSlots,
  setError
) => {
  event.stopPropagation();
  try {
    const confirmation = window.confirm("¿Desea confirmar esta cita?");
    if (!confirmation) return;

    const appointmentId = slot._id || slot.id;
    await confirmAppointment(appointmentId, { confirmAppointment: true });

    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.id === slot.id
          ? {
              ...s,
              status: "confirmed",
              appointment: {
                ...s.appointment,
                confirmAppointment: true,
              },
            }
          : s
      )
    );
    showToast("Cita confirmada exitosamente", "success");
  } catch (err) {
    setError(err.message);
    showToast("Error confirmando la cita: " + err.message, "error");
  }
};

export const handleComplete = async (event, slot, setTimeSlots, setError) => {
  event.stopPropagation();
  try {
    const confirmation = window.confirm(
      "¿Confirmar que el paciente fue atendido?"
    );
    if (!confirmation) return;

    const appointmentId = slot._id || slot.id;
    await completeAppointment(appointmentId);

    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.id === appointmentId
          ? {
              ...s,
              status: "completed",
              appointment: {
                ...s.appointment,
                completed: true,
              },
            }
          : s
      )
    );
    showToast("Cita marcada como completada exitosamente", "success");
  } catch (err) {
    setError(err.message);
    showToast("Error al marcar la cita como completada: " + err.message, "error");
  }
};

export const handleEdit = async (event, slot, setTimeSlots, setError) => {
  event.stopPropagation();
  try {
    const newName = prompt(
      "Ingrese el nuevo nombre del paciente:",
      slot.appointment.name
    );
    if (!newName) return alert("El nombre no puede estar vacío.");

    const newReason = prompt(
      "Ingrese la nueva razón de la cita:",
      slot.appointment.reason
    );
    if (!newReason) return alert("La razón no puede estar vacía.");

    const updatedAppointmentData = {
      appointment: {
        ...slot.appointment,
        name: newName,
        reason: newReason,
      },
    };

    await updateAppointment(slot.id, updatedAppointmentData);

    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.id === slot.id
          ? {
              ...s,
              appointment: {
                ...s.appointment,
                name: newName,
                reason: newReason,
              },
            }
          : s
      )
    );
    showToast("Cita editada exitosamente", "success");
  } catch (err) {
    setError(err.message);
    alert("Error editando la cita: " + err.message);
  }
};
export const handleReassignClick = async (
  event,
  slot,
  selectedDate,
  setTimeSlots,
  setError
) => {
  event.stopPropagation();
  try {
    const confirmation = window.confirm(
      "¿Está seguro que desea reasignar esta cita?"
    );
    if (!confirmation) return;

    const newName = prompt("Ingrese el nombre del nuevo paciente:");
    if (!newName) {
      alert("El nombre del paciente no puede estar vacío.");
      return;
    }

    const newReason = prompt("Ingrese la razón de la nueva cita:");
    if (!newReason) {
      alert("La razón de la cita no puede estar vacía.");
      return;
    }

    const appointmentId = slot._id || slot.id;
    if (!appointmentId) {
      throw new Error("ID de cita no válido");
    }

    const deleteResult = await deleteAppointment(appointmentId);
    if (!deleteResult.success) {
      throw new Error(`Error al eliminar la cita: ${deleteResult.message}`);
    }

    const newAppointmentData = {
      date: selectedDate.toISOString().split("T")[0],
      appointmentTime: slot.appointmentTime,
      realAppointmentTime: slot.appointmentTime,
      available: false,
      status: "pending",
      appointment: {
        name: newName,
        reason: newReason,
        confirmAppointment: false,
      },
    };

    const response = await createAppointment(newAppointmentData);

    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.appointmentTime === slot.appointmentTime
          ? { ...response, id: response._id }
          : s
      )
    );

    showToast("Cita reasignada exitosamente", "success");
  } catch (err) {
    console.error("Reassignment error:", err);
    setError(err.message);
    showToast("Error durante la reasignación: " + err.message, "error");
  }
};

export const handleDelete = async (event, slot, setTimeSlots, setError) => {
  event.stopPropagation();
  try {
    const confirmation = window.confirm(
      "¿Está seguro que desea eliminar esta cita?"
    );
    if (!confirmation) return;

    const appointmentId = slot._id || slot.id;

    if (!appointmentId) {
      throw new Error("No se encontró el ID de la cita");
    }

    await deleteAppointment(appointmentId);
    setTimeSlots((prevSlots) =>
      prevSlots.map((s) =>
        s.appointmentTime === slot.appointmentTime
          ? { ...s, appointment: null, status: "pending", available: true }
          : s
      )
    );

    showToast("Cita eliminada exitosamente", "success");
  } catch (err) {
    console.error("Error completo:", err);
    setError(err.message);
    showToast("Error eliminando la cita: " + err.message, "error");
  }
};

export const handleConfirmAppointment = async (appointmentId) => {
  try {
    await confirmAppointment(appointmentId);
    // Recargar las citas después de confirmar
    await loadAppointments();
    showToast("Cita confirmada exitosamente", "success");
  } catch (error) {
    showToast("Error al confirmar la cita", "error");
    console.error("Error:", error);
  }
};
