import { Orb } from '../db/models/orb.js';
import mongoose from 'mongoose';

/**
 * Tarihi gün bazına sabitle (00:00)
 * Unique index (userId + date) için kritik
 */
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * GÜNLÜK ORB OLUŞTUR
 * - Aynı gün varsa Mongo hata fırlatır (unique index)
 */
export const createOrb = async ({
  userId,
  date,
  emotions,
  note,
  animationSeed,
}) => {
  const orb = await Orb.create({
    userId,
    date: normalizeDate(date),
    emotions,
    note,
    animationSeed,
  });

  return orb;
};

/**
 * TARİHE GÖRE ORB GETİR (tek gün)
 */
export const getOrbByDate = async ({ userId, date }) => {
  return Orb.findOne({
    userId,
    date: normalizeDate(date),
  });
};

/**
 * ID İLE ORB GETİR
 */
export const getOrbById = async ({ orbId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(orbId)) {
    throw new Error('Invalid orb id');
  }

  return Orb.findOne({
    _id: orbId,
    userId,
  });
};

/**
 * TARİH ARALIĞINDA ORB’LARI GETİR
 * (takvim / aylık / yıllık görünüm)
 */
export const getOrbsByRange = async ({ userId, startDate, endDate }) => {
  return Orb.find({
    userId,
    date: {
      $gte: normalizeDate(startDate),
      $lte: normalizeDate(endDate),
    },
  }).sort({ date: 1 });
};

/**
 * ORB GÜNCELLE
 * - Geçmiş dahil HER ORB güncellenebilir
 * - date değiştirilmez (unique yapı bozulmasın)
 */
export const updateOrb = async ({
  orbId,
  userId,
  emotions,
  note,
  animationSeed,
}) => {
  const orb = await Orb.findOne({
    _id: orbId,
    userId,
  });

  if (!orb) {
    throw new Error('Orb not found');
  }

  if (emotions) orb.emotions = emotions;
  if (note !== undefined) orb.note = note;
  if (animationSeed !== undefined) orb.animationSeed = animationSeed;

  await orb.save();
  return orb;
};

/**
 * ORB SİL
 * - Geçmiş silinebilir
 */
export const deleteOrb = async ({ orbId, userId }) => {
  const result = await Orb.deleteOne({
    _id: orbId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new Error('Orb not found');
  }

  return true;
};

/**
 * EMOTION İSTATİSTİKLERİ
 * - Poster / yıl sonu tablo için
 */
export const getOrbStats = async ({ userId, startDate, endDate }) => {
  return Orb.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: normalizeDate(startDate),
          $lte: normalizeDate(endDate),
        },
      },
    },
    { $unwind: '$emotions' },
    {
      $group: {
        _id: '$emotions.type',
        totalPercentage: { $sum: '$emotions.percentage' },
        daysCount: { $sum: 1 },
      },
    },
    {
      $project: {
        emotion: '$_id',
        totalPercentage: 1,
        daysCount: 1,
        _id: 0,
      },
    },
  ]);
};
