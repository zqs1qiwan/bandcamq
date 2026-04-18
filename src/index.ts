export interface Env {
  BING_KV: KVNamespace;
}

// -----------------------------------------------------------------
//  bölüm 1: 前端 UI 界面 (V6.5 UX 优化 - 修复版)
// -----------------------------------------------------------------
const buildHtmlUI = (imageUrl: string | null): string => {

  const bgImageUrl = imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';

  return `
<!DOCTYPE html>
<html>
<head>
    <title>LaobaiTV bandcamp Downloader</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0; padding: 20px; color: #fff;
            background-image: url('${bgImageUrl}');
            background-size: cover; background-position: center center; background-attachment: fixed;
            min-height: 100vh; display: flex; flex-direction: column; align-items: center;
        }
        .container {
            width: 100%; max-width: 700px; margin-top: 5vh; padding: 25px 30px;
            background-color: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        h2 {
            color: #fff; font-family: 'Montserrat', sans-serif; font-size: 2.2em; font-weight: 700;
            margin-top: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); 
            user-select: none; -webkit-user-select: none; -moz-user-select: none;
            margin-bottom: 30px; 
        }
        .container p { 
            color: rgba(255, 255, 255, 0.9); 
            margin-top: 0; 
            margin-bottom: 10px; 
            user-select: none; -webkit-user-select: none; -moz-user-select: none;
        }
        .input-group { margin: 0; display: flex; flex-direction: column; gap: 15px; }
        input[type="text"] {
            width: 100%; padding: 12px; font-size: 1em; border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px; box-sizing: border-box; background-color: rgba(0, 0, 0, 0.2);
            color: #fff; text-align: center;
        }
        input[type="text"]::placeholder { color: rgba(255, 255, 255, 0.5); }
        input[type="text"]:focus { border-color: rgba(255, 255, 255, 0.6); outline: none; }
        button#fetch-btn {
            padding: 12px 20px; font-size: 1.1em; font-weight: 600;
            background-color: rgba(255, 255, 255, 0.15); color: white; border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px; cursor: pointer; transition: background-color 0.2s ease;
        }
        button#fetch-btn:hover { background-color: rgba(255, 255, 255, 0.25); }

        /* ✅ 修复 1: 添加按钮禁用时的样式 */
        button#fetch-btn:disabled {
            background-color: rgba(100, 100, 100, 0.3);
            color: rgba(255, 255, 255, 0.5);
            cursor: not-allowed;
        }

        #loading { margin-top: 15px; display: none; } /* (此样式保留，但元素已被移除) */
        #results-container { margin-top: 20px; text-align: left; width: 100%; }
       
        #player-container {
            display: block; margin-top: 20px; width: 100%;
            padding: 15px; background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px; box-sizing: border-box;
        }
        .player-top-row {
            display: flex; align-items: center;
            gap: 15px; margin-bottom: 10px;
        }
        #player-art {
            width: 50px; height: 50px; border-radius: 4px;
            flex-shrink: 0; object-fit: cover;
        }
        .player-info {
            flex: 1; white-space: nowrap; overflow: hidden;
            text-overflow: ellipsis; text-align: left; min-width: 0;
        }
        #player-title { 
            font-weight: 600; display: block; white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis;
        }
        #player-artist { 
            font-size: 0.9em; color: rgba(255, 255, 255, 0.8); 
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .player-timeline {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 5px;
        }
        #current-time, #total-time {
            font-size: 0.8em;
            color: rgba(255, 255, 255, 0.7);
            min-width: 40px;
        }
        #current-time { text-align: left; }
        #total-time { text-align: right; }
        #progress-bar {
            width: 100%;
            flex: 1;
            accent-color: #fff;
        }
        .player-buttons {
            display: flex; align-items: center;
            justify-content: center; gap: 20px; margin-top: 15px;
        }
        .player-buttons button {
            background: none; border: 1px solid rgba(255, 255, 255, 0.3);
            color: white; border-radius: 50%;
            width: 40px; height: 40px; font-size: 1.2em; padding: 0;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: background-color 0.2s ease;
        }
        .player-buttons button:hover { background-color: rgba(255, 255, 255, 0.1); }
        button#play-pause-btn { width: 45px; height: 45px; font-size: 1.5em; }
       
        #album-info {
            text-align: center;
            margin-bottom: 25px;
        }
        #album-info img {
            width: 100%;
            max-width: 210px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        #album-info h3 {
            font-size: 1.3em;
            font-weight: 600;
            margin: 15px 0 5px 0;
        }
        #album-info h4 {
            font-size: 1.0em;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
        }
       
        #track-list ul { list-style-type: none; padding-left: 0; }
        #track-list li {
            background-color: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 15px; margin-top: -1px; display: flex;
            justify-content: space-between; align-items: center; transition: background-color 0.2s ease;
            cursor: pointer;
        }
        #track-list li:first-child { border-top-left-radius: 8px; border-top-right-radius: 8px; }
        #track-list li:last-child { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; margin-bottom: 10px; }
        #track-list li:hover { background-color: rgba(0, 0, 0, 0.5); }
        .track-play-button {
            font-size: 1.1em; margin-right: 15px;
            color: rgba(255, 255, 255, 0.7); transition: color 0.2s ease;
        }
        #track-list li:hover .track-play-button { color: #fff; }
        #track-list li.playing {
            background-color: rgba(0, 123, 255, 0.3);
            border-color: rgba(0, 123, 255, 0.5);
        }
        #track-list li.playing .track-play-button { color: #007bff; content: '⏸'; }
        .track-info { flex: 1; margin-right: 10px; pointer-events: none; }
        .track-title { font-weight: 500; }
        .track-duration { font-size: 0.9em; color: rgba(255, 255, 255, 0.7); margin-left: 8px; }
        .track-download-button {
            text-decoration: none; padding: 8px 12px; background-color: rgba(40, 167, 69, 0.3);
            color: white; border: 1px solid rgba(40, 167, 69, 0.5); border-radius: 5px;
            font-size: 0.9em; font-weight: 500; white-space: nowrap; transition: all 0.2s ease;
            z-index: 2;
        }
        .track-download-button:hover { background-color: rgba(40, 167, 69, 0.5); border-color: rgba(40, 167, 69, 0.8); }
        .error { color: #ffcdd2; font-weight: bold; background-color: rgba(211, 47, 47, 0.3); padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
   
    <div class="container">
        <h2>LaobaiTV bandcamp Downloader</h2>
        <p>输入 Bandcamp 专辑 URL:</p>
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
               
                let albumHtml = 
                    '<div id="album-info">' +
                        '<img src="' + data.album_art_url + '" alt="Album Art">' +
                        '<h3>' + data.album_title + '</h3>' +
                        '<h4>by ' + currentAlbumArtist + '</h4>' +
                    '</div>';
               
                let tracksHtml = '<div id="track-list"><ul>';
                for (let i = 0; i < data.tracks.length; i++) {
                    const track = data.tracks[i];
                    
                    const downloadUrl = 'api/download?url=' + encodeURIComponent(track.download_url) + '&filename=' + encodeURIComponent(track.title) + '.mp3';
                    
                    tracksHtml += 
                        '<li data-track-index="' + i + '">' +
                            '<div class="track-play-button">▶</div>' +
                            '<div class="track-info">' +
                                '<span class="track-title">' + track.title + '</span>' +
                                '<span class="track-duration">(' + track.duration_text + ')</span>' +
                            '</div>' +
                            '<a href="' + downloadUrl + '" target="_blank" class="track-download-button">下载</a>' +
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