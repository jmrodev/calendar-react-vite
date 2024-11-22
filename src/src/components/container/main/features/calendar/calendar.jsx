import React, { useState } from 'react';
import './calendar.css';

const Calendar = ({ onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    
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
                    className={`day 
                        ${isToday ? 'today' : ''} 
                        ${isWeekend ? 'weekend' : ''} 
                        ${isSelected ? 'selected' : ''}`
                    }
                    onClick={() => onDateSelect(dateForDay)}
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
                <div className='day header-day weekend'>Sáb</div>
            </div>
            <div className="days">
                {generateCalendar()}
            </div>
            <div className="navigation">
                <button className='nav-btn' onClick={goToPreviousMonth}>◀</button>
                <button className='nav-btn' onClick={goToCurrentMonth}>▼</button>
                <button className='nav-btn' onClick={goToNextMonth}>▶</button>
            </div>
        </div>
    );
};

export default Calendar;