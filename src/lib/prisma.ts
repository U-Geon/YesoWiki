import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables.')
}

const globalForPrisma = globalThis as unknown as {
  pool: Pool | undefined
  adapter: PrismaPg | undefined
  prisma: PrismaClient | undefined
}

// Next.js HMR 시 커넥션 풀이 누적되지 않도록 전역 캐시(globalForPrisma)를 활용
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
    // 쿼리 실행이 너무 길어질 경우 중단 (보안 및 성능 목적)
    query_timeout: 10000,
  })

const adapter = globalForPrisma.adapter ?? new PrismaPg(pool)

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool
  globalForPrisma.adapter = adapter
  globalForPrisma.prisma = db
}
