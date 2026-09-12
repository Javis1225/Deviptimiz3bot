-- Seed 7 categories and 121 tools for DevOptimizeBot

INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
(1, 'YouTube Creator Tools', 'youtube-creator-tools', 'Tools for YouTube content creators', 'youtube', 1),
(2, 'TikTok & Pinterest Creator Tools', 'tiktok-pinterest-creator-tools', 'Tools for TikTok and Pinterest creators', 'smartphone', 2),
(3, 'Technical SEO & On-Page Tools', 'technical-seo-on-page-tools', 'Technical SEO and on-page optimization tools', 'search', 3),
(4, 'Performance, Domain & Off-Page Intel', 'performance-domain-off-page-intel', 'Domain, performance and off-page tools', 'globe', 4),
(5, 'Developer & Link Utilities', 'developer-link-utilities', 'Developer utilities and link tools', 'code', 5),
(6, 'Text & Writing Utilities', 'text-writing-utilities', 'Text processing and writing tools', 'type', 6),
(7, 'Design & Math Utilities', 'design-math-utilities', 'Design, color and calculation tools', 'palette', 7)
ON CONFLICT (id) DO NOTHING;

-- Tools will be seeded from the application data or a follow-up script.
-- For production, use the tools.ts catalog to generate INSERT statements.
