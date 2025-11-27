import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function agentsRoutes(app: FastifyInstance) {
  
  // Middleware de verificação: Só Admin entra aqui
  app.addHook('onRequest', async (req, reply) => {
    try {
      await req.jwtVerify();
      if (req.user.role !== 'ADMIN') {
        return reply.status(403).send({ message: 'Acesso negado.' });
      }
    } catch (err) {
      return reply.status(401).send({ message: 'Não autorizado.' });
    }
  });

  app.get('/agents', async () => {
    return prisma.agent.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { name: 'asc' }
    });
  });

  app.put('/agents/:id', async (req, reply) => {
    const paramsSchema = z.object({ id: z.string() });
    const bodySchema = z.object({
      name: z.string().optional(),
      role: z.enum(['USER', 'ADMIN']).optional(),
      password: z.string().min(6).optional()
    });

    const { id } = paramsSchema.parse(req.params);
    const data = bodySchema.parse(req.body);

    let updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 6);
    }

    await prisma.agent.update({ where: { id }, data: updateData });
    return reply.send({ message: 'Atualizado com sucesso' });
  });


  app.delete('/agents/:id', async (req, reply) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);

    if (req.user.id === id) {
      return reply.status(400).send({ message: 'Você não pode excluir a si mesmo.' });
    }

    await prisma.visit.deleteMany({ where: { agentId: id } });
    await prisma.agent.delete({ where: { id } });

    return reply.status(204).send();
  });
}