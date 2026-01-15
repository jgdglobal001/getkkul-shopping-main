/**
 * 관리자 권한 부여 스크립트 (Drizzle ORM)
 * 사용법: node scripts/make-admin.js [이메일]
 * 예시: node scripts/make-admin.js jgdglobal@naver.com
 */
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { eq } = require('drizzle-orm');
const { pgTable, text, boolean, timestamp } = require('drizzle-orm/pg-core');

// Users 스키마 정의
const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  name: text('name'),
  email: text('email').notNull().unique(),
  role: text('role').default('user'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

// DB 연결
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function makeAdmin() {
  try {
    // 모든 사용자 조회
    console.log('📋 현재 데이터베이스의 모든 사용자:');
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    }).from(users);

    if (allUsers.length === 0) {
      console.log('❌ 데이터베이스에 사용자가 없습니다.');
      return;
    }

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // 커맨드라인 인자 또는 기본값
    const targetEmail = process.argv[2] || 'jgdglobal@naver.com';

    console.log(`\n🔄 ${targetEmail} 사용자를 관리자로 변경 중...`);

    // 사용자 업데이트
    const result = await db.update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, targetEmail))
      .returning();

    if (result.length === 0) {
      console.log('❌ 해당 이메일의 사용자를 찾을 수 없습니다.');
      console.log('💡 먼저 해당 이메일로 로그인해서 계정을 생성해주세요.');
      return;
    }

    const updatedUser = result[0];
    console.log('✅ 성공적으로 관리자 권한이 부여되었습니다!');
    console.log(`👑 ${updatedUser.name} (${updatedUser.email}) - Role: ${updatedUser.role}`);

    // 업데이트된 모든 사용자 다시 조회
    console.log('\n📋 업데이트된 사용자 목록:');
    const updatedUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    }).from(users);

    updatedUsers.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

makeAdmin();
