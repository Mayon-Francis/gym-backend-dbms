import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import logger from './utils/logger';
import { init } from './db/connection';
import { pingRouter } from './routes/ping';
import { userRouter } from './routes/user';
import { IDB_CONFIG } from './types.d';
import { trainerRouter } from './routes/trainer';
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;
// const DB_URI = process.env.DB;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
// const DB = process.env.DB;
if (!DB_HOST) {
    throw new Error('DB_HOST not found in .env file');
}
if (!DB_PORT) {
    throw new Error('DB_PORT not found in .env file');
}
if (!DB_USER) {
    throw new Error('DB_USER not found in .env file');
}
if (!DB_PASS) {
    throw new Error('DB_PASS not found in .env file');
}
// if (!DB) {
//     throw new Error('DB not found in .env file');
// }

const DB_CONFIG: IDB_CONFIG = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    // database: DB
}


const app: Express = express();

app.disable('etag');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(function (tokens, req, res) {
    let authorizationLog = ""
    try {
        authorizationLog = req.headers["authorization"] ?
            Buffer.from(req.headers["authorization"].split(" ")[1], 'base64').toString('utf8') :
            "Auth-header-missing";
    } catch (err) {

    }

    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        authorizationLog,
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}, { stream: { write: message => logger.info(message.trim()) } }));

app.use('/ping', pingRouter);
app.use('/user', userRouter);
app.use('/trainer', trainerRouter);

app.listen(PORT, async () => {
    init(DB_CONFIG);
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});