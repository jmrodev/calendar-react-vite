import React, { useState } from 'react';
import { Main } from './main/main';
import { Aside } from './aside/aside';

const Content = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div className='content'>
            <Aside onDateSelect={setSelectedDate} selectedDate={selectedDate} />
            <Main selectedDate={selectedDate} />
        </div>
    );
};

export default Content;