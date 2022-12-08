import { Request, Response } from "express";
import { execute } from "../db/connection";
import { IUser } from "../models/user";
import { UserQueries } from "../queries/user";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger";
import { TrainerQueries } from "../queries/trainer";
import { TrainerAssignedQueries } from "../queries/trainerAssign";
import { ITrainerAssignStatus } from "../models/trainerAssignStatus";
import { ITrainer } from "../models/trainer";

async function loginUserController(req: Request, res: Response) {
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
        logger.error('[loginUserController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function registerUserController(req: Request, res: Response) {
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
        logger.error('[registerUserController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when registering User'
        });
    }
}

async function getUsersController(req: Request, res: Response) {
    try {
        const users = await execute(UserQueries.GetUsers, []);
        res.status(200).json({
            users: users
        });

    } catch (error) {
        logger.error('[getUsersController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching Users'
        });
    }
}

async function getUserController(req: Request, res: Response) {
    try {
        const user = (await execute(UserQueries.GetUserByEmail, [req.params.email]))[0];
        res.status(200).json({
            user: user
        });

    } catch (error) {
        logger.error('[getUserController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching user with email: ' + req.params.email
        });
    }
}

async function requestTrainerController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    const trainerEmail = req.params.trainerEmail;

    try {
        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [trainerEmail]))[0];
        if (!trainer) {
            res.status(404).json({
                message: 'Trainer not found'
            });
            return;
        }

        const trainerAssigned: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntryByUserIdTrainerId, [userUid, trainer.id]))[0];
        if (trainerAssigned) {
            res.status(409).json({
                message: 'User already assigned to trainer'
            });
            return;
        }

        const AssignTrainer: ITrainerAssignStatus = {
            id: uuidv4(),
            user_id: userUid,
            trainer_id: trainer.id,
            status: "pending"
        }

        await execute(TrainerAssignedQueries.AddEntry, [AssignTrainer.id, AssignTrainer.user_id, AssignTrainer.trainer_id, AssignTrainer.status]);

        res.status(200).json({
            message: 'Trainer request successfully sent'
        });

    } catch (error) {
        logger.error('[requestTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when requesting trainer with email: ' + trainerEmail
        });
    }
}

async function requestDeleteTrainerController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    const trainerEmail = req.params.trainerEmail;

    try {
        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [trainerEmail]))[0];
        if (!trainer) {
            res.status(404).json({
                message: 'Trainer not found'
            });
            return;
        }

        const trainerAssigned: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntryByUserIdTrainerId, [userUid, trainer.id]))[0];
        if (!trainerAssigned) {
            res.status(409).json({
                message: 'User not requested/assigned to trainer'
            });
            return;
        }

        const AssignTrainer: ITrainerAssignStatus = {
            id: uuidv4(),
            user_id: userUid,
            trainer_id: trainer.id,
            status: "pending"
        }

        await execute(TrainerAssignedQueries.DeleteEntryByUserIdTrainerId, [userUid, trainer.id]);

        res.status(200).json({
            message: 'Trainer request successfully deleted'
        });

    } catch (error) {
        logger.error('[requestDeleteTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting trainerRequest with email: ' + trainerEmail
        });
    }
}


/*
 * This function is used to get the trainer from a user perspective,
 * so it will return all trainers and also mark the status that the user is assigned to.
 * This is expected to be used in the frontend to show the user which trainers he is assigned to.
 * and provide option to unassign/request a trainer.
 */
async function getTrainerFromUserController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    try {
        const trainers: ITrainer[] = (await execute(TrainerQueries.GetTrainers, []));

        console.log(trainers);
        const TrainerAssignedToUser: ITrainerAssignStatus[] = (await execute(TrainerAssignedQueries.GetEntriesByUserId, [userUid]));

        const trainersWithStatus = trainers.map(trainer => {
            const trainerAssigned = TrainerAssignedToUser.find(t => t.trainer_id === trainer.id);
            return {
                ...trainer,
                requestStatus: trainerAssigned?.status || 'not_assigned'
            }
        });
        res.status(200).json({
            trainers: trainersWithStatus
        });

    } catch (error) {
        logger.error('[getTrainerFromUserController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching trainer from user with userUid: ' + userUid
        });
    }
}


export {
    loginUserController,
    registerUserController,
    getUsersController,
    getUserController,
    getTrainerFromUserController,
    requestTrainerController,
    requestDeleteTrainerController
};