import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAppointmentsByDate, getAppointmentsByWeekDay } from '../../services/appointmentsService';

export const fetchMonthAppointments = createAsyncThunk(
  'appointments/fetchMonthAppointments',
  async ({ year, month }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const counts = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      try {
        const appointments = await getAppointmentsByDate(date);
        counts[date] = appointments.length;
      } catch (error) {
        console.error(`Error fetching appointments for ${date}:`, error);
        counts[date] = 0;
      }
    }
    return counts;
  }
);

export const fetchWeekDayAppointments = createAsyncThunk(
  'appointments/fetchWeekDayAppointments',
  async () => {
    const counts = {};
    for (let day = 0; day < 7; day++) {
      try {
        const appointments = await getAppointmentsByWeekDay(day);
        counts[day] = appointments.length;
      } catch (error) {
        console.error(`Error fetching appointments for weekday ${day}:`, error);
        counts[day] = 0;
      }
    }
    return counts;
  }
);

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
        state.monthCounts = {
          ...state.monthCounts,
          ...action.payload
        };
        state.loading = false;
      })
      .addCase(fetchMonthAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchWeekDayAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeekDayAppointments.fulfilled, (state, action) => {
        state.weekDayCounts = {
          ...state.weekDayCounts,
          ...action.payload
        };
        state.loading = false;
      })
      .addCase(fetchWeekDayAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default appointmentsSlice.reducer; 