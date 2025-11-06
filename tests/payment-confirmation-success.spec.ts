import { test, expect } from '@playwright/test';

test.describe('Payment Confirmation Success', () => {
  test('should verify payment and update order status when session is authenticated', async ({ page }) => {
    // Mock the session as authenticated
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-token');
    });

    // Intercept the toss-confirm API call
    let apiCalled = false;
    await page.route('**/api/orders/toss-confirm', async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to success page with mock params
    await page.goto('/payment/success?paymentKey=mock-payment-key&orderId=ORD-123&amount=10000');

    // Wait for potential API call
    await page.waitForTimeout(2000);

    // Assert that the API was called
    expect(apiCalled).toBe(true);
  });

  test('should not verify payment when session is not authenticated', async ({ page }) => {
    // Ensure no session
    await page.addInitScript(() => {
      window.localStorage.removeItem('next-auth.session-token');
    });

    // Intercept the toss-confirm API call
    let apiCalled = false;
    await page.route('**/api/orders/toss-confirm', async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to success page with mock params
    await page.goto('/payment/success?paymentKey=mock-payment-key&orderId=ORD-123&amount=10000');

    // Wait for potential API call
    await page.waitForTimeout(2000);

    // Assert that the API was not called
    expect(apiCalled).toBe(false);
  });
});