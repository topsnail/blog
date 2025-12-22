/**
 * 博客主题切换脚本 (theme.js)
 * 作用：根据页面 URL 自动匹配视觉风格，实现背景注入、容器布局优化及移动端适配。
 * * 维护说明：
 * 1. 核心参数在 GLOBAL_CONFIG 中修改。
 * 2. 公共布局在 commonCss 中修改。
 * 3. 页面特有样式在 if/else 分支逻辑中修改。
 */
document.addEventListener('DOMContentLoaded', function() {    
    // 获取当前访问的页面路径
    const currentUrl = window.location.pathname;

    // ==============================================================================
    // 【1. 全局配置区】
    // 修改下方数值即可改变全站视觉基础
    // ==============================================================================
    const GLOBAL_CONFIG = {
        bgUrl: '/bj2.webp',                   // 背景图路径（建议使用绝对路径）
        bodyBg: 'rgba(237, 239, 233, 0.85)',  // 主体背景色（RGBA：红,绿,蓝,透明度）
        maxWidth: '885px',                    // 内容区域最大宽度
        borderRadius: '10px',                 // 全局圆角半径
        transition: '0.2s ease-out'           // 交互动画过渡效果（时间+曲线）
    };

    // ==============================================================================
    // 【2. 公共基础样式】
    // 适用于全站所有页面的通用 CSS 逻辑
    // ==============================================================================
    let commonCss = `
        /* 全局 HTML 背景设定 */
        html {    
            background: url('${GLOBAL_CONFIG.bgUrl}') no-repeat center center fixed !important;
            background-size: cover !important;
        }

        /* 页面主体容器设定 */
        body {
            min-width: 200px;
            max-width: ${GLOBAL_CONFIG.maxWidth} !important;
            margin: 10px auto !important;                   /* 容器上下间距 10px，左右自动居中 */
            font-size: 16px;
            font-family: sans-serif;
            line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg} !important;
            border-radius: ${GLOBAL_CONFIG.borderRadius} !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important; /* 容器外发光阴影 */
            overflow: auto;
        }

        /* 侧边导航/列表容器设定 */
        .SideNav { 
            background: rgba(255, 255, 255, 0.6); 
            border-radius: ${GLOBAL_CONFIG.borderRadius}; 
        }

        /* 侧边导航项平滑动效 */
        .SideNav-item { transition: ${GLOBAL_CONFIG.transition}; }

        /* 移动端优化：强制显示文章发布时间标签 */
        .LabelTime { 
            display: inline-block !important; 
            visibility: visible !important; 
            opacity: 1 !important;
            margin-left: 8px !important;     
        }
    `;

    let pageSpecificCss = '';

    // ==============================================================================
    // 【3. 分页差异化逻辑】
    // 根据 URL 判断当前页面，并赋予独特的 CSS 规则
    // ==============================================================================
    
    // --- A. 主页逻辑（首页、index 文件、列表分页） ---
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl.includes('/page')) {
        console.log('核心：应用主页主题');
        pageSpecificCss = `
            .blogTitle { display: unset; } /* 确保主页标题可见 */
            
            /* 列表项鼠标悬停交互：变色、放大、加深阴影 */
            .SideNav-item:hover {
                background-color: #c3e4e3;
                border-radius: ${GLOBAL_CONFIG.borderRadius};
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            
            /* 分页按钮悬停颜色 */
            .pagination a:hover, .pagination a:focus { border-color: rebeccapurple; }
        `;
    } 
    
    // --- B. 内容页逻辑（文章正文、友链页、关于页） ---
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        console.log('核心：应用文章页主题');
        pageSpecificCss = `
            /* 文章内图片修饰：圆角与微边框 */
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            
            /* Gmeek 警告/提示框圆角修正 */
            .markdown-alert { border-radius: 8px; }
            
            /* 代码块美化：文字深色、背景浅灰、底部长阴影 */
            .markdown-body .highlight pre, .markdown-body pre {
                color: rgb(0, 0, 0); 
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding-top: 20px; 
                border-radius: 8px;
            }
            
            /* 行内代码高亮颜色 */
            .markdown-body code, .markdown-body tt { background-color: #c9daf8; }
            
            /* 文章标题修饰：H1 标题改为橙色背景块 */
            .markdown-body h1 {
                display: inline-block; 
                font-size: 1.3rem; 
                font-weight: bold;
                background: rgb(239, 112, 96); 
                color: #ffffff;
                padding: 3px 10px 1px; 
                border-radius: 8px; 
                margin-top: 1.8rem;
            }
        `;
    } 
    
    // --- C. 搜索与标签页逻辑 ---
    else if (currentUrl.includes('/tag')) {
        console.log('核心：应用搜索页主题');
        pageSpecificCss = `
            /* 标签列表悬停效果 */
            .SideNav-item:hover {
                background-color: #c3e4e3;
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            
            /* 搜索框美化：全圆角胶囊设计 */
            .subnav-search-input { border-radius: 2em; float: unset !important; }
            
            /* 视觉清理：隐藏原生冗余的浮动按钮 */
            button.btn.float-left { display: none; }
            
            /* 搜索栏高度修正 */
            .subnav-search { width: unset; height: 36px; }
        `;

        /**
         * 搜索补丁：监听搜索框内的键盘事件
         * 功能：按下 Enter (回车) 键时，自动模拟点击搜索按钮。
         */
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
        }, 150); // 150ms 延迟，确保 Gmeek 异步生成的 DOM 元素已挂载
    }

    // ==============================================================================
    // 【4. 最终执行注入】
    // 将拼接好的样式汇总并插入到网页 Head 中生效
    // ==============================================================================
    const style = document.createElement("style");
    style.innerHTML = commonCss + pageSpecificCss;
    document.head.appendChild(style);
});