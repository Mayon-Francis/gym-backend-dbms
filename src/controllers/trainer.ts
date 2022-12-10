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
import { IWorkout } from '../models/workouts';
import { WorkoutQueries } from '../queries/workout';
import { AssignWorkoutQueries } from '../queries/assignWorkout';
import { UserQueries } from '../queries/user';
import { DietQueries } from '../queries/diet';
import { IAssignedDiet, IDiet } from '../models/diet';

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
        const { name, email, password, specialization, profileImageUrl } = req.body;

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

        const users: IUser[] = (await execute(TrainerAssignedQueries.GetUsersRequestedByTrainerId, [trainer.id]));

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

async function getAssignedUsersController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];

        const users: IUser[] = (await execute(TrainerAssignedQueries.GetUsersAssignedByTrainerId, [trainer.id]));

        res.status(200).json({
            requests: users.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profileImageUrl: user.profile_image_url,
                    status: 'accepted'
                }
            })
        });
    } catch (error) {
        logger.error('[getIncomingRequestsController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function createWorkoutController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            logger.error('[createWorkout] Unauthorized');
            return res.status(401).json({ error: "Unauthorized" })
        }

        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];

        const { workoutName, partOfBody, description } = req.body;

        const workout: IWorkout = (await execute(WorkoutQueries.AddWorkout, [
            uuidv4(),
            workoutName,
            partOfBody,
            description,
            trainer.id
        ]))[0];

        res.status(200).json({
            message: "Workout created successfully",
            workout: {
                id: workout.id,
                name: workout.name,
                partOfBody: workout.part_of_body,
                description: workout.description,
                trainerId: workout.trainer_id
            }
        });


    } catch (error) {
        logger.error('[createWorkout]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function assignWorkoutController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            logger.error('[assignWorkout] Unauthorized');
            return res.status(401).json({ error: "Unauthorized" })
        }
        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];
        const { userEmail, workoutName, sets, reps } = req.body;

        const user: IUser = (await execute(UserQueries.GetUserByEmail, [userEmail]))[0];

        const trainerAssigned: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntryByUserIdTrainerId, [user.id, trainer.id]))[0];
        if (!trainerAssigned) {
            res.status(404).json({
                message: 'User not assigned to trainer'
            });
            return;
        }

        const workout: IWorkout = (await execute(WorkoutQueries.GetWorkoutByNameAndTrainerId, [workoutName, trainer.id]))[0];
        if (!workout) {
            res.status(404).json({
                message: 'Workout not found'
            });
            return;
        }

        const assignedWorkout = (await execute(AssignWorkoutQueries.AddAssignedWorkout, [
            uuidv4(),
            user.id,
            workout.id,
            (new Date).toISOString(),
            false,
            sets,
            reps,
        ]))[0];

        res.status(200).json({
            message: "Workout assigned successfully",
            assignedWorkout: {
                id: assignedWorkout.id,
                userId: assignedWorkout.user_id,
                workoutId: assignedWorkout.workout_id,
                date: assignedWorkout.date,
                completed: assignedWorkout.completed,
                sets: assignedWorkout.sets,
                reps: assignedWorkout.reps,
            }
        });
    } catch (error) {
        logger.error('[assignWorkout]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function acceptIncomingRequestController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            logger.error('[acceptIncomingRequest] Unauthorized');
            return res.status(401).json({ error: "Unauthorized" })
        }

        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];

        const userEmail = req.params.userEmail;

        const user: IUser = (await execute(UserQueries.GetUserByEmail, [userEmail]))[0];

        const trainerAssigned: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntryByUserIdTrainerId, [user.id, trainer.id]))[0];
        if (!trainerAssigned) {
            res.status(404).json({
                message: 'User not assigned to trainer'
            });
            return;
        } else if (trainerAssigned.status === 'accepted') {
            res.status(400).json({
                message: 'User already accepted'
            });
            return;
        }

        await execute(TrainerAssignedQueries.SetStatus, ["accepted", user.id, trainer.id]);

        res.status(200).json({
            message: "Request accepted successfully",
            userId: user.id,
        });
    } catch (error) {
        logger.error('[acceptIncomingRequest]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function createDietController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            logger.error('[createDiet] Unauthorized');
            return res.status(401).json({ error: "Unauthorized" })
        }

        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];

        const { name, protein, quantity } = req.body;

        const diet: IDiet = (await execute(DietQueries.AddDiet, [
            uuidv4(),
            name,
            protein,
            quantity,
            trainer.id
        ]))[0];

        res.status(200).json({
            message: "Diet created successfully",
            diet: {
                id: diet.id,
                name: diet.name,
                protien: diet.protien,
                quantity: diet.quantity,
                trainerId: diet.trainer_id,
            }
        });
    } catch (error) {
        logger.error('[createDiet]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async function assignDietController(req: Request, res: Response) {
    try {
        const creds = getCreds(req);
        if (!creds) {
            logger.error('[assignDietController] Unauthorized');
            return res.status(401).json({ error: "Unauthorized" })
        }
        const trainer: ITrainer = (await execute(TrainerQueries.GetTrainerByEmail, [creds.email]))[0];
        const { userEmail, dietName, noOfTimes, time } = req.body;

        const user: IUser = (await execute(UserQueries.GetUserByEmail, [userEmail]))[0];

        const trainerAssigned: ITrainerAssignStatus = (await execute(TrainerAssignedQueries.GetEntryByUserIdTrainerId, [user.id, trainer.id]))[0];
        if (!trainerAssigned) {
            res.status(404).json({
                message: 'User not assigned to trainer'
            });
            return;
        }

        const diet: IDiet = (await execute(DietQueries.GetDietByNameAndTrainerId, [dietName, trainer.id]))[0];
        const dietAssigned: IAssignedDiet = (await execute(DietQueries.AssignDiet, [
            uuidv4(),
            diet.id,
            user.id,
            noOfTimes,
            time,]))[0];

        res.status(200).json({
            message: "Diet assigned successfully",
            dietAssigned: {
                id: dietAssigned.id,
                dietId: dietAssigned.diet_id,
                userId: dietAssigned.user_id,
                noOfTimes: dietAssigned.no_of_times,
                time: dietAssigned.time,
            }
        });
    } catch (error) {
        logger.error('[assignDietController]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export {
    loginTrainerController,
    registerTrainerController,
    getTrainersController,
    getTrainerController,
    getIncomingRequestsController,
    getAssignedUsersController,
    createWorkoutController,
    assignWorkoutController,
    acceptIncomingRequestController,
    createDietController,
    assignDietController,
}