const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE_URL = "https://sugampanthi.com.np";
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "src", "data", "posts.js");
const PUBLIC_SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const BUILD_SITEMAP = path.join(ROOT, "build", "sitemap.xml");

const safeRead = (filePath) => fs.readFileSync(filePath, "utf8");

const loadPosts = () => {
  const src = safeRead(DATA_FILE);
  const transformed = src.replace("export const posts =", "module.exports =");
  const sandbox = { module: { exports: [] }, exports: {} };
  vm.runInNewContext(transformed, sandbox, { filename: "posts.js" });
  return Array.isArray(sandbox.module.exports) ? sandbox.module.exports : [];
};

const toIsoDate = (dateValue) => {
  if (!dateValue) return new Date().toISOString().slice(0, 10);
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
};

const xmlEscape = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
};

const posts = loadPosts();
const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { loc: `${SITE_URL}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: "daily", priority: "0.9" },
];

const postUrls = posts
  .filter((post) => post && post.slug)
  .map((post) => ({
    loc: `${SITE_URL}${post.canonicalPath || `/blog/${post.slug}`}`,
    lastmod: toIsoDate(post.date),
    changefreq: "monthly",
    priority: "0.8",
  }));

const urls = uniqueBy([...staticUrls, ...postUrls], (item) => item.loc);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${xmlEscape(url.lastmod)}</lastmod>
    <changefreq>${xmlEscape(url.changefreq)}</changefreq>
    <priority>${xmlEscape(url.priority)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.mkdirSync(path.dirname(PUBLIC_SITEMAP), { recursive: true });
fs.writeFileSync(PUBLIC_SITEMAP, xml, "utf8");

if (fs.existsSync(path.join(ROOT, "build"))) {
  fs.mkdirSync(path.dirname(BUILD_SITEMAP), { recursive: true });
  fs.writeFileSync(BUILD_SITEMAP, xml, "utf8");
}

console.log(`Sitemap generated with ${urls.length} URLs.`);
