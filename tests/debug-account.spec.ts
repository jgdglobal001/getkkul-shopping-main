import { test, expect } from '@playwright/test';

test('debug: check account page content', async ({ page }) => {
  await page.goto('/account');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Get all content
  const pageContent = await page.textContent('body');
  console.log('=== Page Content ===');
  console.log(pageContent?.substring(0, 1000) || 'No content');

  // Check for specific buttons
  const buttons = await page.locator('button').all();
  console.log('\n=== All Buttons ===');
  for (let i = 0; i < Math.min(buttons.length, 10); i++) {
    const text = await buttons[i].textContent();
    console.log(`Button ${i}: "${text}"`);
  }

  // Check page title
  const title = await page.title();
  console.log('\n=== Page Title ===');
  console.log(title);

  // Check for Korean text anywhere
  const hasKorean = pageContent?.includes('프로필');
  console.log('\n=== Has Korean "프로필" ===');
  console.log(hasKorean);
});