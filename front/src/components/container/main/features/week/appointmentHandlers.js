import AppointmentService from '../../../../../services/appointmentService';

export const handleCreateAppointment = async (slot, selectedDate, setTimeSlots, setError) => {
    try {
        const patientName = prompt('Ingrese el nombre del paciente:');
        if (!patientName) return alert('El nombre del paciente no puede estar vacío.');

        const reason = prompt('Ingrese la razón de la cita:');
        if (!reason) return alert('La razón de la cita no puede estar vacía.');

        const appointmentData = {
            date: selectedDate.toISOString().split('T')[0],
            appointmentTime: slot.appointmentTime,
            realAppointmentTime: slot.appointmentTime,
            available: false,
            status: 'pending',
            appointment: {
                confirmAppointment: false,
                name: patientName,
                reason: reason
            }
        };

        const response = await AppointmentService.createAppointment(appointmentData);
        setTimeSlots(prevSlots =>
            prevSlots.map(s =>
                s.appointmentTime === slot.appointmentTime
                    ? { ...response, id: response._id }
                    : s
            )
        );
    } catch (err) {
        setError(err.message);
        alert('Error creando la cita: ' + err.message);
    }
};


export const handleConfirmClick = async (event, slot, setTimeSlots, setError) => {
    event.stopPropagation();
    try {
        const confirmation = window.confirm('¿Desea confirmar esta cita?');
        if (!confirmation) return;

        await AppointmentService.confirmAppointment(slot.id, { confirmAppointment: true });
        setTimeSlots(prevSlots =>
            prevSlots.map(s =>
                s.id === slot.id
                    ? {
                        ...s,
                        status: 'confirmed',
                        appointment: {
                            ...s.appointment,
                            confirmAppointment: true
                        }
                    }
                    : s
            )
        );
    } catch (err) {
        setError(err.message);
        alert('Error confirmando la cita: ' + err.message);
    }
};

export const handleComplete = async (event, slot, setTimeSlots, setError) => {
    event.stopPropagation();
    try {
        const confirmation = window.confirm('¿Confirmar que el paciente fue atendido?');
        if (!confirmation) return;

        await AppointmentService.completeAppointment(slot.id);
        setTimeSlots(prevSlots =>
            prevSlots.map(s =>
                s.id === slot.id
                    ? { ...s, status: 'completed' }
                    : s
            )
        );
    } catch (err) {
        setError(err.message);
        alert('Error marcando la cita como completada: ' + err.message);
    }
};


export const handleEdit = async (event, slot, setTimeSlots, setError) => {
    event.stopPropagation();
    try {
        const newName = prompt('Ingrese el nuevo nombre del paciente:', slot.appointment.name);
        if (!newName) return alert('El nombre no puede estar vacío.');

        const newReason = prompt('Ingrese la nueva razón de la cita:', slot.appointment.reason);
        if (!newReason) return alert('La razón no puede estar vacía.');

        const updatedAppointmentData = {
            appointment: {
                ...slot.appointment,
                name: newName,
                reason: newReason
            }
        };

        await AppointmentService.updateAppointment(slot.id, updatedAppointmentData);

        setTimeSlots(prevSlots =>
            prevSlots.map(s =>
                s.id === slot.id
                    ? {
                        ...s,
                        appointment: {
                            ...s.appointment,
                            name: newName,
                            reason: newReason
                        }
                    }
                    : s
            )
        );
    } catch (err) {
        setError(err.message);
        alert('Error editando la cita: ' + err.message);
    }
};
export const handleReassignClick = async (event, slot, selectedDate, setTimeSlots, setError) => {
    event.stopPropagation();
    try {        
        const confirmation = window.confirm('¿Está seguro que desea reasignar esta cita?');
        if (!confirmation) return;

        
        const newName = prompt('Ingrese el nombre del nuevo paciente:');
        if (!newName) {
            alert('El nombre del paciente no puede estar vacío.');
            return;
        }

        const newReason = prompt('Ingrese la razón de la nueva cita:');
        if (!newReason) {
            alert('La razón de la cita no puede estar vacía.');
            return;
        }

        
        const appointmentId = slot._id || slot.id;
        if (!appointmentId) {
            throw new Error('ID de cita no válido');
        }

        
        const deleteResult = await AppointmentService.deleteAppointment(appointmentId);
        if (!deleteResult.success) {
            throw new Error(`Error al eliminar la cita: ${deleteResult.message}`);
        }

        
        const newAppointmentData = {
            date: selectedDate.toISOString().split('T')[0],
            appointmentTime: slot.appointmentTime,
            realAppointmentTime: slot.appointmentTime,
            available: false,
            status: 'pending',
            appointment: {
                name: newName,
                reason: newReason,
                confirmAppointment: false
            }
        };

        const response = await AppointmentService.createAppointment(newAppointmentData);

        
        setTimeSlots(prevSlots =>
            prevSlots.map(s =>
                s.appointmentTime === slot.appointmentTime
                    ? { ...response, id: response._id }
                    : s
            )
        );
    } catch (err) {
        console.error('Reassignment error:', err);
        setError(err.message);
        alert('Error durante la reasignación: ' + err.message);
    }
};

export const handleDelete = async (event, slot, setTimeSlots, setError) => {
    event.stopPropagation();
    try {
        const confirmation = window.confirm('¿Está seguro que desea eliminar esta cita?');
        if (!confirmation) return;

        const appointmentId = slot._id || slot.id;

        if (!appointmentId) {
            throw new Error('No se encontró el ID de la cita');
        }

        await AppointmentService.deleteAppointment(appointmentId);
        setTimeSlots(prevSlots =>
            prevSlots.map(s =>
                s.appointmentTime === slot.appointmentTime
                    ? { ...s, appointment: null, status: 'pending', available: true }
                    : s
            )
        );
    } catch (err) {
        console.error('Error completo:', err);
        setError(err.message);
        alert('Error eliminando la cita: ' + err.message);
    }
};

