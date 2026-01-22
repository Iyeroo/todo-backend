import prisma from '../prisma/client.js';

export default async function handler(req, res) {
  // 1️⃣ Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // change '*' to your frontend URL in production
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2️⃣ Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query } = req;
    let body = req.body;

    // If body is string (sometimes happens in serverless), parse it
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // GET all todos
    if (method === 'GET') {
      const todos = await prisma.todo.findMany();
      return res.status(200).json(todos);
    }

    // POST create new todo
    if (method === 'POST') {
      const todo = await prisma.todo.create({ data: body });
      return res.status(201).json(todo);
    }

    // PUT update existing todo using query param id
    if (method === 'PUT') {
      const id = query.id || body.id;
      if (!id) return res.status(400).json({ error: 'Todo ID is required' });

      const { id: _ignore, ...updateData } = body;

      const updatedTodo = await prisma.todo.update({
        where: { id: Number(id) },
        data: updateData,
      });
      return res.status(200).json(updatedTodo);
    }

    // DELETE a todo using query param id
    if (method === 'DELETE') {
      const id = query.id || body.id;
      if (!id) return res.status(400).json({ error: 'Todo ID is required' });

      await prisma.todo.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: 'Todo deleted successfully' });
    }

    // Unsupported method
    res.setHeader('Allow', ['GET','POST','PUT','DELETE','OPTIONS']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
