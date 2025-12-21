(function() {
    const TOC_CONFIG = {
        mainColor: '#0969da',
        activeBg: 'rgba(9, 105, 218, 0.1)',
        tocThreshold: 3,        
        anchorOffset: '80px',   
        pcWidth: 1250,
        // --- 布局微调参数 ---
        iconSize: '42px',       // 圆形图标的大小
        iconBottom: '40px',     // 图标距离底部的距离
        boxBottom: '90px',      // 目录框距离底部的距离（减去iconBottom即为垂直间距）
        sideMargin: '12px',     // 手机端距离侧边的距离
        pcOffset: '450px'       // PC端距离中心点的偏移量
    };

    document.addEventListener('DOMContentLoaded', () => {
        const content = document.querySelector('.markdown-body');
        if (!content) return;

        const headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        if (headings.length <= TOC_CONFIG.tocThreshold) return;

        const tocStyle = document.createElement('style');
        tocStyle.textContent = `
            :target::before { content: ""; display: block; height: ${TOC_CONFIG.anchorOffset}; margin-top: -${TOC_CONFIG.anchorOffset}; }
            
            .toc { 
                position: fixed; 
                background: rgba(255, 255, 255, 0.6) !important; 
                backdrop-filter: blur(16px) !important;
                -webkit-backdrop-filter: blur(16px) !important;
                border: 1px solid rgba(0, 0, 0, 0.08);
                border-radius: 16px; z-index: 1000; padding: 12px; 
                width: fit-content; 
                min-width: 140px; max-width: 200px; 
                max-height: 70vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
                transition: opacity 0.4s, visibility 0.4s; opacity: 0; visibility: hidden;
                display: block;
            }
            .toc.show { opacity: 1; visibility: visible; }
            
            .toc::-webkit-scrollbar { width: 4px; }
            .toc::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
            
            /* 使用配置参数 */
            @media (min-width: ${TOC_CONFIG.pcWidth}px) { 
                .toc { left: calc(50% + ${TOC_CONFIG.pcOffset}); bottom: ${TOC_CONFIG.boxBottom}; } 
                .toc-icon { left: calc(50% + ${TOC_CONFIG.pcOffset}); } 
            }
            @media (max-width: ${TOC_CONFIG.pcWidth - 1}px) { 
                .toc { right: ${TOC_CONFIG.sideMargin}; bottom: ${TOC_CONFIG.boxBottom}; } 
                .toc-icon { right: ${TOC_CONFIG.sideMargin}; } 
            }
            
            .toc-link { 
                display: block; 
                padding: 8px 10px; 
                color: #24292e; text-decoration: none; 
                font-size: 13px; 
                border-radius: 0px; 
                transition: 0.2s; 
                white-space: normal; word-break: break-all; line-height: 1.4;           
                border-bottom: 1px solid rgba(0, 0, 0, 0.04); 
            }
            .toc-link:last-of-type { border-bottom: none; }
            .toc-link.active { color: ${TOC_CONFIG.mainColor} !important; background: ${TOC_CONFIG.activeBg}; font-weight: bold; }

            .toc-back-to-top {
                display: block; height: 0; opacity: 0; visibility: hidden; overflow: hidden;
                text-align: center; font-size: 12px; font-weight: 600; 
                color: ${TOC_CONFIG.mainColor}; 
                cursor: pointer;
                background: rgba(0, 0, 0, 0.03); 
                border-radius: 8px; transition: all 0.3s ease;
            }
            .toc-back-to-top.visible { height: 34px; line-height: 34px; opacity: 1; visibility: visible; margin-top: 8px; }

            .toc-icon { 
                position: fixed; bottom: ${TOC_CONFIG.iconBottom}; z-index: 1001; 
                width: ${TOC_CONFIG.iconSize}; height: ${TOC_CONFIG.iconSize}; 
                border-radius: 50%; background: #fff; border: 2px solid ${TOC_CONFIG.mainColor}; 
                display: flex; align-items: center; justify-content: center; cursor: pointer; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .toc-icon span { position: absolute; width: 15px; height: 2px; background: ${TOC_CONFIG.mainColor}; transition: 0.3s; }
            .toc-icon .line-1 { transform: translateY(-6px); }
            .toc-icon .line-3 { transform: translateY(6px); }
            .toc-icon.active .line-1 { transform: translateY(0) rotate(45deg); }
            .toc-icon.active .line-2 { opacity: 0; }
            .toc-icon.active .line-3 { transform: translateY(0) rotate(-45deg); }
        `;
        document.head.appendChild(tocStyle);

        const tocBox = document.createElement('div');
        tocBox.className = 'toc';
        const links = headings.map((h, i) => {
            if (!h.id) h.id = `toc-anchor-${i}`;
            const a = document.createElement('a');
            a.href = `#${h.id}`;
            a.textContent = h.textContent;
            a.className = 'toc-link';
            a.style.paddingLeft = `${(parseInt(h.tagName[1]) - 1) * 12 + 10}px`;
            tocBox.appendChild(a);
            return { h, a };
        });

        const backToTop = document.createElement('div');
        backToTop.className = 'toc-back-to-top';
        backToTop.innerHTML = '↑ 返回顶部';
        backToTop.onclick = (e) => { 
            e.stopPropagation();
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        };
        tocBox.appendChild(backToTop);

        document.body.appendChild(tocBox);

        const icon = document.createElement('div');
        icon.className = 'toc-icon';
        icon.innerHTML = '<span class="line-1"></span><span class="line-2"></span><span class="line-3"></span>';
        document.body.appendChild(icon);

        const toggle = () => {
            const isShow = tocBox.classList.toggle('show');
            icon.classList.toggle('active', isShow);
        };
        icon.onclick = (e) => { e.stopPropagation(); toggle(); };

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            let activeId = null;
            for (const h of headings) {
                if (h.getBoundingClientRect().top < 150) activeId = h.id;
            }
            links.forEach(({ h, a }) => a.classList.toggle('active', h.id === activeId));
        });

        if (window.innerWidth >= TOC_CONFIG.pcWidth) setTimeout(toggle, 800);

        document.addEventListener('click', (e) => {
            const isMobile = window.innerWidth < TOC_CONFIG.pcWidth;
            const isShowing = tocBox.classList.contains('show');
            const clickedOutside = !tocBox.contains(e.target) && !icon.contains(e.target);
            
            if (isMobile && isShowing && clickedOutside) {
                toggle();
            }
        });
    });
})();