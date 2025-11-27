import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

export async function createVisitRoute(app: FastifyInstance) {
  app.post('/visits', async (request, reply) => {
    
    // 1. VERIFICAÇÃO DE SEGURANÇA (Autenticação)
    try {
      await request.jwtVerify(); // Se não tiver token, para aqui e dá erro 401
    } catch (err) {
      return reply.status(401).send({ message: 'Não autorizado' });
    }

    const createVisitBody = z.object({
      latitude: z.number(),
      longitude: z.number(),
      focoType: z.enum(['NENHUM', 'CAIXA_DAGUA', 'VASOS', 'LIXO', 'PNEUS', 'OUTROS']),
      notes: z.string().optional(),
    });

    const data = createVisitBody.parse(request.body);

    const agentId = request.user.sub; 

    const visit = await prisma.visit.create({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        focoType: data.focoType,
        notes: data.notes,
        agentId: agentId,
      }
    });

    return reply.status(201).send(visit);
  });
}