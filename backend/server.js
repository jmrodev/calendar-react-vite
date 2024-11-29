import express from 'express';
import cors from 'cors';
import router from './Router/router.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router); 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!', err);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
