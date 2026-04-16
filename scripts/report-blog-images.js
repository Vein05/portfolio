const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGE_ROOTS = [
  path.join(ROOT, 'public', 'images'),
  path.join(ROOT, 'public', 'posts', 'images'),
];
const BUILD_REPORT_JSON = path.join(ROOT, 'build', 'blog-image-report.json');
const BUILD_REPORT_MD = path.join(ROOT, 'build', 'blog-image-report.md');
const RASTER_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

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

const toOptimizedPath = (sourcePath) => {
  const imageRoot = getImageRootForPath(sourcePath);
  if (!imageRoot) return null;

  const optimizedRoot = path.join(imageRoot, '.optimized');
  const relativePath = path.relative(imageRoot, sourcePath);
  if (!relativePath || relativePath.startsWith('..')) return null;

  return path.join(optimizedRoot, relativePath.replace(/\.(png|jpe?g)$/i, '.webp'));
};

const createReport = () => {
  const sourceRoots = PUBLIC_IMAGE_ROOTS.filter((root) => fs.existsSync(root));
  if (sourceRoots.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      originalCount: 0,
      optimizedCount: 0,
      originalBytes: 0,
      optimizedBytes: 0,
      savedBytes: 0,
      savedPercent: 0,
      images: [],
    };
  }

  const sourceFiles = sourceRoots.flatMap((root) => walkFiles(root)).filter(isRasterImage);
  const images = sourceFiles.map((sourcePath) => {
    const optimizedPath = toOptimizedPath(sourcePath);
    const originalBytes = fs.statSync(sourcePath).size;
    const optimizedBytes = optimizedPath && fs.existsSync(optimizedPath) ? fs.statSync(optimizedPath).size : 0;

    return {
      source: path.relative(ROOT, sourcePath),
      optimized: optimizedPath ? path.relative(ROOT, optimizedPath) : null,
      originalBytes,
      optimizedBytes,
      savedBytes: Math.max(originalBytes - optimizedBytes, 0),
    };
  });

  const originalBytes = images.reduce((sum, image) => sum + image.originalBytes, 0);
  const optimizedBytes = images.reduce((sum, image) => sum + image.optimizedBytes, 0);
  const savedBytes = originalBytes - optimizedBytes;
  const savedPercent = originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0;

  return {
    generatedAt: new Date().toISOString(),
    originalCount: images.length,
    optimizedCount: images.filter((image) => image.optimizedBytes > 0).length,
    originalBytes,
    optimizedBytes,
    savedBytes,
    savedPercent,
    images: images.sort((left, right) => right.savedBytes - left.savedBytes),
  };
};

const writeReportFiles = (report) => {
  fs.mkdirSync(path.dirname(BUILD_REPORT_JSON), { recursive: true });

  fs.writeFileSync(BUILD_REPORT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const topSavings = report.images.slice(0, 5);
  const markdown = [
    '# Site Image Optimization Report',
    '',
    `Generated: ${report.generatedAt}`,
    `Original raster images: ${report.originalCount}`,
    `Optimized images: ${report.optimizedCount}`,
    `Original total: ${formatBytes(report.originalBytes)}`,
    `Optimized total: ${formatBytes(report.optimizedBytes)}`,
    `Saved: ${formatBytes(report.savedBytes)} (${report.savedPercent.toFixed(1)}%)`,
    '',
    '## Biggest savings',
    '',
    '| Image | Original | Optimized | Saved |',
    '| --- | ---: | ---: | ---: |',
    ...topSavings.map((image) => `| ${image.source} | ${formatBytes(image.originalBytes)} | ${formatBytes(image.optimizedBytes)} | ${formatBytes(image.savedBytes)} |`),
    '',
  ].join('\n');

  fs.writeFileSync(BUILD_REPORT_MD, markdown, 'utf8');
};

const main = () => {
  const report = createReport();
  writeReportFiles(report);

  console.log(
    `Site image report: ${formatBytes(report.originalBytes)} -> ${formatBytes(report.optimizedBytes)} (${formatBytes(report.savedBytes)} saved, ${report.savedPercent.toFixed(1)}%).`
  );
  console.log(`Report written to ${path.relative(ROOT, BUILD_REPORT_JSON)} and ${path.relative(ROOT, BUILD_REPORT_MD)}`);
};

main();