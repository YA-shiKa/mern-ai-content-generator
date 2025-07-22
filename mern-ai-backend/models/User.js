const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    trialActive: {
      type: Boolean,
      default: true,
      required:false,
    },
    trialExpires: {
      type: Date,
    },
    trialPeriod: {
      type: Number,
      default: 3,
    },
    subscriptionPlan: {
      type: String,
      enum: ['Trial', 'Free', 'Basic', 'Premium'],
      default:"Trial",
    },
    apiRequestCount: {
      type: Number,
      default: 0,
    },
    monthlyRequestCount: {
      type: Number,
      default: 100,
    },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
    contentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContentHistory',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



// Compile to form model
const User = mongoose.model('User', userSchema);
module.exports = User;
