const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const todoRoutes=require("./routes/todoRoutes")

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use('/todos',todoRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
