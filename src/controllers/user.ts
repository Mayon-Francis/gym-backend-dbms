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
import { getCreds } from "../utils/creds";
import { WorkoutQueries } from "../queries/workout";
import { AssignWorkoutQueries } from "../queries/assignWorkout";
import { IAssignedWorkoutCombo, IWorkout } from "../models/workouts";
import { IAssignedWorkout } from "../models/assignedWorkout";
import { IAssignedDietCombo } from "../models/diet";
import { DietQueries } from "../queries/diet";

async function loginUserController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user: IUser = (await execute(UserQueries.GetUserByEmail, [email]))[0];

        if (user) {
            if (user.password === password) {
                res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        height_in_cm: user.height_in_cm,
                        weight_in_kg: user.weight_in_kg,
                        profile_image_url: user.profile_image_url,
                    }
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
        const filteredUsers = users.map((user: IUser) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                height_in_cm: user.height_in_cm,
                weight_in_kg: user.weight_in_kg,
                profile_image_url: user.profile_image_url,
            }
        });

        res.status(200).json({
            users: filteredUsers
        });

    } catch (error) {
        logger.error('[getUsersController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching Users'
        });
    }
}

async function getUserController(req: Request, res: Response) {
    const creds = getCreds(req);
    if (!creds) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }
    try {
        const user = (await execute(UserQueries.GetUserByEmail, [creds.email]))[0];

        const assignedTrainer: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntriesByUserId, [user.id]))[0];

        const trainer: ITrainer = assignedTrainer ? (await execute(TrainerQueries.GetTrainerById, [assignedTrainer.trainer_id]))[0] : null;

        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                height_in_cm: user.height_in_cm,
                weight_in_kg: user.weight_in_kg,
                profile_image_url: user.profile_image_url,
                assigned_trainer: trainer ? trainer.email : null,
                trainerStatus: assignedTrainer ? assignedTrainer.status : null
            }
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

        const trainerAssignedAlready: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntriesByUserId, [userUid]))[0];

        if(trainerAssignedAlready) {
            res.status(409).json({
                message: 'User already has sent a request to a trainer with id: ' + trainerAssignedAlready.trainer_id
            });
            return;
        }

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

    const trainerAssign: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntriesByUserId, [userUid]))[0];

    try {
        if (!trainerAssign) {
            res.status(404).json({
                message: 'Trainer not found'
            });
            return;
        }
        const trainerId = trainerAssign.trainer_id;

        const trainerAssigned: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntryByUserIdTrainerId, [userUid, trainerId]))[0];
        if (!trainerAssigned) {
            res.status(409).json({
                message: 'User not requested/assigned to trainer'
            });
            return;
        }

        await execute('BEGIN', []);

        await execute(TrainerAssignedQueries.DeleteEntryByUserIdTrainerId, [userUid, trainerId]);

        await execute(AssignWorkoutQueries.DeleteWorkoutsByUserId, [userUid]);

        await execute(DietQueries.DeleteDietsByUserId, [userUid]);

        await execute('COMMIT', []);
        res.status(200).json({
            message: 'Trainer request successfully deleted'
        });

    } catch (error) {
        await execute('ROLLBACK', []);
        logger.error('[requestDeleteTrainerController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting trainer for user with id: ' + userUid
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
                password: undefined,
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

async function getAssignedWorkoutsController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    try {
        const assignedWorkouts: IAssignedWorkoutCombo[] = (await execute(AssignWorkoutQueries.GetWorkoutsByUserId, [userUid]));
        res.status(200).json({
            workouts: assignedWorkouts
        });

    } catch (error) {
        logger.error('[getAssignedWorkoutsController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching assigned workouts from user with userUid: ' + userUid
        });
    }
}

async function completeWorkoutController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    const workoutAssignedId = req.params.id;

    try {
        const assignedWorkout: IAssignedWorkoutCombo = (await execute(AssignWorkoutQueries.ToggleCompletedStatus, [workoutAssignedId, userUid]))[0];

        // TODO: Refactor to get rowcount from execute function and check if rowcount is 0
        // if (!assignedWorkout) {
        //     res.status(404).json({
        //         message: 'Workout not found'
        //     });
        //     return;
        // }

        res.status(200).json({
            message: 'Workout status successfully toggled'
        });

    } catch (error) {
        logger.error('[completeWorkoutController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when toggling workout with workoutId: ' + workoutAssignedId
        });
    }
}

async function getAssignedDietsController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    try {
        const assignedDiets: IAssignedDietCombo[] = (await execute(DietQueries.GetDietsByUserId, [userUid]));
        res.status(200).json({
            diets: assignedDiets
        });

    } catch (error) {
        logger.error('[getAssignedDietsController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching assigned diets from user with userUid: ' + userUid
        });
    }
}

async function toggleDietController(req: Request, res: Response) {
    const userUid = res.locals?.user?.id;
    if (!userUid) {
        res.status(401).json({
            message: 'User is not logged in'
        });
        return;
    }

    const dietAssignedId = req.params.id;

    try {
        const assignedDiet = (await execute(DietQueries.ToggleCompletedStatus, [dietAssignedId, userUid]))[0];

        res.status(200).json({
            message: 'Diet status successfully toggled'
        });
    } catch (error) {
        logger.error('[toggleDietController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when toggling diet with dietId: ' + dietAssignedId
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
    requestDeleteTrainerController,
    getAssignedWorkoutsController,
    completeWorkoutController,
    getAssignedDietsController,
    toggleDietController,
};