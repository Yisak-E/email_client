const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist-electron');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const packageJsonPath = path.join(distDir, 'package.json');
fs.writeFileSync(packageJsonPath, JSON.stringify({ type: 'commonjs' }, null, 2));
console.log('Prepared dist-electron/package.json with type=commonjs');
