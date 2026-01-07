import Joi from 'joi';

/**
 * Tek emotion şeması
 */
export const emotionSchema = Joi.object({
  type: Joi.string()
    .valid(
      'joy',
      'sadness',
      'anger',
      'disgust',
      'fear',
      'anxiety',
      'envy',
      'ennui',
      'embarrassment',
    )
    .required(),

  percentage: Joi.number().integer().min(1).max(100).required(),
});

/**
 * Orb oluşturma / güncelleme şeması
 */
export const orbSchema = Joi.object({
  date: Joi.date().required(),

  emotions: Joi.array()
    .items(emotionSchema)
    .min(2)
    .required()
    .custom((value, helpers) => {
      const total = value.reduce((sum, e) => sum + e.percentage, 0);
      if (total !== 100) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Emotion percentage sum validation')
    .messages({
      'any.invalid': 'The sum of emotion percentages must equal 100%',
    }),

  note: Joi.string().max(500).allow('', null),

  animationSeed: Joi.number(),
});

/**
 * Orb update şeması
 * - date yok (bilerek)
 * - tüm alanlar opsiyonel
 */
export const orbUpdateSchema = Joi.object({
  emotions: Joi.array()
    .items(emotionSchema)
    .min(2)
    .custom((value, helpers) => {
      const total = value.reduce((sum, e) => sum + e.percentage, 0);
      if (total !== 100) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .messages({
      'any.invalid': 'The sum of emotion percentages must equal 100%',
    }),

  note: Joi.string().max(500).allow('', null),

  animationSeed: Joi.number(),
}).min(1); // en az bir alan güncellensin
