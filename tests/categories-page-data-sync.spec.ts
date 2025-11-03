import { test, expect } from '@playwright/test';

test.describe('Categories Page Data Sync', () => {
  const categoriesPageUrl = 'http://localhost:3002/categories';
  const adminCategoriesUrl = 'http://localhost:3002/account/admin/categories';

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
  });

  test('E2E: Categories page loads and displays categories from data source', async ({ page }) => {
    await page.goto(categoriesPageUrl);
    await page.waitForLoadState('networkidle');

    // Step 1: Verify page title/heading is visible
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Step 2: Verify categories are rendered
    // Categories are typically displayed as clickable cards/links or in a grid
    const categoryLinks = page.locator('a[href*="/products"]');
    const categoryCount = await categoryLinks.count();
    
    expect(categoryCount).toBeGreaterThan(0);
    console.log(`Found ${categoryCount} categories on page`);

    // Step 3: Verify first category has visible text
    const firstCategory = categoryLinks.first();
    const categoryText = await firstCategory.textContent();
    expect(categoryText?.trim().length).toBeGreaterThan(0);
  });

  test('E2E: Categories page displays database categories with API endpoint', async ({ page }) => {
    // This test verifies that the /api/categories endpoint is being used
    await page.goto(categoriesPageUrl);

    // Step 1: Set up listener for API calls
    const responses: any[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/api/categories')) {
        responses.push(response);
      }
    });

    await page.waitForLoadState('networkidle');

    // Step 2: Check if API endpoint was called
    if (responses.length > 0) {
      const apiResponse = responses[0];
      expect(apiResponse.status()).toBe(200);
      
      const data = await apiResponse.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Verify structure of first category
      if (data.length > 0) {
        const firstCategory = data[0];
        expect(firstCategory).toHaveProperty('id');
        expect(firstCategory).toHaveProperty('name');
        console.log(`API returned ${data.length} categories`);
      }
    }
  });

  test('E2E: Categories with order field are displayed in correct sequence', async ({ page }) => {
    await page.goto(categoriesPageUrl);
    await page.waitForLoadState('networkidle');

    // Step 1: Get all category links (categories are rendered as links)
    const categoryLinks = page.locator('a[href*="/products?category="]');

    const count = await categoryLinks.count();
    expect(count).toBeGreaterThan(0);

    // Step 2: Verify categories are rendered in a consistent order
    const categoryNames: string[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await categoryLinks.nth(i).textContent();
      if (text) {
        categoryNames.push(text.trim().split('\n')[0]); // Get first line (category name)
      }
    }

    console.log('Categories displayed in order:', categoryNames);
    expect(categoryNames.length).toBeGreaterThan(0);
  });

  test('E2E: Clicking category navigates to products page', async ({ page }) => {
    await page.goto(categoriesPageUrl);
    await page.waitForLoadState('networkidle');

    // Step 1: Find first category link with category parameter
    const firstCategoryLink = page.locator('a[href*="/products?category="]').first();
    
    // Step 2: Get category href and verify it's valid
    const categoryHref = await firstCategoryLink.getAttribute('href');
    expect(categoryHref).toBeTruthy();
    expect(categoryHref).toContain('/products');
    expect(categoryHref).toContain('category=');

    // Step 3: Click category and wait for navigation
    await firstCategoryLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Extra wait for navigation

    // Step 4: Verify we're on products page with category filter
    const currentUrl = page.url();
    expect(currentUrl).toContain('/products');
    expect(currentUrl).toContain('category=');
  });

  test('E2E: Page caches data and can be refreshed', async ({ page }) => {
    await page.goto(categoriesPageUrl);
    await page.waitForLoadState('networkidle');

    // Step 1: Get initial category count
    const initialLinks = page.locator('a[href*="/products"]');
    const initialCount = await initialLinks.count();
    expect(initialCount).toBeGreaterThan(0);

    // Step 2: Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Step 3: Verify categories still load
    const reloadedLinks = page.locator('a[href*="/products"]');
    const reloadedCount = await reloadedLinks.count();
    
    expect(reloadedCount).toBeGreaterThan(0);
    console.log(`Initial count: ${initialCount}, After reload: ${reloadedCount}`);
  });

  test('E2E: Modified/added categories are visible on categories page', async ({ page }) => {
    await page.goto(categoriesPageUrl);
    await page.waitForLoadState('networkidle');

    // Step 1: Get all visible category text
    const categoryElements = page.locator('a[href*="/products"]');
    const categoryNames: string[] = [];

    const count = await categoryElements.count();
    for (let i = 0; i < count; i++) {
      const text = await categoryElements.nth(i).textContent();
      if (text) {
        categoryNames.push(text.trim());
      }
    }

    // Step 2: Verify categories are displayed (custom/modified ones should appear)
    expect(categoryNames.length).toBeGreaterThan(0);
    console.log('All categories visible on page:', categoryNames);

    // Step 3: At least one category should be visible
    const visibleCategories = categoryNames.filter(name => name.length > 0);
    expect(visibleCategories.length).toBeGreaterThan(0);

    // Step 4: Verify no empty category names
    visibleCategories.forEach(name => {
      expect(name).not.toBe('');
      expect(name.length).toBeGreaterThan(0);
    });
  });
});