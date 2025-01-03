import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentsService } from '../../services/appointmentsService';

// Thunks
export const fetchMonthAppointments = createAsyncThunk(
  'appointments/fetchMonthAppointments',
  async ({ year, month }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const counts = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      try {
        const appointments = await appointmentsService.getByDate(date);
        counts[date] = appointments.length;
      } catch (error) {
        console.error(`Error fetching appointments for ${date}:`, error);
        counts[date] = 0;
      }
    }
    return counts;
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
    appointments: [],
    monthCounts: {},
    weekDayCounts: {},
    loading: false,
    error: null,
    selectedDate: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Month Appointments
      .addCase(fetchMonthAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthAppointments.fulfilled, (state, action) => {
        state.monthCounts = { ...state.monthCounts, ...action.payload };
        state.loading = false;
      })
      .addCase(fetchMonthAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Week Appointments
      .addCase(fetchWeekAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeekAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeekAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CRUD Operations
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const date = action.payload.date;
        const dateStr = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        
        if (state.monthCounts[dateStr] !== undefined) {
          state.monthCounts[dateStr]++;
        }
        
        if (Array.isArray(state.appointments)) {
          state.appointments.push(action.payload);
        } else {
          state.appointments = [action.payload];
        }
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ... resto de los reducers para update y delete
  }
});

export const { clearError, setSelectedDate } = appointmentsSlice.actions;
export default appointmentsSlice.reducer; 