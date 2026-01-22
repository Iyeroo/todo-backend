// import prisma from '../prisma/client.js';

export default async function handler(req, res) {

  // ✅ 1. Always set CORS headers FIRST
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ 2. Handle preflight IMMEDIATELY
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query } = req;
    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // GET
    if (method === 'GET') {
      const todos = await prisma.todo.findMany();
      return res.status(200).json(todos);
    }

    // POST
    if (method === 'POST') {
      const todo = await prisma.todo.create({ data: body });
      return res.status(201).json(todo);
    }

    // PUT
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

    // DELETE
    if (method === 'DELETE') {
      const id = query.id || body.id;
      if (!id) return res.status(400).json({ error: 'Todo ID is required' });

      await prisma.todo.delete({ where: { id: Number(id) } });
      return res.status(200).json({ message: 'Todo deleted successfully' });
    }

    // Unsupported method
    res.setHeader('Allow', ['GET','POST','PUT','DELETE','OPTIONS']);
    return res.status(405).end();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
