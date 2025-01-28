import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentsService } from '../../services/appointmentsService';
import config from '../../config/env.cfg';
import { getAuthToken } from '../../utils/authUtils';

// Thunks
export const fetchMonthAppointments = createAsyncThunk(
  'appointments/fetchMonthAppointments',
  async ({ year, month }) => {
    try {
      console.log('Fetching appointments for:', { year, month });
      
      const url = `${config.baseUrl}/appointments/month/${year}/${month + 1}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Error al obtener las citas del mes');
        } catch {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('Appointments received:', data);
      
      const appointmentsByDate = {};
      data.forEach(appointment => {
        const dateStr = `${appointment.date.year}-${String(appointment.date.month + 1).padStart(2, '0')}-${String(appointment.date.day).padStart(2, '0')}`;
        if (!appointmentsByDate[dateStr]) {
          appointmentsByDate[dateStr] = 0;
        }
        appointmentsByDate[dateStr]++;
      });
      
      return appointmentsByDate;
    } catch (error) {
      console.error('Error fetching month appointments:', error);
      throw error;
    }
  }
);

export const fetchWeekAppointments = createAsyncThunk(
  'appointments/fetchWeek',
  async ({ startDate, endDate }) => {
    return await appointmentsService.getWeekAppointments(startDate, endDate);
  }
);

export const fetchWeekDayAppointments = createAsyncThunk(
  'appointments/fetchWeekDayAppointments',
  async () => {
    const counts = {};
    for (let day = 0; day < 7; day++) {
      try {
        const appointments = await appointmentsService.getByWeekDay(day);
        counts[day] = appointments.length;
      } catch (error) {
        console.error(`Error fetching appointments for weekday ${day}:`, error);
        counts[day] = 0;
      }
    }
    return counts;
  }
);

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async () => await appointmentsService.getAll()
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData) => await appointmentsService.create(appointmentData)
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, updates }) => await appointmentsService.update(id, updates)
);

export const deleteAppointment = createAsyncThunk(
  'appointments/delete',
  async (id) => await appointmentsService.delete(id)
);

// Slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    monthCounts: {},
    weekDayCounts: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.monthCounts = action.payload;
      })
      .addCase(fetchMonthAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default appointmentsSlice.reducer; 