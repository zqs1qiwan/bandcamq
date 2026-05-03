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
    <title>Bandcamp Downloader - 老白 Tools</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <style>
        :root {
            --bg: #0a0a0f;
            --bg2: #111318;
            --bg3: #1a1b23;
            --card: #16171f;
            --border: rgba(0,229,255,0.12);
            --accent: #00e5ff;
            --accent2: #1de9b6;
            --text: #e8eaf0;
            --muted: #8891a4;
            --danger: #ff5370;
            --radius: 14px;
            --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
            margin: 0; padding: 0;
            overflow-x: hidden;
        }
        body {
            font-family: var(--font);
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* ── Nav bar ── */
        .nav {
            width: 100%;
            background: var(--bg2);
            border-bottom: 1px solid var(--border);
            padding: 0 24px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .nav-logo {
            font-size: 1.1em;
            font-weight: 700;
            color: var(--accent);
            text-decoration: none;
            letter-spacing: 0.02em;
        }
        .nav-logo:hover { color: var(--accent2); }
        .nav-back {
            font-size: 0.92em;
            color: var(--muted);
            text-decoration: none;
            transition: color 0.2s;
        }
        .nav-back:hover { color: var(--text); }

        /* ── Page layout ── */
        .page {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 16px 60px;
        }

        /* ── Main card ── */
        .input-card {
            width: 100%;
            max-width: 680px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 32px 28px;
        }

        /* ── Header ── */
        .card-header {
            text-align: center;
            margin-bottom: 28px;
        }
        .card-header h1 {
            font-size: 1.6em;
            font-weight: 700;
            margin: 0 0 8px;
            background: linear-gradient(90deg, var(--accent), var(--accent2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .card-header p {
            font-size: 0.95em;
            color: var(--muted);
            margin: 0;
        }

        /* ── Input group ── */
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        input[type="text"] {
            width: 100%;
            padding: 13px 16px;
            font-size: 16px;
            font-family: var(--font);
            background: var(--bg3);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 10px;
            outline: none;
            transition: border-color 0.2s;
        }
        input[type="text"]::placeholder { color: var(--muted); }
        input[type="text"]:focus { border-color: var(--accent); }

        button#fetch-btn {
            width: 100%;
            padding: 13px 20px;
            font-size: 1em;
            font-weight: 600;
            font-family: var(--font);
            background: linear-gradient(90deg, var(--accent), var(--accent2));
            color: #0a0a0f;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.1s;
        }
        button#fetch-btn:hover { opacity: 0.88; }
        button#fetch-btn:active { transform: scale(0.98); }
        button#fetch-btn:disabled {
            opacity: 0.45;
            cursor: not-allowed;
            transform: none;
        }

        /* ── Results container ── */
        #results-container {
            margin-top: 24px;
            text-align: left;
            width: 100%;
        }

        /* ── Player ── */
        #player-container {
            display: block;
            margin-top: 24px;
            width: 100%;
            padding: 16px;
            background: var(--bg3);
            border: 1px solid var(--border);
            border-radius: var(--radius);
        }
        .player-top-row {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 10px;
        }
        #player-art {
            width: 52px;
            height: 52px;
            border-radius: 8px;
            flex-shrink: 0;
            object-fit: cover;
            border: 1px solid var(--border);
        }
        .player-info {
            flex: 1;
            min-width: 0;
            text-align: left;
        }
        #player-title {
            font-weight: 600;
            font-size: 0.97em;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--text);
        }
        #player-artist {
            font-size: 0.85em;
            color: var(--muted);
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 2px;
        }
        .player-timeline {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 6px;
        }
        #current-time, #total-time {
            font-size: 0.78em;
            color: var(--muted);
            min-width: 38px;
        }
        #current-time { text-align: left; }
        #total-time { text-align: right; }
        #progress-bar {
            flex: 1;
            accent-color: var(--accent);
        }
        .player-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            margin-top: 14px;
        }
        .player-buttons button {
            background: none;
            border: 1px solid var(--border);
            color: var(--text);
            border-radius: 50%;
            width: 40px; height: 40px;
            font-size: 1.15em; padding: 0;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
        }
        .player-buttons button:hover {
            background: var(--bg2);
            border-color: var(--accent);
        }
        button#play-pause-btn {
            width: 46px; height: 46px;
            font-size: 1.4em;
            background: rgba(0,229,255,0.1);
            border-color: var(--accent);
        }
        button#play-pause-btn:hover {
            background: rgba(0,229,255,0.2);
        }

        /* ── Album info ── */
        #album-info {
            text-align: center;
            margin-bottom: 20px;
        }
        #album-info img {
            width: 100%;
            max-width: 200px;
            border-radius: 10px;
            border: 1px solid var(--border);
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        #album-info h3 {
            font-size: 1.2em;
            font-weight: 600;
            margin: 14px 0 4px;
            color: var(--text);
        }
        #album-info h4 {
            font-size: 0.95em;
            font-weight: 400;
            color: var(--muted);
            margin: 0;
        }

        /* ── Track list ── */
        #track-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #track-list li {
            background: var(--bg3);
            border: 1px solid var(--border);
            padding: 11px 14px;
            margin-top: -1px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.2s;
            cursor: pointer;
        }
        #track-list li:first-child { border-radius: var(--radius) var(--radius) 0 0; }
        #track-list li:last-child { border-radius: 0 0 var(--radius) var(--radius); margin-bottom: 8px; }
        #track-list li:only-child { border-radius: var(--radius); }
        #track-list li:hover { background: var(--bg2); }
        .track-play-button {
            font-size: 1em;
            margin-right: 12px;
            color: var(--muted);
            transition: color 0.2s;
            flex-shrink: 0;
        }
        #track-list li:hover .track-play-button { color: var(--accent); }
        #track-list li.playing {
            background: rgba(0,229,255,0.07);
            border-color: rgba(0,229,255,0.3);
        }
        #track-list li.playing .track-play-button { color: var(--accent); }
        .track-info { flex: 1; margin-right: 10px; pointer-events: none; }
        .track-title { font-weight: 500; font-size: 0.95em; color: var(--text); }
        .track-duration { font-size: 0.85em; color: var(--muted); margin-left: 6px; }
        .track-download-button {
            text-decoration: none;
            padding: 6px 12px;
            background: rgba(29,233,182,0.12);
            color: var(--accent2);
            border: 1px solid rgba(29,233,182,0.3);
            border-radius: 8px;
            font-size: 0.85em;
            font-weight: 600;
            white-space: nowrap;
            transition: background 0.2s, border-color 0.2s;
            z-index: 2;
        }
        .track-download-button:hover {
            background: rgba(29,233,182,0.22);
            border-color: var(--accent2);
        }

        /* ── Error ── */
        .error {
            color: var(--danger);
            font-weight: 600;
            background: rgba(255,83,112,0.1);
            border: 1px solid rgba(255,83,112,0.25);
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 0.95em;
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
            .input-card { padding: 24px 16px; }
            .nav { padding: 0 16px; }
        }
    </style>
</head>
<body>

    <nav class="nav">
        <a href="https://tools.laobaitv.net" class="nav-logo">老白 Tools</a>
        <a href="https://tools.laobaitv.net" class="nav-back">← 返回工具箱</a>
    </nav>

    <div class="page">
      <div class="input-card">
        <div class="card-header">
            <h1>Bandcamp Downloader</h1>
            <p>输入 Bandcamp 专辑 URL，一键解析并下载曲目</p>
        </div>
        <div class="input-group">
            <input type="text" id="album-url" placeholder="https://artist.bandcamp.com/album/...">
            <button id="fetch-btn">获取曲目</button>
        </div>

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
      </div>
    </div>

    <audio id="global-player" preload="auto"></audio>

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