import { Router } from "express";

import { getUsersController, postUserController } from "../controllers/user";

const router = Router();

router.get("/", getUsersController);
router.post("/", postUserController);

export { router as userRouter };