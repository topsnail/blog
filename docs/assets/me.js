/**
 * Gmeek 综合主题脚本 - 最终全量教程版
 * 【使用说明】：按下 Ctrl+F 搜索 [ID-XX] 即可快速定位修改。
 */

function loadResource(type, attributes) {
    if (type === 'style') {
        const style = document.createElement('style');
        style.textContent = attributes.css;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // =========================================================================
    // 【一、参数控制中心】 - 90% 的修改在这里完成
    // =========================================================================
    const CONFIG = {
        /* [ID-01] 主题核心色：控制图标边框、激活时的文字颜色、进度条等 */
        mainColor: '#0969da', 

        /* [ID-02] 进度追踪背景：TOC中当前阅读章节的浅色背景底色 */
        activeBg: 'rgba(9, 105, 218, 0.1)', 

        /* [ID-03] 正文容器透明度：建议 0.6(很透) 到 0.9(微透) */
        bodyBg: 'rgba(255, 255, 255, 0.75)', 

        /* [ID-04] 全局圆角：值越大边缘越圆。10px现代，20px Q萌，0px 硬朗 */
        borderRadius: '10px', 

        /* [ID-05] 毛玻璃模糊度：配合背景图使用，建议 10px-20px 效果最佳 */
        blurValue: '12px', 
        
        /* [ID-06] TOC 出现条件：文章至少要有几个标题才会出现目录图标 */
        tocThreshold: 3,

        /* [ID-07] 灵动岛避让高度：点击目录跳转后，标题距离屏幕顶部的距离 */
        anchorOffset: '80px',

        /* [ID-08] 电脑端适配：屏幕宽度超过多少 px 时目录自动开启靠右 */
        pcTOCWidth: 1250 
    };

    // =========================================================================
    // 【二、核心视觉修饰】 - 负责主页对齐、背景、日期复活
    // =========================================================================
    const coreCss = `
        /* [ID-09] 网页背景图片：把 /bj.webp 改为你自己的图片地址 */
        html { 
            background: url('/bj.webp') no-repeat center center fixed !important; 
            background-size: cover !important; 
        }

        /* [ID-10] 主容器阴影与边距：修改 0.5 控制阴影深浅 */
        body { 
            background: ${CONFIG.bodyBg} !important; 
            max-width: 885px !important; margin: 30px auto !important; 
            border-radius: ${CONFIG.borderRadius} !important; 
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important; padding: 20px !important;
        }

        /* [ID-11] 列表项鼠标悬停特效：可改背景色或微弱放大 */
        .SideNav-item:hover { 
            background-color: #c3e4e3 !important; /* 悬停颜色 */
            transform: scale(1.007); /* 放大 0.5% */
            transition: 0.3s; 
        }

        /* [ID-12] 手机端日期强制显示逻辑 */
        @media (max-width: 767px) {
            body { margin: 10px 6px !important; padding: 10px !important; }
            .LabelTime { 
                display: inline-block !important; visibility: visible !important; 
            }
        }
    `;
    loadResource('style', {css: coreCss});

    // =========================================================================
    // 【三、TOC 插件系统】 - 负责目录生成、图标变叉、滚动监听
    // =========================================================================
    const contentContainer = document.querySelector('.markdown-body');
    if (contentContainer) {
        const headings = Array.from(contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        if (headings.length > CONFIG.tocThreshold) {
            const tocCss = `
                /* [ID-13] 锚点偏移量：引用 CONFIG.anchorOffset */
                :target::before { content: ""; display: block; height: ${CONFIG.anchorOffset}; margin-top: -${CONFIG.anchorOffset}; }

                /* [ID-14] TOC 目录框体：控制最大高度 70vh(屏幕的70%) 以防标题过长 */
                .toc { 
                    position: fixed; background: rgba(255, 255, 255, 0.85); 
                    backdrop-filter: blur(${CONFIG.blurValue}); border-radius: 16px; 
                    z-index: 1000; padding: 15px; width: fit-content; max-width: 300px;
                    max-height: 70vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
                    transition: 0.4s; opacity: 0; visibility: hidden;
                }
                .toc.show { opacity: 1; visibility: visible; pointer-events: auto; }
                
                /* [ID-15] 电脑/手机定位切换：460px 是正文 900px 的一半加间距 */
                @media (min-width: ${CONFIG.pcTOCWidth}px) { 
                    .toc { left: calc(50% + 453px); bottom: 100px; } 
                    .toc-icon { left: calc(50% + 453px); } 
                }
                @media (max-width: ${CONFIG.pcTOCWidth - 1}px) { 
                    .toc { right: 15px; bottom: 100px; } 
                    .toc-icon { right: 15px; } 
                }

                /* [ID-16] 悬浮球图标：border-width 控制圆圈粗细 */
                .toc-icon { 
                    position: fixed; bottom: 40px; z-index: 1001; 
                    width: 48px; height: 48px; border-radius: 50%; 
                    background: #fff; border: 2px solid ${CONFIG.mainColor}; 
                    display: flex; align-items: center; justify-content: center; cursor: pointer; 
                }

                /* [ID-17] 汉堡菜单线条：可修改高度 2px 为 3px 变粗 */
                .toc-icon span { position: absolute; width: 20px; height: 2px; background: ${CONFIG.mainColor}; transition: 0.3s; }
                .toc-icon .line-1 { transform: translateY(-5px); }
                .toc-icon .line-3 { transform: translateY(5px); }
                
                /* [ID-18] 图标激活变叉：rotate(45deg) 控制旋转角度 */
                .toc-icon.active .line-1 { transform: translateY(0) rotate(45deg); }
                .toc-icon.active .line-2 { opacity: 0; }
                .toc-icon.active .line-3 { transform: translateY(0) rotate(-45deg); }

                /* [ID-19] TOC 链接文字：修改 14px 可改变目录字号 */
                .toc-link { 
                    display: block; padding: 6px 12px; color: #24292e; text-decoration: none; 
                    font-size: 14px; border-radius: 8px; transition: 0.3s;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; 
                }
                
                /* [ID-20] 阅读进度高亮样式：padding-left 增加动感 */
                .toc-link.active { 
                    color: ${CONFIG.mainColor} !important; background: ${CONFIG.activeBg}; 
                    font-weight: bold; padding-left: 18px !important; 
                }
            `;
            loadResource('style', {css: tocCss});

            // 生成目录 HTML
            const tocElement = document.createElement('div');
            tocElement.className = 'toc';
            const tocLinks = [];

            headings.forEach((heading, index) => {
                if (!heading.id) heading.id = `anchor-${index}`;
                const link = document.createElement('a');
                link.href = '#' + heading.id;
                link.textContent = heading.textContent;
                link.className = 'toc-link';
                /* [ID-21] 标题缩进深度：修改 12px 改变层级之间的间距 */
                const level = parseInt(heading.tagName.charAt(1));
                link.style.paddingLeft = `${(level - 1) * 12 + 12}px`;
                tocElement.appendChild(link);
                tocLinks.push({ heading, link });
            });
            document.body.appendChild(tocElement);

            const icon = document.createElement('div');
            icon.className = 'toc-icon';
            icon.innerHTML = '<span class="line-1"></span><span class="line-2"></span><span class="line-3"></span>';
            document.body.appendChild(icon);

            // [ID-22] 展开状态切换函数
            const toggleTOC = () => {
                const isShow = tocElement.classList.toggle('show');
                icon.classList.toggle('active', isShow);
            };

            icon.onclick = (e) => { e.stopPropagation(); toggleTOC(); };

            // [ID-23] 阅读追踪算法：150 代表标题距离顶端多少 px 时高亮
            const observer = new IntersectionObserver(() => {
                let currentActiveId = null;
                for (const h of headings) {
                    if (h.getBoundingClientRect().top < 150) { 
                        currentActiveId = h.id;
                    }
                }
                tocLinks.forEach(({ heading, link }) => {
                    if (heading.id === currentActiveId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }, { rootMargin: '0px 0px -80% 0px' });

            headings.forEach(h => observer.observe(h));
            
            /* [ID-24] PC端加载后自动展开目录的延迟时间：500(毫秒) */
            if (window.innerWidth >= CONFIG.pcTOCWidth) setTimeout(toggleTOC, 800);

            document.addEventListener('click', (e) => {
                if (tocElement.classList.contains('show') && !tocElement.contains(e.target)) toggleTOC();
            });
        }
    }
});
