# ZERORE / 零度重构 — Cloudflare Pages 静态站

这是一个可直接部署到 Cloudflare Pages 的**预渲染静态单页站**，无需前端框架、无需客户端渲染、首屏加载非常轻。

## 文件结构

- `index.html`：首页
- `styles.css`：样式文件
- `assets/`：品牌图、favicon、OG 图
- `404.html`：404 页面
- `_headers`：Cloudflare Pages 响应头
- `robots.txt`、`sitemap.xml`、`site.webmanifest`：基础站点文件

## 修改建议

### 1. 联系方式
当前按钮和邮箱使用的是：

```text
hello@zerore.ai
```

如果你们要换成正式邮箱，直接全局替换即可。

### 2. 文案位置
主要文案都在 `index.html`：

- 主标题：`把 Agent 变成真正可用的业务能力`
- 公司介绍：`ZERORE（零度重构）是一支 AI Native 团队...`
- 三个服务卡片：`场景洞察 / 产品定义 / 快速验证`
- 两个方向卡片：`Agent 化转型 / AI 原生孵化`

### 3. Logo / 分享图
`assets/og-cover.png` 已经生成，可直接用作社交分享封面。

## 部署方式

把这个压缩包内容解压后上传到 GitHub 仓库根目录即可。

这个项目是纯静态站，适合直接用于 Cloudflare Pages。
