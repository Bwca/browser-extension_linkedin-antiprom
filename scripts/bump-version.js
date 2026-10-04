const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const manifestJsonPath = path.join(rootDir, 'src', 'manifest.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8');
}

function bumpPatchVersion(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(`Invalid version format: ${version}`);
  }
  parts[2] += 1;
  return parts.join('.');
}

const packageJson = readJson(packageJsonPath);
const manifestJson = readJson(manifestJsonPath);
const previousVersion = packageJson.version || '0.0.0';
const nextVersion = bumpPatchVersion(previousVersion);
packageJson.version = nextVersion;
manifestJson.version = nextVersion;
writeJson(packageJsonPath, packageJson);
writeJson(manifestJsonPath, manifestJson);
console.log(`Bumped version from ${previousVersion} to ${nextVersion}`);
