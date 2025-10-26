const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    console.log(`Deleting ${folderPath}...`);
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✓ Deleted ${folderPath}`);
  } else {
    console.log(`${folderPath} does not exist, skipping...`);
  }
}

console.log('🧹 Cleaning build files...\n');

// Delete .next folder
deleteFolder(path.join(__dirname, '.next'));

console.log('\n✅ Clean complete!');
console.log('\n📝 Note: The dev server will rebuild automatically when you access a page.');

