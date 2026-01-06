import mongoose from 'mongoose';

const emotionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'joy',
        'sadness',
        'anger',
        'disgust',
        'fear',
        'anxiety',
        'envy',
        'ennui',
        'embarrassment',
      ],
    },

    percentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
  },
  { _id: false },
);

const orbSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    emotions: {
      type: [emotionSchema],
      required: true,
      validate: [
        {
          validator: (v) => v.length >= 2,
          message: 'You must select at least two emotions.',
        },
        {
          validator: (v) => v.reduce((sum, e) => sum + e.percentage, 0) === 100,
          message: 'The sum of emotion percentages must equal 100%.',
        },
      ],
    },

    note: {
      type: String,
      maxlength: 500,
    },

    animationSeed: Number,

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Kullanıcı başına günde tek Orb
orbSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Orb = mongoose.model('Orb', orbSchema);
