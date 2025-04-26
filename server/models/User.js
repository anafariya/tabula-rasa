const mongoose = require('mongoose');

const cardProgressSchema = new mongoose.Schema({
  cardId: { type: String, required: true }, // Changed from Number to String
  dueDate: { type: Date, required: true },
  interval: { type: Number, default: 1 }, // Interval in days
  easeFactor: { type: Number, default: 2.5 }, // Ease factor for SRS
  lastReviewed: { type: Date },
  quality: { type: Number, min: 0, max: 5 }, // Quality rating (0-5)
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  notes: [
    {
      contentId: { type: String },
      contentType: { type: String },
      content: { type: String },
      updatedAt: { type: Date, default: Date.now },
      createdAt: { type: Date, default: Date.now }
    },
  ],
  cardProgress: [cardProgressSchema],
  studySettings: {
    cardLimit: { type: Number, default: 10 },
    includeNewCards: { type: Boolean, default: true },
    enableTimer: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('User', userSchema);