const GLOBAL_CONFIG = {
  background: {
    gradientColors: ['#5f7470', '#889696', '#278668', '#5c8001', '#f09460', '#7a9e9f'], // 你的指定6色
    gradientAngle: '45deg', // 45度渐变角度
    animationDuration: '15s', // 15秒周期
    animationTimingFunction: 'ease-in-out', // 平滑速度曲线，保证呼吸感
    isSeamless: true, // 开启无缝循环渐变
    opacity: 1, // 渐变整体透明度
    fallbackColor: '#889696' // 兜底背景色（动画不兼容时生效）
  },
  maxWidth: '1200px',
  borderRadius: '8px',
  transitionDuration: '0.3s',
  accentColor: '#278668',
  codeBgColor: '#f5f5f5',
  hoverHighlightColor: 'rgba(39, 134, 104, 0.1)'
};

// 背景预加载/兜底函数（仅移除图片加载，保留核心兜底功能，函数名和调用逻辑不变）
function preloadBackgroundImage() {
  // 构建兜底样式，确保动画不兼容时页面无空白，保留原有兜底核心逻辑
  const fallbackStyle = document.createElement('style');
  fallbackStyle.textContent = `
    html {
      background-color: ${GLOBAL_CONFIG.background.fallbackColor} !important;
    }
  `;
  document.head.appendChild(fallbackStyle);
}

// 页面健壮性增强（原有功能，完整保留，无任何修改）
function enhanceRobustness() {
  // 校验核心DOM元素是否存在，避免后续操作报错（原有逻辑，原样保留）
  const sideNav = document.querySelector('.SideNav');
  const labelTime = document.querySelector('.LabelTime');
  if (sideNav) sideNav.style.transition = `all ${GLOBAL_CONFIG.transitionDuration} ease`;
  if (labelTime) labelTime.style.color = GLOBAL_CONFIG.accentColor;
}

// 图片懒加载优化（原有功能，完整保留，无任何修改）
function initImageLazyLoad() {
  // 为markdown图片添加懒加载，加载失败显示占位图（原有逻辑，原样保留）
  const images = document.querySelectorAll('article img');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.onerror = function() {
      this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999">图片加载失败</text></svg>';
      this.alt = '图片加载失败，请刷新页面重试';
    };
  });
}

// 标签页搜索回车触发（原有功能，完整保留，无任何修改）
function initSearchEnterTrigger() {
  if (window.location.pathname.includes('/tag')) {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    if (searchInput && searchBtn) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchBtn.click();
      });
    }
  }
}

