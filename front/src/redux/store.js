import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  // No es necesario agregar redux-thunk manualmente, ya que se incluye por defecto
});