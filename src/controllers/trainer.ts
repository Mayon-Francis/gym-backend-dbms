import { Request, Response } from 'express';
import { execute } from '../db/connection';
import { TrainerQueries } from '../queries/trainer';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { ITrainer } from '../models/trainer';
import { getCreds } from '../utils/creds';
import { ITrainerAssignStatus } from '../models/trainerAssignStatus';
import { TrainerAssignedQueries } from '../queries/trainerAssign';
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
        const { name, email, password,specialization, profileImageUrl } = req.body;

        let user: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [email]))[0];
        if (user) {
            res.status(409).json({
                message: "trainer already exists"
            });
            return;
        }

        user = (await execute(
            TrainerQueries.AddTrainer,
            [uuidv4(), name, email, specialization, password, profileImageUrl]
        ))[0];
        res.status(200).json({
            message: "trainer registration successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                specialization: user.specialization,
                profile_image_url: user.profile_image_url,
            }
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
        const filteredTrainers = trainers.map((trainer) => {
            return {
                id: trainer.id,
                name: trainer.name,
                email: trainer.email,
                specialization: trainer.specialization,
                profile_image_url: trainer.profile_image_url,
            }
        });
        res.status(200).json({
            trainers: filteredTrainers
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
            trainer: {
                id: trainer.id,
                name: trainer.name,
                email: trainer.email,
                specialization: trainer.specialization,
                profile_image_url: trainer.profile_image_url,
            }
        });
    } catch (error) {
        logger.error('[getTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}


async function getIncomingRequestsController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];

        const users: IUser[] = (await execute(TrainerAssignedQueries.GetUsersByTrainerId, [trainer.id]));

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