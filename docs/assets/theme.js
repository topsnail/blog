/**
 * 123博客主题切换脚本 (zt.js) - 优化版
 * 功能：根据当前页面的 URL 路径，动态注入不同的 CSS 样式。
 * 您可以通过修改顶部 GLOBAL_CONFIG 中的编号快速调整视觉效果。
 */
document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    // ==============================================================================
    // 【全局通用配置区】
    // ==============================================================================
    const GLOBAL_CONFIG = {
        // ① 背景图地址
        bgUrl: 'bj2.webp', 
        // ② 主体不透明度：建议 0.8 到 0.9 之间
        bodyBg: 'rgba(237, 239, 233, 0.85)',
        // ③ 页面最大宽度
        maxWidth: '885px',
        // ④ 全局圆角大小
        borderRadius: '10px',
        // ⑬ 动画过渡时间：0.2s 视觉感比 0.1s 更顺滑
        transition: '0.2s ease-out'
    };

    // 公共基础样式：提取三个分支中重复的代码，提高执行效率
    let commonCss = `
        html {    
            background: url('${GLOBAL_CONFIG.bgUrl}') no-repeat center center fixed !important;
            background-size: cover !important;
        }
        body {
            min-width: 200px;
            max-width: ${GLOBAL_CONFIG.maxWidth} !important; /* 对应编号 ③ */
            margin: 10px auto !important;
            font-size: 16px;
            font-family: sans-serif;
            line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg} !important;   /* 对应编号 ② */
            border-radius: ${GLOBAL_CONFIG.borderRadius} !important; /* 对应编号 ④ */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important; 
            overflow: auto;
        }
        .SideNav { 
            background: rgba(255, 255, 255, 0.6); 
            border-radius: ${GLOBAL_CONFIG.borderRadius}; 
        }
        .SideNav-item { transition: ${GLOBAL_CONFIG.transition}; } /* 对应编号 ⑬ */
    `;

    let pageSpecificCss = '';

    // ==============================================================================
    // 【各页面差异化样式注入】
    // ==============================================================================
    
    // A. 主页逻辑
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('核心：应用主页主题');
        pageSpecificCss = `
            .blogTitle { display: unset; }
            .SideNav-item:hover {
                background-color: #c3e4e3;
                border-radius: ${GLOBAL_CONFIG.borderRadius};
                /* ⑤ 鼠标悬停缩放倍率 */
                transform: scale(1.02);
                /* ⑥ 鼠标悬停阴影大小 */
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            .pagination a:hover, .pagination a:focus { border-color: rebeccapurple; }
        `;
    } 
    // B. 文章页/功能页逻辑
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('核心：应用文章页主题');
        pageSpecificCss = `
            /* ⑦ 文章内图片圆角 */
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            .markdown-alert { border-radius: 8px; }
            .markdown-body .highlight pre, .markdown-body pre {
                color: rgb(0, 0, 0); 
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                /* ⑩ 代码块顶部内边距 */
                padding-top: 20px; 
                border-radius: 8px;
            }
            /* ⑨ 行内代码背景色 */
            .markdown-body code, .markdown-body tt { background-color: #c9daf8; }
            /* ⑧ 文章内 H1 标题修饰 */
            .markdown-body h1 {
                display: inline-block; font-size: 1.3rem; font-weight: bold;
                background: rgb(239, 112, 96); color: #ffffff;
                padding: 3px 10px 1px; border-radius: 8px; margin-top: 1.8rem;
            }
        `;
    } 
    // C. 搜索与标签页逻辑
    else if (currentUrl.includes('/tag')) {
        console.log('核心：应用搜索页主题');
        pageSpecificCss = `
            .SideNav-item:hover {
                background-color: #c3e4e3;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            /* ⑪ 搜索框圆角 */
            .subnav-search-input { border-radius: 2em; float: unset !important; }
            button.btn.float-left { display: none; }
            /* ⑫ 搜索框高度 */
            .subnav-search { width: unset; height: 36px; }
        `;

        // 搜索框回车补丁：优化选择器，增强兼容性
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
        }, 150); // 稍微增加延迟确保 DOM 加载完成
    }

    // ==============================================================================
    // 【注入执行区】
    // ==============================================================================
    const style = document.createElement("style");
    style.innerHTML = commonCss + pageSpecificCss;
    document.head.appendChild(style);
});