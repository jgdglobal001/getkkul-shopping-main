/**
 * 파트너 커미션 설정
 * 겟꿀 파트너스 지급대행용
 */

// 기본 파트너 커미션 비율 (15%)
export const PARTNER_COMMISSION_RATE = 0.15;

/**
 * 파트너 커미션 계산
 * @param productPrice 상품 가격 (배송비 제외)
 * @returns 커미션 금액
 */
export function calculatePartnerCommission(productPrice: number): number {
  return Math.floor(productPrice * PARTNER_COMMISSION_RATE);
}

/**
 * 주문 아이템들의 총 상품 가격 계산 (배송비 제외)
 * @param items 주문 아이템 배열
 * @returns 총 상품 가격
 */
export function calculateTotalProductPrice(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

