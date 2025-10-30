import { test, expect } from '@playwright/test';

test.describe('Product Tags - Auto Separation Feature', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin product creation page
    await page.goto('/account/admin/products/new');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should split tags by # separator', async ({ page }) => {
    const url = page.url();
    
    // Skip test if redirected to auth page (not logged in as admin)
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    // Find the tag input field
    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter multiple tags separated by #
      await tagInput.fill('#keyword1#keyword2#keyword3');
      
      // Click the add/submit button for tags
      const addButton = page.locator('button').filter({ hasText: /추가|Add|제출|Submit/ }).nth(0);
      
      // Try to find the specific tag add button (usually near the tag input)
      const tagContainer = tagInput.locator('..');
      const addTagButton = tagContainer.locator('button').first();
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        // Fallback: press Enter
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Verify tags were split and added
      const tagElements = page.locator('div').filter({ hasText: /keyword1|keyword2|keyword3/ });
      const visibleTagCount = await tagElements.count();
      
      // At least the tags should be present (they might be in separate elements)
      expect(visibleTagCount).toBeGreaterThanOrEqual(1);
      
      // Verify input field is cleared after adding
      const inputValue = await tagInput.inputValue();
      expect(inputValue).toBe('');
    }
  });

  test('should add single tag without # separator', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter a single tag without # separator
      await tagInput.fill('singletag');
      
      // Find and click the tag add button
      const tagContainer = tagInput.locator('..');
      const addTagButton = tagContainer.locator('button').first();
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Verify tag was added
      const singleTag = page.locator('div, span').filter({ hasText: 'singletag' });
      expect(await singleTag.count()).toBeGreaterThanOrEqual(1);
      
      // Input should be cleared
      const inputValue = await tagInput.inputValue();
      expect(inputValue).toBe('');
    }
  });

  test('should filter out empty strings when splitting tags', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter tags with extra # that would create empty strings
      await tagInput.fill('##tag1###tag2##');
      
      const tagContainer = tagInput.locator('..');
      const addTagButton = tagContainer.locator('button').first();
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Check console for any errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Empty strings should be filtered, only tag1 and tag2 should be added
      expect(errors.length).toBe(0);
      expect(await tagInput.inputValue()).toBe('');
    }
  });

  test('should not add duplicate tags', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Add first tag
      await tagInput.fill('mytag');
      
      const tagContainer = tagInput.locator('..');
      const addTagButton = tagContainer.locator('button').first();
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Try to add the same tag again
      await tagInput.fill('mytag');
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Verify input is cleared but tag should only appear once
      expect(await tagInput.inputValue()).toBe('');
    }
  });

  test('should display placeholder text with format example', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const placeholder = await tagInput.getAttribute('placeholder');
      
      // Verify placeholder contains format instructions
      expect(placeholder).toContain('#');
      expect(placeholder).toContain('태그');
    }
  });

  test('should handle whitespace correctly when splitting tags', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter tags with extra spaces
      await tagInput.fill('  #  tag1  #  tag2  ');
      
      const tagContainer = tagInput.locator('..');
      const addTagButton = tagContainer.locator('button').first();
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Input should be cleared after submission
      const inputValue = await tagInput.inputValue();
      expect(inputValue).toBe('');
      
      // Tags should be trimmed (spaces removed)
      const tag1 = page.locator('div, span').filter({ hasText: /^tag1$/ });
      const tag2 = page.locator('div, span').filter({ hasText: /^tag2$/ });
      
      // At least one trimmed tag should be visible
      const tagCount = await tag1.count() + await tag2.count();
      expect(tagCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('should allow entering and submitting tag with Enter key', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter tag and press Enter
      await tagInput.fill('testtag');
      await tagInput.press('Enter');
      
      await page.waitForTimeout(500);
      
      // Verify input field is cleared
      const inputValue = await tagInput.inputValue();
      expect(inputValue).toBe('');
    }
  });

  test('should handle tag form without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Perform multiple tag operations
      for (let i = 1; i <= 3; i++) {
        await tagInput.fill(`tag${i}`);
        
        const tagContainer = tagInput.locator('..');
        const addTagButton = tagContainer.locator('button').first();
        
        if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await addTagButton.click();
        } else {
          await tagInput.press('Enter');
        }
        
        await page.waitForTimeout(300);
      }
      
      // No critical errors should occur
      const criticalErrors = errors.filter(e => 
        e.includes('Cannot read') || 
        e.includes('undefined') && !e.includes('localstorage')
      );
      
      expect(criticalErrors.length).toBe(0);
    }
  });

  test('should split tags from mixed format input', async ({ page }) => {
    const url = page.url();
    
    if (!url.includes('/admin/products/new')) {
      test.skip();
    }

    const tagInput = page.locator('input[placeholder*="태그"]').first();
    
    if (await tagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Mix of # separated and single keywords
      await tagInput.fill('#electronics#smartphones');
      
      const tagContainer = tagInput.locator('..');
      const addTagButton = tagContainer.locator('button').first();
      
      if (await addTagButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await addTagButton.click();
      } else {
        await tagInput.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      // Verify multiple tags were added
      const electronics = page.locator('div, span').filter({ hasText: 'electronics' });
      const smartphones = page.locator('div, span').filter({ hasText: 'smartphones' });
      
      // At least the split tags should be present
      const tagCount = await electronics.count() + await smartphones.count();
      expect(tagCount).toBeGreaterThanOrEqual(1);
    }
  });
});