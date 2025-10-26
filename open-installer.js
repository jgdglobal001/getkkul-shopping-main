const { exec } = require('child_process');

const msiPath = 'C:\\Users\\WD\\AppData\\Local\\Temp\\playwright-mcp-output\\1761455763614\\PowerShell-7-5-4-win-x64.msi';

console.log('PowerShell 7.5.4 설치 프로그램을 엽니다...\n');
console.log(`파일 위치: ${msiPath}\n`);

// Windows 탐색기로 MSI 파일 실행
exec(`start "" "${msiPath}"`, (error) => {
  if (error) {
    console.error('❌ 파일 열기 실패:', error.message);
    console.log('\n수동으로 다음 경로의 파일을 실행해주세요:');
    console.log(msiPath);
  } else {
    console.log('✅ 설치 프로그램이 열렸습니다!');
    console.log('\n📝 설치 안내:');
    console.log('1. 설치 마법사가 열리면 "Next" 클릭');
    console.log('2. 라이선스 동의 후 "Next" 클릭');
    console.log('3. 설치 옵션은 기본값 유지하고 "Next" 클릭');
    console.log('4. "Install" 버튼 클릭');
    console.log('5. 설치 완료 후 "Finish" 클릭');
    console.log('\n⏱️ 설치는 약 1-2분 소요됩니다.');
  }
});

