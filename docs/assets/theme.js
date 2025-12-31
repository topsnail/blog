document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    const GLOBAL_CONFIG = {
        // 您提供的五种核心颜色
        colors: ['#9ac47a', '#A3B18A', '#D9AD98', '#A5A5C1', '#C9B380'],
        bodyBg: 'rgba(237, 239, 233, 0.7)',
        maxWidth: '885px',
        borderRadius: '10px',
        transition: '0.2s ease-out',
        accentColor: 'rgb(239, 112, 96)',
        codeBg: 'rgba(243, 244, 243, 0.9)',
        hoverColor: '#c3e4e3'
    };

    let finalCss = `
        /* 定义135度双色交替渐变呼吸动画 */
        @keyframes breatheGradient {
            0%   { background-image: linear-gradient(135deg, ${GLOBAL_CONFIG.colors[0]}, ${GLOBAL_CONFIG.colors[1]}); }
            25%  { background-image: linear-gradient(135deg, ${GLOBAL_CONFIG.colors[1]}, ${GLOBAL_CONFIG.colors[2]}); }
            50%  { background-image: linear-gradient(135deg, ${GLOBAL_CONFIG.colors[2]}, ${GLOBAL_CONFIG.colors[3]}); }
            75%  { background-image: linear-gradient(135deg, ${GLOBAL_CONFIG.colors[3]}, ${GLOBAL_CONFIG.colors[4]}); }
            100% { background-image: linear-gradient(135deg, ${GLOBAL_CONFIG.colors[4]}, ${GLOBAL_CONFIG.colors[0]}); }
        }

        html { 
            /* 15秒周期，无限往返循环，平滑过渡 */
            animation: breatheGradient 15s infinite alternate ease-in-out !important; 
            min-height: 100vh;
            background-attachment: fixed !important; /* 确保滚动时背景固定 */
        }

        body { 
            min-width: 200px; max-width: ${GLOBAL_CONFIG.maxWidth} !important; 
            margin: 10px auto !important; font-family: sans-serif; line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg} !important; border-radius: ${GLOBAL_CONFIG.borderRadius} !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important; overflow: auto;
        }
        .SideNav { background: rgba(255, 255, 255, 0.6); border-radius: ${GLOBAL_CONFIG.borderRadius}; }
        .SideNav-item { transition: ${GLOBAL_CONFIG.transition}; }
        .LabelTime { display: inline-block !important; visibility: visible !important; opacity: 1 !important; margin-left: 8px !important; }
        .post-item { transition: transform ${GLOBAL_CONFIG.transition}, box-shadow ${GLOBAL_CONFIG.transition}; }
        .post-item:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 8px rgba(0,0,0,0.15); 
            border-radius: ${GLOBAL_CONFIG.borderRadius} !important;
        }
        .markdown-body img { transition: ${GLOBAL_CONFIG.transition} !important; }
        .markdown-body a { color: ${GLOBAL_CONFIG.accentColor}; transition: color ${GLOBAL_CONFIG.transition} !important; }
        .markdown-body a:hover { color: #d65a47 !important; }
        @media (min-width: 768px) and (max-width: 1024px) {
            body { max-width: 90% !important; }
            .SideNav { margin: 0 16px !important; }
        }
    `;

    // 路由逻辑样式注入
    if (currentUrl === '/' || currentUrl.includes('/index.html') || currentUrl。includes('/page')) {
        finalCss += `
            .SideNav-item:hover { background-color: ${GLOBAL_CONFIG.hoverColor}; transform: scale(1.02); box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        `;
    } 
    else if (currentUrl.includes('/post/') || currentUrl.includes('/link.html') || currentUrl.includes('/about.html')) {
        finalCss += `
            .markdown-body img { border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); }
            .markdown-body .highlight pre, .markdown-body pre { 
                background-color: ${GLOBAL_CONFIG.codeBg}; 
                padding: 16px !important; 
                border-radius: 8px;
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: ${GLOBAL_CONFIG.accentColor} transparent;
                line-height: 1.5 !important;
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

        const bindSearchEnter = () => {
            const input = document.querySelector('.subnav-search-input');
            const button = document.querySelector('button.btn');
            if (input && button) {
                input.onkeyup = (e) => { if (e.key === "Enter") button.click(); };
                return true;
            }
            return false;
        };

        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                if (bindSearchEnter()) observer.disconnect();
            });
            const subnav = document.querySelector('.subnav');
            observer.observe(subnav || document.body, { childList: true, subtree: true });
        }
    }

    const style = document.createElement("style");
    style.innerHTML = finalCss;
    document.head.appendChild(style);

    // 图片懒加载与错误处理
    const initImageLazyLoad = () => {
        const images = document.querySelectorAll('.markdown-body img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            img.onerror = () => {
                img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200" viewBox="0 0 400 200"><text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="16">图片加载失败</text></svg>';
            };
        });
    };
    initImageLazyLoad();
});
