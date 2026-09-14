(function() {
    // 检测是否在首页
    function isHomePage() {
        var path = window.location.pathname;
        return path === '/' || path === '/index.html' || path === '/index.htm';
    }

    // 初始化全屏封面
    function initCover() {
        if (!isHomePage()) {
            document.documentElement.classList.remove('banner-as-cover');
            document.documentElement.classList.remove('is-home');
            return;
        }

        document.documentElement.classList.add('banner-as-cover');
        document.documentElement.classList.add('is-home');

        // 插入向下箭头
        var bannerContainer = document.querySelector('.banner-container');
        if (bannerContainer && !document.querySelector('.cover-scroll-down')) {
            var arrow = document.createElement('a');
            arrow.className = 'cover-scroll-down';
            arrow.href = '#content';
            arrow.innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>';
            bannerContainer.appendChild(arrow);

            arrow.addEventListener('click', function(e) {
                e.preventDefault();
                var content = document.getElementById('content');
                if (content) {
                    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // 滚动时隐藏箭头
        var arrow = document.querySelector('.cover-scroll-down');
        if (arrow) {
            function handleScroll() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop >= window.innerHeight * 0.6) {
                    arrow.classList.add('hidden');
                } else {
                    arrow.classList.remove('hidden');
                }
            }
            window.removeEventListener('scroll', handleScroll);
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCover);
    } else {
        initCover();
    }

    // 兼容 Pjax 无刷新加载
    document.addEventListener('pjax:success', initCover);
})();
