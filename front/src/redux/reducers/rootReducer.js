import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import appointmentsReducer from '../slices/appointmentsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentsReducer,
});

export default rootReducer;