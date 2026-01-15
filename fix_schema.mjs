import fs from 'fs';

const schemaPath = './src/lib/db/schema.ts';
let schemaContent = fs.readFileSync(schemaPath, 'utf-8');

console.log('Checking schema...');
console.log('Has partnerRef:', schemaContent.includes('partnerRef'));

// Find lastTossAttempt line
const lines = schemaContent.split('\n');
let insertIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('lastTossAttempt')) {
    insertIndex = i;
    console.log('Found lastTossAttempt at line:', i + 1);
    break;
  }
}

if (insertIndex !== -1 && !schemaContent.includes('partnerRef')) {
  // Insert after lastTossAttempt line
  const newLines = [
    '  // 파트너 정보 (지급대행용)',
    "  partnerRef: text('partnerRef'),",
    "  partnerSellerId: text('partnerSellerId'),",
    "  partnerLinkId: text('partnerLinkId'),"
  ];
  lines.splice(insertIndex + 1, 0, ...newLines);
  fs.writeFileSync(schemaPath, lines.join('\n'), 'utf-8');
  console.log('Schema updated with partner columns!');
} else if (schemaContent.includes('partnerRef')) {
  console.log('partnerRef already exists');
} else {
  console.log('Could not find lastTossAttempt');
}
