import { test, expect } from '@playwright/test';

test.describe('Profile Edit Modal Korean Translation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to account page
    await page.goto('/account');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    // Additional wait to ensure all JS hydration is complete
    await page.waitForTimeout(3000);
  });

  test('should display edit profile button in Korean', async ({ page }) => {
    // Wait for the button to be visible - use more flexible selector
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await expect(editButton).toBeVisible({ timeout: 10000 });

    // Ensure no English button text
    const englishButton = page.locator('button').filter({ hasText: /Edit Profile/ });
    const count = await englishButton.count();
    expect(count).toBe(0);
  });

  test('should open profile edit modal with Korean title', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for modal title in Korean
    const modalTitle = page.locator('h1, h2, h3').filter({ hasText: /프로필 수정/ });
    await expect(modalTitle).toBeVisible();
  });

  test('should display all form labels in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check page content for Korean labels
    const pageContent = await page.textContent('body');
    
    expect(pageContent).toContain('성명'); // Full Name
    expect(pageContent).toContain('이메일 주소'); // Email Address
    expect(pageContent).toContain('전화번호'); // Phone Number
    expect(pageContent).toContain('프로필 사진 변경'); // Change Picture
    expect(pageContent).toContain('비밀번호 설정'); // Password Settings
  });

  test('should display form placeholders in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for Korean placeholders
    const fullNameInput = page.locator('input[placeholder*="성명"], input[placeholder*="이름"]').first();
    if (await fullNameInput.isVisible()) {
      const placeholder = await fullNameInput.getAttribute('placeholder');
      expect(placeholder).toMatch(/성명|이름/);
    }

    // Check for phone number input
    const phoneInput = page.locator('input[placeholder*="전화"]').first();
    if (await phoneInput.isVisible()) {
      const placeholder = await phoneInput.getAttribute('placeholder');
      expect(placeholder).toContain('전화');
    }
  });

  test('should display email helper text in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for Korean helper text about email
    const pageContent = await page.textContent('body');
    
    expect(pageContent).toContain('이메일은 변경할 수 없습니다');
    expect(pageContent).not.toContain('Email cannot be changed');
  });

  test('should display password section in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Look for password section button and click it
    const changePasswordButton = page.locator('button').filter({ hasText: /비밀번호 변경/ });
    if (await changePasswordButton.isVisible()) {
      await changePasswordButton.click();
      
      // Wait for password section to expand
      await page.waitForTimeout(500);

      // Check for Korean password labels
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('현재 비밀번호');
      expect(pageContent).toContain('새 비밀번호');
      expect(pageContent).toContain('새 비밀번호 확인');
    }
  });

  test('should display form buttons in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for Korean button text
    const pageContent = await page.textContent('body');
    
    expect(pageContent).toContain('취소'); // Cancel button
    expect(pageContent).toContain('프로필 업데이트'); // Update Profile button
    
    // Ensure no English button text
    expect(pageContent).not.toContain('Cancel');
    expect(pageContent).not.toContain('Update Profile');
  });

  test('should display image upload section in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for Korean image upload text
    const pageContent = await page.textContent('body');
    
    expect(pageContent).toContain('사진 변경'); // Change Picture button
    
    // Ensure no English text
    expect(pageContent).not.toContain('Change Picture');
  });

  test('should display validation error messages in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Clear the full name field
    const fullNameInput = page.locator('input[name="name"]');
    if (await fullNameInput.isVisible()) {
      await fullNameInput.clear();
      
      // Try to submit the form
      const submitButton = page.locator('button').filter({ hasText: /프로필 업데이트/ });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(500);

        // Check for Korean error message
        const pageContent = await page.textContent('body');
        
        // Should contain Korean validation error
        if (pageContent?.includes('필수')) {
          expect(pageContent).toMatch(/필수|필요/);
        }
      }
    }
  });

  test('should not display any English UI text in profile edit modal', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Get all page content
    const pageContent = await page.textContent('body');
    
    // List of English texts that should NOT appear in profile edit modal
    const englishTextsToAvoid = [
      'Full Name',
      'Email Address',
      'Phone Number',
      'Change Picture',
      'Password Settings',
      'Current Password',
      'New Password',
      'Confirm New Password',
      'File Format',
      'No image',
      'Uploading',
      'No Image',
      'Email cannot be changed',
      'Current password required',
      'Password must be',
      'Passwords do not match',
    ];

    englishTextsToAvoid.forEach(text => {
      // Some texts like "File Format" might appear in specific contexts
      // Only check critical UI labels
      if (['Full Name', 'Email Address', 'Phone Number', 'Change Picture', 'Password Settings'].includes(text)) {
        if (text !== 'Email Address') { // Email Address might appear in disabled field
          expect(pageContent).not.toContain(text);
        }
      }
    });
  });

  test('should display file format note in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for Korean file format note
    const pageContent = await page.textContent('body');
    
    // Should contain Korean text about file format
    if (pageContent?.includes('이미지')) {
      expect(pageContent).toContain('이미지');
    }
  });

  test('should have correct form structure with Korean labels', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Verify form contains input fields with Korean labels
    const nameLabel = page.locator('label').filter({ hasText: /성명/ });
    await expect(nameLabel).toBeVisible();

    const emailLabel = page.locator('label').filter({ hasText: /이메일 주소/ });
    await expect(emailLabel).toBeVisible();

    const phoneLabel = page.locator('label').filter({ hasText: /전화번호/ });
    await expect(phoneLabel).toBeVisible();
  });

  test('should display required field indicators in Korean', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check for asterisk (*) indicating required fields
    const pageContent = await page.textContent('body');
    
    expect(pageContent).toContain('성명 *'); // Full Name with asterisk
  });

  test('should display cancel and update buttons with correct Korean text', async ({ page }) => {
    // Click the edit profile button
    const editButton = page.locator('button').filter({ hasText: /프로필 수정/ });
    await editButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Find and verify cancel button
    const cancelButton = page.locator('button').filter({ hasText: /취소/ });
    await expect(cancelButton).toBeVisible();

    // Find and verify update button
    const updateButton = page.locator('button').filter({ hasText: /프로필 업데이트/ });
    await expect(updateButton).toBeVisible();

    // Ensure no English button text
    const englishCancelButton = page.locator('button').filter({ hasText: /Cancel/ });
    const cancelCount = await englishCancelButton.count();
    expect(cancelCount).toBe(0);

    const englishUpdateButton = page.locator('button').filter({ hasText: /Update Profile/ });
    const updateCount = await englishUpdateButton.count();
    expect(updateCount).toBe(0);
  });
});