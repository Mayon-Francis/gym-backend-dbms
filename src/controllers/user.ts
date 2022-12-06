import { Request, Response } from "express";
import { execute } from "../db/connection";
import { IUser } from "../models/user";
import { UserQueries } from "../queries/user";
import { v4 as uuidv4 } from 'uuid';
async function getUsersController(req: Request, res: Response) {
    try {
        const users = await execute(UserQueries.GetUsers, []);
        res.status(200).json({
            users: users
        });

    } catch (error) {
        console.error('[getUsersController][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching Users'
        });
    }
}

async function postUserController(req: Request, res: Response) {
    try {
        const { name, email, heightInCm, weightInKg, profileImageUrl } = req.body;
        const user: IUser[] = await execute(
            UserQueries.AddUser, 
            [uuidv4(), name, email, heightInCm, weightInKg, profileImageUrl]
        );
        res.status(200).json({
            user: user
        });
    } catch (error) {
        console.error('[postUserController][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding User'
        });
    }
}

export {
    getUsersController,
    postUserController
};