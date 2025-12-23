/**
 * 博客主题切换脚本 (theme.js) - 保留原有功能 + 科学优化版
 */
document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    // ==============================================================================
    // 【1. 全量配置区】所有视觉参数集中于此
    // ==============================================================================
    const GLOBAL_CONFIG = {
        bgUrl: '/bj2.webp',
        bodyBg: 'rgba(237, 239, 233, 0.85)',
        maxWidth: '885px',
        borderRadius: '10px',
        transition: '0.2s ease-out',
        // 新增扩展参数
        accentColor: 'rgb(239, 112, 96)', // 文章标题颜色
        codeBg: 'rgba(243, 244, 243, 0.97)', // 代码块背景
        hoverColor: '#c3e4e3'             // 悬停高亮色
    };

    // ==============================================================================
    // 【新增：背景图预加载 + 失败降级】
    // ==============================================================================
    const preloadBackgroundImage = () => {
        const bgImg = new Image();
        bgImg.src = GLOBAL_CONFIG.bgUrl;
        
        // 背景图加载失败时，使用纯色降级
        bgImg.onerror = () => {
            const fallbackStyle = document.createElement('style');
            fallbackStyle.innerHTML = `
                html { 
                    background: #e9ebe5 !important; /* 与 bodyBg 匹配的纯色兜底 */
                }
            `;
            document.head.appendChild(fallbackStyle);
        };
    };
    // 执行预加载
    preloadBackgroundImage();

    // ==============================================================================
    // 【2. 逻辑处理区】仅负责拼接字符串，不操作 DOM
    // ==============================================================================
    
    // 公共基础样式 (已移除标题相关控制，新增过渡动画和平板端适配)
    let finalCss = `
        html { background: url('${GLOBAL_CONFIG.bgUrl}') no-repeat center center fixed !important; background-size: cover !important; }
        body { 
            min-width: 200px; max-width: ${GLOBAL_CONFIG.maxWidth} !important; 
            margin: 10px auto !important; font-family: sans-serif; line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg} !important; border-radius: ${GLOBAL_CONFIG.borderRadius} !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important; overflow: auto;
        }
        .SideNav { background: rgba(255, 255, 255, 0.6); border-radius: ${GLOBAL_CONFIG.borderRadius}; }
        .SideNav-item { transition: ${GLOBAL_CONFIG.transition}; }
        .LabelTime { display: inline-block !important; visibility: visible !important; opacity: 1 !important; margin-left: 8px !important; }
        /* 新增：多元素过渡动画 */
        .post-item { transition: transform ${GLOBAL_CONFIG.transition}, box-shadow ${GLOBAL_CONFIG.transition}; }
        .post-item:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .markdown-body img { transition: ${GLOBAL_CONFIG.transition} !important; }
        .markdown-body a { color: ${GLOBAL_CONFIG.accentColor}; transition: color ${GLOBAL_CONFIG.transition} !important; }
        .markdown-body a:hover { color: #d65a47 !important; }
        /* 平板端适配（768px-1024px） */
        @media (min-width: 768px) and (max-width: 1024px) {
            body { max-width: 90% !important; }
            .SideNav { margin: 0 16px !important; }
        }
    `;

    // 页面差异化样式拼接
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        finalCss += `
            .SideNav-item:hover { background-color: ${GLOBAL_CONFIG.hoverColor}; transform: scale(1.02); box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        `;
    } 
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        finalCss += `
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            .markdown-body .highlight pre, .markdown-body pre { 
                background-color: ${GLOBAL_CONFIG.codeBg}; 
                padding-top: 20px; 
                border-radius: 8px;
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: ${GLOBAL_CONFIG.accentColor} transparent;
                padding: 16px !important;
                line-height: 1.5 !important;
            }
            .markdown-body pre::-webkit-scrollbar {
                height: 6px;
                width: 6px;
            }
            .markdown-body pre::-webkit-scrollbar-thumb {
                background-color: ${GLOBAL_CONFIG.accentColor};
                border-radius: 3px;
            }
            .markdown-body pre::-webkit-scrollbar-track {
                background: transparent;
            }
            .markdown-body h1 { display: inline-block; background: ${GLOBAL_CONFIG.accentColor}; color: #ffffff; padding: 3px 10px 1px; border-radius: 8px; }
        `;
    }
    else if (currentUrl.includes('/tag')) {
        finalCss += `
            .subnav-search-input { border-radius: 2em; float: unset !important; }
            button.btn.float-left { display: none; }
            .subnav-search { width: unset; height: 36px; }
        `;

        // 【优化：兼容旧浏览器 + 限定监听范围】标签页搜索回车功能
        const bindSearchEnter = () => {
            const input = document.querySelector('.subnav-search-input');
            const button = document.querySelector('button.btn');
            if (input && button) {
                input.onkeyup = (e) => { if (e.key === "Enter") button.click(); };
                return true;
            }
            return false;
        };

        // 优先使用 MutationObserver，不支持则用定时器降级
        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                if (bindSearchEnter()) {
                    observer.disconnect();
                }
            });
            const subnav = document.querySelector('.subnav');
            observer.observe(subnav || document.body, { childList: true, subtree: true });
        } else {
            // 旧浏览器定时器兜底
            const searchTimer = setInterval(() => {
                if (bindSearchEnter()) {
                    clearInterval(searchTimer);
                }
            }, 200);
            // 10秒超时兜底
            setTimeout(() => {
                clearInterval(searchTimer);
            }, 10000);
        }
    }

    // ==============================================================================
    // 【3. 执行注入区】全站仅此一次 DOM 操作
    // ==============================================================================
    const style = document.createElement("style");
    style.innerHTML = finalCss;
    document.head.appendChild(style);

    // ==============================================================================
    // 【新增：鲁棒性优化 + 图片懒加载 + 回到顶部】
    // ==============================================================================
    // 1. 元素存在性判断，避免报错
    const enhanceRobustness = () => {
        const sideNavItems = document.querySelectorAll('.SideNav-item');
        const labelTimes = document.querySelectorAll('.LabelTime');
        // 仅做存在性判断，不影响原有功能
        if (sideNavItems.length && labelTimes.length) {
            return true;
        }
        return false;
    };
    enhanceRobustness();

    // 2. 图片原生懒加载 + 失败占位
    const initImageLazyLoad = () => {
        const images = document.querySelectorAll('.markdown-body img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            img.onerror = () => {
                img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200" viewBox="0 0 400 200"><text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="16">图片加载失败</text></svg>';
                img.alt = '图片加载失败';
            };
        });
    };
    initImageLazyLoad();

    // 3. 轻量回到顶部按钮（不需要可注释 initBackToTop() 此行）
    const initBackToTop = () => {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 8px 12px;
            background: ${GLOBAL_CONFIG.accentColor} !important;
            color: white !important;
            border: none;
            border-radius: ${GLOBAL_CONFIG.borderRadius} !important;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: ${GLOBAL_CONFIG.transition} !important;
            z-index: 999;
            font-size: 14px;
        `;
        backToTopBtn.innerText = '↑';
        backToTopBtn.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        document.body.appendChild(backToTopBtn);
    };
    initBackToTop();
});