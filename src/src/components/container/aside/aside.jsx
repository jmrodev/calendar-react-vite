import React from 'react';
import Calendar from "../main/features/calendar/calendar";

export const Aside = ({ onDateSelect, selectedDate }) => {
    return (
        <aside>
            <Calendar onDateSelect={onDateSelect} selectedDate={selectedDate} /> 
        </aside>
    );
};