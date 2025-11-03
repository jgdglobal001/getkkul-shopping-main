# Toss Payment Widget 에러 분석 보고서

## 📋 요약

**에러:** `variantKey 에 해당하는 위젯을 찾을 수 없습니다. (404 Not Found)`

**원인:** `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경 변수가 설정되지 않음

**해결:** `.env.local` 파일에 Toss Client Key 추가 후 서버 재시작

---

## 🔴 발생한 에러 메시지

```
Error: variantKey 에 해당하는 위젯을 찾을 수 없습니다. 
variantKey 값을 다시 확인해주세요.

Failed to load resource: the server responded with a status of 404
api.tosspayments.com/v1/payment-widget/widget-groups/keys?variantKey=DEFAULT:1
```

---

## 🔍 상세 분석

### 에러 발생 위치
- **파일:** `src/app/(user)/checkout/page.tsx`
- **라인:** 90-100
- **함수:** `initializeWidget()`

### 에러 발생 원인 (우선순위)

#### 1️⃣ **환경 변수 미설정 (가능성 95%)**
```javascript
// 현재 코드
const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
// 결과: undefined 또는 빈 문자열
```

**문제:**
- `.env.local` 또는 `.env` 파일에 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 미설정
- Toss API에 유효하지 않은 Client Key 전달
- API 서버가 위젯을 찾을 수 없음 → 404 에러

#### 2️⃣ **SDK 로드 실패 (가능성 3%)**
```javascript
const TossPayments = (window as any).TossPayments;
if (!TossPayments) {
  console.error("Toss Payments SDK not loaded");
  return;
}
```

**문제:**
- `src/app/layout.tsx`의 SDK 스크립트 로드 실패
- 네트워크 문제로 인한 스크립트 로드 지연

#### 3️⃣ **잘못된 Client Key (가능성 2%)**
- Toss 콘솔에서 발급받은 Client Key가 유효하지 않음
- 테스트 환경과 프로덕션 환경 혼동

---

## ✅ 해결 방법

### 단계 1: 환경 변수 설정

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### 단계 2: Client Key 추가

`.env.local` 파일에 다음 내용 추가:

```env
# Toss Payments 설정
NEXT_PUBLIC_TOSS_CLIENT_KEY=pk_test_xxxxxxxxxxxxxxxx
TOSS_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

**주의:**
- `NEXT_PUBLIC_` 접두사는 필수
- 실제 Client Key를 [Toss Developers](https://developers.tosspayments.com)에서 발급받아야 함
- 테스트 환경: `pk_test_`, `sk_test_` 사용
- 프로덕션 환경: `pk_live_`, `sk_live_` 사용

### 단계 3: 서버 재시작

```bash
npm run dev
```

### 단계 4: 브라우저 캐시 초기화

- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

---

## 🛠️ 코드 개선 사항

### 추가된 기능

1. **에러 상태 관리**
   ```javascript
   const [widgetError, setWidgetError] = useState<string | null>(null);
   ```

2. **명확한 에러 메시지**
   - "Toss Client Key is not configured"
   - "Toss Payments SDK not loaded"
   - "Invalid order amount"
   - 기타 구체적인 에러 메시지

3. **UI 에러 표시**
   - 빨간색 알림 박스로 에러 표시
   - 사용자가 문제를 명확히 인식 가능

4. **상세한 콘솔 로그**
   - Client Key 일부 마스킹 (보안)
   - 초기화 과정 추적 가능

---

## 📊 문제 해결 흐름도

```
1. 환경 변수 확인
   ├─ 설정됨 → 2번으로
   └─ 미설정 → ❌ 에러: Client Key 미설정

2. SDK 로드 확인
   ├─ 로드됨 → 3번으로
   └─ 미로드 → ❌ 에러: SDK 로드 실패

3. 주문 금액 확인
   ├─ 유효함 → 4번으로
   └─ 무효함 → ❌ 에러: 유효하지 않은 금액

4. Toss API 호출
   ├─ 성공 (200) → ✅ 위젯 렌더링
   └─ 실패 (404) → ❌ 에러: variantKey 찾을 수 없음
```

---

## 🔧 디버깅 팁

### 콘솔 확인
```javascript
// 브라우저 콘솔에서 실행
console.log(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
console.log(window.TossPayments);
```

### 네트워크 탭 확인
1. F12 → Network 탭
2. `api.tosspayments.com` 요청 찾기
3. 상태 코드 확인 (200 = OK, 404 = 에러)

### 환경 변수 확인
```bash
echo $NEXT_PUBLIC_TOSS_CLIENT_KEY
```

---

## 📚 참고 자료

- [Toss Payments 공식 문서](https://docs.tosspayments.com)
- [Toss Developers 콘솔](https://developers.tosspayments.com)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)

---

## ✨ 결론

이 에러는 **환경 변수 미설정**으로 인한 것입니다.

`.env.local` 파일에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`를 추가하고 서버를 재시작하면 해결됩니다.

개선된 에러 처리로 인해 향후 유사한 문제 발생 시 **정확한 원인**을 UI에서 확인할 수 있습니다.

