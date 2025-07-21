document.addEventListener('DOMContentLoaded', () => {

    // 后端API的地址
    // const API_BASE_URL = 'http://localhost:3000/api';
    const API_BASE_URL = 'https://blogcollector.onrender.com/api';
    
    // 获取 DOM 元素
    const articleContainer = document.getElementById('article-container');
    const filterList = document.getElementById('filter-list');
    const orgSourceList = document.getElementById('organization-source-list');
    const indSourceList = document.getElementById('individual-source-list');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const errorDetails = document.querySelector('#error-message p');
    const refreshButton = document.getElementById('refresh-button');
    const searchInput = document.getElementById('search-input'); // [新增] 获取搜索框

    let allArticles = []; // 存储从后端获取的所有文章的原始列表

    /**
     * 将文章渲染到 DOM.
     */
    const renderArticles = (articles) => {
        articleContainer.innerHTML = '';
        if (articles.length === 0) {
            articleContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">No articles found matching your criteria.</p>`;
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
     * [新增] 核心过滤和渲染函数
     * 根据当前的侧边栏选择和搜索框内容来过滤和显示文章
     */
    const applyFilters = () => {
        const sourceFilterButton = document.querySelector('aside button.active');
        const sourceName = sourceFilterButton ? sourceFilterButton.textContent : 'All Feeds';
        const searchTerm = searchInput.value.toLowerCase();

        let filteredArticles = allArticles;

        // 1. 应用来源过滤器
        if (sourceName !== '所有源') {
            filteredArticles = filteredArticles.filter(article => article.sourceName === sourceName);
        }

        // 2. 应用关键词搜索过滤器
        if (searchTerm) {
            filteredArticles = filteredArticles.filter(article =>
                article.title.toLowerCase().includes(searchTerm) ||
                article.description.toLowerCase().includes(searchTerm)
            );
        }

        renderArticles(filteredArticles);
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
        allButton.querySelector('button').addEventListener('click', (e) => {
            document.querySelectorAll('aside button').forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            applyFilters();
        });
        filterList.appendChild(allButton);

        sources.forEach(source => {
            const sourceButton = document.createElement('li');
            sourceButton.innerHTML = `<button class="w-full text-left px-4 py-2 rounded-md font-medium">${source.name}</button>`;
            sourceButton.querySelector('button').addEventListener('click', (e) => {
                document.querySelectorAll('aside button').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                applyFilters();
            });

            if (source.category === 'organization') {
                orgSourceList.appendChild(sourceButton);
            } else if (source.category === 'individual') {
                indSourceList.appendChild(sourceButton);
            }
        });
    };

    /**
     * 核心的数据获取与渲染逻辑
     */
    const fetchAndRender = async () => {
        loadingIndicator.style.display = 'flex';
        errorMessage.style.display = 'none';
        articleContainer.innerHTML = '';

        try {
            if (filterList.children.length === 0) {
                const sourcesResponse = await fetch(`${API_BASE_URL}/sources`);
                if (!sourcesResponse.ok) throw new Error('无法获取源配置');
                const allSourceConfigs = await sourcesResponse.json();
                populateSidebar(allSourceConfigs);
            }

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
            const allFeedsButton = filterList.querySelector('button');
            if (allFeedsButton) {
                allFeedsButton.classList.add('active');
            }
            applyFilters();

        } catch (error) {
            console.error("获取数据失败:", error);
            loadingIndicator.style.display = 'none';
            errorDetails.textContent = `获取数据失败，请确保后端服务器正在运行。错误: ${error.message}`;
            errorMessage.style.display = 'flex';
        }
    };

    const init = () => {
        refreshButton.addEventListener('click', fetchAndRender);
        searchInput.addEventListener('input', applyFilters); // [新增] 为搜索框添加事件监听
        fetchAndRender(); // 初始加载
    };

    init();
});
