# ZERORE · 零度重构 — Landing Site

静态单页站，Cloudflare Pages / GitHub Pages 直接部署。

AndAgain-inspired visual system · dark-first · bilingual (EN / 中).

## 文件结构

- `index.html` — 单页主站（Hero / Culture / Projects / Team / Join）
- `styles.css` — 主样式文件
- `404.html` — 404 页面
- `assets/` — 品牌图、favicon、OG 图、团队照片
  - `assets/team/` — 团队肖像：`roger-yang.jpg`、`weiwei-zhang.jpg`、`zhang-ziwen.jpg`、`jiang-hangze.jpg`、`huang-xiaoyan.jpg`、`cai-chang.jpg`、`ji-xingchen.jpg`
- `_headers` — Cloudflare Pages 响应头
- `robots.txt` · `sitemap.xml` · `site.webmanifest`

## 页面结构

1. **Hero**（深色）— ZERORE 品牌主张 · 页面 load 有字幕幕布动画 + 单词上浮
2. **Culture**（深色）— 4 个文化支柱 + 宣言卡片；左侧 sticky rail `01 · CULTURE`
3. **Projects**（更深黑）— 总标题 "What we're building"；Zeval 作为 FLAGSHIP · 01 展开，含四层架构、loop 可视化、4 项 stats、4 个核心判断；底部留了 `IN INCUBATION` 占位供未来新项目
4. **Team**（深色）— 5 位 Co-founder + 2 位 Advisor（蔡畅 / 季星辰）
5. **Join**（更深黑）— 招募 CMO，加一个 "Open Conversation" 弹性位

## 双语系统

- `<html data-lang="en|zh">` 决定可见语言；用 `localStorage['zerore-lang']` 持久化
- 每段双语文案用 `<span lang="en">...</span><span lang="zh">...</span>` 双份写
- CSS：`html[data-lang="en"] [lang="zh"] { display: none }` 及反向
- Nav 右侧 `EN / 中` 按钮点击切换

### 添加新文案时

只需要给每段双语写两份：

```html
<p>
  <span lang="en">English copy.</span>
  <span lang="zh">中文文案。</span>
</p>
```

## 动效要点

- Page-load curtain：`body.is-loaded` 驱动幕布上滑
- Hero title 单词上浮：`.hero__line .word` + `@keyframes heroRise`
- 滚动触发显影：`.reveal` + IntersectionObserver
- Cursor follower：鼠标跟随小圆点，hover 可交互元素时放大并变亮
- Marquee：keyframes 线性滚动
- Aurora：分散的彩色高斯模糊圆，滚动时带视差

## 修改建议

### 1. 团队照片

最新版本已直接引用真实照片，全部放在 `assets/team/` 下。
若要替换某一位的肖像：保留同名 jpg 覆盖即可。

### 2. 联系邮箱

所有 `mailto:` 指向 `roger@zerore.ai`。如有企业邮箱，全局替换即可。

### 3. 文案定位

所有文案都在 `index.html` 里，按 section 顺序排列。每段文案双语对照，改的时候两份一起改。

### 4. 加新项目（不只是 Zeval）

`#projects` 里用 `<article class="project">` 再加一块即可。可以参考 `.project--coming` 的样式，或完整复制 Zeval 的 project 结构（head + layers + showcase + thesis）来搭建新的项目段。

## 部署

纯静态 —— 把目录内容推送到 GitHub 仓库根目录即可，Cloudflare Pages / GitHub Pages 均可。
上海镜像站的 Nginx 配置样本位于 `ops/nginx-zerore-cn.conf`；发布时只同步公开站点
文件到 `/home/ubuntu/1.zerore-ai/public`，不要把 `.git`、`.github`、`ops`、`README.md`
或 `CNAME` 暴露为 Web 文件，并保留源站独立的 `/speedtest/`。
同步时设置目录 `0755`、文件 `0644`（例如 `rsync --chmod=D755,F644`）；新增图片
可能继承生成工具的 `0600` 权限，导致 Nginx 返回 403。发布后用公网请求检查新资源。

## 搜索与分享维护

- `zerore.ai` 是公开页面的规范域名；`.cn` 部署同内容时沿用 `.ai` 的 canonical。
- 新增公开 HTML 页面时，同时添加唯一的 title、description、canonical、OG/Twitter
  元信息，加入 `sitemap.xml`，并从相关页面给出可见入口。404 页面不要加入站点地图。
- 分享封面位于 `assets/og-cover.png`。修改外部统计或研究结论时，页面上保留
  可核查的原始来源，并准确描述样本与结论。
- `robots.txt` 保持公开页面可抓取；不依赖 `llms.txt` 等特殊文件获得 AI 搜索收录。
- 运行 `node .github/scripts/check-seo.mjs` 校验页面、站点地图、链接与分享图。
- 当前中文由同一页面切换显示；若需要独立中文搜索入口，应另建中文 URL，并同步
  设计导航、canonical 与 `hreflang`，不能直接给同一个 URL 标注两种独立语言。
