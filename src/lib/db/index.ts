import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazy initialization - 빌드 시점에 DB 연결 방지
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Proxy를 사용해서 기존 코드와 호환되게 db 객체 제공
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  }
});

// Re-export schema for convenience
export * from './schema';

