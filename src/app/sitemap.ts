import { MetadataRoute } from 'next';
import { db, products, categories } from '@/lib/db';
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://www.getkkul.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/faqs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 카테고리 페이지들
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const allCategories = await db.select().from(categories).where(eq(categories.isActive, true));
    categoryPages = allCategories.map((category) => ({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  // 상품 페이지들
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const allProducts = await db.select().from(products).where(eq(products.isActive, true));
    productPages = allProducts.map((product) => ({
      url: `${BASE_URL}/products/${product.id}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}

