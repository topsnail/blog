document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    const GLOBAL_CONFIG = {
        bodyBg: 'rgba(237, 239, 233, 0.85)',
        maxWidth: '885px',
        borderRadius: '10px',
        transition: '0.2s ease-out',
        accentColor: 'rgb(239, 112, 96)',
        codeBg: 'rgba(243, 244, 243, 0.97)',
        hoverColor: '#c3e4e3'
    };

    let finalCss = `
        /* 5色渐变呼吸背景 - 45度角，15秒周期，增强版呼吸效果 */
        html { 
            background: linear-gradient(45deg, 
                #e3f2fd,      /* 柔和的淡蓝色 */
                #f3e5f5,      /* 浅紫色 */
                #e8f5e9,      /* 淡绿色 */
                #fff3e0,      /* 浅橙色 */
                #fce4ec,      /* 浅粉色 */
                #e3f2fd       /* 回到起始色形成循环 */
            ) !important;
            background-size: 600% 600% !important;  /* 增大尺寸让动画更明显 */
            animation: gradientBreathing 15s ease infinite !important;
            min-height: 100vh !important;
        }
        
        @keyframes gradientBreathing {
            0% {
                background-position: 0% 50%;
            }
            25% {
                background-position: 50% 100%;
            }
            50% {
                background-position: 100% 50%;
            }
            75% {
                background-position: 50% 0%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        
        body { 
            min-width: 200px; max-width: ${GLOBAL_CONFIG.maxWidth} !important; 
            margin: 10px auto !important; font-family: sans-serif; line-height: 1.25;
            background: ${GLOBAL_CONFIG.bodyBg} !important; border-radius: ${GLOBAL_CONFIG.borderRadius} !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important; overflow: auto;
            min-height: calc(100vh - 20px) !important;  /* 确保body填满屏幕 */
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

    // ... [剩余代码保持不变，包括页面路径判断、标签页搜索、图片懒加载等]
    
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
                if (bindSearchEnter()) {
                    observer.disconnect();
                }
            });
            const subnav = document.querySelector('.subnav');
            observer.observe(subnav || document.body, { childList: true, subtree: true });
        } else {
            const searchTimer = setInterval(() => {
                if (bindSearchEnter()) {
                    clearInterval(searchTimer);
                }
            }, 200);
            setTimeout(() => {
                clearInterval(searchTimer);
            }, 10000);
        }
    }

    const style = document.createElement("style");
    style.innerHTML = finalCss;
    document.head.appendChild(style);

    const enhanceRobustness = () => {
        const sideNavItems = document.querySelectorAll('.SideNav-item');
        const labelTimes = document.querySelectorAll('.LabelTime');
        if (sideNavItems.length && labelTimes.length) {
            return true;
        }
        return false;
    };
    enhanceRobustness();

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
});