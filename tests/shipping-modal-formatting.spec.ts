import { test, expect } from '@playwright/test';

test.describe('ShippingModal Number Formatting and Korean Translations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display free shipping threshold with comma separator in header banner', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Check header banner text for formatted threshold
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    
    // Should find the banner with comma-formatted amount
    const bannerText = await headerBanner.textContent();
    expect(bannerText).toContain('₩29,000');
    
    // Ensure it's NOT displaying unformatted number
    expect(bannerText).not.toContain('₩29000');
  });

  test('should open shipping modal when clicking header banner', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check if modal title is visible
    const title = page.locator('h3:has-text("무료 배송")').first();
    await expect(title).toBeVisible();
  });

  test('should display modal title in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check modal title
    const title = page.locator('h3:has-text("무료 배송")').first();
    await expect(title).toContainText('무료 배송');
  });

  test('should display modal subtitle in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check modal subtitle
    const subtitle = page.locator('p:has-text("빠르고 신뢰할 수 있는 배송 서비스")').first();
    await expect(subtitle).toBeVisible();
  });

  test('should display free shipping offer with formatted amount in modal', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check free shipping offer text with formatted amount
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('₩29,000 이상 주문 시 무료배송');
    
    // Ensure unformatted version is NOT present
    expect(pageContent).not.toContain('₩29000 이상 주문 시 무료배송');
  });

  test('should display free shipping description with formatted amount in modal', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check free shipping description text
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('₩29,000 이상의 모든 주문에 대해 무료배송을 이용하세요');
    
    // Ensure unformatted version is NOT present
    expect(pageContent).not.toContain('₩29000 이상의 모든 주문에 대해 무료배송을 이용하세요');
  });

  test('should display delivery time section in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check delivery time section
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('배송 시간');
    expect(pageContent).toContain('오전 12시(정오)까지 주문 시 당일 출고');
  });

  test('should display coverage area section in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check coverage area section
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('배송 지역');
    expect(pageContent).toContain('수도권 전지역 익일 도착률 97%, 그 외 지역 2~3일 이내 도착');
  });

  test('should display tracking section in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check tracking section
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('추적');
    expect(pageContent).toContain('모든 배송 상황을 송장번호로 확인할 수 있습니다');
  });

  test('should display terms and conditions section in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check terms section
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('배송 안내');
    expect(pageContent).toContain('무료 배송 혜택은 한국 내 배송에만 적용됩니다');
    expect(pageContent).toContain('특수 상품은 추가 요금이 발생할 수 있습니다');
    expect(pageContent).toContain('오전 12시(정오)까지 주문한 상품은 같은 영업일에 배송됩니다');
    expect(pageContent).toContain('주말 및 휴일 주문은 다음 영업일에 배송됩니다');
  });

  test('should display close button in Korean', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check close button
    const closeButton = page.locator('button:has-text("닫기")').first();
    await expect(closeButton).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Verify modal title is visible
    const title = page.locator('h3:has-text("무료 배송")').first();
    await expect(title).toBeVisible();

    // Click close button
    const closeButton = page.locator('button:has-text("닫기")').first();
    await closeButton.click();

    // Wait for modal to disappear
    await page.waitForTimeout(500);

    // Verify modal title is not visible
    await expect(title).not.toBeVisible();
  });

  test('should not display any English critical text in modal', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Check that critical English texts are NOT present
    const pageContent = await page.textContent('body');
    
    const criticalEnglishTexts = [
      'Free Shipping',
      'Fast and reliable',
      'Delivery Time',
      'Coverage Area',
      'Tracking',
      'Terms and Conditions',
      'Close',
    ];

    criticalEnglishTexts.forEach(text => {
      if (pageContent?.includes(text)) {
        expect(pageContent).not.toContain(text);
      }
    });
  });

  test('should display consistent formatted amount in both header and modal', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Get header banner text
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    const headerText = await headerBanner.textContent();

    // Click to open modal
    await headerBanner.click();
    await page.waitForTimeout(500);

    // Get page content
    const pageContent = await page.textContent('body');

    // Both should contain the formatted amount
    expect(headerText).toContain('₩29,000');
    expect(pageContent).toContain('₩29,000');

    // Neither should contain unformatted amount
    expect(headerText).not.toContain('₩29000');
    expect(pageContent).not.toContain('₩29000');
  });

  test('should close modal when clicking background overlay', async ({ page }) => {
    // Wait for header to load
    await page.waitForTimeout(1000);

    // Click the shipping banner to open modal
    const headerBanner = page.locator('p').filter({ hasText: /₩[\d,]+/ }).first();
    await headerBanner.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Verify modal is visible
    const title = page.locator('h3:has-text("무료 배송")').first();
    await expect(title).toBeVisible();

    // Click on the background overlay
    const overlay = page.locator('div[class*="fixed inset-0 z-50"]').locator('div').first();
    await overlay.click({ position: { x: 10, y: 10 } });

    // Wait for modal to disappear
    await page.waitForTimeout(500);

    // Verify modal is not visible
    const isVisible = await title.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});