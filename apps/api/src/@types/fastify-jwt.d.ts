import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string, name: string, role: string }
    user: {
      sub: string;
      name: string;
      role: string;
      iat: number;
      exp: number;
    }
  }
}