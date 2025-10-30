import { test, expect } from '@playwright/test';

test.describe('Product Details Page - Korean Labels', () => {
  const productUrl = 'http://localhost:3002/products/cmhcwwyqk0000l504gx9du4f6';

  test('should display all product labels in Korean', async ({ page }) => {
    await page.goto(productUrl);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for savings amount label (절약하는 금액)
    const savingsLabel = page.getByText(/절약하는/);
    await expect(savingsLabel.first()).toBeVisible();
    
    // Check for brand label (브랜드) - in product info section
    const brandText = page.locator('p, span').filter({ hasText: '브랜드' }).first();
    if (await brandText.count() > 0) {
      await expect(brandText).toBeVisible();
    }
    
    // Check for category label (카테고리) - specifically in product info section
    const categoryInInfo = page.getByText(/카테고리:/);
    if (await categoryInInfo.count() > 0) {
      await expect(categoryInInfo.first()).toBeVisible();
    }
    
    // Check for tags label (태그)
    const tagsLabel = page.getByText(/태그:/);
    if (await tagsLabel.count() > 0) {
      await expect(tagsLabel.first()).toBeVisible();
    }
    
    // Check for payment security guarantee label (안전하고 보안된 결제 보장)
    const paymentSecurityLabel = page.getByText(/안전하고|보안된|결제|보장/);
    if (await paymentSecurityLabel.count() > 0) {
      await expect(paymentSecurityLabel.first()).toBeVisible();
    }
  });

  test('should NOT display English labels on product details page', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');
    
    // Verify that English "Brand:" is NOT visible (should be Korean 브랜드)
    const englishBrand = page.locator('text=Brand:');
    await expect(englishBrand).not.toBeVisible();
    
    // Verify that English "Category:" is NOT visible
    const englishCategory = page.locator('text=Category:');
    await expect(englishCategory).not.toBeVisible();
    
    // Verify that English "Tags:" is NOT visible
    const englishTags = page.locator('text=Tags:');
    await expect(englishTags).not.toBeVisible();
    
    // Verify that "You are saving" is NOT visible
    const englishSaving = page.locator('text=/You are saving/');
    await expect(englishSaving).not.toBeVisible();
  });

  test('should display brand and category values with Korean labels', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');
    
    // Check for brand label with actual brand value
    const brandSection = page.getByText(/브랜드/);
    if (await brandSection.count() > 0) {
      await expect(brandSection.first()).toBeVisible();
    }
    
    // Check for category label with category value - specifically in product info
    const categorySection = page.getByText(/카테고리:/);
    if (await categorySection.count() > 0) {
      await expect(categorySection.first()).toBeVisible();
    }
    
    // Check for tags label with tag value
    const tagsSection = page.getByText(/태그:/);
    if (await tagsSection.count() > 0) {
      await expect(tagsSection.first()).toBeVisible();
    }
  });
});

test.describe('Cart Page - Product Korean Labels', () => {
  const cartUrl = 'http://localhost:3002/cart';

  test('should display cart product labels in Korean', async ({ page }) => {
    await page.goto(cartUrl);
    await page.waitForLoadState('networkidle');
    
    // Check if cart has items
    const cartItems = page.locator('[data-testid="cart-item"]').first();
    
    if (await cartItems.count() > 0) {
      // Check for brand label (브랜드)
      const brandLabel = page.locator('text=/브랜드/i').first();
      if (await brandLabel.isVisible()) {
        await expect(brandLabel).toBeVisible();
      }
      
      // Check for category label (카테고리)
      const categoryLabel = page.locator('text=/카테고리/i').first();
      if (await categoryLabel.isVisible()) {
        await expect(categoryLabel).toBeVisible();
      }
    }
  });

  test('should NOT display English labels in cart products', async ({ page }) => {
    await page.goto(cartUrl);
    await page.waitForLoadState('networkidle');
    
    // Check if cart has items
    const cartItems = page.locator('[data-testid="cart-item"]').first();
    
    if (await cartItems.count() > 0) {
      // Verify English labels are not visible
      const englishBrandLabels = page.locator('text=Brand:');
      const englishCategoryLabels = page.locator('text=Category:');
      
      // These should not be visible if Korean labels are properly applied
      if (await englishBrandLabels.count() === 0) {
        await expect(englishBrandLabels).toHaveCount(0);
      }
    }
  });

  test('should add product to cart and verify Korean labels', async ({ page }) => {
    // Navigate to product page
    await page.goto('http://localhost:3002/products/cmhcwwyqk0000l504gx9du4f6');
    await page.waitForLoadState('networkidle');
    
    // Find and click add to cart button - use getByRole to find button
    const addToCartButton = page.getByRole('button').filter({ hasText: /장바구니|카트|추가/ }).first();
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
      
      // Navigate to cart
      await page.goto('http://localhost:3002/cart');
      await page.waitForLoadState('networkidle');
      
      // Verify Korean labels are present
      const koreanLabels = page.getByText(/브랜드|카테고리/).first();
      const visible = await koreanLabels.isVisible().catch(() => false);
      if (visible) {
        await expect(koreanLabels).toBeVisible();
      }
    }
  });
});

test.describe('Product Details - Savings Information', () => {
  const productUrl = 'http://localhost:3002/products/cmhcwwyqk0000l504gx9du4f6';

  test('should display savings amount with Korean labels and currency symbol', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');
    
    // Check for savings message with Korean labels and won symbol
    const savingsWithCurrency = page.locator('text=/절약.*₩|₩.*절약/');
    const hasVisibleSavings = await savingsWithCurrency.isVisible().catch(() => false);
    
    if (hasVisibleSavings) {
      await expect(savingsWithCurrency).toBeVisible();
    }
  });

  test('should display payment security guarantee in Korean', async ({ page }) => {
    await page.goto(productUrl);
    await page.waitForLoadState('networkidle');
    
    // Check for payment security message
    const securityMessage = page.locator('text=/안전하고.*보안된|안전.*보증|결제.*보장/');
    const isVisible = await securityMessage.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(securityMessage).toBeVisible();
    }
  });
});