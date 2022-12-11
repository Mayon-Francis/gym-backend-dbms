import { Router } from 'express';
import {
    getTrainersController,
    getTrainerController,
    loginTrainerController,
    registerTrainerController,
    getIncomingRequestsController,
    createWorkoutController,
    assignWorkoutController,
    acceptIncomingRequestController,
    getAssignedUsersController,
    createDietController,
    assignDietController,
    getWorkoutsController,
    getDietsController,
    rejectIncomingRequestController
} from '../controllers/trainer';
import { isTrainerLoggedIn } from '../middlewares/auth';

const router = Router();
router.post('/login', loginTrainerController);
router.post('/register', registerTrainerController);


router.get('/', getTrainersController);

router.use(isTrainerLoggedIn);
router.get('/user/requested', getIncomingRequestsController);
router.get('/user/assigned', getAssignedUsersController);

// TODO: modify to use creds

router.post('/user/:userEmail', acceptIncomingRequestController);
router.delete('/user/:userEmail', rejectIncomingRequestController);

router.get('/workout', getWorkoutsController);
router.post('/workout', createWorkoutController);
router.post('/workout/assign', assignWorkoutController);

router.get('/diet', getDietsController);
router.post('/diet', createDietController);
router.post('/diet/assign', assignDietController);

router.get('/:email', getTrainerController);




export { router as trainerRouter };