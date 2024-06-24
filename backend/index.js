const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Work Orders API");
});

// Routes
app.use("/api/workorders", require("./routes/workorders"));
app.use("/api/activities", require("./routes/activities"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
