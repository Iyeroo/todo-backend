import express from "express";
import cors from "cors";
import prisma from "./prisma/client.js";

const app = express();
const PORT = 5000;

// ---------------- MIDDLEWARE ----------------
app.use(cors({ origin: "*" }));
app.use(express.json());

// ---------------- ROUTES ----------------

// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    return res.status(200).json(todos);
  } catch (err) {
    console.error("GET TODOS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// CREATE todo
app.post("/todos", async (req, res) => {
  try {
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const todo = await prisma.todo.create({
      data: body,
    });

    return res.status(201).json(todo);
  } catch (err) {
    console.error("CREATE TODO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE todo
app.put("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    let body = req.body;

    if (!id) {
      return res.status(400).json({ error: "Todo ID required" });
    }

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { id: _, ...data } = body;

    const updated = await prisma.todo.update({
      where: { id },
      data,
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("UPDATE TODO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Todo ID required" });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE TODO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
