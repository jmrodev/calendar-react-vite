import { createBrowserRouter } from 'react-router-dom';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Dashboard from '../pages/Dashboard';
import { Login } from '../pages/Login';
import Appointments from '../pages/Appointments';
import Doctors from '../pages/Doctors';
import Patients from '../pages/Patients';
import Settings from '../pages/Settings';
import UnauthorizedPage from '../pages/UnauthorizedPage';

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
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
      }
    ],
  },
]); 