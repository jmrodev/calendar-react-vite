import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import NotificationProvider from './context/NotificationProvider';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Calendar from './components/Calendar';
import AppointmentList from './components/AppointmentList';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';

const App = () => {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/calendar" 
                  element={
                    <PrivateRoute>
                      <Calendar />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/appointments" 
                  element={
                    <PrivateRoute>
                      <AppointmentList />
                    </PrivateRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/calendar" replace />} />
              </Routes>
            </main>
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </NotificationProvider>
    </Provider>
  );
};

export default App; 