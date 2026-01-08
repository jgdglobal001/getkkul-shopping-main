import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/auth/signin'],
                disallow: [
                    '/admin/*',
                    '/dashboard/*',
                    '/api/*',
                    '/auth/*',
                    '/checkout/*',
                    '/payment/*',
                    '/packer-dashboard/*',
                    '/delivery-dashboard/*',
                    '/user-dashboard/*',
                ],
            },
            {
                userAgent: 'Yeti',
                allow: '/',
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            },
        ],
        sitemap: 'https://www.getkkul.com/sitemap.xml',
        host: 'https://www.getkkul.com',
    };
}
