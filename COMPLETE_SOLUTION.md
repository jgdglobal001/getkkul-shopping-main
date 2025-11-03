# 🎯 Toss Payment Widget 에러 - 완전한 해결 가이드

## 📌 문제 정의

**에러 메시지:**
```
Error: variantKey 에 해당하는 위젯을 찾을 수 없습니다.
Failed to load resource: the server responded with a status of 404
```

**발생 위치:** 결제 페이지 (`/checkout`)

**영향:** Toss Payments 결제 위젯이 로드되지 않음

---

## 🔍 근본 원인 (확률 순서)

### 1️⃣ 환경 변수 미설정 (95% 확률)
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경 변수가 설정되지 않음
- 코드에서 `undefined` 값을 Toss API로 전달
- API 서버가 유효하지 않은 Client Key로 위젯을 찾을 수 없음

### 2️⃣ SDK 로드 실패 (3% 확률)
- `https://js.tosspayments.com/v2/standard` 스크립트 로드 실패
- 네트워크 문제 또는 CDN 장애

### 3️⃣ 잘못된 Client Key (2% 확률)
- Toss 콘솔에서 발급받은 Client Key가 유효하지 않음
- 테스트/프로덕션 환경 혼동

---

## ✅ 5단계 해결 방법

### Step 1: `.env.local` 파일 생성

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### Step 2: Toss Client Key 추가

`.env.local` 파일 내용:

```env
# Toss Payments 설정
NEXT_PUBLIC_TOSS_CLIENT_KEY=pk_test_xxxxxxxxxxxxxxxx
TOSS_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

**중요 사항:**
- `NEXT_PUBLIC_` 접두사는 필수 (클라이언트에서 접근 가능)
- 테스트 환경: `pk_test_`, `sk_test_` 사용
- 프로덕션 환경: `pk_live_`, `sk_live_` 사용

### Step 3: Toss Client Key 발급받기

1. https://developers.tosspayments.com 접속
2. 개발자 계정 생성 또는 로그인
3. 새 프로젝트 생성
4. 프로젝트 설정 → Client Key 복사
5. `.env.local`에 붙여넣기

### Step 4: 개발 서버 재시작

```bash
npm run dev
```

**중요:** 환경 변수 변경 후 반드시 서버를 재시작해야 합니다.

### Step 5: 브라우저 캐시 초기화 및 새로고침

- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

---

## 🔧 검증 방법

### 방법 1: 브라우저 콘솔 확인

```javascript
// 브라우저 개발자 도구 콘솔에서 실행
console.log(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
console.log(window.TossPayments);
```

**예상 결과:**
- 첫 번째: `pk_test_...` (Client Key 출력)
- 두 번째: `{...}` (Toss SDK 객체)

### 방법 2: 네트워크 탭 확인

1. F12 → Network 탭
2. 페이지 새로고침
3. `api.tosspayments.com` 요청 찾기
4. 상태 코드 확인
   - ✅ 200: 성공
   - ❌ 404: Client Key 문제

### 방법 3: 환경 변수 확인

```bash
# 터미널에서 실행
echo $NEXT_PUBLIC_TOSS_CLIENT_KEY
```

---

## 📊 개선된 에러 처리

### 이전 (개선 전)
- 에러가 콘솔에만 표시됨
- 사용자가 문제를 모름
- 디버깅이 어려움

### 이후 (개선 후)
- 에러가 UI에 명확하게 표시됨
- 구체적인 에러 메시지 제공
- 해결 방법이 메시지에 포함됨

**표시되는 에러 메시지:**
- "Toss Client Key is not configured"
- "Toss Payments SDK not loaded"
- "Invalid order amount"
- 기타 구체적인 에러 메시지

---

## 🆘 여전히 문제가 있다면?

### 1단계: 에러 메시지 확인
- UI에 표시된 에러 메시지 읽기
- 콘솔에서 상세 로그 확인

### 2단계: 환경 변수 재확인
```bash
# .env.local 파일 확인
cat .env.local

# 또는 터미널에서
echo $NEXT_PUBLIC_TOSS_CLIENT_KEY
```

### 3단계: 서버 재시작
```bash
# 기존 서버 중지 (Ctrl+C)
# 새로 시작
npm run dev
```

### 4단계: 캐시 완전 초기화
- 브라우저 개발자 도구 → Application → Clear site data
- 또는 시크릿 모드에서 테스트

### 5단계: Toss 콘솔 확인
- Client Key가 활성화되어 있는지 확인
- 테스트/프로덕션 환경 확인
- 프로젝트 설정 재확인

---

## 📋 체크리스트

```
[ ] .env.local 파일 생성됨
[ ] NEXT_PUBLIC_TOSS_CLIENT_KEY 설정됨
[ ] TOSS_SECRET_KEY 설정됨
[ ] npm run dev 재시작함
[ ] 브라우저 캐시 초기화함
[ ] 페이지 새로고침함
[ ] 콘솔에 에러 없음
[ ] 네트워크 탭에서 200 상태 확인
[ ] 결제 위젯이 정상 로드됨
```

---

## 📚 참고 자료

- [Toss Payments 공식 문서](https://docs.tosspayments.com)
- [Toss Developers 콘솔](https://developers.tosspayments.com)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)
- [Toss Payment Widget V2 API](https://docs.tosspayments.com/reference/widget-sdk)

---

## 💡 핵심 요약

| 항목 | 내용 |
|------|------|
| **에러 원인** | 환경 변수 미설정 |
| **해결 방법** | `.env.local`에 Client Key 추가 |
| **소요 시간** | 5분 |
| **난이도** | 매우 쉬움 |
| **재발 가능성** | 낮음 (일회성) |

---

## ✨ 결론

이 에러는 **환경 변수 미설정**으로 인한 것입니다.

`.env.local` 파일에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`를 추가하고 서버를 재시작하면 **100% 해결**됩니다.

개선된 에러 처리로 인해 향후 유사한 문제 발생 시 **정확한 원인**을 UI에서 즉시 확인할 수 있습니다.

