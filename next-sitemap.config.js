/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://smart.sokso.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 1.0,
  exclude: ['/mantenimiento'],
  additionalPaths: async (config) => {
    return [
      {
        loc: '/articulos',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
     
    ]
  },
}
