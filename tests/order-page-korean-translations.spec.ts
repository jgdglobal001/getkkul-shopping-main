import { test, expect } from '@playwright/test';

test.describe('Order Page Korean Translations', () => {
  const orderUrl = 'http://localhost:3002/account/orders/cmhio58d3000gwms4c9w9ge0n';

  test('E2E: Order detail page displays all text in Korean', async ({ page }) => {
    await page.goto(orderUrl);
    await page.waitForLoadState('networkidle');

    // Check main heading
    await expect(page.getByRole('heading', { name: '주문 추적' })).toBeVisible();

    // Check order number section
    await expect(page.getByText('주문번호')).toBeVisible();

    // Check placed on date
    await expect(page.getByText('주문일:')).toBeVisible();

    // Check download receipt button
    await expect(page.getByRole('button', { name: '영수증 다운로드' })).toBeVisible();

    // Check status - assuming it's confirmed
    await expect(page.getByText('주문 확인')).toBeVisible();

    // Check tracking steps
    await expect(page.getByText('주문 확인')).toBeVisible(); // Order Confirmed
    await expect(page.getByText('처리 중')).toBeVisible(); // Processing
    await expect(page.getByText('배송됨')).toBeVisible(); // Shipped
    await expect(page.getByText('배송 완료')).toBeVisible(); // Delivered

    // Check active step message
    await expect(page.getByText('귀하의 주문은 현재')).toBeVisible();

    // Check order items section
    await expect(page.getByText('상품')).toBeVisible();

    // Check quantity label
    await expect(page.getByText('수량:')).toBeVisible();

    // Check order summary
    await expect(page.getByRole('heading', { name: '주문 요약' })).toBeVisible();

    // Check total amount
    await expect(page.getByText('총 금액')).toBeVisible();

    // Check payment status
    await expect(page.getByText('결제 상태')).toBeVisible();
    await expect(page.getByText('결제 완료')).toBeVisible();

    // Check order date
    await expect(page.getByText('주문 날짜')).toBeVisible();

    // Check need help section
    await expect(page.getByRole('heading', { name: '도움이 필요하신가요?' })).toBeVisible();

    // Check call support
    await expect(page.getByText('고객 지원 전화')).toBeVisible();

    // Check email support
    await expect(page.getByText('이메일 지원')).toBeVisible();

    // Check back to account button
    await expect(page.getByRole('link', { name: '계정으로 돌아가기' })).toBeVisible();

    // If tracking number exists, check
    const trackingNumberHeading = page.getByRole('heading', { name: '추적 번호' });
    if (await trackingNumberHeading.isVisible().catch(() => false)) {
      await expect(trackingNumberHeading).toBeVisible();
    }

    // If estimated delivery exists, check
    const estimatedDeliveryHeading = page.getByRole('heading', { name: '예상 배송일' });
    if (await estimatedDeliveryHeading.isVisible().catch(() => false)) {
      await expect(estimatedDeliveryHeading).toBeVisible();
    }

    // If shipping address exists, check
    const shippingAddressHeading = page.getByRole('heading', { name: '배송 주소' });
    if (await shippingAddressHeading.isVisible().catch(() => false)) {
      await expect(shippingAddressHeading).toBeVisible();
    }
  });
});