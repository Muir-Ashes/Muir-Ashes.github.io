(function() {
    // 1. 播放器 HTML 结构
    var playerHTML = `
    <div id="musicPlayer" class="music-player">
      <div class="music-cover" id="musicCoverWrap">
        <img id="musicCover" alt="cover">
        <div class="music-cover-placeholder" id="musicCoverPlaceholder">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>
        </div>
      </div>
      <div class="music-info">
        <div class="music-title" id="musicTitle">未播放</div>
        <div class="music-artist" id="musicArtist">—</div>
      </div>
      <div class="music-controls">
        <button class="music-btn" id="musicPrev" aria-label="上一首">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z"/></svg>
        </button>
        <button class="music-btn music-play-btn" id="musicPlay" aria-label="播放/暂停">
          <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
        </button>
        <button class="music-btn" id="musicNext" aria-label="下一首">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z"/></svg>
        </button>
      </div>
      <div class="music-progress-wrap" id="musicProgressWrap">
        <div class="music-progress-bar" id="musicProgressBar"></div>
      </div>
      <audio id="musicAudio" preload="none"></audio>
    </div>`;

    // 2. 播放列表数据（换成你自己的音乐）
    window.musicPlayerData = {
        playlist: [
            {
                title: "歌曲名",
                artist: "歌手名",
                url: "/music/song.mp3",
                cover: "/images/covers/cover1.jpg"
            }
        ]
    };

    // 3. 动态插入播放器 HTML
    function initPlayer() {
        if (document.getElementById('musicPlayer')) return; // 已存在就不重复插入
        var wrapper = document.createElement('div');
        wrapper.innerHTML = playerHTML.trim();
        document.body.appendChild(wrapper.firstChild);

        // 4. 加载播放器逻辑脚本
        var script = document.createElement('script');
        script.src = '/js/music-player.js';
        script.onload = function() {
            // music-player.js 加载完后会自动初始化
        };
        document.body.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayer);
    } else {
        initPlayer();
    }

    // 兼容 Pjax 无刷新加载
    document.addEventListener('pjax:success', function() {
        if (!document.getElementById('musicPlayer')) {
            initPlayer();
        }
    });
})();
