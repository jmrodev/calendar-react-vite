// timeSlotUtils.js

import AppointmentService from '../../../../../services/appointmentService';

export const generateTimeSlots = async (selectedDate) => {
    try {
        const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        const existingSlots = await AppointmentService.getAppointmentsByDate(dateStr);
        const slots = [];
        const initHour = 9;
        const finishHour = 19;

        for (let hour = initHour; hour < finishHour; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const existingSlot = existingSlots.find(slot => slot.appointmentTime === timeString);
            if (existingSlot) {
                // Asegurar que tenemos tanto _id como id
                slots.push({ 
                    ...existingSlot, 
                    id: existingSlot._id,
                    _id: existingSlot._id 
                });
            } else {
                slots.push({
                    _id: `${dateStr}-${timeString}`,
                    id: `${dateStr}-${timeString}`,
                    date: dateStr,
                    appointmentTime: timeString,
                    realAppointmentTime: timeString,
                    available: true,
                    status: 'pending',
                    appointment: null
                });
            }
        }
        return slots;
    } catch (err) {
        throw new Error('Error generating time slots: ' + err.message);
    }
};