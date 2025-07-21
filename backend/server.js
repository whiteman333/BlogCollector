// 引入必要的库
const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser'); // 用于解析RSS
const axios = require('axios');
const cheerio = require('cheerio');

// 初始化
const app = express();
const parser = new Parser();
const PORT = 3000; // 后端服务器运行的端口

// 中间件
app.use(cors()); // 允许所有来源的前端访问

// --- 数据源定义 (统一在后端管理) ---
const rssSources = [
    { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', category: 'organization' },
    { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml', category: 'organization' },
    { name: 'The Gradient', url: 'https://thegradient.pub/rss/', category: 'organization' },
];

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
        }
    },
    {
        name: 'Andrej Karpathy',
        url: 'https://karpathy.bearblog.dev/blog/',
        category: 'individual',
        selectors: {
            articleContainer: 'ul.blog-posts li',
            title: 'a',
            link: 'a',
            description: '',
            time: 'time',
        }
    },
];
// --- 数据源定义结束 ---


// --- 后端核心抓取逻辑 ---

// [类型1] 获取并解析 RSS 源
const fetchRssFeed = async (source) => {
    try {
        console.log(`[RSS] 开始获取: ${source.name}`);
        const feed = await parser.parseURL(source.url);
        return feed.items.map(item => ({
            title: item.title || '无标题',
            link: item.link || '#',
            info: new Date(item.pubDate).toLocaleDateString(),
            sourceName: source.name,
            description: (item.contentSnippet || item.content || '').substring(0, 150) + '...'
        }));
    } catch (error) {
        console.error(`[RSS] 获取失败: ${source.name}`, error.message);
        return [];
    }
};

// [类型2] 使用网页抓取来获取文章
const fetchScrapedFeed = async (target) => {
    try {
        console.log(`[Scrape] 开始获取: ${target.name}`);
        const { data } = await axios.get(target.url);
        const $ = cheerio.load(data);
        const articles = [];

        $(target.selectors.articleContainer).each((i, el) => {
            const title = $(el).find(target.selectors.title).text().trim();
            let link = $(el).find(target.selectors.link).attr('href') || '#';
            if (link.startsWith('/')) {
                link = new URL(link, target.url).href;
            }
            const description = $(el).find(target.selectors.description).text().trim().substring(0, 150) + '...';
            const time = $(el).find(target.selectors.time).text().trim();
            articles.push({
                title,
                link,
                info: time,
                sourceName: target.name,
                description
            });
        });
        // if (articles.length == 0) {
        //     console.log(data);
        // }
        // else {
        //     console.log(articles);
        // }
        return articles;
    } catch (error) {
        console.error(`[Scrape] 获取失败: ${target.name}`, error.message);
        return [];
    }
};


// --- API 路由 ---

// [更新] /api/articles 现在获取并返回所有类型的文章
app.get('/api/articles', async (req, res) => {
    console.log("收到获取所有文章的请求...");

    const rssPromises = rssSources.map(fetchRssFeed);
    const scrapePromises = scrapingTargets.map(fetchScrapedFeed);

    const allPromises = [...rssPromises, ...scrapePromises];
    const results = await Promise.allSettled(allPromises);

    let allArticles = [];
    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
            allArticles = allArticles.concat(result.value);
        }
    });

    // 按日期排序
    allArticles.sort((a, b) => b.info - a.info);

    console.log(`请求处理完毕，共返回 ${allArticles.length} 篇文章。`);
    res.json(allArticles);
});

// /api/sources 端点保持不变，用于告诉前端有哪些源
app.get('/api/sources', (req, res) => {
    const sources = [
        ...rssSources.map(s => ({ name: s.name, category: s.category })),
        ...scrapingTargets.map(s => ({ name: s.name, category: s.category }))
    ];
    res.json(sources);
});


// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`后端服务器正在 http://localhost:${PORT} 上运行`);
});
