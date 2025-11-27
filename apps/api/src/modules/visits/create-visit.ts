import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

export async function createVisitRoute(app: FastifyInstance) {
  app.post('/visits', async (request, reply) => {
    
    // 1. Validação dos dados que chegam do Front
    const createVisitBody = z.object({
      latitude: z.number(),
      longitude: z.number(),
      focoType: z.enum(['NENHUM', 'CAIXA_DAGUA', 'VASOS', 'LIXO', 'PNEUS', 'OUTROS']),
      notes: z.string().optional(),
      agentId: z.string().uuid(),
    });

    // Parse vai jogar um erro se os dados estiverem errados
    const data = createVisitBody.parse(request.body);

    // 2. Salva no Banco
    const visit = await prisma.visit.create({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        focoType: data.focoType, // O Prisma converte a string para Enum automaticamente
        notes: data.notes,
        agentId: data.agentId,
      }
    });

    return reply.status(201).send(visit);
  });
}