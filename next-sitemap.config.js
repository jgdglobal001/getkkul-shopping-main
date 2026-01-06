/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://www.getkkul.com",
  generateRobotsTxt: false, // public/robots.txt 사용
  generateIndexSitemap: false, // 동적 sitemap.ts 사용
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*", "/dashboard/*", "/api/*", "/auth/*"],
};

module.exports = config;
