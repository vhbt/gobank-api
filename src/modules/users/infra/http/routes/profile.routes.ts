import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';
import BalanceController from '../controllers/BalanceController';

const profileRouter = Router();
const profileController = new ProfileController();
const balanceController = new BalanceController();

profileRouter.get('/', ensureAuthenticated, profileController.show);
profileRouter.put('/', ensureAuthenticated, profileController.update);

profileRouter.get('/balance', ensureAuthenticated, balanceController.show);

export default profileRouter;
