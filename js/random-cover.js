(function() {
    // 1. 把你的封面图片路径都写在这里
    var coverImages = [
        '/images/covers/1.jpg',
        '/images/covers/2.jpg',
        '/images/covers/3.jpg',
        // 按需添加更多...
    ];

    // 2. 随机选择函数，并尽量避免与上一次重复
    function getRandomImage() {
        if (coverImages.length === 0) return null;
        if (coverImages.length === 1) return coverImages[0];

        var lastIndex = localStorage.getItem('lastCoverIndex');
        var randomIndex = Math.floor(Math.random() * coverImages.length);

        // 如果随机到的和上次一样，就重新随机一次
        while (randomIndex == lastIndex && coverImages.length > 1) {
            randomIndex = Math.floor(Math.random() * coverImages.length);
        }

        localStorage.setItem('lastCoverIndex', randomIndex);
        return coverImages[randomIndex];
    }

    // 3. 应用背景图到 Banner
    function applyRandomCover() {
        var isHome = document.documentElement.classList.contains('is-home');
        if (!isHome) return; // 只在首页生效

        var banner = document.querySelector('.banner');
        if (!banner) return;

        var randomImage = getRandomImage();
        if (randomImage) {
            // 使用 !important 覆盖主题默认的背景图
            banner.style.setProperty('background-image', 'url("' + randomImage + '")', 'important');
        }
    }

    // 4. 页面加载和 Pjax 切换时都执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyRandomCover);
    } else {
        applyRandomCover();
    }
    document.addEventListener('pjax:success', applyRandomCover);
})();
