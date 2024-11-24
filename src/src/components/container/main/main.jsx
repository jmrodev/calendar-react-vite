import React from 'react';
import Week from './features/week/Week';

export const Main = ({ selectedDate }) => {
    return (
        <main>
            <Week selectedDate={selectedDate} />
        </main>
    );
};