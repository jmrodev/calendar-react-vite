import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as appointmentService from '../../services/appointmentService';

export const fetchWeekAppointments = createAsyncThunk(
  'appointments/fetchWeek',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const appointments = await appointmentService.getWeekAppointments(startDate, endDate);
      return appointments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const appointment = await appointmentService.createAppointment(appointmentData);
      return appointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const appointment = await appointmentService.updateAppointment(id, updates);
      return appointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await appointmentService.cancelAppointment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    selectedDate: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Week Appointments
      .addCase(fetchWeekAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeekAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchWeekAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Appointment
      .addCase(createNewAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createNewAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(apt => apt._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(apt => apt._id !== action.payload);
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedDate, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer; 