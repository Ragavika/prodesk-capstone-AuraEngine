require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const inventoryRoutes = require("./routes/inventoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();

app.use(express.json());
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticsRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Aura Engine API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});