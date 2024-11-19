import React from 'react'; // Importar React
import Timer from './features/timer/Timer'; // Importar el nuevo componente Timer
import Calendar from './features/calendar/calendar'; // Importar el componente Calendar

// Definición del componente funcional Main
export const Main = () => {
    // Renderizar el componente
    return (
        <main>
            <Timer /> 
          
        </main>
    );
}