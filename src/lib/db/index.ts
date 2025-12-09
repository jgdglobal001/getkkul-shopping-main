import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 빌드 시점에는 더미 URL 사용, 런타임에 실제 URL 사용
const databaseUrl = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';

