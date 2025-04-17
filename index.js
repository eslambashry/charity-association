import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectionDB } from './DB/connection.js';
import { config } from 'dotenv'
import path from 'path'
import userRouter from './src/modules/auth/auth.routes.js';
config({path: path.resolve('./config/.env')})
const app = express();
app.use(json());
app.use(morgan('dev'));
app.use(cors());

app.use('/user',userRouter)


connectionDB()
app.listen(5050, () => console.log('🚀 Server running on port 5050'));
