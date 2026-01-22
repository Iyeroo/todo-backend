import prisma from "../prisma/client.js";

export default async function handler(req, res) {
  // ✅ CORS headers (must be FIRST)
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const { method, query } = req;
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    // GET all todos
    if (method === "GET") {
      const todos = await prisma.todo.findMany();
      return res.status(200).json(todos);
    }

    // CREATE todo
    if (method === "POST") {
      const todo = await prisma.todo.create({ data: body });
      return res.status(201).json(todo);
    }

    // UPDATE todo
    if (method === "PUT") {
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

    // DELETE todo
    if (method === "DELETE") {
      const id = query.id || body.id;
      if (!id) {
        return res.status(400).json({ error: "Todo ID required" });
      }

      await prisma.todo.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
