import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const entries = await readdir(repositoryRoot, { withFileTypes: true });
const htmlFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name)
  .sort();

const footerFiles = [];
for (const filename of htmlFiles) {
  const source = await readFile(resolve(repositoryRoot, filename), "utf8");
  if (!source.includes("<footer")) {
    continue;
  }

  footerFiles.push(filename);
  const links = source.match(/<a\s+class="foot__icp"[\s\S]*?<\/a>/g) ?? [];
  assert.equal(links.length, 1, `${filename} 必须且只能包含一个备案链接`);
  assert.match(links[0], /href="https:\/\/beian\.miit\.gov\.cn\/"/);
  assert.match(links[0], /target="_blank"/);
  assert.match(links[0], /rel="noopener noreferrer"/);
  assert.match(links[0], />沪ICP备2026044789号<\/a>/);
}

assert.deepEqual(footerFiles, htmlFiles, "每个 HTML 页面都必须包含页脚备案信息");

const styles = await readFile(resolve(repositoryRoot, "styles.css"), "utf8");
assert.match(styles, /\.foot__icp\s*\{/);
assert.match(styles, /\.foot__icp:hover/);

console.log(`ICP备案检查通过：${footerFiles.length} 个页脚页面`);
