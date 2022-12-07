import { Request, Response } from "express";
import { execute } from "../db/connection";
import { IUser } from "../models/user";
import { UserQueries } from "../queries/user";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger";

async function loginController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user: IUser = (await execute(UserQueries.GetUserByEmail, [email]))[0];

        if (user) {
            if (user.password === password) {
                res.status(200).json({
                    message: "Login successful",
                    user: user
                });
            } else {
                res.status(401).json({ error: "Invalid password" });
            }
        } else {
            res.status(404).json({ error: "user not found" });
        }
    } catch (error) {
        logger.error('[loginController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function registerController(req: Request, res: Response) {
    try {
        const { name, email, password, heightInCm, weightInKg, profileImageUrl } = req.body;

        let user: IUser = (await execute(UserQueries.GetUserByEmail, [email]))[0];
        if (user) {
            res.status(409).json({
                message: "user already exists"
            });
            return;
        }

        user = (await execute(
            UserQueries.AddUser,
            [uuidv4(), name, email, password, heightInCm, weightInKg, profileImageUrl]
        ))[0];
        res.status(200).json({
            message: "user registration successful",
            user: user
        });
    } catch (error) {
        logger.error('[registerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when registering User'
        });
    }
}
/*
    sample request body for registerController
    {
        "name": "John Doe",
        "email": "johnDoe@gmail.com
        "password": "password",
        "heightInCm": 180,
        "weightInKg": 80,
        "profileImageUrl": "https://www.google.com"
    }
*/

export {
    loginController,
    registerController
}
