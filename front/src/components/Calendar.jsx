import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthAppointments, fetchWeekDayAppointments } from '../redux/slices/appointmentsSlice';
import { logout } from '../redux/slices/authSlice';
import { isTokenValid } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import showToast from '../utils/toastUtils';
import "./styles/calendar.css";

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate ? new Date(savedDate) : new Date();
  });
  const dispatch = useDispatch();
  const { 
    monthCounts, 
    weekDayCounts, 
    loading, 
    error 
  } = useSelector(state => state.appointments);
  const weekDays = [
    { name: 'Domingo', short: 'Dom', value: 0 },
    { name: 'Lunes', short: 'Lun', value: 1 },
    { name: 'Martes', short: 'Mar', value: 2 },
    { name: 'Miércoles', short: 'Mié', value: 3 },
    { name: 'Jueves', short: 'Jue', value: 4 },
    { name: 'Viernes', short: 'Vie', value: 5 },
    { name: 'Sábado', short: 'Sáb', value: 6 }
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Token actual:', localStorage.getItem('token'));
        console.log('Auth headers:', getAuthHeaders());
        
        if (!isTokenValid()) {
          throw new Error('Sesión expirada');
        }

        await Promise.all([
          dispatch(fetchMonthAppointments({
            year: currentDate.getFullYear(),
            month: currentDate.getMonth()
          })),
          dispatch(fetchWeekDayAppointments())
        ]);
      } catch (error) {
        console.error('Error completo:', error);
        if (error.message.includes('autenticación') || error.message.includes('expirada')) {
          dispatch(logout());
          navigate('/login');
          showToast('Su sesión ha expirado, por favor inicie sesión nuevamente', 'warning');
        } else {
          showToast('Error al cargar los datos', 'error');
        }
      }
    };

    if (isTokenValid()) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [currentDate, dispatch, navigate]);

  const handleWeekDayClick = (dayValue) => {
    const today = new Date();
    const daysUntilNext = (dayValue + 7 - today.getDay()) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    onDateSelect(nextDate, true);
  };

  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getOccupancyClass = (percentage) => {
    if (percentage > 66) return 'high';
    if (percentage > 33) return 'medium';
    return 'low';
  };

  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendar = [];

    // Días vacíos al inicio del mes
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateForDay = new Date(year, month, day);
      const dateStr = dateForDay.toISOString().split('T')[0];
      const count = monthCounts[dateStr] || 0;
      const maxAppointments = 8; // Máximo de citas por día
      const occupancyPercentage = (count / maxAppointments) * 100;
      const occupancyClass = getOccupancyClass(occupancyPercentage);

      const isToday = day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;
      const isSelected = selectedDate &&
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();

      calendar.push(
        <div
          key={day}
          className={`day-container ${isToday ? "today" : ""} ${isWeekend ? "weekend" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => onDateSelect(dateForDay, false)}
          title={`${count} citas programadas`}
        >
          <div className="day-number">{day}</div>
          <div className="occupancy-bar">
            <div 
              className={`occupancy-fill ${occupancyClass}`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>
      );
    }

    return calendar;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Modificar el renderizado de los días para incluir la barra de ocupación
  const renderDay = (day, isWeekDay = false) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    const count = monthCounts[dateStr] || 0;
    const maxAppointments = 8; // Asumimos un máximo de 8 citas por día
    const occupancyPercentage = (count / maxAppointments) * 100;

    return (
      <div className="day-container">
        <div className="day-number">{day}</div>
        <div className="occupancy-bar">
          <div 
            className="occupancy-fill"
            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  // Modificar el renderizado de los días de la semana para incluir la barra de ocupación
  const renderWeekDay = (day) => {
    if (loading) {
      return (
        <div 
          key={day.value} 
          className="day header-day loading"
        >
          <div className="weekday-content">
            <span>{day.short}</span>
          </div>
        </div>
      );
    }

    const count = weekDayCounts[day.value] || 0;
    const maxAppointments = 20;
    const occupancyPercentage = (count / maxAppointments) * 100;

    let occupancyClass = 'low';
    if (occupancyPercentage > 66) {
      occupancyClass = 'high';
    } else if (occupancyPercentage > 33) {
      occupancyClass = 'medium';
    }

    return (
      <div 
        key={day.value} 
        className={`day header-day ${
          selectedDate && selectedDate.getDay() === day.value ? 'selected' : ''
        }`}
        onClick={() => handleWeekDayClick(day.value)}
        title={`${day.name} - ${count} citas`}
      >
        <div className="weekday-content">
          <span>{day.short}</span>
          <div className="weekday-occupancy-bar">
            <div 
              className={`occupancy-fill ${occupancyClass}`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Renderizado condicional basado en el estado
  if (error) {
    return (
      <div className="calendar-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="monthly-calendar">
        <h4>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h4>
        <div className="weekdays">
          {weekDays.map(day => renderWeekDay(day))}
        </div>
        <div className="days">
          {generateCalendar()}
        </div>
        <div className="navigation">
          <button className="nav-btn" onClick={goToPreviousMonth}>◀</button>
          <button className="nav-btn" onClick={goToCurrentMonth}>▼</button>
          <button className="nav-btn" onClick={goToNextMonth}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
