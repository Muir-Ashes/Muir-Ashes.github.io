(function() {
    // ============================================
    // 1. 图片库配置
    // ============================================
    var imageLibraries = {
        covers: [
            '/images/covers/cover1.jpg',
            '/images/covers/cover2.jpeg',
            '/images/covers/cover3.jpeg',
	    '/images/covers/cover4.jpeg',
	    '/images/covers/cover5.jpeg'
		
        ],
        avatars: [
            '/images/avatars/avatars1.jpg',
            '/images/avatars/avatars2.jpg',
            '/images/avatars/avatars3.jpg',
	    '/images/avatars/avatars4.jpeg',
	    '/images/avatars/avatars5/jpeg'
        ],
        thumbnails: [
            '/images/thumbnails/thumbnails1.jpeg',
            '/images/thumbnails/thumbnails2.png',
            '/images/thumbnails/thumbnails3.png',
	//    '/images/thumbnails/4.jpg',
        //    '/images/thumbnails/5.jpg'
        ]
    };

    // ============================================
    // 2. 随机选择（避免连续两次相同）
    // ============================================
    function getRandomImage(libName) {
        var lib = imageLibraries[libName];
        if (!lib || lib.length === 0) return null;
        if (lib.length === 1) return lib[0];

        var randomIndex = Math.floor(Math.random() * lib.length);
        try {
            var storageKey = 'lastIndex_' + libName;
            var lastIndex = localStorage.getItem(storageKey);
            while (randomIndex == lastIndex && lib.length > 1) {
                randomIndex = Math.floor(Math.random() * lib.length);
            }
            localStorage.setItem(storageKey, randomIndex);
        } catch (e) {}
        return lib[randomIndex];
    }

    // ============================================
    // 3. 随机全屏封面
    // ============================================
    function randomCover() {
        var banner = document.querySelector('.banner');
        if (!banner) return;
        var img = getRandomImage('covers');
        if (img) {
            banner.style.setProperty('background-image', 'url("' + img + '")', 'important');
        }
    }

    // ============================================
    // 4. 随机头像
    // ============================================
    function randomAvatar() {
        var avatar = document.getElementById('leftbar_overview_author_image');
        if (!avatar) return;
        var img = getRandomImage('avatars');
        if (img) {
            avatar.style.setProperty('background-image', 'url("' + img + '")', 'important');
        }
    }

    // ============================================
    // 5. 随机文章缩略图
    // ============================================
    function randomThumbnails() {
        var cards = document.querySelectorAll(
            '#main article.post, #main article.post-preview, .post-preview'
        );
        if (cards.length === 0) return;

        cards.forEach(function(card) {
            var thumb = card.querySelector('.post-thumbnail');
            if (!thumb) return;

            // 如果文章自带封面图（真实图片），跳过不覆盖
            if (thumb.tagName === 'IMG' &&
                thumb.src && thumb.src.indexOf('data:image') === -1 &&
                thumb.naturalWidth > 0) {
                return;
            }

            var img = getRandomImage('thumbnails');
            if (!img) return;

            if (thumb.tagName === 'IMG') {
                thumb.src = img;
                thumb.classList.add('lazyload-loaded');
                thumb.style.opacity = '1';
            } else {
                thumb.style.setProperty('background-image', 'url("' + img + '")', 'important');
            }
        });
    }

    // ============================================
    // 6. 初始化
    // ============================================
    function initAll() {
        randomCover();
        randomAvatar();
        randomThumbnails();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initAll, 100);
        });
    } else {
        setTimeout(initAll, 100);
    }

    // 兼容 Pjax 无刷新加载
    document.addEventListener('pjax:success', function() {
        setTimeout(initAll, 100);
    });
    document.addEventListener('pjax:complete', function() {
        setTimeout(initAll, 100);
    });
    document.addEventListener('pjax:end', function() {
        setTimeout(initAll, 100);
    });
})();
