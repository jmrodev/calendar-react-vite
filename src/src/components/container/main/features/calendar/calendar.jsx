import React, { useState } from 'react';
import './calendar.css'; // Asegúrate de tener un archivo CSS para los estilos

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Estado para la fecha actual

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
            calendar.push(
                <div key={day} className={`day ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}>
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
            <h2>Calendario de {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
            <div className="navigation">
                <button onClick={goToPreviousMonth}>Anterior</button>
                <button onClick={goToNextMonth}>Siguiente</button>
                <button onClick={goToCurrentMonth}>Mes Actual</button> {/* Botón para volver al mes actual */}
            </div>
            <div className="weekdays">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sab</div>
            </div>
            <div className="days">
                {generateCalendar()} {/* Generar el calendario */}
            </div>
        </div>
    );
};

export default Calendar; // Exportar el componente Calendar 