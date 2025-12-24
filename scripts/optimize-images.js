/**
 * Image Optimization Script
 * Converts images to WebP format and creates optimized versions
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const INPUT_DIRS = [
  'src/images',
  'src/blog',
  'src/images/RussiaR',
  'src/images/Gemini',
  'src/images/Sam',
];

const OUTPUT_DIR = 'src/images/optimized';

const QUALITY = {
  webp: 80,
  jpeg: 85,
  png: 85,
};

const MAX_WIDTH = 1920;

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function getImageFiles(dir) {
  try {
    const files = await readdir(dir);
    return files.filter((file) => {
      const ext = extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
  } catch {
    return [];
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  const ext = extname(filename).toLowerCase();
  const name = basename(filename, ext);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate new dimensions if needed
    const width = metadata.width > MAX_WIDTH ? MAX_WIDTH : undefined;

    // Create WebP version
    const webpPath = join(outputDir, `${name}.webp`);
    await image
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY.webp })
      .toFile(webpPath);

    // Create optimized original format
    const optimizedPath = join(outputDir, filename);
    if (ext === '.png') {
      await image
        .resize({ width, withoutEnlargement: true })
        .png({ quality: QUALITY.png, compressionLevel: 9 })
        .toFile(optimizedPath);
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      await image
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(optimizedPath);
    }

    const originalStats = await stat(inputPath);
    const webpStats = await stat(webpPath);

    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

    console.log(
      `✓ ${filename}: ${(originalStats.size / 1024).toFixed(0)}KB → ${(webpStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`
    );

    return {
      original: originalStats.size,
      optimized: webpStats.size,
      savings: originalStats.size - webpStats.size,
    };
  } catch (error) {
    console.error(`✗ Failed to optimize ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Image Optimization Starting...\n');

  await ensureDir(OUTPUT_DIR);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let processedCount = 0;

  for (const inputDir of INPUT_DIRS) {
    if (!existsSync(inputDir)) {
      continue;
    }

    console.log(`\n📁 Processing: ${inputDir}`);

    const subOutputDir = join(OUTPUT_DIR, inputDir.replace('src/', ''));
    await ensureDir(subOutputDir);

    const files = await getImageFiles(inputDir);

    for (const file of files) {
      const inputPath = join(inputDir, file);
      const result = await optimizeImage(inputPath, subOutputDir, file);

      if (result) {
        totalOriginal += result.original;
        totalOptimized += result.optimized;
        processedCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Optimization Summary:');
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Original size:   ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Optimized size:  ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `   Total savings:   ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`
  );
  console.log('='.repeat(50));
}

main().catch(console.error);
