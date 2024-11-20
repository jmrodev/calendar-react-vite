import React, { useState } from 'react';
import Week from '../week/week';
import './calendar.css'; // Asegúrate de tener un archivo CSS para los estilos

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
const [selectedDate, setSelectedDate] = useState(null); 
    // Función para obtener el primer día del mes
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay(); // Devuelve el día de la semana (0-6)
    };

    // Función para obtener el número de días en un mes
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate(); // Devuelve el número de días en el mes
    };

    // Generar el calendario
    const generateCalendar = () => {
        const month = currentDate.getMonth(); // Obtener el mes actual
        const year = currentDate.getFullYear(); // Obtener el año actual
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const calendar = [];

        // Agregar espacios en blanco para los días antes del primer día del mes
        for (let i = 0; i < firstDay; i++) {
            calendar.push(<div key={`empty-${i}`} className="empty"></div>);
        }

        // Agregar los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
            const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6; // Sábado o Domingo
            const dateForDay = new Date(year, month, day);
            
            calendar.push(
                <div 
                key={day}
                 className={`day ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
                 onClick={() => setSelectedDate(dateForDay)}
                 >
                    {day}
                </div>
            );
        }

        return calendar;
    };

    // Funciones para cambiar de mes
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Función para volver al mes actual
    const goToCurrentMonth = () => {
        setCurrentDate(new Date()); // Restablecer a la fecha actual
    };

    return (
        <div className="calendar">
            <h4>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h4>
          
            <div className="weekdays">
                <div className='day header-day weekend'>Dom</div>
                <div className='day header-day'>Lun</div>
                <div className='day header-day'>Mar</div>
                <div className='day header-day'>Mié</div>
                <div className='day header-day'>Jue</div>
                <div className='day header-day'>Vie</div>
                <div className='day header-day weekend'>Sab</div>
            </div>
            <div className="days">
                {generateCalendar()} {/* Generar el calendario */}
            </div>
            <div className="navigation">
                <button className='nav-btn' onClick={goToPreviousMonth}>◀</button>
                <button className='nav-btn' onClick={goToCurrentMonth}>▼</button>
                <button className='nav-btn' onClick={goToNextMonth}>▶</button>
            </div>
            {/* <Week selectedDate={selectedDate} />  */}
            {selectedDate && <Week selectedDate={selectedDate} />}

        </div>
    );
};

export default Calendar; // Exportar el componente Calendar 