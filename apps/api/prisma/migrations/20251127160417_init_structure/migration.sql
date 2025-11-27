-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('COMPLETED', 'REFUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "FocoType" AS ENUM ('NENHUM', 'CAIXA_DAGUA', 'VASOS', 'LIXO', 'PNEUS', 'OUTROS');

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'COMPLETED',
    "focoType" "FocoType" NOT NULL DEFAULT 'NENHUM',
    "notes" TEXT,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent_id" TEXT NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_email_key" ON "agents"("email");

-- CreateIndex
CREATE INDEX "visits_agent_id_idx" ON "visits"("agent_id");

-- CreateIndex
CREATE INDEX "visits_visited_at_idx" ON "visits"("visited_at");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
