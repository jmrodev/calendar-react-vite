import express from 'express';
import cors from 'cors';
import appointmentRouter from './Router/appointmentRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

// Asegúrate de que la ruta base sea /api/appointments
app.use('/api/appointments', appointmentRouter);

// ... resto de la configuración del servidor ...

export default app; 