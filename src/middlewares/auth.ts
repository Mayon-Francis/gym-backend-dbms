import { Request, Response, NextFunction } from "express";
import { execute } from "../db/connection";
import { IUser } from "../models/user";
import { UserQueries } from "../queries/user";

async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    console.log("[Middleware: isLoggedIn]")
    const token = req.headers.authorization;
    if (token) {
        const creds = Buffer.from(token.split(" ")[1], 'base64').toString('utf8');
        console.log("creds", creds);
        const email = creds.split(":")[0];
        const password = creds.split(":")[1];
        const user:IUser = (await execute(UserQueries.GetUserByEmail, [email]))[0];
        if(user) {
            if(user.password === password) {
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

export { 
    isLoggedIn
 };