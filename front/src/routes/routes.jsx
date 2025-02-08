import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Dashboard from '../pages/Dashboard';
import { Login } from '../pages/Login';
import Register from '../pages/Register';
import Appointments from '../pages/Appointments';
import Doctors from '../pages/Doctors';
import Patients from '../pages/Patients';
import Settings from '../pages/Settings';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/appointments/*',
        element: <Appointments />,
      },
      {
        path: '/doctors',
        element: <Doctors />,
      },
      {
        path: '/patients',
        element: <Patients />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />
  }
]);