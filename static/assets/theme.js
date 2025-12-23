/**
 * 博客主题切换脚本 (theme.js) - 终极优化版
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
    // 【2. 逻辑处理区】仅负责拼接字符串，不操作 DOM
    // ==============================================================================
    
    // 公共基础样式 (含手机端隐藏标题逻辑)
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
        
        /* 移动端标题隐藏 */
        @media (max-width: 767px) { .blogTitle { display: none !important; } }
    `;

    // 页面差异化样式拼接
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        finalCss += `
            .blogTitle { display: unset; }
            .SideNav-item:hover { background-color: ${GLOBAL_CONFIG.hoverColor}; transform: scale(1.02); box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        `;
    } 
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        finalCss += `
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            .markdown-body .highlight pre, .markdown-body pre { background-color: ${GLOBAL_CONFIG.codeBg}; padding-top: 20px; border-radius: 8px; }
            .markdown-body h1 { display: inline-block; background: ${GLOBAL_CONFIG.accentColor}; color: #ffffff; padding: 3px 10px 1px; border-radius: 8px; }
        `;
    }
    else if (currentUrl.includes('/tag')) {
        finalCss += `
            .subnav-search-input { border-radius: 2em; float: unset !important; }
            button.btn.float-left { display: none; }
            .subnav-search { width: unset; height: 36px; }
        `;

        // 智能搜索补丁：使用观察器代替定时器
        const observer = new MutationObserver(() => {
            const input = document.querySelector('.subnav-search-input');
            const button = document.querySelector('button.btn');
            if (input && button) {
                input.onkeyup = (e) => { if (e.key === "Enter") button.click(); };
                observer.disconnect(); // 绑定成功后停止监听
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==============================================================================
    // 【3. 执行注入区】全站仅此一次 DOM 操作
    // ==============================================================================
    const style = document.createElement("style");
    style.innerHTML = finalCss;
    document.head.appendChild(style);
});