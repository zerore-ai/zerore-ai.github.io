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
- Scroll warp：所有带 `data-warp` 的大标题会在滚动时轻微 `skewY` + `translateY`
- Cursor follower：鼠标跟随小圆点，hover 可交互元素时放大并变亮
- Marquee：keyframes 线性滚动
- Aurora：分散的彩色高斯模糊圆，滚动时带视差

## 修改建议

### 1. 团队照片

最新版本已直接引用真实照片，全部放在 `assets/team/` 下。
若要替换某一位的肖像：保留同名 jpg 覆盖即可。

### 2. 联系邮箱

所有 `mailto:` 指向 `yanghaoran1118@gmail.com`。如有企业邮箱，全局替换即可。

### 3. 文案定位

所有文案都在 `index.html` 里，按 section 顺序排列。每段文案双语对照，改的时候两份一起改。

### 4. 加新项目（不只是 Zeval）

`#projects` 里用 `<article class="project">` 再加一块即可。可以参考 `.project--coming` 的样式，或完整复制 Zeval 的 project 结构（head + layers + showcase + thesis）来搭建新的项目段。

## 部署

纯静态 —— 把目录内容推送到 GitHub 仓库根目录即可，Cloudflare Pages / GitHub Pages 均可。
