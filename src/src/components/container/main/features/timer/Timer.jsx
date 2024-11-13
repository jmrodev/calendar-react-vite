import React, { useState, useEffect } from 'react'; // Importar React y los hooks useState y useEffect

// Definición del componente funcional Timer
const Timer = () => {
    // Declarar el estado timeToGo, inicializado en 0
    const [timeToGo, setTimeToGo] = useState(0);
    // Declarar el estado elapsed, que almacenará el tiempo transcurrido
    const [elapsed, setElapsed] = useState(0);

    // Función para incrementar el estado timeToGo
    function incrementTiming() {
        setTimeToGo(prevTime => prevTime + 1);
    }

    // Función que simula un proceso que toma tiempo
    let functionForTiming = () => {
        for (let i = 0; i < 1000; i++) {
            console.log(i);
        }
    }

    // useEffect se ejecuta después de que el componente se monta
    useEffect(() => {
        const start = new Date(); // Capturar el tiempo de inicio
        functionForTiming(); // Llamar a la función que simula el tiempo
        const end = new Date(); // Capturar el tiempo de finalización
        const elapsedTime = end.getTime() - start.getTime(); // Calcular el tiempo transcurrido
        setElapsed(elapsedTime); // Actualizar el estado elapsed
        incrementTiming(); // Llamar a incrementTiming para incrementar el contador
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

    // Obtener la fecha actual
    let today = new Date();

    // Renderizar el componente
    return (
        <div>
            <h2>Principal</h2> {/* Título del componente */}
            <p>{today.toDateString()}</p> {/* Mostrar la fecha actual en formato legible */}
            <p>Tiempo transcurrido: {elapsed} ms</p> {/* Mostrar el tiempo transcurrido */}
            <p>Tiempo incrementado: {timeToGo}</p> {/* Mostrar el valor del contador timeToGo */}
        </div>
    );
};

export default Timer; // Exportar el componente Timer 