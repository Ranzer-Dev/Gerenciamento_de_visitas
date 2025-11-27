import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { getVisitsRoute } from './modules/visits/get-visits';
import { createVisitRoute } from './modules/visits/create-visit';

const app = fastify();

app.register(cors, { 
  origin: true 
});

app.register(getVisitsRoute);
app.register(createVisitRoute);

app.listen({ port: 3333 }).then(() => {
  console.log('🔥 Server rodando em http://localhost:3333');
});