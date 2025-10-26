const { execSync } = require('child_process');
const path = require('path');

const msiPath = 'C:\\Users\\WD\\AppData\\Local\\Temp\\playwright-mcp-output\\1761455763614\\PowerShell-7-5-4-win-x64.msi';

console.log('PowerShell 7.5.4 설치 시작...');
console.log(`MSI 파일: ${msiPath}`);

try {
  // MSI 파일을 자동 설치 (조용한 설치)
  console.log('\n설치 중... (약 1-2분 소요)');
  execSync(`msiexec /i "${msiPath}" /quiet /norestart ADD_EXPLORER_CONTEXT_MENU_OPENPOWERSHELL=1 ADD_FILE_CONTEXT_MENU_RUNPOWERSHELL=1 ENABLE_PSREMOTING=1 REGISTER_MANIFEST=1`, {
    stdio: 'inherit',
    timeout: 120000 // 2분 타임아웃
  });
  
  console.log('\n✅ PowerShell 7.5.4 설치 완료!');
  console.log('\n설치된 위치: C:\\Program Files\\PowerShell\\7\\');
  console.log('실행 파일: pwsh.exe');
  
} catch (error) {
  console.error('\n❌ 설치 실패:', error.message);
  console.log('\n수동 설치가 필요합니다:');
  console.log(`1. 파일 탐색기에서 다음 경로로 이동:`);
  console.log(`   ${msiPath}`);
  console.log(`2. MSI 파일을 더블클릭하여 설치`);
  process.exit(1);
}

