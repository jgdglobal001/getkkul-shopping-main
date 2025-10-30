import { test, expect } from '@playwright/test';

test.describe('AddToCart Cancel Mode Feature', () => {
  const productUrl = 'http://localhost:3002/products/cmhcwwyqk0000l504gx9du4f6';

  test.beforeEach(async ({ page, context }) => {
    // Create a new context to ensure clean cart state
    await page.goto('http://localhost:3002/');
    await page.waitForLoadState('networkidle');
  });

  test('E2E: Add product, enter cancel mode, and return to add-to-cart button', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');

    // Step 1: Click "Add to Cart" button
    await page.getByRole('button', { name: '장바구니에 담기' }).click();
    await page.waitForTimeout(1000);

    // Step 2: Verify quantity controls appear
    await expect(page.getByText('장바구니에 있음')).toBeVisible();

    // Step 3: Click minus button (first button in the quantity controls)
    // The minus button is the first button after we see "장바구니에 있음"
    const quantitySection = page.locator('div').filter({ has: page.getByText('장바구니에 있음') }).first();
    const buttons = quantitySection.locator('button');
    const minusButton = buttons.nth(0);
    
    await minusButton.click();
    await page.waitForTimeout(1000);

    // Step 4: Verify cancel mode - "담기 취소" button should appear
    // The cancel button is a sibling, not inside quantitySection
    const cancelButton = page.getByRole('button', { name: '담기 취소' }).first();
    await expect(cancelButton).toBeVisible();

    // Step 5: Click "담기 취소" button
    await cancelButton.click();
    await page.waitForTimeout(1000);

    // Step 6: Verify we're back to "Add to Cart" button
    await expect(page.getByRole('button', { name: '장바구니에 담기' })).toBeVisible();
  });

  test('E2E: Quantity decrease at qty=1 enters cancel mode, qty>=2 decreases normally', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');

    // Add product
    await page.getByRole('button', { name: '장바구니에 담기' }).click();
    await page.waitForTimeout(1000);

    const quantitySection = page.locator('div').filter({ has: page.getByText('장바구니에 있음') }).first();
    const buttons = quantitySection.locator('button');
    const minusButton = buttons.nth(0);
    const plusButton = buttons.nth(1);

    // Increase quantity to 2
    await plusButton.click();
    await page.waitForTimeout(1000);

    // Decrease back to 1 - should NOT enter cancel mode
    await minusButton.click();
    await page.waitForTimeout(1000);

    // Verify quantity controls still visible
    const quantityIndicator = page.getByText('장바구니에 있음');
    await expect(quantityIndicator).toBeVisible();

    // Click minus again at qty=1 - should enter cancel mode
    await minusButton.click();
    await page.waitForTimeout(1000);

    // Verify cancel button appears (sibling of quantity section)
    const cancelButton = page.getByRole('button', { name: '담기 취소' }).first();
    await expect(cancelButton).toBeVisible();

    // Verify quantity indicator disappears
    const quantityGone = await quantityIndicator.isVisible().catch(() => false);
    await expect(quantityGone).toBeFalsy();
  });

  test('E2E: Quantity increase respects stock limit', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');

    // Add product
    await page.getByRole('button', { name: '장바구니에 담기' }).click();
    await page.waitForTimeout(1000);

    const quantitySection = page.locator('div').filter({ has: page.getByText('장바구니에 있음') }).first();
    const plusButton = quantitySection.locator('button').nth(1);

    // Try to increase quantity many times
    for (let i = 0; i < 25; i++) {
      const isDisabled = await plusButton.isDisabled().catch(() => false);
      if (isDisabled) {
        // Successfully reached stock limit
        await expect(isDisabled).toBeTruthy();
        return;
      }
      await plusButton.click();
      await page.waitForTimeout(200);
    }

    // If we get here, check that plus button is at least disabled
    const finalDisabled = await plusButton.isDisabled().catch(() => false);
    await expect(finalDisabled).toBeTruthy();
  });

  test('E2E: Multiple add/cancel cycles work correctly', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');

    // Cycle 1: Add and cancel
    for (let cycle = 0; cycle < 2; cycle++) {
      // Add to cart
      await page.getByRole('button', { name: '장바구니에 담기' }).click();
      await page.waitForTimeout(1000);

      // Get quantity section
      const quantitySection = page.locator('div').filter({ has: page.getByText('장바구니에 있음') }).first();
      const minusButton = quantitySection.locator('button').nth(0);

      // Enter cancel mode
      await minusButton.click();
      await page.waitForTimeout(1000);

      // Click cancel button (sibling of quantity section)
      const cancelButton = page.getByRole('button', { name: '담기 취소' }).first();
      await cancelButton.click();
      await page.waitForTimeout(1000);

      // Verify back to add-to-cart
      await expect(page.getByRole('button', { name: '장바구니에 담기' })).toBeVisible();
    }
  });

  test('E2E: Add, increase, then decrease shows normal controls not cancel', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');

    // Add product
    await page.getByRole('button', { name: '장바구니에 담기' }).click();
    await page.waitForTimeout(1000);

    const quantitySection = page.locator('div').filter({ has: page.getByText('장바구니에 있음') }).first();
    const buttons = quantitySection.locator('button');
    const minusButton = buttons.nth(0);
    const plusButton = buttons.nth(1);

    // Increase
    await plusButton.click();
    await page.waitForTimeout(500);
    await plusButton.click();
    await page.waitForTimeout(500);
    await plusButton.click();
    await page.waitForTimeout(1000);

    // Decrease multiple times but not to cancel
    await minusButton.click();
    await page.waitForTimeout(500);
    await minusButton.click();
    await page.waitForTimeout(500);
    await minusButton.click();
    await page.waitForTimeout(1000);

    // Should show normal quantity controls, not cancel button
    const quantityIndicator = page.getByText('장바구니에 있음');
    await expect(quantityIndicator).toBeVisible();

    // Buttons should still be visible
    await expect(minusButton).toBeVisible();
    await expect(plusButton).toBeVisible();

    // Cancel button should NOT appear until we reach qty=1 and click minus again
  });
});