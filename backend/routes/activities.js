const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// Get all activities for a work order
router.get("/workorder/:workorderId", async (req, res) => {
  const activities = await Activity.find({
    workorder_id: req.params.workorderId,
  });
  res.json(activities);
});

// Create a new activity
router.post("/", async (req, res) => {
  const newActivity = new Activity(req.body);
  await newActivity.save();
  res.json(newActivity);
});

// Update an activity
router.put("/:id", async (req, res) => {
  const updatedActivity = await Activity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.json(updatedActivity);
});

// Delete an activity
router.delete("/:id", async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ message: "Activity deleted" });
});

module.exports = router;
