#!/usr/bin/env node
// Generates PNG icons from public/next.svg using sharp.
// Usage: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [192, 256, 384, 512];
const svgPath = path.join(__dirname, '..', 'public', 'next.svg');
const outDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(svgPath)) {
  console.error('SVG not found at', svgPath);
  process.exit(1);
}

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('sharp is not installed. Run: npm install sharp --save-dev');
    process.exit(1);
  }

  for (const s of sizes) {
    const outPath = path.join(outDir, `icon-${s}x${s}.png`);
    await sharp(svgPath)
      .resize(s, s, { fit: 'contain' })
      .png({ quality: 100 })
      .toFile(outPath);
    console.log('Wrote', outPath);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
