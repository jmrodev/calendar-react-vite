import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthAppointments, fetchWeekDayAppointments } from '../redux/slices/appointmentsSlice';
import { logout } from '../redux/slices/authSlice';
import { isTokenValid } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import showToast from '../utils/toastUtils';
import "./styles/calendar.css";

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { monthCounts, weekDayCounts, loading, error } = useSelector(state => state.appointments);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
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

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    const formattedDate = clickedDate.toISOString().split('T')[0];
    console.log('Fecha seleccionada en Calendar:', formattedDate);
    
    if (onDateSelect) {
      onDateSelect(formattedDate);
    }
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const getOccupancyClass = (percentage) => {
    if (percentage > 66) return 'high';
    if (percentage > 33) return 'medium';
    return 'low';
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const calendar = [];

    // Días vacíos al inicio del mes
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateForDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = dateForDay.toISOString().split('T')[0];
      const count = monthCounts[dateStr] || 0;
      const maxAppointments = 8;
      const occupancyPercentage = (count / maxAppointments) * 100;
      const occupancyClass = getOccupancyClass(occupancyPercentage);

      const isToday = day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;
      const isSelected = selectedDate === dateStr;

      calendar.push(
        <div
          key={day}
          className={`day-container ${isToday ? "today" : ""} ${isWeekend ? "weekend" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateClick(day)}
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
      <div className="calendar-header">
        <h4>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h4>
        <div className="weekdays">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>
      </div>
      <div className="calendar-grid">
        {generateCalendar()}
      </div>
      <div className="navigation">
        <button className="nav-btn" onClick={goToPreviousMonth}>◀</button>
        <button className="nav-btn" onClick={goToCurrentMonth}>▼</button>
        <button className="nav-btn" onClick={goToNextMonth}>▶</button>
      </div>
    </div>
  );
};

export default Calendar;
