const fs = require('fs');
const path = require('path');

const sourceDirectory = path.join(
  __dirname,
  '..',
  'src',
  'contracts'
);

const destinationDirectory = path.join(
  __dirname,
  '..',
  'public',
  'contracts'
);

if (!fs.existsSync(sourceDirectory)) {
  console.error('Source contracts directory does not exist.');
  process.exit(1);
}

fs.mkdirSync(destinationDirectory, {
  recursive: true,
});

const files = fs
  .readdirSync(sourceDirectory)
  .filter((file) => file.endsWith('.txt'));

for (const file of files) {
  const source = path.join(sourceDirectory, file);
  const destination = path.join(destinationDirectory, file);

  fs.copyFileSync(source, destination);

  console.log(`Copied contract: ${file}`);
}

console.log('Contracts copied successfully.');