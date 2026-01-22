const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* -------------------- OPTIONS (CORS PREFLIGHT) -------------------- */
app.options("*", (req, res) => {
  res.status(204).end();
});

/* -------------------- ROUTES -------------------- */

// GET all todos
app.get("/", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.status(200).json(todos);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// CREATE todo
app.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await prisma.todo.create({
      data: { title }
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("POST error:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// UPDATE todo
app.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { completed } = req.body;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed }
    });

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("PATCH error:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE todo
app.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.todo.delete({
      where: { id }
    });

    res.status(204).end();
  } catch (error) {
    console.error("DELETE error:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

/* -------------------- EXPORT (CRITICAL) -------------------- */
module.exports = app;
