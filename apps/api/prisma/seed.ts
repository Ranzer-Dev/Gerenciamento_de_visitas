import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o Seed do Banco de Dados...')

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dengue.gov.br';
  const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'Mudar@1234!'; 
  const passwordHash = await bcrypt.hash(adminPasswordRaw, 6);

  const admin = await prisma.agent.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      password: passwordHash, 
    },
    create: {
      email: adminEmail,
      name: 'Super Administrador',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log(`👮 Admin garantido: ${admin.email}`)
  console.log(`🔑 Senha inicial: ${adminPasswordRaw}`)

  console.log('✅ Seed finalizado com sucesso.')
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