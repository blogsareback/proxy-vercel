# BAB Proxy (Vercel)

Self-hosted CORS proxy with content extraction for [Blogs Are Back](https://blogsareback.com).

Deploy your own proxy to bypass CORS restrictions when fetching RSS feeds and extracting article content.

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/blogsareback/bab-proxy-vercel)

1. Click the button above
2. Sign in to Vercel (create free account if needed)
3. Click "Deploy"
4. Copy your deployment URL (e.g., `https://bab-proxy-xyz.vercel.app`)
5. In Blogs Are Back: **Settings → Custom Proxy → Paste URL → Validate**

## Features

- **Feed Fetching** - Fetch RSS/Atom feeds with CORS bypass
- **Content Extraction** - Extract article content using Mozilla Readability
- **Conditional GET** - Supports ETag and Last-Modified for efficient polling
- **SSRF Protection** - Blocks requests to private IPs and dangerous hosts
- **Optional Authentication** - Secure your proxy with an API key

## Free Tier Limits

- 100,000 requests/month
- 10 second function timeout (Hobby plan)
- 100 GB bandwidth/month

## API Endpoints

### GET /health

Check proxy status and capabilities.

```bash
curl https://your-proxy.vercel.app/health
```

Response:
```json
{
  "ok": true,
  "version": "1.0.0",
  "provider": "vercel-serverless",
  "capabilities": ["fetch", "parse"]
}
```

### POST /fetch

Fetch an RSS/Atom feed.

```bash
curl -X POST https://your-proxy.vercel.app/fetch \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/feed.xml"}'
```

Request body:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `url` | string | Yes | - | Feed URL to fetch |
| `headers` | object | No | `{}` | Headers to forward (If-None-Match, If-Modified-Since) |
| `timeout` | number | No | 10000 | Timeout in milliseconds (max 30000) |

### POST /parse

Extract article content from a webpage.

```bash
curl -X POST https://your-proxy.vercel.app/parse \
  -H "Content-Type: application/json" \
  -d '{"url": "https://blog.example.com/article"}'
```

Request body:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `url` | string | Yes | - | Article URL to parse |
| `format` | string | No | `"both"` | `"html"`, `"text"`, or `"both"` |
| `timeout` | number | No | 15000 | Timeout in milliseconds (max 30000) |

## Configuration

### Add API Key (Optional)

Secure your proxy so only you can use it:

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - Name: `BAB_API_KEY`
   - Value: `your-secret-key` (generate a strong random string)
4. Click **Save**
5. Redeploy your project (Deployments → Redeploy)
6. In Blogs Are Back, enter the same API key in your proxy settings

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BAB_API_KEY` | - | Require this key in X-API-Key header |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins (comma-separated) |
| `MAX_RESPONSE_SIZE_MB` | `10` | Max response size for feed fetch |
| `MAX_HTML_SIZE_MB` | `5` | Max HTML size for content parsing |
| `DEFAULT_TIMEOUT_MS` | `10000` | Default request timeout |
| `MAX_TIMEOUT_MS` | `30000` | Maximum allowed timeout |

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npx vercel dev

# The proxy will be available at http://localhost:3000
```

## How It Works

1. **Feed Fetching**: Your browser can't fetch feeds from other domains due to CORS. This proxy fetches the feed server-side and returns it with proper CORS headers.

2. **Content Extraction**: Uses [Mozilla Readability](https://github.com/mozilla/readability) (the library behind Firefox Reader View) to extract clean article content from any webpage.

3. **Security**: All URLs are validated to prevent Server-Side Request Forgery (SSRF) attacks. Requests to private IPs, localhost, and cloud metadata endpoints are blocked.

## Upgrading

If you deployed via the one-click button, your project is linked to this repository. To get updates:

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Git**
3. Click **Redeploy** to pull the latest changes

Or set up automatic deployments by connecting to your own fork.

