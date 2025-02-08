import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import PropTypes from 'prop-types';

export const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider; 