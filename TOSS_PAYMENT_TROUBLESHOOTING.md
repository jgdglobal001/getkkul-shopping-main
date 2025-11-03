# Toss Payments Widget 에러 분석 및 해결 가이드

## 🔴 발생한 에러

```
Error: variantKey 에 해당하는 위젯을 찾을 수 없습니다. 
variantKey 값을 다시 확인해주세요.

Failed to load resource: the server responded with a status of 404
api.tosspayments.com/v1/payment-widget/widget-groups/keys?variantKey=DEFAULT:1
```

---

## 🔍 근본 원인 분석

### **1. 환경 변수 미설정 (가장 가능성 높음) ⚠️**

**문제:**
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경 변수가 설정되지 않음
- 코드에서 `undefined` 또는 빈 문자열을 Toss API로 전달
- Toss API 서버가 유효하지 않은 Client Key로 위젯을 찾을 수 없음

**증거:**
```javascript
// src/app/(user)/checkout/page.tsx:56
const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
if (!tossClientKey) {
  console.error("Toss Client Key is not configured");
  return;
}
```

### **2. Toss Payments SDK 로드 실패**

**문제:**
- SDK 스크립트가 제대로 로드되지 않음
- `window.TossPayments` 객체가 존재하지 않음

**증거:**
```javascript
const TossPayments = (window as any).TossPayments;
if (!TossPayments) {
  console.error("Toss Payments SDK not loaded");
  return;
}
```

### **3. 네트워크 요청 실패**

**문제:**
- Toss API 서버에서 404 에러 반환
- 잘못된 variantKey 또는 Client Key로 인한 요청 실패

---

## ✅ 해결 방법

### **Step 1: 환경 변수 설정**

#### 1-1. `.env.local` 파일 생성 (개발 환경)

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
touch .env.local
```

#### 1-2. Toss Client Key 추가

```env
# Toss Payments 설정
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-actual-toss-client-key-here
TOSS_SECRET_KEY=your-actual-toss-secret-key-here
```

**중요:**
- `NEXT_PUBLIC_` 접두사는 필수 (클라이언트에서 접근 가능하게 함)
- 실제 Client Key를 [Toss Developers](https://developers.tosspayments.com)에서 발급받아야 함
- 테스트 환경에서는 테스트 Client Key 사용

#### 1-3. Toss Client Key 발급 방법

1. [Toss Developers](https://developers.tosspayments.com) 접속
2. 개발자 계정 생성 또는 로그인
3. 새 프로젝트 생성
4. 프로젝트 설정에서 Client Key 복사
5. `.env.local`에 붙여넣기

### **Step 2: 개발 서버 재시작**

```bash
npm run dev
```

**중요:** 환경 변수 변경 후 반드시 서버를 재시작해야 합니다.

### **Step 3: 브라우저 캐시 초기화**

1. 브라우저 개발자 도구 열기 (F12)
2. 네트워크 탭에서 "캐시 비우기" 또는 "Disable cache" 체크
3. 페이지 새로고침 (Ctrl+Shift+R 또는 Cmd+Shift+R)

### **Step 4: 에러 메시지 확인**

개선된 에러 처리로 인해 다음과 같은 메시지가 표시됩니다:

- **"Toss Client Key is not configured"** → 환경 변수 설정 필요
- **"Toss Payments SDK not loaded"** → SDK 로드 실패 (네트워크 문제)
- **"Invalid order amount"** → 주문 금액 데이터 문제
- **기타 에러 메시지** → 구체적인 원인 표시

---

## 🔧 추가 디버깅 팁

### 콘솔에서 확인할 사항

```javascript
// 브라우저 콘솔에서 실행
console.log(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
console.log(window.TossPayments);
```

### 네트워크 요청 확인

1. 개발자 도구 → 네트워크 탭
2. `api.tosspayments.com` 요청 확인
3. 상태 코드가 200인지 확인 (404면 Client Key 문제)

### 환경 변수 확인

```bash
# 터미널에서 확인
echo $NEXT_PUBLIC_TOSS_CLIENT_KEY
```

---

## 📋 체크리스트

- [ ] `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_TOSS_CLIENT_KEY` 설정
- [ ] `TOSS_SECRET_KEY` 설정
- [ ] 개발 서버 재시작 (`npm run dev`)
- [ ] 브라우저 캐시 초기화
- [ ] 페이지 새로고침
- [ ] 콘솔 에러 메시지 확인
- [ ] 네트워크 요청 상태 확인

---

## 🆘 여전히 문제가 있다면

1. **콘솔 에러 메시지 전체 복사**
2. **네트워크 탭의 실패한 요청 확인**
3. **Client Key가 올바른지 재확인**
4. **Toss Developers 문서 참조**: https://docs.tosspayments.com

---

## 📝 코드 변경 사항

### 개선된 에러 처리

- `widgetError` 상태 추가로 에러 메시지 저장
- 각 에러 지점에서 명확한 메시지 제공
- UI에 에러 알림 표시
- 콘솔에 상세한 로그 기록

### 파일 수정

- `src/app/(user)/checkout/page.tsx`
  - 에러 상태 추가
  - 에러 처리 개선
  - UI 에러 표시 추가

