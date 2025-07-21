# 🚀 BlogCollector

**BlogCollector** is a naive AI/Tech blog aggregator that supports **RSS feeds + web scraping**, perfect for personal knowledge tracking and information monitoring.

<p align="center">
  <img src="https://img.shields.io/badge/Node-18%2B-brightgreen"/>
  <img src="https://img.shields.io/badge/License-MIT-blue"/>
  <img src="https://img.shields.io/badge/PRs-welcome-orange"/>
</p>

---

## 📑 Table of Contents

- [🚀 BlogCollector](#-blogcollector)
  - [📑 Table of Contents](#-table-of-contents)
  - [Features](#features)
  - [Quick Start](#quick-start)
    - [1. Clone the repo](#1-clone-the-repo)
    - [2. Start the backend](#2-start-the-backend)
    - [3. Preview the frontend locally](#3-preview-the-frontend-locally)
  - [Project Structure](#project-structure)
  - [Add / Modify Data Sources](#add--modify-data-sources)
    - [1. RSS sources](#1-rss-sources)
    - [2. Scraping targets](#2-scraping-targets)
  - [FAQ](#faq)
  - [Contributing \& License](#contributing--license)

---

## Features

- ✅ **Multiple sources**: RSS / Atom feeds & any webpage via custom CSS selectors
- ✅ **Category & filter**: Organization / Individual, one-click filtering + search

---

## Quick Start

### 1. Clone the repo

```bash
$ git clone https://github.com/<yourname>/BlogCollector.git
$ cd BlogCollector
```

### 2. Start the backend

```bash
$ cd backend
$ npm install
$ npm start     # default PORT=3000, can be overridden
```

### 3. Preview the frontend locally

```bash
$ cd ../frontend
# any static server works; two common options:
$ npx serve .          # requires the serve package
# or
$ python3 -m http.server 8080
```
Then visit `http://localhost:8080` (or the URL printed by *serve*).

> 💡 VS Code users can also install **Live Server** and choose *Open with Live Server*.

---

## Project Structure

```text
BlogCollector/
├─ backend/            # Node.js / Express backend
│  ├─ server.js        # entry file
│  └─ ...
├─ frontend/           # static frontend
│  ├─ index.html
│  ├─ script.js
│  └─ style.css
└─ README.md
```

---

## Add / Modify Data Sources

### 1. RSS sources

Append entries to the `rssSources` array in `backend/server.js`:

```js
const rssSources = [
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', category: 'organization' },
  // new source
  { name: 'Example Blog', url: 'https://example.com/rss.xml', category: 'individual' },
];
```

### 2. Scraping targets

Append entries to the `scrapingTargets` array in `server.js`:

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
  // new source example
  {
    name: 'Karpathy',
    url: 'https://karpathy.bearblog.dev/blog/',
    category: 'individual',
    selectors: {
      articleContainer: 'ul.blog-posts li',
      title: 'a',
      link: 'a',
      description: '',      // this site has no summary
      time: 'time',
    },
  },
];
```

> After editing sources, restart the backend:
>
> ```bash
> $ cd backend && npm restart
> ```

---

## FAQ

| Issue       | Solution                                                        |
| ----------- | --------------------------------------------------------------- |
| Port in use | Change the `PORT` env var or free port 3000                     |
| CORS error  | CORS is enabled globally; update the whitelist if you set a CDN |
| Scrape fail | Check anti-bot measures & verify your CSS selectors             |

---

## Contributing & License

- Pull requests, issues and stars are welcome! 🌟
- Released under the **MIT License** — free for personal & commercial use.