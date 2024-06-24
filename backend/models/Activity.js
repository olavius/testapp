const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  workorder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkOrder",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", ActivitySchema);
