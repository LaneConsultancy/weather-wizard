/**
 * Image Optimization Script
 * Converts large PNG images to optimized WebP format
 * Reduces file sizes from 6+ MB to ~200-500 KB
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Images to convert (large PNGs)
const imagesToConvert = [
  'chimney.png',
  'fascias-soffits.png',
  'flat-roofing.png',
  'guttering.png',
  'hero.png',
  'roof-repairs.png',
];

async function optimizeImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  const outputFilename = filename.replace('.png', '.webp');
  const outputPath = path.join(imagesDir, outputFilename);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${filename} (not found)`);
    return;
  }

  try {
    const info = await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = info.size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✅ ${filename} -> ${outputFilename}`);
    console.log(`   ${(inputSize / 1024 / 1024).toFixed(2)} MB -> ${(outputSize / 1024 / 1024).toFixed(2)} MB (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

async function optimizeLogo() {
  const logoPath = path.join(__dirname, '../public/weather-wizard-logo-no-bg.png');
  const outputPath = path.join(__dirname, '../public/weather-wizard-logo-no-bg.webp');

  if (!fs.existsSync(logoPath)) {
    console.log('⚠️  Logo not found, skipping');
    return;
  }

  try {
    const info = await sharp(logoPath)
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);

    const inputSize = fs.statSync(logoPath).size;
    const outputSize = info.size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✅ Logo optimized`);
    console.log(`   ${(inputSize / 1024).toFixed(2)} KB -> ${(outputSize / 1024).toFixed(2)} KB (${savings}% smaller)`);
  } catch (error) {
    console.error('❌ Error optimizing logo:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  // Convert service images
  for (const image of imagesToConvert) {
    await optimizeImage(image);
  }

  // Optimize logo
  console.log('\n📋 Optimizing logo...');
  await optimizeLogo();

  console.log('\n✨ Optimization complete!');
}

main().catch(console.error);
