import React, { useState, useEffect } from "react";
import { getAppointmentsByDate, getAppointmentsByWeekDay } from "../services/appointmentsService";
import "./styles/calendar.css";

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointmentsCount, setAppointmentsCount] = useState({});
  const [weekDayAppointments, setWeekDayAppointments] = useState({});
  const weekDays = [
    { name: 'Domingo', short: 'Dom', value: 0 },
    { name: 'Lunes', short: 'Lun', value: 1 },
    { name: 'Martes', short: 'Mar', value: 2 },
    { name: 'Miércoles', short: 'Mié', value: 3 },
    { name: 'Jueves', short: 'Jue', value: 4 },
    { name: 'Viernes', short: 'Vie', value: 5 },
    { name: 'Sábado', short: 'Sáb', value: 6 }
  ];

  // Obtener conteo de citas para cada día del mes actual
  useEffect(() => {
    const fetchMonthAppointments = async () => {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const daysInMonth = getDaysInMonth(year, month - 1);
      
      const counts = {};
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        try {
          const appointments = await getAppointmentsByDate(date);
          counts[date] = appointments.length;
        } catch (error) {
          console.error(`Error fetching appointments for ${date}:`, error);
        }
      }
      setAppointmentsCount(counts);
    };

    fetchMonthAppointments();
  }, [currentDate]);

  // Obtener conteo de citas para cada día de la semana
  useEffect(() => {
    const fetchWeekDayAppointments = async () => {
      const counts = {};
      for (let day = 0; day < 7; day++) {
        try {
          const appointments = await getAppointmentsByWeekDay(day);
          counts[day] = appointments.length;
        } catch (error) {
          console.error(`Error fetching appointments for weekday ${day}:`, error);
        }
      }
      setWeekDayAppointments(counts);
    };

    fetchWeekDayAppointments();
  }, []);

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

  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendar = [];

    
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateForDay = new Date(year, month, day);
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
          className={`day ${isToday ? "today" : ""} ${isWeekend ? "weekend" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => onDateSelect(dateForDay, false)}
        >
          {day}
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
    const count = appointmentsCount[dateStr] || 0;
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
    const count = weekDayAppointments[day.value] || 0;
    const maxAppointments = 20; // Asumimos un máximo de 20 citas por día de la semana
    const occupancyPercentage = (count / maxAppointments) * 100;

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
              className="occupancy-fill"
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

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
