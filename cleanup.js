const fs = require('fs');
const path = require('path');

const reportsDir = path.resolve('reports');

const foldersToClean = [
  'screenshots',
  'videos',
  'traces',
  'html',
];

for (const folder of foldersToClean) {
  const fullPath = path.join(reportsDir, folder);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Cleaned: ${fullPath}`);
  }
}

const jsonReport = path.join(reportsDir, 'cucumber-report.json');
if (fs.existsSync(jsonReport)) {
  fs.unlinkSync(jsonReport);
  console.log(`Cleaned: ${jsonReport}`);
}

console.log('Previous report data cleared.');
