import { Request, Response, NextFunction } from "express";
import { execute } from "../db/connection";
import { ITrainer } from "../models/trainer";
import { IUser } from "../models/user";
import { TrainerQueries } from "../queries/trainer";
import { UserQueries } from "../queries/user";
import { getCreds } from "../utils/creds";
import logger from "../utils/logger";

async function isUserLoggedIn(req: Request, res: Response, next: NextFunction) {
    logger.info("[Middleware: isUserLoggedIn]")
    const creds = getCreds(req);
    if (creds) {
        const user:IUser = (await execute(UserQueries.GetUserByEmail, [creds.email]))[0];
        if(user) {
            if(user.password === creds.password) {
                res.locals.user = user;
                next();
            } else {
                res.status(401).json({ error: "Unauthorized" });
            }
        } else {
            res.status(401).json({ error: "Unauthorized, User does not exist." });
        }
    } else {
        res.status(401).json({ error: "Unauthorized. Auhorization Header missing" });
    }
}

async function isTrainerLoggedIn(req: Request, res: Response, next: NextFunction) {
    logger.info("[Middleware: isTrainerLoggedIn]")
    const creds = getCreds(req);
    if (creds) {
        const user:ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];
        if(user) {
            if(user.password === creds.password) {
                res.locals.trainer = user;
                next();
            } else {
                res.status(401).json({ error: "Unauthorized" });
            }
        } else {
            res.status(401).json({ error: "Unauthorized, Trainer does not exist." });
        }
    } else {
        res.status(401).json({ error: "Unauthorized. Auhorization Header missing" });
    }
}

export { 
    isUserLoggedIn,
    isTrainerLoggedIn,
 };