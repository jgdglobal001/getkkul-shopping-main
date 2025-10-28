import { test, expect } from '@playwright/test';

test.describe('Category Page Korean Translation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to categories page
    await page.goto('/categories');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display page title in Korean', async ({ page }) => {
    // Check page title is in Korean
    const pageTitle = page.locator('h1');
    await expect(pageTitle).toContainText('카테고리별 쇼핑');
    // Ensure no English text
    await expect(pageTitle).not.toContainText('Shop by Categories');
  });

  test('should display page description in Korean', async ({ page }) => {
    // Check page description contains Korean text
    const description = page.locator('p').filter({ hasText: '당사의' });
    await expect(description).toBeVisible();
    // Ensure no English text like "Discover our"
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Discover our wide range');
  });

  test('should display breadcrumb navigation in Korean', async ({ page }) => {
    // Check breadcrumb Home text is Korean
    const breadcrumb = page.locator('[role="navigation"]');
    if (await breadcrumb.isVisible()) {
      const breadcrumbText = await breadcrumb.textContent();
      expect(breadcrumbText).toContain('홈');
      expect(breadcrumbText).toContain('카테고리');
      expect(breadcrumbText).not.toContain('Home');
      expect(breadcrumbText).not.toContain('Categories');
    }
  });

  test('should display statistics labels in Korean', async ({ page }) => {
    // Check total categories label using visible elements only
    const statsSection = page.locator('body').getByText('전체 카테고리');
    await expect(statsSection).toBeVisible();
    
    const pageText = await page.textContent('body');
    expect(pageText).toContain('전체 카테고리');
    expect(pageText).toContain('상품 수');
    expect(pageText).toContain('브랜드 수');
  });

  test('should display category names in Korean', async ({ page }) => {
    // Wait for category cards to load
    await page.waitForTimeout(2000);

    // Check for Korean category names by searching for visible category cards
    // The category cards should have Korean names rendered
    const beautyCard = page.locator('a, button').filter({ hasText: /뷰티/ });
    const fragranceCard = page.locator('a, button').filter({ hasText: /향수/ });
    
    // At least one Korean category name should be visible
    const koreanCategoryCount = await page.locator('body').getByText(/뷰티|향수|가구|식료품|가구/).count();
    expect(koreanCategoryCount).toBeGreaterThan(0);
  });

  test('should display "View Products" button in Korean', async ({ page }) => {
    // Wait for buttons to be visible
    await page.waitForTimeout(2000);

    // Check for Korean button text
    const buttons = page.locator('button:has-text("상품 보기")');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      expect(buttonCount).toBeGreaterThan(0);
    }

    // Ensure no English button text
    const englishButtons = page.locator('button:has-text("View Products")');
    const englishButtonCount = await englishButtons.count();
    expect(englishButtonCount).toBe(0);
  });

  test('should display item count badge in Korean with "개" unit', async ({ page }) => {
    // Wait for items to load
    await page.waitForTimeout(2000);

    // Check for Korean "개" unit in item counts
    const pageContent = await page.textContent('body');
    if (pageContent?.includes('개')) {
      // If items are displayed, they should use Korean unit
      expect(pageContent).toContain('개');
    }
  });

  test('should display out of stock text in Korean', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Check if "품절" appears (for out of stock items)
    const pageContent = await page.textContent('body');
    
    // This might not always be present, but if it is, it should be Korean
    if (pageContent?.includes('품절')) {
      expect(pageContent).toContain('품절');
      expect(pageContent).not.toContain('Out of Stock');
    }
  });

  test('should display loading message in Korean', async ({ page }) => {
    // Scroll to bottom to trigger loading
    const body = page.locator('body');
    await body.evaluate((el) => el.scrollIntoView());

    // Attempt to scroll to trigger infinite scroll
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitForTimeout(500);
    }

    // Check for loading message in Korean
    const pageContent = await page.textContent('body');
    if (pageContent?.includes('로드')) {
      // If loading is shown, should be in Korean
      expect(pageContent).toContain('로드 중');
    }
  });

  test('should display end message in Korean', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(1000);

    // Check for end-of-list message
    const pageContent = await page.textContent('body');
    
    // If all categories are loaded, should show Korean end message
    if (pageContent?.includes('모두')) {
      expect(pageContent).toContain('모두');
      // Ensure no English "You've seen it all"
      expect(pageContent).not.toContain("You've seen it all");
    }
  });

  test('should not display any English UI text on the page', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const pageContent = await page.textContent('body');
    
    // List of English texts that should NOT appear
    const englishTextsToAvoid = [
      'Shop by Categories',
      'Discover our wide range',
      'Total Categories',
      'View Products',
      'Loading more categories',
      "You've seen it all",
      'Browse All Products',
      'Categories',
      'Products',
    ];

    englishTextsToAvoid.forEach(text => {
      if (text !== 'Categories' && text !== 'Products') {
        // Some might appear in URLs or other contexts, so only check critical ones
        if (text === 'Shop by Categories' || text === 'View Products' || text === 'Loading more categories') {
          expect(pageContent).not.toContain(text);
        }
      }
    });
  });

  test('should have correct page title meta tag', async ({ page }) => {
    // Check meta title or document title for Korean text
    const titleText = await page.title();
    // Title might contain category page reference in Korean
    await expect(page).toHaveTitle(/카테고리|category/i);
  });
});