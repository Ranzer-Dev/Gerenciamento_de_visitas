import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function getVisitsRoute(app: FastifyInstance) {
  app.get('/visits', async () => {
    const visits = await prisma.visit.findMany({
      include: {
        agent: {
          select: { name: true }
        }
      },
      orderBy: {
        visitedAt: 'desc'
      }
    });

    return visits;
  });
}