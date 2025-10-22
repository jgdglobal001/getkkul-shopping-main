const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    // 모든 사용자 조회
    console.log('📋 현재 데이터베이스의 모든 사용자:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ 데이터베이스에 사용자가 없습니다.');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // jgdglobal@naver.com 사용자를 관리자로 변경
    const targetEmail = 'jgdglobal@naver.com';
    
    console.log(`\n🔄 ${targetEmail} 사용자를 관리자로 변경 중...`);
    
    const updatedUser = await prisma.user.update({
      where: {
        email: targetEmail
      },
      data: {
        role: 'admin'
      }
    });

    console.log('✅ 성공적으로 관리자 권한이 부여되었습니다!');
    console.log(`👑 ${updatedUser.name} (${updatedUser.email}) - Role: ${updatedUser.role}`);

    // 업데이트된 모든 사용자 다시 조회
    console.log('\n📋 업데이트된 사용자 목록:');
    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    updatedUsers.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    if (error.code === 'P2025') {
      console.log('❌ 해당 이메일의 사용자를 찾을 수 없습니다.');
      console.log('💡 먼저 해당 이메일로 로그인해서 계정을 생성해주세요.');
    } else {
      console.error('❌ 오류 발생:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
