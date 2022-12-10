import { Router } from "express";
import {
    getUsersController,
    getUserController,
    loginUserController,
    registerUserController,
    getTrainerFromUserController,
    requestTrainerController,
    requestDeleteTrainerController,
    getAssignedWorkoutsController,
    completeWorkoutController,
} from "../controllers/user";
import { isUserLoggedIn } from "../middlewares/auth";

const router = Router();

router.post("/login", loginUserController);
router.post("/register", registerUserController);


router.use(isUserLoggedIn);
router.get("/", getUserController);
router.get('/trainer', getTrainerFromUserController);
// router.get('/:email', getUserController);
router.post('/trainer/:trainerEmail', requestTrainerController);
router.delete('/trainer/:trainerEmail', requestDeleteTrainerController);
router.get('/workout', getAssignedWorkoutsController);
router.post('/workout/:id', completeWorkoutController);

export { router as userRouter };