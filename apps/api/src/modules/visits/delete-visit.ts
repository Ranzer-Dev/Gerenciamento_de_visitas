import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

export async function deleteVisitRoute(app: FastifyInstance) {
  app.delete('/visits/:id', async (request, reply) => {
    
    try { await request.jwtVerify(); } 
    
    catch (err) { return reply.status(401).send({ message: 'Não autorizado' }); }
    console.log("QUEM ESTÁ TENTANDO APAGAR?", request.user);

    if (request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Apenas administradores podem excluir visitas.' });
    }

    const paramsSchema = z.object({ id: z.string().uuid() });
    const querySchema = z.object({ force: z.string().optional() });

    const { id } = paramsSchema.parse(request.params);
    const { force } = querySchema.parse(request.query);

    if (force === 'true') {
      await prisma.visit.delete({ where: { id } });
    } else {
      await prisma.visit.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
    }

    return reply.status(204).send();
  });
}