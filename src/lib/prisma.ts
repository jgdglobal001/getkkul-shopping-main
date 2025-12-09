import { PrismaClient, Prisma } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'

// WebSocket 설정 - Edge/Workers 환경에서는 네이티브 WebSocket 사용
// Node.js 환경에서만 ws 패키지 사용
if (typeof globalThis.WebSocket === 'undefined') {
  // Node.js 환경 (로컬 개발)
  // eslint-disable-next-line
  const ws = require('ws')
  neonConfig.webSocketConstructor = ws
} else {
  // Edge/Workers 환경 (Cloudflare)
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Cloudflare Workers/Edge 환경에서는 Neon Serverless Adapter 사용
  const connectionString = process.env.DATABASE_URL!

  // Neon Serverless Pool 생성
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

export { Prisma }

// 개발 환경에서 핫 리로드 시 중복 연결 방지
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
