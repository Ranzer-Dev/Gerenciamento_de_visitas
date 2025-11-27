import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  
  // ROTA DE CADASTRO
  app.post('/register', async (req, reply) => {
    const registerBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = registerBody.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 6);

    const userExists = await prisma.agent.findUnique({ where: { email } });
    if (userExists) return reply.status(409).send({ message: 'E-mail já cadastrado.' });

    const agent = await prisma.agent.create({
      data: { name, email, password: passwordHash }
    });

    return reply.status(201).send({ id: agent.id, name: agent.name });
  });

  // ROTA DE LOGIN
  app.post('/login', async (req, reply) => {
    const loginBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = loginBody.parse(req.body);

    const agent = await prisma.agent.findUnique({ where: { email } });
    if (!agent) return reply.status(400).send({ message: 'Credenciais inválidas.' });

    const isPasswordValid = await bcrypt.compare(password, agent.password);
    if (!isPasswordValid) return reply.status(400).send({ message: 'Credenciais inválidas.' });

    const token = app.jwt.sign(
      { name: agent.name,
        id: agent.id,
        role: agent.role
      },
      { sub: agent.id, expiresIn: '7d' }
    );

    return reply.send({ token, user: { id: agent.id, name: agent.name, email: agent.email, role: agent.role } });
  });
}