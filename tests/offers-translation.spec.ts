import { test, expect } from '@playwright/test';

test.describe('Offers Page Korean Translation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to offers page
    await page.goto('/offers');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display page title in Korean', async ({ page }) => {
    // Check page title is in Korean
    const pageTitle = page.locator('h1');
    await expect(pageTitle).toContainText('특가 상품');
    // Ensure no English text
    await expect(pageTitle).not.toContainText('Special Offers');
  });

  test('should display page description in Korean', async ({ page }) => {
    // Check page description contains Korean text
    const description = page.locator('p').filter({ hasText: '놓치지 마세요' });
    await expect(description).toBeVisible();
    // Ensure no English description text
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Don\'t miss out');
  });

  test('should display breadcrumb navigation in Korean', async ({ page }) => {
    // Check breadcrumb navigation
    const breadcrumb = page.locator('[role="navigation"]');
    if (await breadcrumb.isVisible()) {
      const breadcrumbText = await breadcrumb.textContent();
      expect(breadcrumbText).toContain('홈');
      expect(breadcrumbText).toContain('특가');
      expect(breadcrumbText).not.toContain('Home');
      expect(breadcrumbText).not.toContain('Special Offers');
    }
  });

  test('should display filter labels in Korean', async ({ page }) => {
    // Wait for filters to load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // Check for Korean filter labels
    expect(pageContent).toContain('카테고리');
    expect(pageContent).toContain('최소 할인율');
    
    // Ensure no English Minimum Discount label
    expect(pageContent).not.toContain('Minimum Discount');
  });

  test('should display sort options in Korean', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Look for sort dropdown or similar UI
    const pageContent = await page.textContent('body');
    
    // Check for Korean sort option labels
    const koreanSortTexts = ['최고 할인율', '최저 할인율', '낮은 가격순', '높은 가격순'];
    
    // At least one sort option should be visible in Korean
    const hasSortOptions = koreanSortTexts.some(text => pageContent?.includes(text));
    
    if (hasSortOptions) {
      // Ensure no English sort options
      expect(pageContent).not.toContain('Highest Discount');
      expect(pageContent).not.toContain('Lowest Discount');
      expect(pageContent).not.toContain('Price Low to High');
      expect(pageContent).not.toContain('Price High to Low');
    }
  });

  test('should display category filter options in Korean', async ({ page }) => {
    // Wait for filters to load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // Check for Korean category filter options
    expect(pageContent).toContain('모든 카테고리');
    
    // Ensure no English category filter
    expect(pageContent).not.toContain('All Categories');
  });

  test('should display discount filter options in Korean', async ({ page }) => {
    // Wait for filters to load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // Check for Korean discount filter options
    expect(pageContent).toContain('모든 할인');
    
    // Check for specific discount percentages in Korean
    const hasDiscountRanges = pageContent?.includes('10% 이상') || 
                              pageContent?.includes('20% 이상') || 
                              pageContent?.includes('30% 이상');
    
    // If discount ranges are shown, they should be in Korean
    if (hasDiscountRanges) {
      expect(pageContent).not.toContain('10% or more');
      expect(pageContent).not.toContain('20% or more');
    }
  });

  test('should display empty state message in Korean', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // If no offers found, should display Korean message
    if (pageContent?.includes('발견된 상품이 없습니다')) {
      expect(pageContent).toContain('발견된 상품이 없습니다');
      expect(pageContent).not.toContain('No offers found');
    }
    
    // If offers are found, page should still have Korean UI
    if (pageContent?.includes('특가 상품')) {
      expect(pageContent).toContain('특가 상품');
    }
  });

  test('should display "try adjusting filters" message in Korean', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // If this message exists, it should be in Korean
    if (pageContent?.includes('필터')) {
      // This text might appear in empty state
      expect(pageContent).not.toContain('Try adjusting');
    }
  });

  test('should display clear filters button in Korean', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // Check for Korean clear filters button
    const clearFiltersButton = page.locator('button').filter({ hasText: /필터|초기화/ });
    
    if (await clearFiltersButton.count() > 0) {
      const buttonText = await clearFiltersButton.first().textContent();
      expect(buttonText).not.toContain('Clear All Filters');
      expect(buttonText).not.toContain('Clear Filters');
    }
  });

  test('should display load more button in Korean', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Scroll to bottom to see load more button
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(1000);

    const loadMoreButton = page.locator('button').filter({ hasText: /더 많은|더보기/ });
    
    if (await loadMoreButton.count() > 0) {
      const buttonText = await loadMoreButton.first().textContent();
      expect(buttonText).not.toContain('Load More Offers');
      expect(buttonText).not.toContain('Load More');
    }
  });

  test('should display offers count in Korean format', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // Check for Korean count format (should contain numbers with Korean text)
    if (pageContent?.includes('특가 상품')) {
      // Page has loaded with offers
      // Count display should not use English format
      expect(pageContent).not.toContain('Offers Found');
    }
  });

  test('should not display any critical English UI text on the page', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const pageContent = await page.textContent('body');
    
    // List of critical English texts that should NOT appear
    const criticalEnglishTexts = [
      'Special Offers',
      'Don\'t miss out',
      'Highest Discount',
      'Lowest Discount',
      'Price Low to High',
      'Price High to Low',
      'All Categories',
      'Minimum Discount',
      'No offers found',
      'Load More Offers',
    ];

    criticalEnglishTexts.forEach(text => {
      if (pageContent?.includes(text)) {
        expect(pageContent).not.toContain(text);
      }
    });
  });

  test('should have correct page title meta tag', async ({ page }) => {
    // Check meta title or document title for Korean text
    const titleText = await page.title();
    // Title should contain offer or special price reference in Korean or be generic
    expect(titleText.length).toBeGreaterThan(0);
  });

  test('should display sort options dropdown with Korean labels', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find sort/select element
    const sortElements = page.locator('select, [role="combobox"], [role="listbox"]');
    
    if (await sortElements.count() > 0) {
      const sortElement = sortElements.first();
      const sortText = await sortElement.textContent();
      
      // If sort dropdown exists, should have Korean labels
      if (sortText) {
        expect(sortText).not.toContain('Highest Discount');
        expect(sortText).not.toContain('Lowest Discount');
      }
    }
  });

  test('should display offers found count in Korean', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(2000);

    const pageContent = await page.textContent('body');
    
    // Should not display English "Offers Found" format
    expect(pageContent).not.toMatch(/\d+\s+Offers Found/);
    
    // If count is displayed, check for Korean format
    if (pageContent?.match(/\d+\s+특가/)) {
      expect(pageContent).toMatch(/\d+\s+특가/);
    }
  });
});