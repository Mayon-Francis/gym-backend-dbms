import { Request, Response } from "express";
import { execute } from "../db/connection";
import { UserQueries } from "../queries/user";
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

export {
    getUsersController
};