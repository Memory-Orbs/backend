import * as OrbService from '../services/orb.js';
import { orbSchema, orbUpdateSchema } from '../validation/orb.js';

/**
 * POST /orbs
 */
export const createOrb = async (req, res, next) => {
  try {
    const { error, value } = orbSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const orb = await OrbService.createOrb({
      userId: req.user.id,
      date: value.date,
      emotions: value.emotions,
      note: value.note,
      animationSeed: value.animationSeed,
    });

    res.status(201).json(orb);
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.message = 'Orb already exists for this date';
    }
    next(error);
  }
};

/**
 * GET /orbs/date/:date
 */
export const getOrbByDate = async (req, res, next) => {
  try {
    const orb = await OrbService.getOrbByDate({
      userId: req.user.id,
      date: req.params.date,
    });

    if (!orb) {
      return res.status(404).json({ message: 'Orb not found' });
    }

    res.json(orb);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orbs/:id
 */
export const getOrbById = async (req, res, next) => {
  try {
    const orb = await OrbService.getOrbById({
      orbId: req.params.id,
      userId: req.user.id,
    });

    if (!orb) {
      return res.status(404).json({ message: 'Orb not found' });
    }

    res.json(orb);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orbs
 * ?startDate=&endDate=
 */
export const getOrbsByRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const orbs = await OrbService.getOrbsByRange({
      userId: req.user.id,
      startDate,
      endDate,
    });

    res.json(orbs);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /orbs/:id
 */
export const updateOrb = async (req, res, next) => {
  try {
    const { error, value } = orbUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const orb = await OrbService.updateOrb({
      orbId: req.params.id,
      userId: req.user.id,
      emotions: value.emotions,
      note: value.note,
      animationSeed: value.animationSeed,
    });

    res.json(orb);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /orbs/:id
 */
export const deleteOrb = async (req, res, next) => {
  try {
    await OrbService.deleteOrb({
      orbId: req.params.id,
      userId: req.user.id,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orbs/stats
 */
export const getOrbStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await OrbService.getOrbStats({
      userId: req.user.id,
      startDate,
      endDate,
    });

    res.json(stats);
  } catch (error) {
    next(error);
  }
};
