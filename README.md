# 🚀 BlogCollector

**BlogCollector** 是一个naive版本的 AI/Tech 博客聚合器，支持 **RSS 订阅 + 网页爬取**，适合个人知识管理与信息流监控。

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
  - [常见问题](#常见问题)
  - [贡献与许可](#贡献与许可)

---

## 功能特性

- ✅ **多源支持**：RSS / Atom、任意网页（自定义 CSS 选择器）
- ✅ **分类 & 筛选**：Organization / Individual，一键过滤+搜索

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