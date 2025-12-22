/**
 * 3博客主题切换脚本 (theme.js)
 * 功能：根据当前 URL 动态注入全局背景、布局以及各页面特有的 CSS 样式。
 */
document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    // ==============================================================================
    // 【全局通用配置区】
    // 修改此处的数值，全站对应的样式会同步更新
    // ==============================================================================
    const GLOBAL_CONFIG = {
        bgUrl: '/bj2.webp',                   // ① 背景图地址
        bodyBg: 'rgba(237, 239, 233, 0.85)',  // ② 主体容器背景色（带透明度）
        maxWidth: '885px',                    // ③ 页面内容最大宽度
        borderRadius: '10px',                 // ④ 全局圆角大小
        transition: '0.2s ease-out'           // ⑬ 交互动画平滑过渡时间
    };

    // 【公共基础样式】：所有页面通用的布局样式
    let commonCss = `
        html {    
            /* 设置全局背景图，并固定不随滚动条移动 */
            background: url('${GLOBAL_CONFIG.bgUrl}') no-repeat center center fixed !important;
            background-size: cover !important;
        }
        body {
            min-width: 200px;
            max-width: ${GLOBAL_CONFIG.maxWidth} !important; /* 宽度控制 */
            margin: 10px auto !important;                   /* 上下留白 10px，左右居中 */
            font-size: 16px;
            font-family: sans-serif;
            line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg} !important;   /* 背景透明度 */
            border-radius: ${GLOBAL_CONFIG.borderRadius} !important; /* 圆角控制 */
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important;       /* 容器阴影 */
            overflow: auto;
        }
        .SideNav { 
            background: rgba(255, 255, 255, 0.6); 
            border-radius: ${GLOBAL_CONFIG.borderRadius}; 
        }
        .SideNav-item { transition: ${GLOBAL_CONFIG.transition}; } /* 列表项动画 */

        /* 强制显示移动端的时间标签：确保在手机端也能清楚看到发布日期 */
        .LabelTime { 
            display: inline-block !important; 
            visibility: visible !important; 
            opacity: 1 !important;
            margin-left: 8px !important;     
        }
    `;

    let pageSpecificCss = '';

    // ==============================================================================
    // 【各页面差异化样式注入】
    // ==============================================================================
    
    // A. 主页逻辑：匹配根路径、index.html 或 分页路径
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('核心：应用主页主题');
        pageSpecificCss = `
            .blogTitle { display: unset; } /* 确保主页标题显示 */
            .SideNav-item:hover {
                background-color: #c3e4e3;
                border-radius: ${GLOBAL_CONFIG.borderRadius};
                transform: scale(1.02); /* ⑤ 悬停时轻微放大 */
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* ⑥ 悬停阴影增强 */
            }
            .pagination a:hover, .pagination a:focus { border-color: rebeccapurple; }
        `;
    } 
    // B. 文章页/功能页逻辑：匹配 post 路径、链接页或关于页
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('核心：应用文章页主题');
        pageSpecificCss = `
            /* ⑦ 文章内图片圆角与边框 */
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            .markdown-alert { border-radius: 8px; }
            .markdown-body .highlight pre, .markdown-body pre {
                color: rgb(0, 0, 0); 
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding-top: 20px; /* ⑩ 代码块顶部内边距 */
                border-radius: 8px;
            }
            /* ⑨ 行内代码块（code）的背景色 */
            .markdown-body code, .markdown-body tt { background-color: #c9daf8; }
            /* ⑧ 文章内一级标题（H1）修饰效果 */
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
            /* ⑪ 搜索框胶囊形状圆角 */
            .subnav-search-input { border-radius: 2em; float: unset !important; }
            button.btn.float-left { display: none; } /* 隐藏原生浮动按钮 */
            .subnav-search { width: unset; height: 36px; } /* ⑫ 搜索框高度调整 */
        `;

        // 【搜索框交互补丁】：支持按下 Enter 键直接搜索
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
        }, 150); // 150ms 延迟，确保 Gmeek 框架的 DOM 已生成
    }

    // ==============================================================================
    // 【注入执行区】：将合并后的 CSS 代码插入到网页 <head> 中
    // ==============================================================================
    const style = document.createElement("style");
    style.innerHTML = commonCss + pageSpecificCss;
    document.head.appendChild(style);
});
