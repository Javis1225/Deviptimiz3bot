export interface Tool {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  description: string;
  enabled: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "YouTube Creator Tools",
    slug: "youtube-creator-tools",
    description: "Tools for YouTube content creators",
    icon: "youtube"
  },
  {
    id: 2,
    name: "TikTok & Pinterest Creator Tools",
    slug: "tiktok-pinterest-creator-tools",
    description: "Tools for TikTok and Pinterest creators",
    icon: "smartphone"
  },
  {
    id: 3,
    name: "Technical SEO & On-Page Tools",
    slug: "technical-seo-on-page-tools",
    description: "Technical SEO and on-page optimization tools",
    icon: "search"
  },
  {
    id: 4,
    name: "Performance, Domain & Off-Page Intel",
    slug: "performance-domain-off-page-intel",
    description: "Domain, performance and off-page tools",
    icon: "globe"
  },
  {
    id: 5,
    name: "Developer & Link Utilities",
    slug: "developer-link-utilities",
    description: "Developer utilities and link tools",
    icon: "code"
  },
  {
    id: 6,
    name: "Text & Writing Utilities",
    slug: "text-writing-utilities",
    description: "Text processing and writing tools",
    icon: "type"
  },
  {
    id: 7,
    name: "Design & Math Utilities",
    slug: "design-math-utilities",
    description: "Design, color and calculation tools",
    icon: "palette"
  }
];

