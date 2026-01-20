/**
 * 파비콘 생성 스크립트
 * favicon.ico를 다양한 크기의 PNG로 변환
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function generateFavicons() {
  const sourceFile = path.join(rootDir, 'public', 'favicon.ico');
  
  // favicon.ico 파일 확인
  if (!fs.existsSync(sourceFile)) {
    console.error('❌ favicon.ico 파일을 찾을 수 없습니다!');
    process.exit(1);
  }

  console.log('📁 favicon.ico 파일 정보 확인 중...');
  
  try {
    const metadata = await sharp(sourceFile).metadata();
    console.log(`   원본 크기: ${metadata.width}x${metadata.height}`);
    console.log(`   포맷: ${metadata.format}`);
    
    // 정사각형 확인
    if (metadata.width !== metadata.height) {
      console.log(`⚠️  원본이 정사각형이 아닙니다. 정사각형으로 조정합니다.`);
    }

    // 생성할 파비콘 크기들
    const sizes = [
      { size: 16, output: path.join(rootDir, 'public', 'favicon-16x16.png') },
      { size: 32, output: path.join(rootDir, 'public', 'favicon-32x32.png') },
      { size: 48, output: path.join(rootDir, 'public', 'favicon-48x48.png') },
      { size: 180, output: path.join(rootDir, 'src', 'app', 'apple-icon.png') },
      { size: 192, output: path.join(rootDir, 'public', 'icon-192.png') },
      { size: 512, output: path.join(rootDir, 'public', 'icon-512.png') },
      // Next.js App Router용 icon.png (32x32 권장, 하지만 더 큰 사이즈도 지원)
      { size: 512, output: path.join(rootDir, 'src', 'app', 'icon.png') },
    ];

    console.log('\n🎨 파비콘 생성 중...\n');

    for (const { size, output } of sizes) {
      // 디렉토리 확인
      const dir = path.dirname(output);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await sharp(sourceFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // 투명 배경
        })
        .png()
        .toFile(output);
      
      console.log(`   ✅ ${path.relative(rootDir, output)} (${size}x${size})`);
    }

    console.log('\n🎉 파비콘 생성 완료!\n');
    
    // 요약
    console.log('📋 생성된 파일 요약:');
    console.log('   - src/app/icon.png (512x512) - Next.js 자동 처리');
    console.log('   - src/app/apple-icon.png (180x180) - iOS 홈화면');
    console.log('   - public/icon-192.png (192x192) - Android/PWA');
    console.log('   - public/icon-512.png (512x512) - PWA 스플래시');
    console.log('   - public/favicon-16x16.png (16x16)');
    console.log('   - public/favicon-32x32.png (32x32)');
    console.log('   - public/favicon-48x48.png (48x48) - Google 검색 최소 권장');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

generateFavicons();

