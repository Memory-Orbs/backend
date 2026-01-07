import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createOrb,
  getOrbByDate,
  getOrbById,
  getOrbsByRange,
  updateOrb,
  deleteOrb,
  getOrbStats,
} from '../controllers/orb.js';

const router = Router();

router.use(authenticate);

/**
 * POST /orbs
 */
router.post('/', createOrb);

/**
 * GET /orbs/date/:date
 */
router.get('/date/:date', getOrbByDate);

/**
 * GET /orbs/stats
 */
router.get('/stats', getOrbStats);

/**
 * GET /orbs
 */
router.get('/', getOrbsByRange);

/**
 * GET /orbs/:id
 */
router.get('/:id', getOrbById);

/**
 * PUT /orbs/:id
 */
router.put('/:id', updateOrb);

/**
 * DELETE /orbs/:id
 */
router.delete('/:id', deleteOrb);

export default router;
