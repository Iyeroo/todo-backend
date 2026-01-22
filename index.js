const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.json());

// ROUTES
app.use("/todos", todoRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "API running 🚀" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
