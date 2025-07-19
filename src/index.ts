import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/index.js';
import errorMiddleware from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = () => {
    try {
        app.listen(PORT, () => {
            console.log('http://localhost:' + PORT);
        })

    } catch (e) {
        console.error(e);
    }
}

start()