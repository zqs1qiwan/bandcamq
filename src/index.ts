export interface Env {
  BING_KV: KVNamespace;
}

// -----------------------------------------------------------------
//  bölüm 1: 前端 UI 界面 (V7.0 tools.laobaitv.net 统一风格)
// -----------------------------------------------------------------
const buildHtmlUI = (_imageUrl: string | null): string => {

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bandcamp 音乐下载 · 老白TV工具</title>
  <link rel="icon" href="https://laobaitv.net/favicon.ico">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:      #0a0a0f;
      --bg2:     #111318;
      --bg3:     #1a1b23;
      --card:    #16171f;
      --border:  rgba(0,229,255,0.12);
      --accent:  #00e5ff;
      --accent2: #1de9b6;
      --text:    #e8eaf0;
      --muted:   #8891a4;
      --danger:  #ff5370;
      --radius:  14px;
      --font:    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
    }

    html { scroll-behavior: smooth; }

    html, body {
      overflow-x: hidden;
      width: 100%;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
    }

    /* ── Nav ── */
    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 56px;
      background: var(--bg2);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      min-width: 0;
      box-sizing: border-box;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--text);
      font-size: 15px;
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
      transition: opacity 0.2s;
    }
    .logo:hover { opacity: 0.8; }
    .logo img {
      height: 26px;
      width: auto;
      flex-shrink: 0;
      filter: brightness(1.1);
    }
    .logo span {
      color: var(--accent);
      white-space: nowrap;
    }
    nav a.nav-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 13px;
      transition: color 0.2s;
      white-space: nowrap;
    }
    nav a.nav-link:hover { color: var(--text); }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-shrink: 0;
    }
    .nav-status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.76rem;
      color: var(--muted);
      white-space: nowrap;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent2);
      box-shadow: 0 0 6px rgba(29,233,182,0.6);
      flex-shrink: 0;
      animation: pulse-dot 2.5s infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @media (max-width: 480px) { .nav-status { display: none; } }

    /* ── Hero ── */
    .hero {
      flex: 1;
      padding: 72px 24px 48px;
      text-align: center;
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,229,255,0.08) 0%, transparent 70%);
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0,229,255,0.08);
      border: 1px solid rgba(0,229,255,0.2);
      color: var(--accent);
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 20px;
      letter-spacing: .5px;
    }

    .hero h1 {
      font-size: clamp(28px, 5vw, 48px);
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 14px;
      background: linear-gradient(135deg, #ffffff 0%, #a8d8ea 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero > p {
      color: var(--muted);
      font-size: 15px;
      max-width: 520px;
      margin: 0 auto 36px;
    }

    /* ── Input Card ── */
    .input-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px;
      max-width: 720px;
      margin: 0 auto;
      width: 100%;
      box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,255,0.04);
    }

    .input-row {
      display: flex;
      gap: 10px;
    }

    input#album-url {
      flex: 1;
      background: var(--bg2);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: var(--text);
      font-family: var(--font);
      font-size: 16px;
      padding: 12px 16px;
      height: 52px;
      outline: none;
      transition: border-color .2s;
      min-width: 0;
    }
    input#album-url::placeholder { color: var(--muted); }
    input#album-url:focus { border-color: rgba(0,229,255,0.4); }

    button#fetch-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 20px;
      height: 52px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: var(--font);
      cursor: pointer;
      border: none;
      transition: all .2s;
      white-space: nowrap;
      min-width: 96px;
      background: linear-gradient(135deg, #00b4d8, #00e5ff);
      color: #000;
    }
    button#fetch-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(0,229,255,0.35);
    }
    button#fetch-btn:active { transform: translateY(0); }
    button#fetch-btn:disabled {
      opacity: .5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .input-hint {
      margin-top: 12px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    /* ── Player Card ── */
    #player-container {
      display: none;
      max-width: 720px;
      margin: 20px auto 0;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      width: 100%;
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      animation: fadeUp .35s ease;
    }

    .player-top-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }

    #player-art {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      flex-shrink: 0;
      object-fit: cover;
      border: 1px solid var(--border);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .player-info {
      flex: 1;
      min-width: 0;
    }

    #player-title {
      font-weight: 600;
      font-size: 15px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text);
    }

    #player-artist {
      font-size: 13px;
      color: var(--muted);
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 3px;
    }

    .player-timeline {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #current-time, #total-time {
      font-size: 11px;
      color: var(--muted);
      min-width: 38px;
      font-variant-numeric: tabular-nums;
    }

    #current-time { text-align: left; }
    #total-time { text-align: right; }

    #progress-bar {
      flex: 1;
      accent-color: var(--accent);
      cursor: pointer;
    }

    .player-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
    }

    .player-buttons button {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 50%;
      width: 40px; height: 40px;
      font-size: 16px; padding: 0;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: background .2s, border-color .2s;
    }

    .player-buttons button:hover {
      background: rgba(255,255,255,0.09);
      border-color: var(--accent);
    }

    button#play-pause-btn {
      width: 48px; height: 48px;
      font-size: 20px;
      background: rgba(0,229,255,0.1);
      border-color: rgba(0,229,255,0.3);
    }

    button#play-pause-btn:hover {
      background: rgba(0,229,255,0.2);
      border-color: var(--accent);
    }

    /* ── Results Container ── */
    #results-container {
      max-width: 720px;
      margin: 20px auto 0;
      width: 100%;
    }

    /* ── Album Info (dynamically injected) ── */
    #album-info {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      text-align: center;
      margin-bottom: 16px;
      animation: fadeUp .35s ease;
    }

    #album-info img {
      width: 100%;
      max-width: 180px;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }

    #album-info h3 {
      font-size: 18px;
      font-weight: 700;
      margin: 16px 0 6px;
      color: var(--text);
      background: linear-gradient(135deg, #ffffff 0%, #a8d8ea 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #album-info h4 {
      font-size: 14px;
      font-weight: 400;
      color: var(--muted);
      margin: 0;
    }

    /* ── Track List (dynamically injected) ── */
    #track-list {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      animation: fadeUp .35s ease;
    }

    #track-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    #track-list li {
      background: transparent;
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background .2s;
      cursor: pointer;
      gap: 10px;
    }

    #track-list li:last-child { border-bottom: none; }
    #track-list li:hover { background: rgba(0,229,255,0.04); }

    #track-list li.playing {
      background: rgba(0,229,255,0.07);
      border-bottom-color: rgba(0,229,255,0.2);
    }

    .track-play-button {
      font-size: 14px;
      color: var(--muted);
      transition: color .2s;
      flex-shrink: 0;
      width: 20px;
      text-align: center;
    }

    #track-list li:hover .track-play-button { color: var(--accent); }
    #track-list li.playing .track-play-button { color: var(--accent); }

    .track-info {
      flex: 1;
      min-width: 0;
      pointer-events: none;
    }

    .track-title {
      font-weight: 500;
      font-size: 14px;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }

    .track-duration {
      font-size: 12px;
      color: var(--muted);
    }

    .track-download-button {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
      padding: 7px 14px;
      background: linear-gradient(135deg, #00b4d8, #00e5ff);
      color: #000;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      white-space: nowrap;
      transition: all .2s;
      border: none;
      cursor: pointer;
      flex-shrink: 0;
      z-index: 2;
    }

    .track-download-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(0,229,255,0.35);
    }

    /* ── Error ── */
    .error {
      background: rgba(255,83,112,0.08);
      border: 1px solid rgba(255,83,112,0.2);
      color: var(--danger);
      padding: 14px 18px;
      border-radius: var(--radius);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .spin {
      width: 16px; height: 16px;
      border: 2px solid rgba(0,229,255,0.3);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin .7s linear infinite;
      flex-shrink: 0;
    }

    /* ── Footer ── */
    footer {
      margin-top: 0;
      padding: 40px 24px 24px;
      text-align: center;
      color: var(--muted);
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    footer a { color: var(--muted); text-decoration: none; }
    footer a:hover { color: var(--accent); }

    /* ── Responsive ── */
    @media (max-width: 600px) {
      .hero { padding: 40px 16px 28px; }
      .hero > p { font-size: 14px; }
      .input-card { padding: 16px 12px; border-radius: 12px; }
      .input-row { flex-direction: column; }
      input#album-url { height: 48px; font-size: 16px; }
      button#fetch-btn { height: 44px; min-width: 0; border-radius: 10px; }
      #player-container { padding: 16px; }
      #results-container { padding: 0 4px; }
      nav a.nav-link { font-size: 12px; }
    }
  </style>
</head>
<body>

<nav>
  <a href="https://tools.laobaitv.net" class="logo">
    <img src="https://laobaitv.net/images/logo.svg" alt="老白TV" onerror="this.style.display='none'">
    老白TV <span>工具箱</span>
  </a>
  <div class="nav-right">
    <span class="nav-status">
      <span class="status-dot"></span>
      高品质 · 免费
    </span>
    <a href="https://laobaitv.net" class="nav-link" target="_blank" rel="noopener">laobaitv.net →</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-badge">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <circle cx="5" cy="5" r="4"/>
    </svg>
    高品质 · 免费下载 · 支持专辑
  </div>
  <h1>Bandcamp 音乐下载</h1>
  <p>粘贴专辑或单曲链接，获取高品质音频</p>

  <div class="input-card">
    <div class="input-row">
      <input type="text" id="album-url" placeholder="https://artist.bandcamp.com/album/...">
      <button id="fetch-btn">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        解析
      </button>
    </div>
    <div class="input-hint">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:2px">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
      支持 Bandcamp 专辑页和单曲页链接，点击解析后可在线试听并逐曲下载。
    </div>
  </div>
</section>

<div id="player-container">
  <div class="player-top-row">
    <img id="player-art" src="https://r2.laobaitv.net/laobaitv-logo-shade.png" alt="Album Art">
    <div class="player-info">
      <span id="player-title">laobaitv bandcamp</span>
      <span id="player-artist">by 老白Q</span>
    </div>
  </div>
  <div class="player-timeline">
    <span id="current-time">00:00</span>
    <input type="range" id="progress-bar" value="0" max="100">
    <span id="total-time">00:00</span>
  </div>
  <div class="player-buttons">
    <button id="prev-btn">⏮</button>
    <button id="play-pause-btn">▶</button>
    <button id="next-btn">⏭</button>
  </div>
</div>

<div id="results-container"></div>

<audio id="global-player" preload="auto"></audio>

<footer>
  <p>
    <a href="https://laobaitv.net">老白TV</a> ·
    <a href="https://tools.laobaitv.net">工具箱</a> ·
    本工具仅供个人学习研究使用
  </p>
  <p style="margin-top:6px;opacity:.5">版权 © 2026 老白TV</p>
</footer>

<script>
        let currentPlaylist = [];
        let currentAlbumArt = '';
        let currentAlbumArtist = '';
        let currentTrackIndex = -1;

        // ✅ 修复 2: 添加用于处理拖动状态的全局变量
        let isScrubbing = false;
        let wasPlayingBeforeScrub = false;

        const defaultArt = 'https://r2.laobaitv.net/laobaitv-logo-shade.png';
        const defaultTitle = 'laobaitv bandcamp';
        const defaultArtist = 'by 老白Q';

        const btn = document.getElementById('fetch-btn');
        const input = document.getElementById('album-url');
        const resultsDiv = document.getElementById('results-container');
        
        // ✅ 修复 1: 移除了 loading 变量的定义
        // const loading = document.getElementById('loading');
       
        const globalPlayer = document.getElementById('global-player');
        const playerContainer = document.getElementById('player-container');
        const playerArt = document.getElementById('player-art');
        const playerTitle = document.getElementById('player-title');
        const playerArtist = document.getElementById('player-artist');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress-bar');
       
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
       
        function formatTime(secs) {
            const minutes = Math.floor(secs / 60) || 0;
            const seconds = Math.floor(secs % 60) || 0;
            
            // (保持上次的修复: 使用 + 号拼接)
            return minutes + ':' + seconds.toString().padStart(2, '0');
        }

        btn.onclick = async () => {
            const targetUrl = input.value;
            if (!targetUrl) return;

            // ✅ 修复 1: 在按钮上显示加载状态
            btn.disabled = true;
            btn.textContent = '抓取中...';
            
            resultsDiv.innerHTML = ''; 
            // loading.style.display = 'block'; // (已移除)
           
            globalPlayer.pause(); 
            currentPlaylist = []; 
            resetPlayerUI();

            try {
                const resp = await fetch('api/get-tracks?url=' + encodeURIComponent(targetUrl)); 
                if (!resp.ok) throw new Error('服务器错误: ' + await resp.text());
               
                const data = await resp.json();
                if (!data.tracks || data.tracks.length === 0) {
                     resultsDiv.innerHTML = '<p class="error">未找到可下载的曲目。</p>';
                     return;
                }

                currentPlaylist = data.tracks;
                currentAlbumArt = data.album_art_url;
                currentAlbumArtist = data.artist || 'Various Artists';
                currentTrackIndex = -1;
               
                // XSS 防护：转义 HTML 特殊字符
                function escHtml(s) {
                    if (!s) return '';
                    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
                }

                let albumHtml = 
                    '<div id="album-info">' +
                        '<img src="' + escHtml(data.album_art_url) + '" alt="Album Art">' +
                        '<h3>' + escHtml(data.album_title) + '</h3>' +
                        '<h4>by ' + escHtml(currentAlbumArtist) + '</h4>' +
                    '</div>';
               
                let tracksHtml = '<div id="track-list"><ul>';
                for (let i = 0; i < data.tracks.length; i++) {
                    const track = data.tracks[i];
                    
                    const downloadUrl = 'api/download?url=' + encodeURIComponent(track.download_url) + '&filename=' + encodeURIComponent(track.title) + '.mp3';
                    
                    tracksHtml += 
                        '<li data-track-index="' + i + '">' +
                            '<div class="track-play-button">▶</div>' +
                            '<div class="track-info">' +
                                '<span class="track-title">' + escHtml(track.title) + '</span>' +
                                '<span class="track-duration">(' + escHtml(track.duration_text) + ')</span>' +
                            '</div>' +
                            '<a href="' + escHtml(downloadUrl) + '" target="_blank" class="track-download-button">下载</a>' +
                        '</li>';
                }
                tracksHtml += '</ul></div>';

                resultsDiv.innerHTML = albumHtml + tracksHtml;
                playerContainer.style.display = 'block';

            } catch (e) {
                resultsDiv.innerHTML = '<p class="error">获取失败: ' + e.message + '</p>';
                resetPlayerUI();
            } finally {
                // ✅ 修复 1: 恢复按钮状态
                btn.disabled = false;
                btn.textContent = '获取曲目';
                // loading.style.display = 'none'; // (已移除)
            }
        };

        function resetPlayerUI() {
            playerArt.src = defaultArt;
            playerTitle.textContent = defaultTitle;
            playerArtist.textContent = defaultArtist;
            playPauseBtn.textContent = '▶';
            progressBar.value = 0;
            currentTimeEl.textContent = '00:00';
            totalTimeEl.textContent = '00:00';
            currentTrackIndex = -1;
           
            document.querySelectorAll('#track-list li.playing').forEach(li => {
                li.classList.remove('playing');
                const playButton = li.querySelector('.track-play-button');
                if (playButton) playButton.textContent = '▶';
            });
        }

        function playTrack(index) {
            if (index < 0 || index >= currentPlaylist.length) {
                globalPlayer.pause();
                resetPlayerUI();
                return;
            }

            if (index === currentTrackIndex) {
                if (globalPlayer.paused) globalPlayer.play();
                else globalPlayer.pause();
                return;
            }

            currentTrackIndex = index;
            const track = currentPlaylist[index];

            globalPlayer.src = track.download_url; 
            globalPlayer.play();

            playerArt.src = currentAlbumArt;
            playerTitle.textContent = track.title;
            playerArtist.textContent = 'by ' + currentAlbumArtist;
           
            totalTimeEl.textContent = track.duration_text;
            currentTimeEl.textContent = '00:00';
           
            document.querySelectorAll('#track-list li').forEach((li, i) => {
                const isPlaying = (i === index);
                li.classList.toggle('playing', isPlaying);
                const playButton = li.querySelector('.track-play-button');
                if (playButton) playButton.textContent = isPlaying ? '⏸' : '▶';
            });
        }

        resultsDiv.onclick = (e) => {
            if (e.target.classList.contains('track-download-button')) return;
            const targetLi = e.target.closest('li[data-track-index]');
            if (targetLi) {
                const index = parseInt(targetLi.dataset.trackIndex, 10);
                playTrack(index);
            }
        };

        playPauseBtn.onclick = () => {
            if (currentTrackIndex === -1 && currentPlaylist.length > 0) {
                playTrack(0);
            } else if (globalPlayer.paused) {
                globalPlayer.play();
            } else {
                globalPlayer.pause();
            }
        };
        nextBtn.onclick = () => { playTrack(currentTrackIndex + 1); };
        prevBtn.onclick = () => { playTrack(currentTrackIndex - 1); };

        globalPlayer.onplay = () => {
            playPauseBtn.textContent = '⏸';
            const li = document.querySelector('li[data-track-index="' + currentTrackIndex + '"]');
            if (li) {
                li.classList.add('playing');
                li.querySelector('.track-play-button').textContent = '⏸';
            }
        };
        globalPlayer.onpause = () => {
            playPauseBtn.textContent = '▶';
            const li = document.querySelector('li[data-track-index="' + currentTrackIndex + '"]');
            if (li) {
                li.classList.remove('playing');
                li.querySelector('.track-play-button').textContent = '▶';
            }
        };
        globalPlayer.onended = () => { nextBtn.click(); };
       
        globalPlayer.ontimeupdate = () => {
            // ✅ 修复 2: 仅在用户没有拖动时才更新进度条
            if (!isScrubbing && globalPlayer.duration) {
                progressBar.value = (globalPlayer.currentTime / globalPlayer.duration) * 100;
                currentTimeEl.textContent = formatTime(globalPlayer.currentTime);
            }
        };
       
        globalPlayer.onloadedmetadata = () => {
            if (globalPlayer.duration) {
                totalTimeEl.textContent = formatTime(globalPlayer.duration);
            }
        };

        // ✅ 修复 2: 替换旧的 oninput 逻辑
        progressBar.oninput = () => {
            // 开始拖动
            if (!isScrubbing) {
                isScrubbing = true;
                wasPlayingBeforeScrub = !globalPlayer.paused;
                if (wasPlayingBeforeScrub) {
                    globalPlayer.pause();
                }
            }

            // 拖动过程中更新时间和显示
            if (globalPlayer.duration) {
                const newTime = (progressBar.value / 100) * globalPlayer.duration;
                globalPlayer.currentTime = newTime;
                // 手动更新时间显示，因为 ontimeupdate 被暂停了
                currentTimeEl.textContent = formatTime(newTime);
            }
        };
        
        // ✅ 修复 2: 添加 onchange 事件 (在松手时触发)
        progressBar.onchange = () => {
            if (isScrubbing) {
                if (wasPlayingBeforeScrub) {
                    globalPlayer.play();
                }
                isScrubbing = false;
                wasPlayingBeforeScrub = false;
            }
        };

        globalPlayer.onerror = () => {
            if (globalPlayer.src && globalPlayer.src !== '') { 
                alert('播放失败: 链接可能已过期。\\n请重新点击 "获取曲目" 按钮刷新列表。');
                resetPlayerUI();
            }
        };
    </script>
</body>
</html>
`;
};

// -----------------------------------------------------------------
// bölüm 2: Worker 路由和 Fetch 处理器 (V6.4 修复版)
// -----------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const basePath = "/bandcamp"; 
    let path = url.pathname;
    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length);
    }
    if (path === "") {
      path = "/";
    }

    // --- 路由 1: 根路径 (/) ---
    if (path === '/') {
      let imageUrl: string | null = null;
      try {
        imageUrl = await env.BING_KV.get("BING_IMAGE_URL");
      } catch (e: any) { console.error(`[UI] 从 KV 读取失败: ${e.message}`); }
      const html = buildHtmlUI(imageUrl);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    // --- 路由 2: 爬虫 API (/api/get-tracks) ---
    if (path === '/api/get-tracks') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) {
        return new Response('缺少 url 参数', { status: 400 });
      }

      // 安全校验：只允许 *.bandcamp.com 域名，防 SSRF
      try {
        const parsedUrl = new URL(targetUrl);
        if (!parsedUrl.hostname.endsWith('.bandcamp.com')) {
          return new Response('仅支持 bandcamp.com 域名', { status: 400 });
        }
      } catch {
        return new Response('无效的 URL', { status: 400 });
      }

      console.log(`[Prod] 正在抓取: ${targetUrl}`);
     
      try {
        const targetResp = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/5.0 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/5.0.36'
          }
        });
       
        if (!targetResp.ok) {
          return new Response(`[Prod] 抓取失败，状态码: ${targetResp.status}`, { status: 502 });
        }

        let rawTralbumData: string | null = null;
        const rewriter = new HTMLRewriter()
          .on('script[data-tralbum]', {
            element(element) {
              const data = element.getAttribute('data-tralbum');
              if (data) {
                rawTralbumData = data;
              }
            },
          });

        await rewriter.transform(targetResp).arrayBuffer(); 

        if (!rawTralbumData) {
          return new Response('未在此页面找到 data-tralbum。', { status: 404 });
        }

        const cleanedData = rawTralbumData.replace(/&quot;/g, '"');
        const albumInfo = JSON.parse(cleanedData);

        const artist = albumInfo.current.artist || albumInfo.artist || null;
        const albumTitle = albumInfo.current.title;
        const artId = albumInfo.current.art_id;
       
        const albumArtUrl = `https://f4.bcbits.com/img/a${artId}_16.jpg`; 
       
        const tracks = albumInfo.trackinfo.map((track: any) => {
          if (!track.file || !track.file['mp3-128']) {
            return null;
          }
          const duration = Math.round(track.duration);
          const minutes = Math.floor(duration / 60);
          const seconds = (duration % 60).toString().padStart(2, '0');
          return {
            title: track.title,
            duration_text: `${minutes}:${seconds}`, // 这里的 $ 是 OK 的，因为它在 bölüm 2 (Worker 作用域)
            download_url: track.file['mp3-128']
          };
        }).filter(Boolean); 

        const responsePayload = {
          album_title: albumTitle,
          artist: artist,
          album_art_url: albumArtUrl,
          tracks: tracks 
        };
       
        return new Response(JSON.stringify(responsePayload), {
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });

      } catch (e: any) {
        console.error(`[Prod] 解析时发生异常: ${e.message}`, e.stack);
        return new Response(`处理时发生内部错误: ${e.message}`, { status: 500 });
      }
    }

    // --- 路由 3: 下载代理 API (/api/download) ---
    if (path === '/api/download') {
      const mp3Url = url.searchParams.get('url');
      const filename = url.searchParams.get('filename') || 'download.mp3';
      if (!mp3Url) { return new Response('缺少 url 参数', { status: 400 }); }
     
      const decodedMp3Url = decodeURIComponent(mp3Url);

      // 安全校验：下载 URL 必须是 bcbits.com（Bandcamp CDN），防 SSRF
      try {
        const parsedMp3Url = new URL(decodedMp3Url);
        if (!parsedMp3Url.hostname.endsWith('.bcbits.com') && !parsedMp3Url.hostname.endsWith('.bandcamp.com')) {
          return new Response('无效的下载来源', { status: 400 });
        }
      } catch {
        return new Response('无效的 URL', { status: 400 });
      }

      const mp3Resp = await fetch(decodedMp3Url, {
        headers: { 'Referer': 'https://bandcamp.com/' }
      });

      if (!mp3Resp.ok) { return new Response('无法获取 MP3 文件 (上游服务器错误)', { status: 502 }); }

      const headers = new Headers(mp3Resp.headers);
      const decodedFilename = decodeURIComponent(filename);
      const encodedFilenameForHeader = encodeURIComponent(decodedFilename); 

      headers.set(
        'Content-Disposition', 
        `attachment; filename="${decodedFilename}"; filename*=UTF-8''${encodedFilenameForHeader}`
      );
     
      return new Response(mp3Resp.body, {
        status: mp3Resp.status,
        statusText: mp3Resp.statusText,
        headers: headers
      });
    }

    // --- 路由 4: 404 ---
    return new Response(`Not Found: ${path}`, { status: 404 });
  },
};