/**
 * 博客主题切换脚本 (zt.js) - 优化版
 * 功能：统一管理全局背景与布局，根据 URL 动态注入页面特有样式
 */
document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    // 1. 【提取公共配置】：在此处统一修改背景和主体参数
    const GLOBAL_CONFIG = {
        bgUrl: 'bj2.webp', // 统一背景图地址
        bodyBg: 'rgba(237, 239, 233, 0.84)',
        maxWidth: '885px',
        borderRadius: '10px'
    };

    // 2. 【基础公共样式】：所有页面共用的布局，只需写一次
    let commonCss = `
        html {    
            background: url('${GLOBAL_CONFIG.bgUrl}') no-repeat center center fixed !important;
            background-size: cover !important;
        }
        body {
            min-width: 200px;
            max-width: ${GLOBAL_CONFIG.maxWidth};
            margin: 30px auto;
            font-size: 16px;
            font-family: sans-serif;
            line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg}; 
            border-radius: ${GLOBAL_CONFIG.borderRadius}; 
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); 
            overflow: auto;
        }
        .SideNav { background: rgba(255, 255, 255, 0.6); border-radius: ${GLOBAL_CONFIG.borderRadius}; }
        .SideNav-item { transition: 0.1s; }
    `;

    let pageSpecificCss = '';

    // 3. 【差异化逻辑】：各页面仅注入自己特有的样式
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('应用主页主题');
        pageSpecificCss = `
            .blogTitle { display: unset; }
            .SideNav-item:hover {
                background-color: #c3e4e3;
                border-radius: ${GLOBAL_CONFIG.borderRadius};
                transform: scale(1.04);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            .pagination a:hover, .pagination a:focus { border-color: rebeccapurple; }
        `;
    } 
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('文章页主题');
        pageSpecificCss = `
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            .markdown-alert { border-radius: 8px; }
            .markdown-body .highlight pre, .markdown-body pre {
                color: rgb(0, 0, 0); background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding-top: 20px; border-radius: 8px;
            }
            .markdown-body code, .markdown-body tt { background-color: #c9daf8; }
            .markdown-body h1 {
                display: inline-block; font-size: 1.3rem; font-weight: bold;
                background: rgb(239, 112, 96); color: #ffffff;
                padding: 3px 10px 1px; border-radius: 8px; margin-top: 1.8rem;
            }
        `;
    } 
    else if (currentUrl.includes('/tag')) {
        console.log('应用搜索页主题');
        pageSpecificCss = `
            .SideNav-item:hover {
                background-color: #c3e4e3;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            .subnav-search-input { border-radius: 2em; float: unset !important; }
            button.btn.float-left { display: none; }
            .subnav-search { width: unset; height: 36px; }
        `;

        // 搜索交互逻辑补丁（优化选择器）
        setTimeout(() => {
            const input = document.querySelector('.subnav-search-input');
            const button = document.querySelector('button.btn'); 
            if (input && button) {
                input.addEventListener("keyup", function(event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        button.click();
                    }
                });
            }
        }, 100);
    }

    // 4. 【最后一步】：统一注入 CSS，减少 DOM 操作
    const style = document.createElement("style");
    style.innerHTML = commonCss + pageSpecificCss;
    document.head.appendChild(style);
});