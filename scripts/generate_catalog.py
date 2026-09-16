#!/usr/bin/env python3
"""
Single source of truth for the DevOptimizeBot tool catalog.

Generates:
  - src/data/toolRegistry.ts  (frontend catalog metadata)
  - supabase/seed_tools.sql   (INSERT statements for categories + tools)

Run again whenever a tool moves from "pending" to "implemented" by editing
IMPLEMENTED below, or when a genuinely new tool is added to CATEGORIES.

SCOPE NOTE: the original spec listed 121 tools across 7 categories with an
explicit "never remove a tool" rule. TikTok & Pinterest Creator Tools,
Technical SEO & On-Page Tools, and Performance/Domain & Off-Page Intel (34
tools) plus Keyword Position Tracker were deliberately removed at the
project owner's request, since each needs an external API/data provider
that wasn't available — a decision that knowingly overrides that original
rule. What remains (86 tools, 4 categories) is exactly what's real.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# 1. THE CATALOG — 4 categories, 86 tools. See the SCOPE NOTE above for why
#    this is smaller than the original 121-tool spec.
# ---------------------------------------------------------------------------
CATEGORIES = [
    ("YouTube Creator Tools", [
        "YouTube Video Title Generator", "YouTube Tag Extractor", "YouTube Thumbnail Previewer",
        "YouTube Channel ID Finder", "YouTube Description Generator", "YouTube Money Calculator",
        "YouTube Embed Code Generator", "YouTube Region Restriction Checker", "YouTube Comment Picker",
        "YouTube Live Subscriber Counter", "YouTube Timestamp Link Maker", "YouTube Search Trend Analyzer",
        "YouTube Channel Audit Checklist", "YouTube Shorts Script Timer", "YouTube Metadata Viewer",
    ]),
    ("Developer & Link Utilities", [
        "JSON Formatter & Validator", "JSON to XML Converter", "XML to JSON Converter",
        "Base64 Encoder & Decoder", "URL Encoder & Decoder", "MD5 Hash Generator", "SHA-256 Generator",
        "Bcrypt Generator", "JavaScript Minifier", "CSS Minifier", "HTML Minifier", "SQL Formatter",
        "Regex Tester", "JWT Decoder", "Cron Expression Generator", "YAML to JSON Converter",
        "JSON to CSV Converter", "Mobile-Friendly Tester", "Link Extraction Tool", "QR Code Generator",
        "SHA-1 Hash Generator", "SHA-512 Hash Generator", "API Key & Password Generator",
        "HTTP Security Header Checker", "Security.txt File Generator", "CORS Configuration Generator",
        "XSS Input Sanitizer", "SVG Compressor & Optimizer", "Gzip & Brotli Savings Calculator",
        "Lazy Load Image Code Generator", "Critical CSS Generator", "@font-face CSS Generator",
        "Browser Cache & Storage Cleaner",
    ]),
    ("Text & Writing Utilities", [
        "Slug Generator", "Word Counter & Reading Time Estimator", "Case Converter", "Remove Duplicate Lines",
        "Line Counter", "Text Diff Checker", "Random String Generator", "Lorem Ipsum Generator",
        "Markdown to HTML Converter", "HTML to Markdown Converter", "Text Sorter", "Find and Replace Tool",
        "Morse Code Converter", "Stripper of HTML Tags", "Word Frequency Counter", "Reverse Text Generator",
        "Whitespace Remover",
    ]),
    ("Design & Math Utilities", [
        "HEX to RGB Converter", "RGB to HEX Converter", "Color Palette Generator", "CSS Gradient Generator",
        "SVG to PNG Converter", "PNG to JPEG Converter", "CSS Box Shadow Generator",
        "Image Aspect Ratio Calculator", "Favicon Generator", "Image Resizer", "CSS Border Radius Generator",
        "Color Contrast Checker", "Image Color Picker", "Placeholder Image Generator", "Percentage Calculator",
        "Age Calculator", "Compound Interest Calculator", "Unix Timestamp Converter", "Date Difference Calculator",
        "Password Strength Meter", "Random Number Picker",
    ]),
]

assert len(CATEGORIES) == 4, "Expected exactly 4 categories after the scope reduction"
TOTAL = sum(len(tools) for _, tools in CATEGORIES)
assert TOTAL == 86, f"Expected exactly 86 tools after the scope reduction, counted {TOTAL}"

# Tools implemented in this build pass -> React component name in src/tools/text/
IMPLEMENTED = {
    "Slug Generator": "SlugGenerator",
    "Word Counter & Reading Time Estimator": "WordCounter",
    "Case Converter": "CaseConverter",
    "Remove Duplicate Lines": "RemoveDuplicateLines",
    "Line Counter": "LineCounter",
    "Text Diff Checker": "TextDiffChecker",
    "Random String Generator": "RandomStringGenerator",
    "Lorem Ipsum Generator": "LoremIpsumGenerator",
    "Markdown to HTML Converter": "MarkdownToHtml",
    "HTML to Markdown Converter": "HtmlToMarkdown",
    "Text Sorter": "TextSorter",
    "Find and Replace Tool": "FindAndReplace",
    "Morse Code Converter": "MorseCodeConverter",
    "Stripper of HTML Tags": "HtmlTagStripper",
    "Word Frequency Counter": "WordFrequencyCounter",
    "Reverse Text Generator": "ReverseTextGenerator",
    "Whitespace Remover": "WhitespaceRemover",
    "HEX to RGB Converter": "HexToRgb",
    "RGB to HEX Converter": "RgbToHex",
    "Color Palette Generator": "ColorPaletteGenerator",
    "CSS Gradient Generator": "CssGradientGenerator",
    "SVG to PNG Converter": "SvgToPng",
    "PNG to JPEG Converter": "PngToJpeg",
    "CSS Box Shadow Generator": "CssBoxShadowGenerator",
    "Image Aspect Ratio Calculator": "ImageAspectRatioCalculator",
    "Favicon Generator": "FaviconGenerator",
    "Image Resizer": "ImageResizer",
    "CSS Border Radius Generator": "CssBorderRadiusGenerator",
    "Color Contrast Checker": "ColorContrastChecker",
    "Image Color Picker": "ImageColorPicker",
    "Placeholder Image Generator": "PlaceholderImageGenerator",
    "Percentage Calculator": "PercentageCalculator",
    "Age Calculator": "AgeCalculator",
    "Compound Interest Calculator": "CompoundInterestCalculator",
    "Unix Timestamp Converter": "UnixTimestampConverter",
    "Date Difference Calculator": "DateDifferenceCalculator",
    "Password Strength Meter": "PasswordStrengthMeter",
    "Random Number Picker": "RandomNumberPicker",
    "JSON Formatter & Validator": "JsonFormatter",
    "JSON to XML Converter": "JsonToXml",
    "XML to JSON Converter": "XmlToJson",
    "Base64 Encoder & Decoder": "Base64Tool",
    "URL Encoder & Decoder": "UrlEncoderTool",
    "MD5 Hash Generator": "Md5Generator",
    "SHA-256 Generator": "Sha256Generator",
    "Bcrypt Generator": "BcryptGenerator",
    "JavaScript Minifier": "JsMinifier",
    "CSS Minifier": "CssMinifier",
    "HTML Minifier": "HtmlMinifier",
    "SQL Formatter": "SqlFormatter",
    "Regex Tester": "RegexTester",
    "JWT Decoder": "JwtDecoder",
    "Cron Expression Generator": "CronGenerator",
    "YAML to JSON Converter": "YamlToJson",
    "JSON to CSV Converter": "JsonToCsv",
    "Link Extraction Tool": "LinkExtractor",
    "QR Code Generator": "QrCodeGenerator",
    "SHA-1 Hash Generator": "Sha1Generator",
    "SHA-512 Hash Generator": "Sha512Generator",
    "API Key & Password Generator": "ApiKeyGenerator",
    "Security.txt File Generator": "SecurityTxtGenerator",
    "CORS Configuration Generator": "CorsGenerator",
    "XSS Input Sanitizer": "XssSanitizer",
    "SVG Compressor & Optimizer": "SvgOptimizer",
    "Gzip & Brotli Savings Calculator": "CompressionCalculator",
    "Lazy Load Image Code Generator": "LazyLoadGenerator",
    "Critical CSS Generator": "CriticalCssGenerator",
    "@font-face CSS Generator": "FontFaceGenerator",
    "Browser Cache & Storage Cleaner": "StorageCleaner",
    "YouTube Video Title Generator": "TitleGenerator",
    "YouTube Tag Extractor": "TagExtractor",
    "YouTube Thumbnail Previewer": "ThumbnailPreviewer",
    "YouTube Channel ID Finder": "ChannelIdFinder",
    "YouTube Description Generator": "DescriptionGenerator",
    "YouTube Money Calculator": "MoneyCalculator",
    "YouTube Embed Code Generator": "EmbedGenerator",
    "YouTube Region Restriction Checker": "RegionRestrictionChecker",
    "YouTube Comment Picker": "CommentPicker",
    "YouTube Live Subscriber Counter": "SubscriberCounter",
    "YouTube Timestamp Link Maker": "TimestampLinkMaker",
    "YouTube Search Trend Analyzer": "SearchTrendAnalyzer",
    "YouTube Channel Audit Checklist": "AuditChecklist",
    "YouTube Shorts Script Timer": "ShortsScriptTimer",
    "YouTube Metadata Viewer": "MetadataViewer",
    "Mobile-Friendly Tester": "MobileFriendlyTester",
    "HTTP Security Header Checker": "SecurityHeaderChecker",
}

DESCRIPTIONS = {
    "Slug Generator": "Turn any text into a clean, URL-safe slug.",
    "Word Counter & Reading Time Estimator": "Count words, characters and sentences, and estimate reading time.",
    "Case Converter": "Convert text between UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case and kebab-case.",
    "Remove Duplicate Lines": "Strip repeated lines from a block of text while keeping the first occurrence.",
    "Line Counter": "Count total, blank and non-blank lines, plus longest and average line length.",
    "Text Diff Checker": "Compare two blocks of text line by line and highlight what changed.",
    "Random String Generator": "Generate random strings with your choice of length and character set.",
    "Lorem Ipsum Generator": "Generate placeholder Lorem Ipsum text by paragraph, sentence or word.",
    "Markdown to HTML Converter": "Convert common Markdown syntax into clean HTML.",
    "HTML to Markdown Converter": "Convert simple HTML back into Markdown.",
    "Text Sorter": "Sort lines alphabetically, numerically or by length, ascending or descending.",
    "Find and Replace Tool": "Find and replace text, with optional case sensitivity, whole-word and regex matching.",
    "Morse Code Converter": "Convert text to Morse code and back.",
    "Stripper of HTML Tags": "Remove HTML tags and return clean plain text.",
    "Word Frequency Counter": "Count how often each word appears in a block of text.",
    "Reverse Text Generator": "Reverse text as a whole string, by word order, or letter by letter within each word.",
    "Whitespace Remover": "Trim, collapse or fully remove extra whitespace from text.",
    "HEX to RGB Converter": "Convert a HEX color code to RGB.",
    "RGB to HEX Converter": "Convert RGB values to a HEX color code.",
    "Color Palette Generator": "Generate complementary, analogous, triadic or monochromatic palettes from a base color.",
    "CSS Gradient Generator": "Build a linear or radial CSS gradient with a live preview.",
    "SVG to PNG Converter": "Convert SVG markup or a file into a downloadable PNG.",
    "PNG to JPEG Converter": "Convert PNG (or any image) to JPEG, with a background fill for transparency.",
    "CSS Box Shadow Generator": "Build a box-shadow value with a live preview.",
    "Image Aspect Ratio Calculator": "Find a ratio, or scale one dimension to match another.",
    "Favicon Generator": "Generate favicons in all the standard sizes from one image.",
    "Image Resizer": "Resize an image in your browser, with an optional locked aspect ratio.",
    "CSS Border Radius Generator": "Build a border-radius value with a live preview.",
    "Color Contrast Checker": "Check WCAG contrast ratio and AA/AAA pass/fail between two colors.",
    "Image Color Picker": "Click anywhere on an uploaded image to read that pixel's color.",
    "Placeholder Image Generator": "Generate a placeholder image with a custom size, color and label.",
    "Percentage Calculator": "Three common percentage calculations: of, is-what-percent, and percent change.",
    "Age Calculator": "Calculate exact age in years, months and days between two dates.",
    "Compound Interest Calculator": "Project growth over time with regular contributions.",
    "Unix Timestamp Converter": "Convert between Unix timestamps and human-readable dates.",
    "Date Difference Calculator": "Find the days, weeks, months and years between two dates.",
    "Password Strength Meter": "Check password strength entirely client-side — nothing is sent anywhere.",
    "Random Number Picker": "Pick one or more random numbers in a range, with or without duplicates.",
    "JSON Formatter & Validator": "Format, validate and minify JSON.",
    "JSON to XML Converter": "Convert a JSON object into XML.",
    "XML to JSON Converter": "Convert XML into a JSON object.",
    "Base64 Encoder & Decoder": "Encode text to Base64, or decode Base64 back to text.",
    "URL Encoder & Decoder": "Percent-encode or decode text and URLs.",
    "MD5 Hash Generator": "Generate an MD5 checksum (not for password storage).",
    "SHA-256 Generator": "Generate a SHA-256 hash natively via the browser's crypto API.",
    "Bcrypt Generator": "Hash a password with bcrypt, or verify one against an existing hash.",
    "JavaScript Minifier": "Strip comments and extra whitespace from JavaScript (basic, not a full bundler minifier).",
    "CSS Minifier": "Strip comments and collapse whitespace in CSS.",
    "HTML Minifier": "Collapse whitespace and strip comments in HTML, preserving pre/script/style content.",
    "SQL Formatter": "Break a query onto readable lines with keywords capitalized.",
    "Regex Tester": "Test a regular expression against sample text, with match highlighting.",
    "JWT Decoder": "Decode a JWT's header and payload (does not verify the signature).",
    "Cron Expression Generator": "Build a cron expression and see what it means in plain English.",
    "YAML to JSON Converter": "Convert YAML into JSON.",
    "JSON to CSV Converter": "Convert an array of JSON objects into CSV.",
    "Link Extraction Tool": "Pull every link out of pasted HTML or plain text.",
    "QR Code Generator": "Generate a QR code for a URL or any text.",
    "SHA-1 Hash Generator": "Generate a SHA-1 hash (weak for security use; prefer SHA-256+).",
    "SHA-512 Hash Generator": "Generate a SHA-512 hash natively via the browser's crypto API.",
    "API Key & Password Generator": "Generate a prefixed API key, or a strong random password.",
    "Security.txt File Generator": "Build a security.txt file per RFC 9116.",
    "CORS Configuration Generator": "Build CORS headers and copy-paste snippets for Express or Nginx.",
    "XSS Input Sanitizer": "Escape or strip dangerous HTML from user input.",
    "SVG Compressor & Optimizer": "Strip comments, metadata and excess whitespace from an SVG.",
    "Gzip & Brotli Savings Calculator": "Real gzip size via the browser's compression engine; Brotli is estimated.",
    "Lazy Load Image Code Generator": "Generate HTML for lazy-loaded images.",
    "Critical CSS Generator": "Extract CSS rules matching selectors you specify.",
    "@font-face CSS Generator": "Build an @font-face declaration for a self-hosted font.",
    "Browser Cache & Storage Cleaner": "Clear this site's own local/session storage and Cache Storage entries.",
    "YouTube Video Title Generator": "Generate title ideas from a topic or keyword.",
    "YouTube Tag Extractor": "Pull the public tags a video was uploaded with.",
    "YouTube Thumbnail Previewer": "Preview a video's thumbnail at every available resolution.",
    "YouTube Channel ID Finder": "Resolve a @handle or channel URL to its underlying channel ID.",
    "YouTube Description Generator": "Assemble a well-structured video description.",
    "YouTube Money Calculator": "Rough estimate of ad revenue from views and CPM.",
    "YouTube Embed Code Generator": "Generate an iframe embed for any video.",
    "YouTube Region Restriction Checker": "See which countries a video is blocked or exclusively allowed in.",
    "YouTube Comment Picker": "Fetch a video's comments and pick one at random.",
    "YouTube Live Subscriber Counter": "Look up a channel's current subscriber count.",
    "YouTube Timestamp Link Maker": "Create a link that jumps to a specific moment in a video.",
    "YouTube Search Trend Analyzer": "See how much content exists for a keyword and what's currently ranking.",
    "YouTube Channel Audit Checklist": "A self-review checklist for channel and video optimization.",
    "YouTube Shorts Script Timer": "Estimate how long your script will take to say out loud, against the Shorts limit.",
    "YouTube Metadata Viewer": "Look up a video's title, description, tags, stats and duration.",
    "Mobile-Friendly Tester": "Checks a page's viewport tag and other mobile-readiness signals.",
    "HTTP Security Header Checker": "Checks a site's response for common security headers.",
}


def slugify(name: str) -> str:
    s = name.lower()
    s = s.replace("&", " and ")
    s = s.replace("@", " ")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


def ts_string(s: str) -> str:
    return json.dumps(s)  # JSON string escaping is a valid JS/TS string literal


def build_catalog():
    categories = []
    tools = []
    for cat_index, (cat_name, tool_names) in enumerate(CATEGORIES):
        cat_slug = slugify(cat_name)
        categories.append({"slug": cat_slug, "name": cat_name, "sortOrder": cat_index})
        for tool_index, tool_name in enumerate(tool_names):
            slug = slugify(tool_name)
            tools.append({
                "slug": slug,
                "name": tool_name,
                "categorySlug": cat_slug,
                "description": DESCRIPTIONS.get(tool_name, f"{tool_name} — part of the DevOptimizeBot toolbox."),
                "implemented": tool_name in IMPLEMENTED,
                "componentKey": IMPLEMENTED.get(tool_name),
                "sortOrder": tool_index,
            })

    # Sanity checks before writing anything out
    slugs = [t["slug"] for t in tools]
    assert len(slugs) == len(set(slugs)), "Duplicate slugs detected in generated catalog"
    names = [t["name"] for t in tools]
    assert len(names) == len(set(names)), "Duplicate tool names detected in generated catalog"
    category_slugs = {c["slug"] for c in categories}
    for t in tools:
        assert t["categorySlug"] in category_slugs, f"{t['name']} references an unknown category"
    return categories, tools


def write_ts_registry(categories, tools):
    lines = []
    lines.append("// AUTO-GENERATED by scripts/generate_catalog.py — do not hand-edit.")
    lines.append("// Re-run the script to regenerate after changing the catalog or IMPLEMENTED map.")
    lines.append('import type { Category, ToolMeta } from "../types/tool"')
    lines.append("")
    lines.append("export const EXPECTED_TOOL_COUNT = " + str(len(tools)))
    lines.append("export const EXPECTED_CATEGORY_COUNT = " + str(len(categories)))
    lines.append("")
    lines.append("export const CATEGORIES: Category[] = [")
    for c in categories:
        lines.append(
            f'  {{ slug: {ts_string(c["slug"])}, name: {ts_string(c["name"])}, sortOrder: {c["sortOrder"]} }},'
        )
    lines.append("]")
    lines.append("")
    lines.append("export const TOOLS: ToolMeta[] = [")
    for t in tools:
        comp = ts_string(t["componentKey"]) if t["componentKey"] else "null"
        lines.append("  {")
        lines.append(f'    slug: {ts_string(t["slug"])},')
        lines.append(f'    name: {ts_string(t["name"])},')
        lines.append(f'    categorySlug: {ts_string(t["categorySlug"])},')
        lines.append(f'    description: {ts_string(t["description"])},')
        lines.append(f'    implemented: {"true" if t["implemented"] else "false"},')
        lines.append(f"    componentKey: {comp},")
        lines.append(f'    sortOrder: {t["sortOrder"]},')
        lines.append("  },")
    lines.append("]")
    lines.append("")
    out_path = ROOT / "src" / "data" / "toolRegistry.ts"
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out_path}")


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def write_sql_seed(categories, tools):
    lines = []
    lines.append("-- AUTO-GENERATED by scripts/generate_catalog.py — do not hand-edit.")
    lines.append("-- Seeds the 7 categories and 121 tools that make up the DevOptimizeBot catalog.")
    lines.append("-- Safe to re-run: uses ON CONFLICT upserts keyed on slug.")
    lines.append("")
    lines.append("insert into public.categories (slug, name, sort_order) values")
    cat_rows = [
        f"  ('{sql_escape(c['slug'])}', '{sql_escape(c['name'])}', {c['sortOrder']})" for c in categories
    ]
    lines.append(",\n".join(cat_rows) + "\n" +
                 "on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;")
    lines.append("")
    lines.append("insert into public.tools (slug, name, category_id, description, route_path, is_enabled, is_implemented, sort_order) values")
    tool_rows = []
    for t in tools:
        enabled = "true" if t["implemented"] else "false"
        implemented = "true" if t["implemented"] else "false"
        route = f"/tools/{t['slug']}"
        tool_rows.append(
            "  ('{slug}', '{name}', (select id from public.categories where slug = '{cat}'), "
            "'{desc}', '{route}', {enabled}, {implemented}, {sort})".format(
                slug=sql_escape(t["slug"]), name=sql_escape(t["name"]), cat=sql_escape(t["categorySlug"]),
                desc=sql_escape(t["description"]), route=route, enabled=enabled,
                implemented=implemented, sort=t["sortOrder"],
            )
        )
    lines.append(",\n".join(tool_rows) + "\n" +
                 "on conflict (slug) do update set\n"
                 "  name = excluded.name,\n"
                 "  category_id = excluded.category_id,\n"
                 "  description = excluded.description,\n"
                 "  is_implemented = excluded.is_implemented,\n"
                 "  sort_order = excluded.sort_order;")
    lines.append("")
    out_path = ROOT / "supabase" / "seed_tools.sql"
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {out_path}")


if __name__ == "__main__":
    categories, tools = build_catalog()
    write_ts_registry(categories, tools)
    write_sql_seed(categories, tools)
    implemented_count = sum(1 for t in tools if t["implemented"])
    print(f"Categories: {len(categories)} | Tools: {len(tools)} | Implemented: {implemented_count}")