// 核心：构建样式（仅修改html背景相关，其余原有样式完整保留）
function buildGlobalStyles() {
  // 解构背景配置，简化CSS编写（新增，不影响原有逻辑）
  const {
    gradientColors,
    gradientAngle,
    animationDuration,
    animationTimingFunction,
    isSeamless,
    opacity
  } = GLOBAL_CONFIG.background;

  // 构建最终CSS，仅替换背景部分，其余原有样式完整复制
  let finalCss = `
    /* ******** 优化后的背景渐变呼吸动画（无缝+性能优化）******** */
    @keyframes gradientBreath {
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

    html {
      /* 原有html核心布局属性，完整保留 */
      width: 100%;
      height: 100vh;
      position: fixed;
      /* 优化后的无缝渐变背景 */
      background: linear-gradient(${gradientAngle}, ${gradientColors.join(', ')}, ${gradientColors[0]});
      background-size: ${isSeamless ? '200% 200%' : 'cover'};
      background-repeat: no-repeat;
      background-position: center;
      /* 绑定动画，确保过渡自然 */
      animation: gradientBreath ${animationDuration} infinite ${animationTimingFunction};
      opacity: ${opacity};
      /* 性能优化：开启GPU加速，降低渲染开销 */
      will-change: background-position;
      backface-visibility: hidden;
      transform: translateZ(0);
      /* 为伪元素遮罩提供定位容器 */
      position: relative;
    }

    /* 新增：轻微遮罩层，提升页面内容可读性，不遮挡任何交互 */
    html::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(1px);
      z-index: -1;
      pointer-events: none;
    }

    /* ******** 以下为原有核心样式，一字不改，确保原有功能生效 ******** */
    /* 原有body样式 */
    body {
      max-width: ${GLOBAL_CONFIG.maxWidth};
      margin: 0 auto;
      padding: 20px;
      border-radius: ${GLOBAL_CONFIG.borderRadius};
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      transition: all ${GLOBAL_CONFIG.transitionDuration} ease;
      box-sizing: border-box;
    }

    /* 原有侧边栏样式 */
    .SideNav {
      width: 240px;
      padding: 15px;
      border-radius: ${GLOBAL_CONFIG.borderRadius};
      transition: all ${GLOBAL_CONFIG.transitionDuration} ease;
      margin-right: 20px;
      float: left;
    }

    .SideNav .nav-item {
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all ${GLOBAL_CONFIG.transitionDuration} ease;
    }

    /* 原有时间标签样式 */
    .LabelTime {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 8px;
    }

    /* 原有文章项样式 */
    .post-item {
      padding: 16px;
      border-radius: ${GLOBAL_CONFIG.borderRadius};
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all ${GLOBAL_CONFIG.transitionDuration} ease;
    }

    .post-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    /* 原有链接样式 */
    a {
      color: ${GLOBAL_CONFIG.accentColor};
      text-decoration: none;
      transition: color ${GLOBAL_CONFIG.transitionDuration} ease;
    }

    a:hover {
      color: ${GLOBAL_CONFIG.hoverHighlightColor.replace('0.1', '0.8')};
      text-decoration: underline;
    }

    /* 原有代码块样式 */
    pre, code {
      background-color: ${GLOBAL_CONFIG.codeBgColor};
      border-radius: 4px;
      padding: 2px 4px;
      font-family: "Consolas", "Monaco", monospace;
    }

    pre {
      padding: 16px;
      overflow-x: auto;
      margin: 16px 0;
    }

    /* 原有响应式样式 */
    @media (max-width: 1024px) and (min-width: 768px) {
      body {
        max-width: 90%;
        padding: 15px;
      }
      .SideNav {
        width: 200px;
        margin-right: 15px;
      }
    }

    @media (max-width: 767px) {
      .SideNav {
        float: none;
        width: 100%;
        margin-right: 0;
        margin-bottom: 20px;
      }
      body {
        padding: 10px;
        max-width: 95%;
      }
    }

    /* ******** 原有页面差异化样式，完整保留 ******** */
    /* 首页/列表页样式 */
    ${window.location.pathname === '/' || window.location.pathname.includes('/page') ? `
      .SideNav .nav-item:hover {
        background-color: ${GLOBAL_CONFIG.hoverHighlightColor};
        transform: scale(1.02);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
    ` : ''}

    /* 文章/关于/链接页样式 */
    ${window.location.pathname.includes('/post/') || window.location.pathname === '/about.html' || window.location.pathname === '/links.html' ? `
      article img {
        border-radius: ${GLOBAL_CONFIG.borderRadius};
        border: 1px solid #eee;
        max-width: 100%;
        height: auto;
      }
      h1 {
        color: ${GLOBAL_CONFIG.accentColor};
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
        margin-bottom: 24px;
      }
      pre::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      pre::-webkit-scrollbar-thumb {
        background-color: ${GLOBAL_CONFIG.accentColor};
        border-radius: 4px;
      }
      pre::-scrollbar {
        width: 8px;
        height: 8px;
      }
      pre::-scrollbar-thumb {
        background-color: ${GLOBAL_CONFIG.accentColor};
        border-radius: 4px;
      }
    ` : ''}

    /* 标签页样式 */
    ${window.location.pathname.includes('/tag') ? `
      .search-input {
        width: 200px;
        padding: 8px 12px;
        border-radius: ${GLOBAL_CONFIG.borderRadius};
        border: 1px solid #eee;
        margin-right: 8px;
        transition: all ${GLOBAL_CONFIG.transitionDuration} ease;
      }
      .search-input:focus {
        border-color: ${GLOBAL_CONFIG.accentColor};
        outline: none;
        box-shadow: 0 0 0 2px rgba(39, 134, 104, 0.2);
      }
      .search-btn {
        padding: 8px 16px;
        border-radius: ${GLOBAL_CONFIG.borderRadius};
        border: none;
        background-color: ${GLOBAL_CONFIG.accentColor};
        color: #fff;
        cursor: pointer;
        transition: all ${GLOBAL_CONFIG.transitionDuration} ease;
      }
      .search-btn:hover {
        background-color: ${GLOBAL_CONFIG.accentColor.replace('rgb', 'rgba').replace(')', ', 0.8)')};
      }
      .tag-extra-btn {
        display: none;
      }
    ` : ''}
  `;

  // 注入样式到页面（原有逻辑，完整保留）
  const styleTag = document.createElement('style');
  styleTag.textContent = finalCss;
  document.head.appendChild(styleTag);
}

// 页面DOM加载完成后执行（原有入口逻辑，完整保留）
document.addEventListener('DOMContentLoaded', () => {
  // 执行顺序与原有一致，确保功能正常触发
  preloadBackgroundImage();
  buildGlobalStyles();
  enhanceRobustness();
  initImageLazyLoad();
  initSearchEnterTrigger();
});
