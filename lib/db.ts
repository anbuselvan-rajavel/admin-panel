import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined
    }
  }
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
