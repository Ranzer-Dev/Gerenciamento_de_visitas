import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Limpa o banco antes de criar
  await prisma.visit.deleteMany()
  await prisma.agent.deleteMany()

  console.log('🌱 Começando o Seed...')

  // 2. Cria um Agente
  const agenteJoao = await prisma.agent.create({
    data: {
      name: 'João da Silva',
      email: 'joao.agente@saude.gov.br',
      password: 'senha_super_secreta_hash', 
    }
  })

  console.log(`👤 Agente criado: ${agenteJoao.name}`)

  await prisma.visit.create({
    data: {
      latitude: -23.550520, 
      longitude: -46.633308, 
      focoType: 'PNEUS',
      notes: 'Muitos pneus no quintal dos fundos',
      agentId: agenteJoao.id,
    }
  })

  await prisma.visit.create({
    data: {
      latitude: -23.551520,
      longitude: -46.634308, 
      focoType: 'NENHUM',
      notes: 'Residência verificada, tudo ok.',
      agentId: agenteJoao.id,
    }
  })

  console.log('📍 Visitas criadas!')
  console.log('✅ Seed finalizado.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })