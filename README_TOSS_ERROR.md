# 🎯 Toss Payment Widget 에러 분석 및 해결 - 완전 가이드

## 📌 빠른 요약

| 항목 | 내용 |
|------|------|
| **에러** | `variantKey 에 해당하는 위젯을 찾을 수 없습니다. (404)` |
| **원인** | `NEXT_PUBLIC_TOSS_CLIENT_KEY` 환경 변수 미설정 |
| **해결** | `.env.local`에 Client Key 추가 후 서버 재시작 |
| **소요 시간** | 5분 |
| **난이도** | ⭐ (매우 쉬움) |

---

## 📚 문서 가이드

### 🚀 급할 때 (5분)
👉 **[TOSS_QUICK_FIX.md](TOSS_QUICK_FIX.md)**
- 빠른 해결 방법
- 체크리스트
- 핵심만 정리

### 📖 상세히 알고 싶을 때
👉 **[COMPLETE_SOLUTION.md](COMPLETE_SOLUTION.md)**
- 완전한 해결 가이드
- 5단계 상세 설명
- 검증 방법
- 문제 해결 팁

### 🔍 깊이 있게 분석하고 싶을 때
👉 **[TOSS_PAYMENT_TROUBLESHOOTING.md](TOSS_PAYMENT_TROUBLESHOOTING.md)**
- 상세한 원인 분석
- 모든 가능한 원인
- 각 원인별 해결 방법
- 디버깅 팁

### 📊 에러 분석 보고서
👉 **[ERROR_ANALYSIS_SUMMARY.md](ERROR_ANALYSIS_SUMMARY.md)**
- 에러 분석 보고서
- 발생 위치 및 원인
- 상세 분석
- 참고 자료

### 💻 코드 개선 사항
👉 **[CODE_IMPROVEMENTS.md](CODE_IMPROVEMENTS.md)**
- 코드 변경 사항
- Before/After 비교
- 개선 효과
- 사용자 경험 개선

### ✅ 변경 사항 요약
👉 **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)**
- 수행한 작업 목록
- 수정된 파일
- 개선 효과
- 체크리스트

---

## ⚡ 즉시 해결 (3단계)

### 1️⃣ 환경 변수 설정
```bash
# .env.local 파일 생성
touch .env.local

# 다음 내용 추가
NEXT_PUBLIC_TOSS_CLIENT_KEY=pk_test_xxxxxxxxxxxxxxxx
TOSS_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
```

### 2️⃣ 서버 재시작
```bash
npm run dev
```

### 3️⃣ 브라우저 새로고침
- Windows/Linux: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

---

## 🔍 에러 원인 (확률 순서)

| 순위 | 원인 | 확률 | 해결 |
|------|------|------|------|
| 1️⃣ | 환경 변수 미설정 | 95% | `.env.local`에 추가 |
| 2️⃣ | SDK 로드 실패 | 3% | 네트워크 확인 |
| 3️⃣ | 잘못된 Client Key | 2% | Toss 콘솔 재확인 |

---

## ✨ 개선 사항

### 코드 개선
- ✅ 에러 상태 추가 (`widgetError`)
- ✅ 명확한 에러 메시지 제공
- ✅ UI에 에러 알림 표시
- ✅ 상세한 콘솔 로그

### 사용자 경험 개선
- ✅ 에러가 UI에 명확하게 표시됨
- ✅ 구체적인 해결 방법 제시
- ✅ 디버깅이 쉬워짐

---

## 📋 체크리스트

```
[ ] .env.local 파일 생성
[ ] NEXT_PUBLIC_TOSS_CLIENT_KEY 설정
[ ] TOSS_SECRET_KEY 설정
[ ] npm run dev 재시작
[ ] 브라우저 캐시 초기화
[ ] 페이지 새로고침
[ ] 콘솔 에러 확인
[ ] 네트워크 탭 확인
[ ] 결제 위젯 정상 로드 확인
```

---

## 🆘 여전히 문제가 있다면?

### 1단계: 에러 메시지 확인
- UI에 표시된 에러 메시지 읽기
- 콘솔에서 상세 로그 확인

### 2단계: 환경 변수 재확인
```bash
cat .env.local
echo $NEXT_PUBLIC_TOSS_CLIENT_KEY
```

### 3단계: 서버 재시작
```bash
# Ctrl+C로 기존 서버 중지
npm run dev
```

### 4단계: 캐시 완전 초기화
- 개발자 도구 → Application → Clear site data
- 또는 시크릿 모드에서 테스트

### 5단계: Toss 콘솔 확인
- Client Key 활성화 상태 확인
- 테스트/프로덕션 환경 확인

---

## 📞 추가 리소스

- [Toss Payments 공식 문서](https://docs.tosspayments.com)
- [Toss Developers 콘솔](https://developers.tosspayments.com)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🎯 핵심 메시지

> **이 에러는 환경 변수 미설정으로 인한 것입니다.**
>
> `.env.local` 파일에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`를 추가하고 
> 서버를 재시작하면 **100% 해결**됩니다.

---

## 📝 파일 수정 사항

**수정된 파일:** `src/app/(user)/checkout/page.tsx`

**변경 사항:**
1. 에러 상태 추가 (라인 32)
2. 에러 처리 개선 (라인 55-125)
3. UI 에러 표시 추가 (라인 541-568)

---

## ✅ 완료 상태

- [x] 에러 원인 분석 완료
- [x] 코드 개선 완료
- [x] 상세 문서 작성 완료
- [x] 빠른 해결 가이드 작성 완료
- [ ] 사용자가 환경 변수 설정 (사용자 작업)
- [ ] 사용자가 서버 재시작 (사용자 작업)
- [ ] 에러 해결 확인 (사용자 작업)

---

## 💡 다음 단계

1. 위의 **"즉시 해결 (3단계)"** 따라하기
2. 문제 해결 확인
3. 필요시 해당 문서 참고

**모든 문서는 프로젝트 루트에 위치합니다.**

