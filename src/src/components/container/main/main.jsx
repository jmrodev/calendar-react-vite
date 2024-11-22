import React from 'react';
import Week from './features/week/week';

export const Main = ({ selectedDate }) => {
    return (
        <main>
            <Week selectedDate={selectedDate} />
        </main>
    );
};