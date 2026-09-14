(function() {
    var cfg = window.musicPlayerData || { playlist: [] };
    var playlist = cfg.playlist || [];
    var player = document.getElementById('musicPlayer');
    var audio = document.getElementById('musicAudio');
    if (!player || !audio) return;
    
    var coverImg = document.getElementById('musicCover');
    var coverPlaceholder = document.getElementById('musicCoverPlaceholder');
    var titleEl = document.getElementById('musicTitle');
    var artistEl = document.getElementById('musicArtist');
    var playBtn = document.getElementById('musicPlay');
    var prevBtn = document.getElementById('musicPrev');
    var nextBtn = document.getElementById('musicNext');
    var iconPlay = playBtn.querySelector('.icon-play');
    var iconPause = playBtn.querySelector('.icon-pause');
    var progressWrap = document.getElementById('musicProgressWrap');
    var progressBar = document.getElementById('musicProgressBar');

    var isPlaying = false, currentSong = null, plIdx = -1;
    var _progressRAF = null, isDragging = false;

    function constrainPlayer(save) {
        var w = player.offsetWidth, h = player.offsetHeight;
        var vw = window.innerWidth, vh = window.innerHeight;
        if (w === 0 || h === 0) return;
        var curLeft = parseInt(player.style.left);
        var curTop = parseInt(player.style.top);
        if (isNaN(curLeft) || isNaN(curTop)) return;
        var newLeft = Math.max(10, Math.min(curLeft, vw - w - 10));
        var newTop = Math.max(10, Math.min(curTop, vh - h - 10));
        if (newLeft !== curLeft || newTop !== curTop) {
            player.style.bottom = 'auto'; player.style.right = 'auto';
            player.style.left = newLeft + 'px'; player.style.top = newTop + 'px';
        }
        if (save && !isNaN(newLeft) && !isNaN(newTop)) {
            localStorage.setItem('musicPlayerPos', JSON.stringify({ left: newLeft, top: newTop }));
        }
    }

    var savedPos = localStorage.getItem('musicPlayerPos');
    if (savedPos) {
        var pos = JSON.parse(savedPos);
        if (!isNaN(pos.left) && !isNaN(pos.top)) {
            player.style.left = pos.left + 'px'; player.style.top = pos.top + 'px';
            player.style.bottom = 'auto'; player.style.right = 'auto';
        } else {
            player.style.right = '20px'; player.style.bottom = '20px';
        }
    } else {
        player.style.right = '20px'; player.style.bottom = '20px';
    }

    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() { constrainPlayer(true); }, 100);
    });

    (function initDraggable() {
        var startX, startY, initialLeft, initialTop;
        function getClientPos(e) {
            if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            return { x: e.clientX, y: e.clientY };
        }
        function onDragStart(e) {
            if (e.target.closest('.music-btn') || e.target.closest('.music-progress-wrap')) return;
            var pos = getClientPos(e);
            startX = pos.x; startY = pos.y;
            initialLeft = player.offsetLeft; initialTop = player.offsetTop;
            isDragging = false;
            function onDragMove(ev) {
                if (ev.touches) ev.preventDefault();
                var cp = getClientPos(ev);
                var dx = cp.x - startX, dy = cp.y - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;
                if (isDragging) {
                    player.classList.add('dragging');
                    player.style.bottom = 'auto'; player.style.right = 'auto';
                    player.style.left = (initialLeft + dx) + 'px';
                    player.style.top = (initialTop + dy) + 'px';
                }
            }
            function onDragEnd(ev) {
                document.removeEventListener('mousemove', onDragMove);
                document.removeEventListener('mouseup', onDragEnd);
                document.removeEventListener('touchmove', onDragMove);
                document.removeEventListener('touchend', onDragEnd);
                player.classList.remove('dragging');
                if (isDragging) { constrainPlayer(true); ev.stopPropagation(); }
            }
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
            document.addEventListener('touchmove', onDragMove, { passive: false });
            document.addEventListener('touchend', onDragEnd);
        }
        player.addEventListener('mousedown', onDragStart);
        player.addEventListener('touchstart', onDragStart, { passive: false });
    })();

    player.addEventListener('click', function(e) {
        if (e.target.closest('.music-btn') || e.target.closest('.music-progress-wrap')) return;
        if (isDragging) { isDragging = false; return; }
        player.classList.toggle('show-progress');
    });

    function applySong(song) {
        if (!song) return;
        currentSong = song;
        progressBar.style.width = '0%';
        var coverUrl = song.cover || '';
        if (coverUrl) {
            coverImg.src = coverUrl;
            coverImg.onload = function() { coverImg.classList.add('loaded'); coverPlaceholder.style.display = 'none'; };
            coverImg.onerror = function() { coverImg.classList.remove('loaded'); coverPlaceholder.style.display = 'flex'; };
        } else {
            coverImg.classList.remove('loaded'); coverPlaceholder.style.display = 'flex';
        }
        titleEl.textContent = song.title || '未知歌曲';
        artistEl.textContent = song.artist || '未知歌手';
        if (song.url) audio.src = song.url;
        else audio.removeAttribute('src');
    }

    function loadSong(dir) {
        if (!playlist.length) return;
        if (dir === 'next') plIdx = (plIdx + 1) % playlist.length;
        else if (dir === 'prev') plIdx = (plIdx - 1 + playlist.length) % playlist.length;
        else plIdx = plIdx < 0 ? 0 : plIdx;
        applySong(playlist[plIdx]);
    }

    function togglePlay() {
        if (!audio.src && currentSong && currentSong.url) audio.src = currentSong.url;
        if (!audio.src) {
            loadSong('next');
            setTimeout(function() { if (audio.src) audio.play().catch(function() {}); }, 100);
            return;
        }
        if (isPlaying) audio.pause();
        else audio.play().catch(function() {});
    }

    function updatePlayState(playing) {
        isPlaying = playing;
        if (playing) {
            iconPlay.style.display = 'none'; iconPause.style.display = 'block';
            player.classList.add('playing'); player.classList.add('show-progress');
        } else {
            iconPlay.style.display = 'block'; iconPause.style.display = 'none';
            player.classList.remove('playing');
        }
    }

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', function() {
        var was = isPlaying;
        if (was) { audio.pause(); audio.currentTime = 0; }
        loadSong('prev');
        if (was && audio.src) audio.play().catch(function() {});
    });
    nextBtn.addEventListener('click', function() {
        var was = isPlaying;
        if (was) { audio.pause(); audio.currentTime = 0; }
        loadSong('next');
        if (was && audio.src) audio.play().catch(function() {});
    });

    audio.addEventListener('play', function() { updatePlayState(true); });
    audio.addEventListener('pause', function() { updatePlayState(false); });
    audio.addEventListener('ended', function() { loadSong('next'); if (audio.src) audio.play().catch(function() {}); });

    function updateProgress() {
        if (audio.duration && isFinite(audio.duration)) {
            progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
        }
        if (isPlaying) _progressRAF = requestAnimationFrame(updateProgress);
    }
    audio.addEventListener('play', function() { cancelAnimationFrame(_progressRAF); _progressRAF = requestAnimationFrame(updateProgress); });
    audio.addEventListener('pause', function() { cancelAnimationFrame(_progressRAF); });

    if (progressWrap) {
        progressWrap.addEventListener('click', function(e) {
            if (!audio.duration || !isFinite(audio.duration)) return;
            var rect = progressWrap.getBoundingClientRect();
            var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audio.currentTime = ratio * audio.duration;
        });
    }

    if (playlist.length > 0) loadSong('next');
})();
