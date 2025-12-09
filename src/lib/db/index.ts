import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Neon HTTP 드라이버 사용 (Cloudflare Workers 호환)
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';

