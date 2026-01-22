const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all todos
const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a todo
const addTodo = async (req, res) => {
    try {
    const { title } = req.body;

    // 🔥 VALIDATION
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        is_completed: false,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("ADD TODO ERROR:", error);
    res.status(500).json({ error: error.message });
  }

  };

// Update todo (title or complete)
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_completed } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (is_completed !== undefined) data.is_completed = is_completed;

    const todo = await prisma.todo.update({
      where: { id },
      data,
    });

    res.json(todo);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
