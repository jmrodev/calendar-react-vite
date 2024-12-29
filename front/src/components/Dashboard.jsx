import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaUsers, FaCog } from 'react-icons/fa';
import './styles/dashboard.css';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);

  const adminMenuItems = [
    {
      icon: <FaCalendarAlt />,
      title: 'Gestión de Citas',
      description: 'Administra todas las citas médicas',
      link: '/appointments'
    },
    {
      icon: <FaUserMd />,
      title: 'Doctores',
      description: 'Gestiona el personal médico',
      link: '/doctors'
    },
    {
      icon: <FaUsers />,
      title: 'Pacientes',
      description: 'Administra los pacientes registrados',
      link: '/patients'
    },
    {
      icon: <FaCog />,
      title: 'Configuración',
      description: 'Configura el sistema',
      link: '/settings'
    }
  ];

  const userMenuItems = [
    {
      icon: <FaCalendarAlt />,
      title: 'Mis Citas',
      description: 'Ver y gestionar tus citas',
      link: '/appointments'
    },
    {
      icon: <FaUserMd />,
      title: 'Doctores',
      description: 'Ver lista de doctores',
      link: '/doctors'
    }
  ];

  const menuItems = user.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="dashboard-container">
      <h1>Bienvenido, {user.fullName}</h1>
      
      <div className="dashboard-grid">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index} className="dashboard-card">
            <div className="card-icon">
              {item.icon}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {user.role === 'admin' && (
        <div className="dashboard-stats">
          <h2>Estadísticas Generales</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Citas Hoy</h4>
              <p className="stat-number">12</p>
            </div>
            <div className="stat-card">
              <h4>Pacientes Totales</h4>
              <p className="stat-number">150</p>
            </div>
            <div className="stat-card">
              <h4>Doctores Activos</h4>
              <p className="stat-number">8</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 