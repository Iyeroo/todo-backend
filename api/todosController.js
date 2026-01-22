import prisma from '../prisma/client.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const { method } = req;

  try {
    // GET all todos
    if (method === 'GET') {
      const todos = await prisma.todo.findMany();
      return res.status(200).json(todos);
    }

    // POST create new todo
    if (method === 'POST') {
      const data = req.body; // { title: 'Buy milk', is_completed: false }
      const todo = await prisma.todo.create({ data });
      return res.status(201).json(todo);
    }

    // PUT update existing todo
    if (method === 'PUT') {
      const { id, ...updateData } = req.body; // { id: 1, title: 'Buy bread' }
      if (!id) return res.status(400).json({ error: 'Todo ID is required' });

      const updatedTodo = await prisma.todo.update({
        where: { id: Number(id) },
        data: updateData,
      });
      return res.status(200).json(updatedTodo);
    }

    // DELETE a todo
    if (method === 'DELETE') {
      const { id } = req.body; // { id: 1 }
      if (!id) return res.status(400).json({ error: 'Todo ID is required' });

      await prisma.todo.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: 'Todo deleted successfully' });
    }

    // Unsupported methods
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
