import express from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todos.js";

const router = express.Router();

// GET all todos
router.get("/", getTodos);

// CREATE a todo
router.post("/", createTodo);

// UPDATE a todo by id
router.put("/:id", updateTodo);

// DELETE a todo by id
router.delete("/:id", deleteTodo);

export default router;
