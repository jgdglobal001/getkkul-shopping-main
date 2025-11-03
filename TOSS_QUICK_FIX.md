# 🚀 Toss Payment Widget 에러 - 빠른 해결 가이드

## 🔴 에러 메시지
```
Error: variantKey 에 해당하는 위젯을 찾을 수 없습니다.
Failed to load resource: 404
```

---

## ⚡ 5분 안에 해결하기

### 1️⃣ `.env.local` 파일 생성
```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### 2️⃣ 다음 내용 추가
```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-client-key-here
TOSS_SECRET_KEY=your-toss-secret-key-here
```

### 3️⃣ 서버 재시작
```bash
npm run dev
```

### 4️⃣ 브라우저 새로고침
- `Ctrl+Shift+R` (Windows/Linux)
- `Cmd+Shift+R` (Mac)

---

## 🎯 근본 원인 (3가지)

| 원인 | 증상 | 해결 |
|------|------|------|
| **Client Key 미설정** | 환경 변수 없음 | `.env.local`에 추가 |
| **SDK 로드 실패** | `window.TossPayments` 없음 | 네트워크 확인 |
| **잘못된 Client Key** | API 404 에러 | Toss 콘솔에서 재확인 |

---

## 🔧 Toss Client Key 얻기

1. https://developers.tosspayments.com 접속
2. 로그인 (없으면 회원가입)
3. 프로젝트 생성
4. 설정 → Client Key 복사
5. `.env.local`에 붙여넣기

---

## ✅ 확인 체크리스트

```
[ ] .env.local 파일 생성됨
[ ] NEXT_PUBLIC_TOSS_CLIENT_KEY 설정됨
[ ] npm run dev 재시작함
[ ] 브라우저 캐시 초기화함
[ ] 페이지 새로고침함
[ ] 콘솔에 에러 없음
```

---

## 🆘 여전히 안 되면?

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
# 터미널에서 실행
echo $NEXT_PUBLIC_TOSS_CLIENT_KEY
```

---

## 📚 참고 자료

- [Toss Payments 공식 문서](https://docs.tosspayments.com)
- [Toss Developers](https://developers.tosspayments.com)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)

---

## 💡 개선 사항

코드에 다음 개선사항이 적용되었습니다:

✅ 에러 상태 추가 (`widgetError`)
✅ 명확한 에러 메시지 제공
✅ UI에 에러 알림 표시
✅ 상세한 콘솔 로그

이제 에러가 발생하면 **정확한 원인**을 UI에서 확인할 수 있습니다!

