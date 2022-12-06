import { Router } from "express";

import { getUsersController } from "../controllers/user";

const router = Router();

router.get("/", getUsersController);

export { router as userRouter };