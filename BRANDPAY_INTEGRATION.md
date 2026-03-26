## BrandPay 통합 구현 메모

### 목표
- 마이페이지에서 BrandPay 카드 등록/관리
- 체크아웃/장바구니/추가결제 위젯에서 동일 고객으로 BrandPay 결제
- 기존 `toss-confirm -> partnerLinkId -> payout` 흐름 유지

### 핵심 설계
1. **Widget Key 계열 통일**
   - BrandPay 등록/관리와 결제 위젯 모두 `NEXT_PUBLIC_TOSS_CLIENT_KEY (gck_)` 사용
   - Access Token 교환은 `TOSS_WIDGET_SECRET_KEY (gsk_)` 사용
2. **customerKey 공통화**
   - `src/lib/tossUtils.ts`의 `buildTossCustomerKey()` 사용
   - `userId` 우선, 없으면 `email` 기반으로 안정적인 키 생성
   - `Date.now()` 같은 비안정 fallback 제거
   - BrandPay redirect 전 기대 `customerKey`를 브라우저 저장소에 보관하고 callback에서 동일 값인지 검증
3. **BrandPay redirectUrl 공통화**
   - 모든 `widgets()`/`brandpay()` 초기화 시 `getBrandpayRedirectUrl()` 사용
   - callback은 `returnUrl`을 받아 원래 화면으로 복귀
4. **파트너 커미션 유지**
   - BrandPay 여부와 무관하게 `orders.partnerLinkId`만 유지되면 됨
   - 실제 커미션 지급은 기존 `src/app/api/orders/toss-confirm/route.ts`가 계속 담당

### 수정 파일
- `src/lib/tossUtils.ts`
- `src/components/account/PaymentClient.tsx`
- `src/app/(user)/account/payment/callback/page.tsx`
- `src/app/api/toss/brandpay/access-token/route.ts`
- `src/app/(user)/checkout/page.tsx`
- `src/components/cart/CartSummary.tsx`
- `src/components/account/OrdersList.tsx`
- `tests/toss-utils.spec.ts`

### 흐름 정리

#### 1. 마이페이지 카드 등록
1. 사용자가 `/account/payment` 진입
2. `PaymentClient`가 `buildTossCustomerKey()`로 고객 키 생성
3. `TossPayments(clientKey).brandpay({ customerKey, redirectUrl })` 초기화
4. `addPaymentMethod()` 또는 `openSettings()` 호출
5. 토스 callback → `/account/payment/callback`
6. callback이 `code + customerKey`를 `/api/toss/brandpay/access-token`으로 전달
7. callback은 저장해둔 expected `customerKey`와 URL의 `customerKey`를 먼저 비교
8. callback 화면은 브리지 완료 전까지 유지하고, 즉시 `router.push()` 하지 않음
9. 토큰 교환과 SDK 브리지 정리 후 원래 화면으로 복귀

#### 2. 체크아웃/장바구니 BrandPay 결제
1. 기존 pending order 생성 로직 유지
2. 위젯 초기화 시 `widgets({ customerKey, brandpay: { redirectUrl } })` 사용
3. 최초 BrandPay 등록이 필요하면 callback을 거쳐 원래 페이지로 돌아옴
4. callback에서 expected `customerKey` 검증 후 Access Token을 발급함
5. 같은 `customerKey`를 다시 사용하므로 등록 카드가 위젯에 노출됨
6. `requestPayment()`는 기존처럼 `successUrl/failUrl`로 진행

#### 3. 파트너 커미션 지급
1. 파트너 링크 유입 시 `partnerLinkId`를 주문에 저장
2. BrandPay 결제 성공 후 `/payment/success`에서 `/api/orders/toss-confirm` 호출
3. `toss-confirm`가 주문의 `partnerLinkId`를 읽어 커미션 계산/지급 요청 수행
4. 따라서 BrandPay 추가 구현은 **주문 ID와 partnerLinkId를 보존**하기만 하면 됨

### 운영 체크리스트
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` = Widget client key (`gck_`)
- `TOSS_WIDGET_SECRET_KEY` = Widget secret key (`gsk_`)
- `TOSS_CORE_SECRET_KEY`, `TOSS_SECURITY_KEY` = 기존 지급대행 유지
- `/account/payment/callback`는 middleware에서 public callback으로 유지

### 주의사항
- BrandPay 등록 callback에서 파트너 보상을 처리하면 안 됨
- 결제 성공 후 승인/정산은 반드시 기존 `toss-confirm` 한 곳에서 처리
- customerKey 생성 규칙을 다른 파일에서 다시 구현하지 말고 공통 유틸만 사용할 것
- callback 페이지에서 Access Token 교환 직후 즉시 SPA 이동하면 SDK의 `customerToken` 브리지가 끊길 수 있으므로, callback은 server wrapper + client processor 구조로 유지할 것
- 팝업 callback도 고려해 expected `customerKey`는 `sessionStorage`와 `localStorage`에 함께 저장하고, callback에서 검증 후 정리할 것