export const tools: Tool[] = [
  // CATEGORY 1 — YouTube Creator Tools (1-15)
  { id: 1, name: "YouTube Video Title Generator", slug: "youtube-video-title-generator", category_id: 1, description: "Generate engaging YouTube video titles", enabled: true },
  { id: 2, name: "YouTube Tag Extractor", slug: "youtube-tag-extractor", category_id: 1, description: "Extract tags from any YouTube video", enabled: true },
  { id: 3, name: "YouTube Thumbnail Previewer", slug: "youtube-thumbnail-previewer", category_id: 1, description: "Preview how thumbnails look on YouTube", enabled: true },
  { id: 4, name: "YouTube Channel ID Finder", slug: "youtube-channel-id-finder", category_id: 1, description: "Find any YouTube channel ID", enabled: true },
  { id: 5, name: "YouTube Description Generator", slug: "youtube-description-generator", category_id: 1, description: "Generate optimized video descriptions", enabled: true },
  { id: 6, name: "YouTube Money Calculator", slug: "youtube-money-calculator", category_id: 1, description: "Estimate YouTube earnings potential", enabled: true },
  { id: 7, name: "YouTube Embed Code Generator", slug: "youtube-embed-code-generator", category_id: 1, description: "Generate YouTube embed codes", enabled: true },
  { id: 8, name: "YouTube Region Restriction Checker", slug: "youtube-region-restriction-checker", category_id: 1, description: "Check video region restrictions", enabled: true },
  { id: 9, name: "YouTube Comment Picker", slug: "youtube-comment-picker", category_id: 1, description: "Randomly pick comments for giveaways", enabled: true },
  { id: 10, name: "YouTube Live Subscriber Counter", slug: "youtube-live-subscriber-counter", category_id: 1, description: "Live subscriber count tracker", enabled: true },
  { id: 11, name: "YouTube Timestamp Link Maker", slug: "youtube-timestamp-link-maker", category_id: 1, description: "Create timestamped YouTube links", enabled: true },
  { id: 12, name: "YouTube Search Trend Analyzer", slug: "youtube-search-trend-analyzer", category_id: 1, description: "Analyze YouTube search trends", enabled: true },
  { id: 13, name: "YouTube Channel Audit Checklist", slug: "youtube-channel-audit-checklist", category_id: 1, description: "Complete channel audit checklist", enabled: true },
  { id: 14, name: "YouTube Shorts Script Timer", slug: "youtube-shorts-script-timer", category_id: 1, description: "Time your Shorts scripts", enabled: true },
  { id: 15, name: "YouTube Metadata Viewer", slug: "youtube-metadata-viewer", category_id: 1, description: "View full video metadata", enabled: true },

  // CATEGORY 2 — TikTok & Pinterest (16-23)
  { id: 16, name: "TikTok Engagement Calculator", slug: "tiktok-engagement-calculator", category_id: 2, description: "Calculate TikTok engagement rates", enabled: true },
  { id: 17, name: "TikTok Caption Generator", slug: "tiktok-caption-generator", category_id: 2, description: "Generate engaging TikTok captions", enabled: true },
  { id: 18, name: "TikTok Bio Generator", slug: "tiktok-bio-generator", category_id: 2, description: "Create optimized TikTok bios", enabled: true },
  { id: 19, name: "TikTok Video Length Splitter", slug: "tiktok-video-length-splitter", category_id: 2, description: "Split videos for TikTok limits", enabled: true },
  { id: 20, name: "Pinterest Board Cover Maker", slug: "pinterest-board-cover-maker", category_id: 2, description: "Create Pinterest board covers", enabled: true },
  { id: 21, name: "Pinterest Pin Title Optimizer", slug: "pinterest-pin-title-optimizer", category_id: 2, description: "Optimize Pinterest pin titles", enabled: true },
  { id: 22, name: "Pinterest Description Builder", slug: "pinterest-description-builder", category_id: 2, description: "Build Pinterest descriptions", enabled: true },
  { id: 23, name: "Pinterest Multi-Image Collage Layout", slug: "pinterest-multi-image-collage-layout", category_id: 2, description: "Create multi-image collage layouts", enabled: true },

  // CATEGORY 3 — Technical SEO (24-39)
  { id: 24, name: "Robots.txt Generator", slug: "robots-txt-generator", category_id: 3, description: "Generate robots.txt files", enabled: true },
  { id: 25, name: "XML Sitemap Generator", slug: "xml-sitemap-generator", category_id: 3, description: "Generate XML sitemaps", enabled: true },
  { id: 26, name: "Hreflang Tag Builder", slug: "hreflang-tag-builder", category_id: 3, description: "Build hreflang tags", enabled: true },
  { id: 27, name: "HTTP Status Code Checker", slug: "http-status-code-checker", category_id: 3, description: "Check HTTP status codes", enabled: true },
  { id: 28, name: "Redirect Chain Auditing Tool", slug: "redirect-chain-auditing-tool", category_id: 3, description: "Audit redirect chains", enabled: true },
  { id: 29, name: "Sitemap Validator", slug: "sitemap-validator", category_id: 3, description: "Validate XML sitemaps", enabled: true },
  { id: 30, name: "Canonical Tag Checker", slug: "canonical-tag-checker", category_id: 3, description: "Check canonical tags", enabled: true },
  { id: 31, name: "Crawl Depth Map Generator", slug: "crawl-depth-map-generator", category_id: 3, description: "Map crawl depth of pages", enabled: true },
  { id: 32, name: "Text-to-HTML Ratio Calculator", slug: "text-to-html-ratio-calculator", category_id: 3, description: "Calculate text-to-HTML ratio", enabled: true },
  { id: 33, name: "Keyword Density Analyzer", slug: "keyword-density-analyzer", category_id: 3, description: "Analyze keyword density", enabled: true },
  { id: 34, name: "SERP Preview Tool", slug: "serp-preview-tool", category_id: 3, description: "Preview search engine results", enabled: true },
  { id: 35, name: "Heading Tag Hierarchy Reviewer", slug: "heading-tag-hierarchy-reviewer", category_id: 3, description: "Review heading hierarchy", enabled: true },
  { id: 36, name: "Image Alt Text Auditor", slug: "image-alt-text-auditor", category_id: 3, description: "Audit image alt texts", enabled: true },
  { id: 37, name: "Meta Tag Generator", slug: "meta-tag-generator", category_id: 3, description: "Generate meta tags", enabled: true },
  { id: 38, name: "Schema Markup Generator", slug: "schema-markup-generator", category_id: 3, description: "Generate schema markup", enabled: true },
  { id: 39, name: "Rich Snippets Tester", slug: "rich-snippets-tester", category_id: 3, description: "Test rich snippets", enabled: true },

  // CATEGORY 4 — Performance, Domain & Off-Page (40-49)
  { id: 40, name: "Domain Authority Checker", slug: "domain-authority-checker", category_id: 4, description: "Check domain authority", enabled: true },
  { id: 41, name: "Backlink Checker", slug: "backlink-checker", category_id: 4, description: "Check backlinks", enabled: true },
  { id: 42, name: "Anchor Text Analyzer", slug: "anchor-text-analyzer", category_id: 4, description: "Analyze anchor text", enabled: true },
  { id: 43, name: "Disavow File Generator", slug: "disavow-file-generator", category_id: 4, description: "Generate disavow files", enabled: true },
  { id: 44, name: "Page Speed Performance Audit", slug: "page-speed-performance-audit", category_id: 4, description: "Audit page speed", enabled: true },
  { id: 45, name: "SSL Certificate Checker", slug: "ssl-certificate-checker", category_id: 4, description: "Check SSL certificates", enabled: true },
  { id: 46, name: "Domain Age Checker", slug: "domain-age-checker", category_id: 4, description: "Check domain age", enabled: true },
  { id: 47, name: "Domain WHOIS Lookup", slug: "domain-whois-lookup", category_id: 4, description: "WHOIS lookup for domains", enabled: true },
  { id: 48, name: "DNS Record Finder", slug: "dns-record-finder", category_id: 4, description: "Find DNS records", enabled: true },
  { id: 49, name: "Google Cache Date Checker", slug: "google-cache-date-checker", category_id: 4, description: "Check Google cache date", enabled: true },

  // CATEGORY 5 — Developer & Link Utilities (50-82)
  { id: 50, name: "JSON Formatter & Validator", slug: "json-formatter-validator", category_id: 5, description: "Format and validate JSON", enabled: true },
  { id: 51, name: "JSON to XML Converter", slug: "json-to-xml-converter", category_id: 5, description: "Convert JSON to XML", enabled: true },
  { id: 52, name: "XML to JSON Converter", slug: "xml-to-json-converter", category_id: 5, description: "Convert XML to JSON", enabled: true },
  { id: 53, name: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", category_id: 5, description: "Encode and decode Base64", enabled: true },
  { id: 54, name: "URL Encoder & Decoder", slug: "url-encoder-decoder", category_id: 5, description: "Encode and decode URLs", enabled: true },
  { id: 55, name: "MD5 Hash Generator", slug: "md5-hash-generator", category_id: 5, description: "Generate MD5 hashes", enabled: true },
  { id: 56, name: "SHA-256 Generator", slug: "sha-256-generator", category_id: 5, description: "Generate SHA-256 hashes", enabled: true },
  { id: 57, name: "Bcrypt Generator", slug: "bcrypt-generator", category_id: 5, description: "Generate bcrypt hashes", enabled: true },
  { id: 58, name: "JavaScript Minifier", slug: "javascript-minifier", category_id: 5, description: "Minify JavaScript code", enabled: true },
  { id: 59, name: "CSS Minifier", slug: "css-minifier", category_id: 5, description: "Minify CSS code", enabled: true },
  { id: 60, name: "HTML Minifier", slug: "html-minifier", category_id: 5, description: "Minify HTML code", enabled: true },
  { id: 61, name: "SQL Formatter", slug: "sql-formatter", category_id: 5, description: "Format SQL queries", enabled: true },
  { id: 62, name: "Regex Tester", slug: "regex-tester", category_id: 5, description: "Test regular expressions", enabled: true },
  { id: 63, name: "JWT Decoder", slug: "jwt-decoder", category_id: 5, description: "Decode JWT tokens", enabled: true },
  { id: 64, name: "Cron Expression Generator", slug: "cron-expression-generator", category_id: 5, description: "Generate cron expressions", enabled: true },
  { id: 65, name: "YAML to JSON Converter", slug: "yaml-to-json-converter", category_id: 5, description: "Convert YAML to JSON", enabled: true },
  { id: 66, name: "JSON to CSV Converter", slug: "json-to-csv-converter", category_id: 5, description: "Convert JSON to CSV", enabled: true },
  { id: 67, name: "Mobile-Friendly Tester", slug: "mobile-friendly-tester", category_id: 5, description: "Test mobile friendliness", enabled: true },
  { id: 68, name: "Link Extraction Tool", slug: "link-extraction-tool", category_id: 5, description: "Extract links from text/HTML", enabled: true },
  { id: 69, name: "QR Code Generator", slug: "qr-code-generator", category_id: 5, description: "Generate QR codes", enabled: true },
  { id: 70, name: "SHA-1 Hash Generator", slug: "sha-1-hash-generator", category_id: 5, description: "Generate SHA-1 hashes", enabled: true },
  { id: 71, name: "SHA-512 Hash Generator", slug: "sha-512-hash-generator", category_id: 5, description: "Generate SHA-512 hashes", enabled: true },
  { id: 72, name: "API Key & Password Generator", slug: "api-key-password-generator", category_id: 5, description: "Generate secure API keys and passwords", enabled: true },
  { id: 73, name: "HTTP Security Header Checker", slug: "http-security-header-checker", category_id: 5, description: "Check HTTP security headers", enabled: true },
  { id: 74, name: "Security.txt File Generator", slug: "security-txt-file-generator", category_id: 5, description: "Generate security.txt files", enabled: true },
  { id: 75, name: "CORS Configuration Generator", slug: "cors-configuration-generator", category_id: 5, description: "Generate CORS configurations", enabled: true },
  { id: 76, name: "XSS Input Sanitizer", slug: "xss-input-sanitizer", category_id: 5, description: "Sanitize input against XSS", enabled: true },
  { id: 77, name: "SVG Compressor & Optimizer", slug: "svg-compressor-optimizer", category_id: 5, description: "Compress and optimize SVGs", enabled: true },
  { id: 78, name: "Gzip & Brotli Savings Calculator", slug: "gzip-brotli-savings-calculator", category_id: 5, description: "Calculate compression savings", enabled: true },
  { id: 79, name: "Lazy Load Image Code Generator", slug: "lazy-load-image-code-generator", category_id: 5, description: "Generate lazy load image code", enabled: true },
  { id: 80, name: "Critical CSS Generator", slug: "critical-css-generator", category_id: 5, description: "Generate critical CSS", enabled: true },
  { id: 81, name: "@font-face CSS Generator", slug: "font-face-css-generator", category_id: 5, description: "Generate @font-face CSS", enabled: true },
  { id: 82, name: "Browser Cache & Storage Cleaner", slug: "browser-cache-storage-cleaner", category_id: 5, description: "Clear browser cache and storage", enabled: true },

  // CATEGORY 6 — Text & Writing (83-99)
  { id: 83, name: "Slug Generator", slug: "slug-generator", category_id: 6, description: "Generate URL-friendly slugs", enabled: true },
  { id: 84, name: "Word Counter & Reading Time Estimator", slug: "word-counter-reading-time-estimator", category_id: 6, description: "Count words and estimate reading time", enabled: true },
  { id: 85, name: "Case Converter", slug: "case-converter", category_id: 6, description: "Convert text case", enabled: true },
  { id: 86, name: "Remove Duplicate Lines", slug: "remove-duplicate-lines", category_id: 6, description: "Remove duplicate lines from text", enabled: true },
  { id: 87, name: "Line Counter", slug: "line-counter", category_id: 6, description: "Count lines in text", enabled: true },
  { id: 88, name: "Text Diff Checker", slug: "text-diff-checker", category_id: 6, description: "Compare two texts", enabled: true },
  { id: 89, name: "Random String Generator", slug: "random-string-generator", category_id: 6, description: "Generate random strings", enabled: true },
  { id: 90, name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", category_id: 6, description: "Generate Lorem Ipsum text", enabled: true },
  { id: 91, name: "Markdown to HTML Converter", slug: "markdown-to-html-converter", category_id: 6, description: "Convert Markdown to HTML", enabled: true },
  { id: 92, name: "HTML to Markdown Converter", slug: "html-to-markdown-converter", category_id: 6, description: "Convert HTML to Markdown", enabled: true },
  { id: 93, name: "Text Sorter", slug: "text-sorter", category_id: 6, description: "Sort lines of text", enabled: true },
  { id: 94, name: "Find and Replace Tool", slug: "find-and-replace-tool", category_id: 6, description: "Find and replace text", enabled: true },
  { id: 95, name: "Morse Code Converter", slug: "morse-code-converter", category_id: 6, description: "Convert text to Morse code", enabled: true },
  { id: 96, name: "Stripper of HTML Tags", slug: "stripper-of-html-tags", category_id: 6, description: "Strip HTML tags from text", enabled: true },
  { id: 97, name: "Word Frequency Counter", slug: "word-frequency-counter", category_id: 6, description: "Count word frequency", enabled: true },
  { id: 98, name: "Reverse Text Generator", slug: "reverse-text-generator", category_id: 6, description: "Reverse text", enabled: true },
  { id: 99, name: "Whitespace Remover", slug: "whitespace-remover", category_id: 6, description: "Remove extra whitespace", enabled: true },

  // CATEGORY 7 — Design & Math (100-121)
  { id: 100, name: "HEX to RGB Converter", slug: "hex-to-rgb-converter", category_id: 7, description: "Convert HEX to RGB", enabled: true },
  { id: 101, name: "RGB to HEX Converter", slug: "rgb-to-hex-converter", category_id: 7, description: "Convert RGB to HEX", enabled: true },
  { id: 102, name: "Color Palette Generator", slug: "color-palette-generator", category_id: 7, description: "Generate color palettes", enabled: true },
  { id: 103, name: "CSS Gradient Generator", slug: "css-gradient-generator", category_id: 7, description: "Generate CSS gradients", enabled: true },
  { id: 104, name: "SVG to PNG Converter", slug: "svg-to-png-converter", category_id: 7, description: "Convert SVG to PNG", enabled: true },
  { id: 105, name: "PNG to JPEG Converter", slug: "png-to-jpeg-converter", category_id: 7, description: "Convert PNG to JPEG", enabled: true },
  { id: 106, name: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", category_id: 7, description: "Generate CSS box shadows", enabled: true },
  { id: 107, name: "Image Aspect Ratio Calculator", slug: "image-aspect-ratio-calculator", category_id: 7, description: "Calculate image aspect ratios", enabled: true },
  { id: 108, name: "Favicon Generator", slug: "favicon-generator", category_id: 7, description: "Generate favicons", enabled: true },
  { id: 109, name: "Image Resizer", slug: "image-resizer", category_id: 7, description: "Resize images", enabled: true },
  { id: 110, name: "CSS Border Radius Generator", slug: "css-border-radius-generator", category_id: 7, description: "Generate CSS border radius", enabled: true },
  { id: 111, name: "Color Contrast Checker", slug: "color-contrast-checker", category_id: 7, description: "Check color contrast", enabled: true },
  { id: 112, name: "Image Color Picker", slug: "image-color-picker", category_id: 7, description: "Pick colors from images", enabled: true },
  { id: 113, name: "Placeholder Image Generator", slug: "placeholder-image-generator", category_id: 7, description: "Generate placeholder images", enabled: true },
  { id: 114, name: "Percentage Calculator", slug: "percentage-calculator", category_id: 7, description: "Calculate percentages", enabled: true },
  { id: 115, name: "Age Calculator", slug: "age-calculator", category_id: 7, description: "Calculate age from birthdate", enabled: true },
  { id: 116, name: "Compound Interest Calculator", slug: "compound-interest-calculator", category_id: 7, description: "Calculate compound interest", enabled: true },
  { id: 117, name: "Unix Timestamp Converter", slug: "unix-timestamp-converter", category_id: 7, description: "Convert Unix timestamps", enabled: true },
  { id: 118, name: "Date Difference Calculator", slug: "date-difference-calculator", category_id: 7, description: "Calculate date differences", enabled: true },
  { id: 119, name: "Password Strength Meter", slug: "password-strength-meter", category_id: 7, description: "Check password strength", enabled: true },
  { id: 120, name: "Random Number Picker", slug: "random-number-picker", category_id: 7, description: "Pick random numbers", enabled: true },
  { id: 121, name: "Keyword Position Tracker", slug: "keyword-position-tracker", category_id: 7, description: "Track keyword positions", enabled: true },
];

// Validation helpers
export function validateCatalog() {
  const expected = 121;
  const actual = tools.length;
  const names = tools.map(t => t.name);
  const slugs = tools.map(t => t.slug);
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
  const duplicateSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  const disabled = tools.filter(t => !t.enabled);
  const missingIds = [];
  for (let i = 1; i <= 121; i++) {
    if (!tools.find(t => t.id === i)) missingIds.push(i);
  }

  return {
    expectedNamedTools: expected,
    actualNamedTools: actual,
    missing: missingIds,
    duplicates: [...new Set(duplicates)],
    duplicateSlugs: [...new Set(duplicateSlugs)],
    categories: categories.length,
    invalidSlugs: slugs.filter(s => !/^[a-z0-9-]+$/.test(s)),
    disabledTools: disabled.map(t => t.name),
  };
}
