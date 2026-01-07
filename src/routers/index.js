import { Router } from 'express';
import authRouter from './auth.js';
import orbRouter from './orb.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/orbs', orbRouter);

export default router;
