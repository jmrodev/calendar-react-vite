import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import AppointmentForm from './AppointmentForm';
import {
  handleConfirmClick,
  handleComplete,
  handleEdit,
  handleDelete,
  handleReassignClick,
} from "../services/appointmentHandlers";
import { standardizeDate } from "../utils/dateUtils";
import { generateTimeSlots } from "../utils/timeSlotUtils";

const TimeSlot = ({ slot, selectedDate, setTimeSlots, setError }) => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);

  const refreshTimeSlots = async () => {
    try {
      const updatedSlots = await generateTimeSlots(selectedDate);
      setTimeSlots(updatedSlots);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error refreshing time slots:', error);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    await refreshTimeSlots();
  };

  const handleConfirmClickWrapper = async (e, slot) => {
    try {
      await handleConfirmClick(e, slot, setTimeSlots, setError);
      await refreshTimeSlots();
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      showToast("Error al confirmar la cita", "error");
    }
  };

  const handleCompleteWrapper = async (e, slot) => {
    await handleComplete(e, slot, setTimeSlots, setError);
    await refreshTimeSlots();
  };

  const handleDeleteWrapper = async (e, slot) => {
    await handleDelete(e, slot, setTimeSlots, setError);
    await refreshTimeSlots();
  };

  const handleReassignWrapper = async (e, slot) => {
    await handleReassignClick(e, slot, selectedDate, setTimeSlots, setError);
    await refreshTimeSlots();
  };

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
      setShowForm(true);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <>
      <div
        className={`time-slot ${getSlotClassName(slot)}`}
        onClick={handleSlotClick}
      >
        <div className="time-container">
          <div className="time">{slot.appointmentTime}</div>
          <div className="date">{standardizeDate(selectedDate)}</div>
        </div>
        {slot.appointment && (
          <div className="appointment-details">
            <div className="patient-name">{slot.appointment.name}</div>
            <div className="reason">{slot.appointment.reason}</div>
            <div className="appointment-actions">
              {!slot.appointment.confirmAppointment && (
                <button
                  className="confirm-button"
                  onClick={(e) => handleConfirmClickWrapper(e, slot)}
                >
                  Confirmar
                </button>
              )}
              {slot.appointment.confirmAppointment &&
                slot.status !== "completed" && (
                  <button
                    className="complete-button"
                    onClick={(e) => handleCompleteWrapper(e, slot)}
                  >
                    Completar
                  </button>
                )}
              {slot.appointment.confirmAppointment && (
                <button
                  className="reassign-button"
                  onClick={(e) => handleReassignWrapper(e, slot)}
                >
                  Reasignar
                </button>
              )}
              {!slot.appointment.confirmAppointment && (
                <button
                  className="delete-button"
                  onClick={(e) => handleDeleteWrapper(e, slot)}
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

      {showForm && (
        <div className="modal-overlay">
          <AppointmentForm
            selectedDate={selectedDate}
            selectedTime={slot.appointmentTime}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </>
  );
};

export default TimeSlot;
