# 🚀 BlogCollector

**BlogCollector** 是一个开箱即用的 AI/Tech 博客聚合器，支持 **RSS 订阅 + 网页爬取**，前端美观易用，后端易于扩展，自部署成本低，适合个人知识管理与信息流监控。

<p align="center">
  <img src="https://img.shields.io/badge/Node-18%2B-brightgreen"/>
  <img src="https://img.shields.io/badge/License-MIT-blue"/>
  <img src="https://img.shields.io/badge/PRs-welcome-orange"/>
</p>

---

## 📑 目录

- [🚀 BlogCollector](#-blogcollector)
  - [📑 目录](#-目录)
  - [功能特性](#功能特性)
  - [快速启动](#快速启动)
    - [1. 克隆项目](#1-克隆项目)
    - [2. 启动后端](#2-启动后端)
    - [3. 启动前端（本地预览）](#3-启动前端本地预览)
  - [目录结构](#目录结构)
  - [添加 / 修改数据源](#添加--修改数据源)
    - [1. RSS 源](#1-rss-源)
    - [2. 网页爬取源](#2-网页爬取源)
  - [部署到云端](#部署到云端)
    - [Render（后端）](#render后端)
    - [GitHub Pages（前端）](#github-pages前端)
  - [常见问题](#常见问题)
  - [贡献与许可](#贡献与许可)

---

## 功能特性

- ✅ **多源支持**：RSS / Atom、任意网页（自定义 CSS 选择器）
- ✅ **分类 & 筛选**：Organization / Individual，一键过滤
- ✅ **一键刷新**：手动刷新或定时抓取（可拓展）
- ✅ **零依赖前端**：纯静态文件，可直接托管至 GitHub Pages / Vercel
- ✅ **可扩展后端**：Express + Cheerio，轻松添加新源
- ✅ **跨域无忧**：内置 CORS 支持，前后端分离部署零配置

---

## 快速启动

### 1. 克隆项目

```bash
$ git clone https://github.com/<yourname>/BlogCollector.git
$ cd BlogCollector
```

### 2. 启动后端

```bash
$ cd backend
$ npm install
$ npm start     # 默认 PORT=3000，也可自定义
```

### 3. 启动前端（本地预览）

```bash
$ cd ../frontend
# 任意静态服务器皆可，这里展示两种：
$ npx serve .          # 需先全局安装 serve
# 或
$ python3 -m http.server 8080
```
然后浏览器访问 `http://localhost:8080`（或 serve 输出的地址）。

> 💡 VS Code 用户亦可安装 *Live Server* 插件右键 **Open with Live Server**。

---

## 目录结构

```text
BlogCollector/
├─ backend/            # Node.js / Express 后端
│  ├─ server.js        # 主入口
│  └─ ...
├─ frontend/           # 纯静态前端
│  ├─ index.html
│  ├─ script.js
│  └─ style.css
└─ README.md
```

---

## 添加 / 修改数据源

### 1. RSS 源

在 `backend/server.js` 的 `rssSources` 数组追加：

```js
const rssSources = [
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', category: 'organization' },
  // 新增源
  { name: 'Example Blog', url: 'https://example.com/rss.xml', category: 'individual' },
];
```

### 2. 网页爬取源

在 `server.js` 的 `scrapingTargets` 数组追加：

```js
const scrapingTargets = [
  {
    name: 'Lilian Weng',
    url: 'https://lilianweng.github.io/',
    category: 'individual',
    selectors: {
      articleContainer: 'article.post-entry',
      title: '.entry-header h2',
      link: 'a.entry-link',
      description: 'section.entry-content p',
      time: 'footer.entry-footer',
    },
  },
  // 新增源示例
  {
    name: 'Karpathy',
    url: 'https://karpathy.bearblog.dev/blog/',
    category: 'individual',
    selectors: {
      articleContainer: 'ul.blog-posts li',
      title: 'a',
      link: 'a',
      description: '',      // 此站点无摘要，可留空
      time: 'time',
    },
  },
];
```

> 修改完毕后需重启后端：
>
> ```bash
> $ cd backend && npm restart
> ```

---

## 部署到云端

### Render（后端）

1. GitHub 推送代码，确保 `backend/` 包含 `package.json`、`server.js`。
2. 登陆 [Render](https://render.com/)，**New ▶ Web Service**。
3. 选择仓库，设置 **Root Directory** 为 `backend`，Build Command `npm install`，Start Command `npm start`。
4. 创建服务，几分钟后获得形如 `https://blogcollector-backend.onrender.com` 的域名。

### GitHub Pages（前端）

1. 将 `frontend/` 的静态文件推送到仓库的 `gh-pages` 分支或 `/frontend` 目录。
2. 在仓库 **Settings ▶ Pages** 选择发布源。
3. 修改 `frontend/script.js` 中的 `API_BASE_URL` 指向 Render 后端地址。

更多部署细节可查阅官方文档或本仓库 issue 区。

---

## 常见问题

| 问题      | 解决方案                                               |
| --------- | ------------------------------------------------------ |
| 端口占用  | 更换 `PORT` 环境变量或释放 3000 端口                   |
| CORS 报错 | 已全局启用 `cors` 中间件；若自定义域名需同步更新白名单 |
| 抓取失败  | 检查目标站点是否反爬 / selectors 是否准确              |

---

## 贡献与许可

- 欢迎 **Fork / PR / Issue / Star** 🌟
- 本项目基于 **MIT License** 开源，商业或个人皆可自由使用与修改。