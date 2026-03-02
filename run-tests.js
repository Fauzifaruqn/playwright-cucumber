const { execSync } = require('child_process');

// Get extra CLI args (e.g., --tags @smoke)
const args = process.argv.slice(2).join(' ');
const cucumberCmd = `npx cucumber-js ${args}`.trim();

// Clean previous reports
console.log('--- Cleaning previous reports ---');
execSync('node cleanup.js', { stdio: 'inherit' });

// Run Cucumber tests (allow failures so report always generates)
console.log(`\n--- Running: ${cucumberCmd} ---\n`);
let testExitCode = 0;
try {
  execSync(cucumberCmd, { stdio: 'inherit' });
} catch (err) {
  testExitCode = err.status || 1;
}

// Always generate the HTML report
console.log('\n--- Generating HTML report ---');
try {
  execSync('node generate-report.js', { stdio: 'inherit' });
} catch {
  console.error('Report generation failed (JSON may be missing).');
}

process.exit(testExitCode);
