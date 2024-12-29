import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
// Import other components you'll need
import Login from '../components/Login';
// Add other imports as needed

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/appointments',
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
]); 