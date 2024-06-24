const express = require("express");
const router = express.Router();
const WorkOrder = require("../models/WorkOrder");

// Get all work orders
router.get("/", async (req, res) => {
  const workOrders = await WorkOrder.find();
  res.json(workOrders);
});

// Get a single work order by ID
router.get("/:id", async (req, res) => {
  const workOrder = await WorkOrder.findById(req.params.id);
  res.json(workOrder);
});

// Create a new work order
router.post("/", async (req, res) => {
  const newWorkOrder = new WorkOrder(req.body);
  await newWorkOrder.save();
  res.json(newWorkOrder);
});

// Update a work order
router.put("/:id", async (req, res) => {
  const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.json(updatedWorkOrder);
});

// Delete a work order
router.delete("/:id", async (req, res) => {
  await WorkOrder.findByIdAndDelete(req.params.id);
  res.json({ message: "Work order deleted" });
});

module.exports = router;
