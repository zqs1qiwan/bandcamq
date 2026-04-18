# bandcamq

Bandcamp 音乐专辑代理下载器 — 基于 Cloudflare Workers，提供 Web UI 在线试听和 MP3 下载。

## 功能

- **专辑解析**：输入 Bandcamp 专辑 URL，自动提取所有曲目信息（标题、时长、封面）
- **在线播放器**：内置音频播放器，支持上一曲/下一曲、进度条拖拽、专辑封面展示
- **MP3 下载**：逐曲下载，自动设置文件名，支持中文文件名
- **动态背景**：从 KV 读取必应每日壁纸作为页面背景

## 技术架构

```
Cloudflare Worker (TypeScript)
├── GET /                    → HTML UI 页面（内联 CSS/JS）
├── GET /api/get-tracks      → 爬取 Bandcamp 页面，解析 data-tralbum JSON
├── GET /api/download        → 代理 MP3 下载流，设置 Content-Disposition
└── KV: BING_KV              → 缓存必应壁纸 URL
```

### 绑定资源

| 类型 | 绑定名 | 用途 |
|------|--------|------|
| KV | `BING_KV` | 存储必应每日壁纸 URL |

## 部署

```bash
npm install
wrangler deploy
```

## 配置

- `wrangler.jsonc` 中配置 KV namespace ID
- Worker 路由支持 `/bandcamp` 前缀路径（自动 strip）

## API 端点

| 端点 | 方法 | 参数 | 说明 |
|------|------|------|------|
| `/` | GET | - | Web UI 页面 |
| `/api/get-tracks` | GET | `url` (Bandcamp 专辑 URL) | 返回专辑信息 JSON |
| `/api/download` | GET | `url` (MP3 URL), `filename` | 代理下载 MP3 |

### get-tracks 响应示例

```json
{
  "album_title": "Album Name",
  "artist": "Artist",
  "album_art_url": "https://f4.bcbits.com/img/a1234_16.jpg",
  "tracks": [
    { "title": "Track 1", "duration_text": "3:45", "download_url": "https://..." }
  ]
}
```
