import { Router } from 'express';
import { 
    getTrainersController, 
    getTrainerController, 
    loginTrainerController, 
    registerTrainerController,
    getIncomingRequestsController,
} from '../controllers/trainer';
import { isTrainerLoggedIn } from '../middlewares/auth';

const router = Router();
router.post('/login', loginTrainerController);
router.post('/register', registerTrainerController);


router.get('/', getTrainersController);

router.use(isTrainerLoggedIn);
router.get('/user', getIncomingRequestsController);
router.get('/:email', getTrainerController);

export { router as trainerRouter };