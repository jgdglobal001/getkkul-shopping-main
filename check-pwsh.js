const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('PowerShell 7 설치 확인 중...\n');

// PowerShell 7 설치 경로 확인
const pwshPath = 'C:\\Program Files\\PowerShell\\7\\pwsh.exe';

if (fs.existsSync(pwshPath)) {
  console.log('✅ PowerShell 7이 설치되어 있습니다!');
  console.log(`   위치: ${pwshPath}\n`);
  
  try {
    // 버전 확인
    const version = execSync(`"${pwshPath}" -Command "$PSVersionTable.PSVersion.ToString()"`, {
      encoding: 'utf8'
    }).trim();
    
    console.log(`📌 설치된 버전: PowerShell ${version}`);
    console.log('\n✅ PowerShell 7이 정상적으로 작동합니다!');
    
  } catch (error) {
    console.log('⚠️ PowerShell 7이 설치되었지만 실행 테스트 실패');
    console.log('   VSCode를 재시작하면 정상 작동할 것입니다.');
  }
  
} else {
  console.log('❌ PowerShell 7이 아직 설치되지 않았습니다.');
  console.log('\n다음 중 하나를 수행해주세요:');
  console.log('1. 설치 마법사가 열려있다면 설치를 완료해주세요');
  console.log('2. 설치 마법사가 없다면 다음 파일을 실행해주세요:');
  console.log('   C:\\Users\\WD\\AppData\\Local\\Temp\\playwright-mcp-output\\1761455763614\\PowerShell-7-5-4-win-x64.msi');
}

