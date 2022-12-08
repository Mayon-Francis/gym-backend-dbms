import { Router } from "express";
import {
    getUsersController,
    getUserController,
    loginUserController,
    registerUserController,
    getTrainerFromUserController,
    requestTrainerController,
    requestDeleteTrainerController
} from "../controllers/user";
import { isUserLoggedIn } from "../middlewares/auth";

const router = Router();

router.post("/login", loginUserController);
router.post("/register", registerUserController);

router.get("/", getUsersController);

router.use(isUserLoggedIn);
router.get('/trainer', getTrainerFromUserController);
router.get('/:email', getUserController);
router.post('/trainer/:trainerEmail', requestTrainerController);
router.delete('/trainer/:trainerEmail', requestDeleteTrainerController);

export { router as userRouter };