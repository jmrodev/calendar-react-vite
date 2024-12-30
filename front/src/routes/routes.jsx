import { createBrowserRouter } from 'react-router-dom';
import ProtectedLayout from '../components/ProtectedLayout';
import Dashboard from '../components/Dashboard';
import {Login} from '../components/Login';
// Importa los componentes que faltan
import Appointments from '../components/Appointments';
import Doctors from '../components/Doctors';
import Patients from '../components/Patients';
import Settings from '../components/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
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
    ],
  },
]); 