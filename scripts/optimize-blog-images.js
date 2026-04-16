const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGE_ROOTS = [
  path.join(ROOT, 'public', 'images'),
  path.join(ROOT, 'public', 'posts', 'images'),
];
const RASTER_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const MAX_WIDTH = 1800;

const formatBytes = (value) => {
  if (value === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const scaled = value / 1024 ** unitIndex;
  return `${scaled.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

const walkFiles = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.name === '.optimized') continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(entryPath));
      continue;
    }

    results.push(entryPath);
  }

  return results;
};

const isRasterImage = (filePath) => RASTER_IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());

const getImageRootForPath = (sourcePath) => PUBLIC_IMAGE_ROOTS.find((root) => sourcePath.startsWith(root)) || null;

const toOptimizedOutputPath = (sourcePath) => {
  const imageRoot = getImageRootForPath(sourcePath);
  if (!imageRoot) return null;

  const optimizedRoot = path.join(imageRoot, '.optimized');
  const relativePath = path.relative(imageRoot, sourcePath);
  if (!relativePath || relativePath.startsWith('..')) return null;

  const optimizedRelativePath = relativePath.replace(/\.(png|jpe?g)$/i, '.webp');
  return path.join(optimizedRoot, optimizedRelativePath);
};

const optimizeImage = async (sourcePath) => {
  const outputPath = toOptimizedOutputPath(sourcePath);
  if (!outputPath) return null;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const originalBytes = fs.statSync(sourcePath).size;
  const image = sharp(sourcePath, { failOnError: false }).rotate();
  const metadata = await image.metadata();
  const transform = metadata.width && metadata.width > MAX_WIDTH
    ? image.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : image;

  const optimizedBuffer = await transform.webp({ quality: 82, effort: 6 }).toBuffer();
  fs.writeFileSync(outputPath, optimizedBuffer);

  return {
    sourcePath,
    outputPath,
    originalBytes,
    optimizedBytes: optimizedBuffer.length,
  };
};

const main = async () => {
  const sourceRoots = PUBLIC_IMAGE_ROOTS.filter((root) => fs.existsSync(root));
  if (sourceRoots.length === 0) {
    console.log('No blog images found to optimize.');
    return;
  }

  const sourceFiles = sourceRoots.flatMap((root) => walkFiles(root)).filter(isRasterImage);
  if (sourceFiles.length === 0) {
    console.log('No raster blog images found to optimize.');
    return;
  }

  const results = [];
  for (const sourceFile of sourceFiles) {
    results.push(await optimizeImage(sourceFile));
  }

  const totalOriginalBytes = results.reduce((sum, item) => sum + item.originalBytes, 0);
  const totalOptimizedBytes = results.reduce((sum, item) => sum + item.optimizedBytes, 0);
  const savedBytes = totalOriginalBytes - totalOptimizedBytes;
  const savedPercent = totalOriginalBytes > 0 ? (savedBytes / totalOriginalBytes) * 100 : 0;

  console.log(
    `Optimized ${results.length} public images to WebP: ${formatBytes(totalOriginalBytes)} -> ${formatBytes(totalOptimizedBytes)} (${formatBytes(savedBytes)} saved, ${savedPercent.toFixed(1)}%).`
  );
  const optimizedRoots = [...new Set(results.map((item) => path.relative(ROOT, path.dirname(item.outputPath))))];
  console.log(`Optimized files written under ${optimizedRoots.join(', ')}/`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});