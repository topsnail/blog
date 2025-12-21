(function() {
    const UI_CONFIG = {
        bodyBg: 'rgba(255, 255, 255, 0.8)', 
        borderRadius: '12px'
    };

    const themeCss = `
        html { 
            background: url('/bj2.webp') no-repeat center center fixed !important; 
            background-size: cover !important; 
        }
        
        body { 
            background: ${UI_CONFIG.bodyBg} !important; 
            max-width: 885px !important; 
            margin: 25px auto !important; 
            border-radius: ${UI_CONFIG.borderRadius} !important; 
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.3) !important; 
            padding: 20px !important; 
        }

        @media (max-width: 767px) {
            body { 
                margin: 4px 4px !important; 
                padding: 6px !important; 
            }
            #header { 
                margin-bottom: 8px !important; 
                padding: 0 !important;
            }
            .LabelTime { 
                display: inline-block !important; 
                visibility: visible !important; 
                opacity: 1 !important;
                margin-left: 8px !important;
            }
            .Header-item { 
                display: flex !important; 
                flex-direction: row !important; 
                flex-wrap: nowrap !important;
            }
        }

        .SideNav { 
            overflow: visible !important; 
            border: none !important; 
            background: transparent !important; 
        }

        .SideNav-item { 
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: none !important; 
            border-bottom: 1px solid rgba(0,0,0,0.05) !important;
            position: relative;
        }

        .SideNav-item:hover { 
            background-color: #c3e4e3 !important;           
            transform: scaleX(1.02) scale(1.01) !important; 
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12) !important; 
            z-index: 10;
            border-radius: 10px !important; 
        }

        .markdown-body h1 { 
            display: inline-block; 
            background: #ef7060; 
            color: #fff; 
            padding: 4px 12px; 
            border-radius: 8px; 
            font-weight: 400;
        }
    `;

    const style = document.createElement('style');
    style.textContent = themeCss;
    document.head.appendChild(style);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const searchInput = document.querySelector('.subnav-search-input');
            if (document.activeElement === searchInput) {
                e.preventDefault();
                if (typeof searchShow === 'function') {
                    searchShow();
                } else {
                    const searchButton = document.querySelector('.subnav-search-icon, .btn-primary, button');
                    if (searchButton) searchButton.click();
                }
            }
        }
    });
})();
