import { Request, Response } from 'express';
import { execute } from '../db/connection';
import { TrainerQueries } from '../queries/trainer';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { ITrainer } from '../models/trainer';
import { getCreds } from '../utils/creds';
import { ITrainerAssignStatus } from '../models/trainerAssignStatus';
import { TrainerAssignedQueries } from '../queries/trainerAssign';
import { UserQueries } from '../queries/user';
import { IUser } from '../models/user';

async function loginTrainerController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [email]))[0];

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
            res.status(404).json({ error: "trainer not found" });
        }
    } catch (error) {
        logger.error('[loginTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function registerTrainerController(req: Request, res: Response) {
    try {
        const { name, email, password, profileImageUrl } = req.body;

        let user: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [email]))[0];
        if (user) {
            res.status(409).json({
                message: "trainer already exists"
            });
            return;
        }

        user = (await execute(
            TrainerQueries.AddTrainer,
            [uuidv4(), name, email, password, profileImageUrl]
        ))[0];
        res.status(200).json({
            message: "trainer registration successful",
            user: user
        });
    } catch (error) {
        logger.error('[registerTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when registering trainer'
        });
    }
}

async function getTrainersController(req: Request, res: Response) {
    try {
        const trainers: ITrainer[] = await execute(TrainerQueries.GetTrainers, []);
        res.status(200).json({
            trainers: trainers
        });
    } catch (error) {
        logger.error('[getTrainersController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function getTrainerController(req: Request, res: Response) {
    try {
        const { email } = req.params;
        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [email]))[0];
        res.status(200).json({
            trainer: trainer
        });
    } catch (error) {
        logger.error('[getTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}


// TODO: This is not working
async function getIncomingRequestsController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];

        const requestsAssignStatus: ITrainerAssignStatus[] = await execute(TrainerAssignedQueries.GetEntriesByTrainerId, [trainer.id]);

        const param = `(${(requestsAssignStatus.map((request) => `'${request.user_id}'`)).join(', ')})`;

        // TODO: This is not working
        const users: IUser[] = (await execute(UserQueries.GetUsersByIds, []));
        // const users: IUser[] = (await execute(UserQueries.GetUsersByIds, ['(\'6de54a97-dd02-469f-b0bd-8bfb0bc62b38\', \'6de54a97-dd02-469f-b0bd-8bfb0bc62b38\') ']));

        res.status(200).json({
            requests: users.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profileImageUrl: user.profile_image_url,
                    status: 'pending'
                }
            })
        });
    } catch (error) {
        logger.error('[getIncomingRequestsController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export {
    loginTrainerController,
    registerTrainerController,
    getTrainersController,
    getTrainerController,
    getIncomingRequestsController
}