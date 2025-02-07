import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default AppProvider; 