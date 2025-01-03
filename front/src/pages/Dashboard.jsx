import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaUsers, FaCog } from 'react-icons/fa';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const { user, isLoading } = useSelector(state => state.auth);

  if (!user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="section-title">Bienvenido, {user?.fullName}</h1>
        
        <div className="grid dashboard-grid">
          {menuItems.map((item, index) => (
            <Link to={item.link} key={index} className="card dashboard-card">
              <div className="card-icon">
                {item.icon}
              </div>
              <div className="card-content">
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-secondary">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {user?.role === 'admin' && (
          <section className="section">
            <h2 className="section-title">Estadísticas Generales</h2>
            <div className="grid stats-grid">
              <div className="card">
                <h4 className="mb-2">Citas Hoy</h4>
                <p className="stat-number">12</p>
              </div>
              <div className="card">
                <h4 className="mb-2">Pacientes Totales</h4>
                <p className="stat-number">15</p>
              </div>
              <div className="card">
                <h4 className="mb-2">Doctores Activos</h4>
                <p className="stat-number">8</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 