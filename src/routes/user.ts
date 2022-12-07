import { Router } from "express";

import { getUsersController, getUserController, postUserController } from "../controllers/user";
import { isLoggedIn } from "../middlewares/auth";

const router = Router();

router.get("/", getUsersController);
router.post("/", postUserController);

router.use(isLoggedIn);
router.get('/:email', getUserController);

export { router as userRouter };