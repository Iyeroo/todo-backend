import prisma from "../prisma/client.js";

export async function getTodos(req, res) {
  const todos = await prisma.todo.findMany();
  return res.status(200).json(todos);
}

export async function createTodo(req, res) {
  let body = req.body;

  if (typeof body === "string") {
    body = JSON.parse(body);
  }

  const todo = await prisma.todo.create({
    data: body,
  });

  return res.status(201).json(todo);
}

export async function updateTodo(req, res) {
  let body = req.body;
  const { query } = req;

  if (typeof body === "string") {
    body = JSON.parse(body);
  }

  const id = query.id || body.id;
  if (!id) {
    return res.status(400).json({ error: "Todo ID required" });
  }

  const { id: _, ...data } = body;

  const updated = await prisma.todo.update({
    where: { id: Number(id) },
    data,
  });

  return res.status(200).json(updated);
}

export async function deleteTodo(req, res) {
  let body = req.body;
  const { query } = req;

  if (typeof body === "string") {
    body = JSON.parse(body);
  }

  const id = query.id || body.id;
  if (!id) {
    return res.status(400).json({ error: "Todo ID required" });
  }

  await prisma.todo.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json({ message: "Deleted" });
}
