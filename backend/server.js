import express from 'express';
import cors from 'cors';
import router from './Router/router.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
