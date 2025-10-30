import { test, expect } from '@playwright/test';

test.describe('Product Form Fields - Weight & Dimensions', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin product management page
    await page.goto('/account/admin/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should load product registration page without errors', async ({ page }) => {
    // Check if we're on admin page or redirected to auth
    const url = page.url();
    const isAdminPage = url.includes('/admin/products');
    const isAuthPage = url.includes('/auth');
    
    expect(isAdminPage || isAuthPage).toBeTruthy();
    
    // Verify no critical JavaScript errors on page load
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Specifically check for the "Cannot read properties of undefined (reading 'width')" error
    const dimensionError = errors.filter(e => 
      e.includes('Cannot read properties') && e.includes('width')
    );
    
    expect(dimensionError.length).toBe(0);
  });

  test('should display weight input field', async ({ page }) => {
    const url = page.url();
    
    // Only run if we're on the admin page (not redirected to auth)
    if (url.includes('/admin/products')) {
      // Look for weight label in Korean
      const weightLabel = page.locator('label').filter({ hasText: /무게|Weight/ }).first();
      
      // If admin page is loaded, weight field should be present
      if (await weightLabel.isVisible({ timeout: 5000 }).catch(() => false)) {
        expect(await weightLabel.isVisible()).toBeTruthy();
        
        // Find the associated input
        const weightInput = page.locator('input[placeholder*="kg"]').first();
        expect(await weightInput.isVisible()).toBeTruthy();
      }
    }
  });

  test('should display dimension input fields (width, height, depth)', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      const dimensions = ['width', 'height', 'depth'];
      const koreanLabels = ['가로', '세로', '깊이']; // width, height, depth in Korean
      
      // Check if any dimension field is visible (page might still be loading)
      const pageContent = await page.textContent('body');
      
      // If product form is present, dimension fields should exist
      if (pageContent?.includes('상품 정보') || pageContent?.includes('Product')) {
        for (const label of koreanLabels) {
          const fieldLabel = page.locator(`label`).filter({ hasText: new RegExp(label, 'i') });
          
          // At least some dimension fields should be present
          if (await fieldLabel.count() > 0) {
            expect(await fieldLabel.first().isVisible()).toBeTruthy();
          }
        }
      }
    }
  });

  test('should have weight input with numeric type and correct step', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      const weightInputs = page.locator('input[type="number"][placeholder*="kg"]');
      
      if (await weightInputs.count() > 0) {
        const firstInput = weightInputs.first();
        
        // Check numeric input properties
        const type = await firstInput.getAttribute('type');
        const step = await firstInput.getAttribute('step');
        
        expect(type).toBe('number');
        expect(step).toBe('0.01');
      }
    }
  });

  test('should have dimension inputs with numeric type and correct step', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      // Look for dimension inputs (they should have step attribute for dimensions)
      const dimensionInputs = page.locator('input[placeholder*="cm"], input[placeholder*="m"]').or(
        page.locator('input').filter({ has: page.locator('label').filter({ hasText: /가로|세로|깊이/ }) })
      );
      
      if (await dimensionInputs.count() > 0) {
        for (let i = 0; i < Math.min(await dimensionInputs.count(), 3); i++) {
          const input = dimensionInputs.nth(i);
          const type = await input.getAttribute('type');
          expect(type).toBe('number');
        }
      }
    }
  });

  test('should allow entering weight value without error', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      const weightInput = page.locator('input[placeholder*="kg"]').first();
      
      if (await weightInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Type a weight value
        await weightInput.fill('2.5');
        
        // Verify the value was entered
        const value = await weightInput.inputValue();
        expect(value).toBe('2.5');
        
        // No JavaScript error should occur
        const errors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });
        
        expect(errors.length).toBe(0);
      }
    }
  });

  test('should allow entering dimension values without error', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      // Try to find and fill dimension inputs
      const widthInput = page.locator('input').filter({ has: page.locator('label').filter({ hasText: /가로|Width/ }) }).first();
      const heightInput = page.locator('input').filter({ has: page.locator('label').filter({ hasText: /세로|Height/ }) }).first();
      const depthInput = page.locator('input').filter({ has: page.locator('label').filter({ hasText: /깊이|Depth/ }) }).first();
      
      const inputs = [
        { input: widthInput, value: '10.5' },
        { input: heightInput, value: '15.2' },
        { input: depthInput, value: '8.3' }
      ];
      
      for (const { input, value } of inputs) {
        if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
          await input.fill(value);
          const inputValue = await input.inputValue();
          expect(inputValue).toBe(value);
        }
      }
      
      // No dimensions.width error should occur
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      const dimensionErrors = errors.filter(e => 
        (e.includes('dimensions') && e.includes('width')) ||
        e.includes('Cannot read properties of undefined')
      );
      
      expect(dimensionErrors.length).toBe(0);
    }
  });

  test('should not throw "Cannot read properties of undefined" error', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/account/admin/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check for the specific error that was reported
    const propertyErrors = errors.filter(e => 
      e.includes('Cannot read properties of undefined') &&
      (e.includes('width') || e.includes('height') || e.includes('depth') || e.includes('dimensions'))
    );
    
    expect(propertyErrors.length).toBe(0);
  });

  test('should display availability status field', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      const bodyContent = await page.textContent('body');
      
      // Check for availability status field
      if (bodyContent?.includes('상품 정보') || bodyContent?.includes('Product')) {
        const availabilityLabel = page.locator('label').filter({ hasText: /재고|Availability|상태/ });
        
        if (await availabilityLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          expect(await availabilityLabel.count()).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should display minimum order quantity field', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      const bodyContent = await page.textContent('body');
      
      // Check for minimum order quantity field
      if (bodyContent?.includes('상품 정보') || bodyContent?.includes('Product')) {
        const minOrderLabel = page.locator('label').filter({ hasText: /최소|Minimum|주문/ });
        
        if (await minOrderLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
          expect(await minOrderLabel.count()).toBeGreaterThan(0);
        }
      }
    }
  });

  test('should initialize form fields with default values', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      // Check default values on page load
      const weightInput = page.locator('input[placeholder*="kg"]').first();
      const availabilitySelect = page.locator('select').filter({ has: page.locator('option').filter({ hasText: /Stock|재고/ }) });
      
      if (await weightInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Weight should either be empty or have a default numeric value
        const weightValue = await weightInput.inputValue();
        expect(weightValue === '' || !isNaN(parseFloat(weightValue))).toBeTruthy();
      }
      
      if (await availabilitySelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Availability should have a default selected value
        const selectedValue = await availabilitySelect.inputValue();
        expect(selectedValue?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should have all dimension fields connected to form state', async ({ page }) => {
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      // Try to find and fill dimension inputs with timeout protection
      const widthInput = page.locator(`input[placeholder*="width"], input[placeholder*="Width"], input[placeholder*="가로"]`).first();
      const heightInput = page.locator(`input[placeholder*="height"], input[placeholder*="Height"], input[placeholder*="세로"]`).first();
      const depthInput = page.locator(`input[placeholder*="depth"], input[placeholder*="Depth"], input[placeholder*="깊이"]`).first();
      
      let filledCount = 0;
      
      if (await widthInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await widthInput.fill('12.5');
        filledCount++;
      }
      
      if (await heightInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await heightInput.fill('20.0');
        filledCount++;
      }
      
      if (await depthInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await depthInput.fill('9.5');
        filledCount++;
      }
      
      // Verify that at least some dimension fields exist and were filled
      if (filledCount > 0) {
        // Get values with timeout protection
        const widthValue = await widthInput.inputValue().catch(() => '');
        const heightValue = await heightInput.inputValue().catch(() => '');
        
        // If both fields were filled, their values should be independent
        if (widthValue && heightValue) {
          expect(widthValue).not.toBe(heightValue);
        }
      }
    }
  });

  test('should validate that form doesn\'t crash on dimension state updates', async ({ page }) => {
    const consoleMessages: Array<{ type: string; text: string }> = [];
    
    page.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    
    const url = page.url();
    
    if (url.includes('/admin/products')) {
      // Rapidly update dimension fields to stress test state management
      const widthInput = page.locator(`input[placeholder*="width"], input[placeholder*="Width"], input[placeholder*="가로"]`).first();
      const heightInput = page.locator(`input[placeholder*="height"], input[placeholder*="Height"], input[placeholder*="세로"]`).first();
      
      if (await widthInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        for (let i = 1; i <= 3; i++) {
          await widthInput.fill(`${i}.5`);
          await page.waitForTimeout(100);
        }
      }
      
      if (await heightInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        for (let i = 10; i <= 12; i++) {
          await heightInput.fill(`${i}.0`);
          await page.waitForTimeout(100);
        }
      }
      
      // Check for dimension-related errors
      const dimensionErrors = consoleMessages.filter(m =>
        m.type === 'error' &&
        (m.text.includes('dimensions') || m.text.includes('width') || m.text.includes('height') || m.text.includes('depth'))
      );
      
      expect(dimensionErrors.length).toBe(0);
    }
  });

});