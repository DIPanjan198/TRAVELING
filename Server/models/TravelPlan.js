const mongoose = require("mongoose");

const travelPlanSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
  },
  createdBy: {
    type: String, // email of user
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TravelPlan", travelPlanSchema);
