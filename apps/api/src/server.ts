import { fastify } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { getVisitsRoute } from './modules/visits/get-visits';
import { createVisitRoute } from './modules/visits/create-visit';
import { authRoutes } from './modules/auth/auth.routes';
import { deleteVisitRoute } from './modules/visits/delete-visit';
import { agentsRoutes } from './modules/agents/agents.routes';

const app = fastify();
const port = Number(process.env.PORT) || 3333;

app.register(cors, { 
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secreta-apenas-dev' 
});

app.register(authRoutes);
app.register(getVisitsRoute);
app.register(createVisitRoute);
app.register(deleteVisitRoute);
app.register(agentsRoutes);

app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`🔥 Server rodando na porta ${port}`);
});