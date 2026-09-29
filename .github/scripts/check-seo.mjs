import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const canonicalOrigin = "https://zerore.ai";
const files = (await readdir(root)).filter((name) => name.endsWith(".html"));
const publicPages = files.filter((name) => name !== "404.html").sort();
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const pageSources = new Map();
for (const filename of files) {
  pageSources.set(filename, await readFile(join(root, filename), "utf8"));
}

for (const filename of publicPages) {
  const source = pageSources.get(filename);
  const url = filename === "index.html" ? `${canonicalOrigin}/` : `${canonicalOrigin}/${filename}`;
  for (const marker of [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    '<meta property="og:image"',
    '<meta name="twitter:card"',
  ]) {
    check(source.includes(marker), `${filename}: 缺少 ${marker}`);
  }
  check(
    /<meta\b(?=[^>]*\bname="description")[^>]*>/s.test(source),
    `${filename}: 缺少 meta description`,
  );
  check((source.match(/<h1\b/g) ?? []).length === 1, `${filename}: 需要一个 H1`);
  for (const match of source.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      check(false, `${filename}: JSON-LD 无法解析`);
    }
  }
}

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = publicPages.map((filename) =>
  filename === "index.html" ? `${canonicalOrigin}/` : `${canonicalOrigin}/${filename}`,
);
check(
  JSON.stringify([...sitemapUrls].sort()) === JSON.stringify([...expectedUrls].sort()),
  `站点地图应包含全部公开页面且仅包含一次：${expectedUrls.join(", ")}`,
);

for (const filename of files) {
  const source = pageSources.get(filename);
  for (const match of source.matchAll(/href="([^"#]+)#([^"?]+)"/g)) {
    const [, target, fragment] = match;
    if (/^[a-z]+:/i.test(target)) continue;
    const targetFile = target.split("/").at(-1);
    const targetSource = pageSources.get(targetFile);
    check(
      targetSource?.includes(`id="${fragment}"`),
      `${filename}: ${target}#${fragment} 的锚点不存在`,
    );
  }
}

const cover = join(root, "assets/og-cover.png");
check((await stat(cover).catch(() => null))?.size > 0, "缺少分享封面 assets/og-cover.png");
check(pageSources.get("404.html").includes('<base href="/">'), "404 页深层路径资源基准错误");

const home = pageSources.get("index.html");
check(
  home.includes('<link rel="icon" type="image/png" sizes="512x512" href="/assets/favicon-512.png">'),
  "首页未声明可供搜索结果使用的大尺寸品牌图标",
);
check((home.match(/<link\s+rel="icon"/g) ?? []).length === 1, "首页应只声明一个搜索图标");
const largeIcon = await readFile(join(root, "assets/favicon-512.png"));
check(
  largeIcon.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    largeIcon.readUInt32BE(16) === largeIcon.readUInt32BE(20) &&
    largeIcon.readUInt32BE(16) > 48,
  "搜索图标应为大于 48px 的方形 PNG",
);
const favicon = await readFile(join(root, "favicon.ico")).catch(() => Buffer.alloc(0));
check(favicon.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0])), "根目录缺少有效 favicon.ico");

assert.deepEqual(errors, [], errors.join("\n"));
console.log(`SEO 检查通过：${publicPages.length} 个公开页面、${sitemapUrls.length} 个站点地图 URL`);
