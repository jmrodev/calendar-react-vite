import React from "react";
import {
  handleCreateAppointment,
  handleConfirmClick,
  handleComplete,
  handleEdit,
  handleDelete,
  handleReassignClick,
} from "./appointmentHandlers";

const TimeSlot = ({ slot, selectedDate, setTimeSlots, setError }) => {
  if (!slot) {
    return null;
  }

  const getSlotClassName = (slot) => {
    if (!slot.appointment) return "available";

    const status = slot.status || "pending";
    const isConfirmed = slot.appointment?.confirmAppointment;

    if (status === "completed") return "completed";
    if (isConfirmed) return "confirmed";
    return "booked";
  };

  const handleSlotClick = () => {
    if (!slot.appointment) {
      handleCreateAppointment(slot, selectedDate, setTimeSlots, setError);
    }
  };

  return (
    <div
      className={`time-slot ${getSlotClassName(slot)}`}
      onClick={handleSlotClick}
    >
      <div className="time">{slot.appointmentTime}</div>
      {slot.appointment && (
        <div className="appointment-details">
          <div className="patient-name">{slot.appointment.name}</div>
          <div className="reason">{slot.appointment.reason}</div>
          <div className="appointment-actions">
            {!slot.appointment.confirmAppointment && (
              <button
                className="confirm-button"
                onClick={(e) =>
                  handleConfirmClick(e, slot, setTimeSlots, setError)
                }
              >
                Confirmar
              </button>
            )}
            {slot.appointment.confirmAppointment &&
              slot.status !== "completed" && (
                <button
                  className="complete-button"
                  onClick={(e) =>
                    handleComplete(e, slot, setTimeSlots, setError)
                  }
                >
                  Completar
                </button>
              )}
            {slot.appointment.confirmAppointment && (
              <button
                className="reassign-button"
                onClick={(e) =>
                  handleReassignClick(
                    e,
                    slot,
                    selectedDate,
                    setTimeSlots,
                    setError
                  )
                }
              >
                Reasignar
              </button>
            )}
            {!slot.appointment.confirmAppointment && (
              <button
                className="delete-button"
                onClick={(e) => handleDelete(e, slot, setTimeSlots, setError)}
              >
                Eliminar
              </button>
            )}
            {!slot.appointment.confirmAppointment && (
              <button
                className="edit-button"
                onClick={(e) => handleEdit(e, slot, setTimeSlots, setError)}
              >
                Editar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
