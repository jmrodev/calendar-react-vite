import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentsReducer from './slices/appointmentsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones específicas que pueden contener datos no serializables
        ignoredActions: [
          'appointments/fetchMonthAppointments/fulfilled',
          'auth/login/fulfilled',
          'auth/logout/fulfilled'
        ]
      }
    })
});

export default store;