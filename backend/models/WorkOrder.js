const mongoose = require("mongoose");

const WorkOrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkOrder", WorkOrderSchema);
