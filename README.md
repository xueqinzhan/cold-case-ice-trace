# 冷案冰痕 · COLD CASE / ICE TRACE

《冷案冰痕》游戏产品介绍页。纯静态单页站点，无构建步骤：直接用浏览器打开 `web/index.html` 即可。

- 线上站点（Qoder Sites）：https://cold-case-ice-trace-3vc7kxkr9l0.qoder.zone
- GitHub Pages：https://xueqinzhan.github.io/cold-case-ice-trace/
- 推送到 `main` 后由 `.github/workflows/pages.yml` 自动部署 `web/`

## 内容说明

页面中的剧情、角色（沈砺 / 林晚 / 周叙）、玩法、平台与发售信息目前**均为占位草稿**，用于确认版式与视觉方向。拿到官方设定、美术、截图与发行信息后，应整体替换而非继续扩写。配图由 AI 生成，非游戏实际画面。

## 本地预览

```bash
python -m http.server 4173 --bind 127.0.0.1 --directory web
```

打开 http://127.0.0.1:4173/。

## 目录

```
web/                      站点源码（index.html / styles.css / app.js / assets）
marketing/xiaohongshu/    小红书发布配图（1080×1440）
marketing/qrcode/         站点二维码与品牌卡片，编码至 Qoder Sites 地址
vibe_images/              配图原始生成稿
.github/workflows/        GitHub Pages 部署工作流
```

## 实现要点

- 语义化 HTML + CSS 自定义属性，无框架、无第三方依赖
- 响应式布局（1024 / 900 / 860 / 760 / 560 断点），移动端抽屉导航
- IntersectionObserver 实现滚动显现与当前章节高亮
- 证据图灯箱：Esc / 方向键 / Tab 焦点陷阱
- Canvas 飘雪背景，遵循 `prefers-reduced-motion`
