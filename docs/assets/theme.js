document.addEventListener('DOMContentLoaded', function() {    
    const currentUrl = window.location.pathname;

    const GLOBAL_CONFIG = {
        // 移除了 bgUrl，改为使用CSS渐变
        bodyBg: 'rgba(237, 239, 233, 0.85)',
        maxWidth: '885px',
        borderRadius: '10px',
        transition: '0.2s ease-out',
        accentColor: 'rgb(239, 112, 96)',
        codeBg: 'rgba(243, 244, 243, 0.97)',
        hoverColor: '#c3e4e3'
    };

    // 移除了背景图片预加载函数，因为不再使用图片背景
    // preloadBackgroundImage();

    let finalCss = `
        /* 5色渐变呼吸背景 - 45度角，15秒周期 */
        html { 
            background: linear-gradient(45deg, 
                #e3f2fd 0%,      /* 柔和的淡蓝色 */
                #f3e5f5 20%,     /* 浅紫色 */
                #e8f5e9 40%,     /* 淡绿色 */
                #fff3e0 60%,     /* 浅橙色 */
                #fce4ec 80%,     /* 浅粉色 */
                #e3f2fd 100%     /* 回到起始色形成循环 */
            ) !important;
            background-size: 400% 400% !important;
            animation: gradientBreathing 15s ease infinite !important;
        }
        
        @keyframes gradientBreathing {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
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