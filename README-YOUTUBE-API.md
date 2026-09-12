# YouTube Data API integration

DevOptimizeBot now uses a server-side Vercel Function at `/api/youtube`. The Google API key is read from the server environment variable `YOUTUBE_API_KEY` and is never bundled into the Vite frontend.

## Connected tools
- YouTube Tag Extractor
- YouTube Channel ID Finder
- YouTube Region Restriction Checker
- YouTube Comment Picker
- YouTube Live Subscriber Counter
- YouTube Search Trend Analyzer
- YouTube Metadata Viewer
- YouTube Thumbnail Previewer (direct thumbnail URLs; no API quota required)

## Vercel setup
1. In Google Cloud, enable **YouTube Data API v3** and create an API key.
2. In Vercel: Project → Settings → Environment Variables.
3. Add `YOUTUBE_API_KEY` with your key. Do not use `VITE_YOUTUBE_API_KEY`.
4. Apply it to Production (and Preview if desired).
5. Redeploy the project.

The API key is intentionally not included in this ZIP.
