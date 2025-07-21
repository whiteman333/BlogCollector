document.addEventListener('DOMContentLoaded', () => {
    
    // 后端API的地址
    const API_BASE_URL = 'http://localhost:3000/api';

    // 获取 DOM 元素
    const articleContainer = document.getElementById('article-container');
    const filterList = document.getElementById('filter-list');
    const orgSourceList = document.getElementById('organization-source-list');
    const indSourceList = document.getElementById('individual-source-list');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const errorDetails = document.querySelector('#error-message p');
    const refreshButton = document.getElementById('refresh-button');

    let allArticles = [];

    /**
     * 将文章渲染到 DOM.
     */
    const renderArticles = (articles) => {
        articleContainer.innerHTML = '';
        if (articles.length === 0 && loadingIndicator.style.display === 'none') {
            articleContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">未找到任何文章。</p>`;
        } else {
            articles.forEach(article => {
                const info = article.info;
                const articleEl = document.createElement('div');
                articleEl.className = 'article-card';
                
                articleEl.innerHTML = `
                    <div class="p-6">
                        <p class="text-sm text-indigo-500 font-semibold mb-2">${article.sourceName}</p>
                        <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">
                            <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 transition-colors duration-200">${article.title}</a>
                        </h3>
                        <p class="text-gray-600 text-sm mb-4 leading-relaxed">${article.description}</p>
                        <p class="text-xs text-gray-400">${info}</p>
                    </div>
                `;
                articleContainer.appendChild(articleEl);
            });
        }
    };
    
    /**
     * 根据从后端获取的源列表填充侧边栏.
     */
    const populateSidebar = (sources) => {
        filterList.innerHTML = '';
        orgSourceList.innerHTML = '';
        indSourceList.innerHTML = '';

        const allButton = document.createElement('li');
        allButton.innerHTML = `<button class="w-full text-left px-4 py-2 rounded-md font-medium">所有源</button>`;
        allButton.querySelector('button').addEventListener('click', (e) => filterBySource('All Feeds', e.currentTarget));
        filterList.appendChild(allButton);

        sources.forEach(source => {
            const sourceButton = document.createElement('li');
            sourceButton.innerHTML = `<button class="w-full text-left px-4 py-2 rounded-md font-medium">${source.name}</button>`;
            sourceButton.querySelector('button').addEventListener('click', (e) => filterBySource(source.name, e.currentTarget));
            
            if (source.category === 'organization') {
                orgSourceList.appendChild(sourceButton);
            } else if (source.category === 'individual') {
                indSourceList.appendChild(sourceButton);
            }
        });
    };

    /**
     * 根据信息源名称过滤显示的文章.
     */
    const filterBySource = (sourceName, clickedButton) => {
        document.querySelectorAll('aside button').forEach(btn => {
            btn.classList.remove('active');
});
        clickedButton.classList.add('active');

        const filteredArticles = (sourceName === 'All Feeds')
            ? allArticles
            : allArticles.filter(article => article.sourceName === sourceName);
        renderArticles(filteredArticles);
    };

    /**
     * 核心的数据获取与渲染逻辑 (纯后端模式)
     */
    const fetchAndRender = async () => {
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        articleContainer.innerHTML = '';

        try {
            // 1. 从后端获取所有源的配置来填充侧边栏
            // (仅在首次加载时或需要时)
            if (filterList.children.length === 0) {
                 const sourcesResponse = await fetch(`${API_BASE_URL}/sources`);
                 if (!sourcesResponse.ok) throw new Error('无法获取源配置');
                 const allSourceConfigs = await sourcesResponse.json();
                 populateSidebar(allSourceConfigs);
            }

            // 2. 从后端获取所有文章
            const articlesResponse = await fetch(`${API_BASE_URL}/articles`);
            if (!articlesResponse.ok) throw new Error('无法从后端获取文章列表');
            
            allArticles = await articlesResponse.json();
            loadingIndicator.style.display = 'none';

            if (allArticles.length === 0) {
                 errorDetails.textContent = "后端成功响应，但未能获取到任何文章。";
                 errorMessage.style.display = 'flex';
                 return;
            }
            
            // 默认选中 "所有源" 并渲染
            filterBySource('All Feeds', filterList.querySelector('button'));

        } catch (error) {
            console.error("获取数据失败:", error);
            loadingIndicator.style.display = 'none';
            errorDetails.textContent = `获取数据失败，请确保后端服务器正在运行。错误: ${error.message}`;
            errorMessage.style.display = 'flex';
        }
    };

    const init = () => {
        refreshButton.addEventListener('click', fetchAndRender);
        fetchAndRender(); // 初始加载
    };

    init();
});
