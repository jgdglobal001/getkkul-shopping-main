# 토스페이먼츠 셀러 등록 가이드

## 📌 개요

셀러 등록 API로 오픈마켓에 입점해있는 셀러의 정보를 토스페이먼츠에 등록합니다.
API 파라미터를 확인해서 Request Body 데이터를 만든 다음, **보안 키로 암호화**해주세요.

---

## 📋 Request Body

### JSON 데이터
```json
{
  "refSellerId": "my-seller-1",
  "businessType": "INDIVIDUAL_BUSINESS",
  "company": {
    "name": "테스트 상호",
    "representativeName": "김토스",
    "businessRegistrationNumber": "1234567890",
    "email": "toss@sample.com",
    "phone": "01012345678"
  },
  "account": {
    "bankCode": "092",
    "accountNumber": "123*****90123",
    "holderName": "김토스"
  },
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `refSellerId` | string | ✅ | 가맹점에서 관리하는 셀러 ID |
| `businessType` | string | ✅ | `INDIVIDUAL`, `INDIVIDUAL_BUSINESS`, `CORPORATE_BUSINESS` |
| `company.name` | string | ✅ | 상호명 |
| `company.representativeName` | string | ✅ | 대표자명 |
| `company.businessRegistrationNumber` | string | ✅ | 사업자등록번호 (10자리) |
| `company.email` | string | ✅ | 이메일 (KYC 안내 발송용) |
| `company.phone` | string | ✅ | 전화번호 (본인인증 문자 발송용) |
| `account.bankCode` | string | ✅ | 은행 코드 |
| `account.accountNumber` | string | ✅ | 계좌번호 |
| `account.holderName` | string | ✅ | 예금주명 |
| `metadata` | object | ❌ | 추가 데이터 (key-value) |

---

## 🔐 API 호출

### JWE로 암호화된 Request Body
```
eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwia...
```

### cURL 예제
```bash
curl --location 'https://api.tosspayments.com/v2/sellers' \
--header 'Authorization: Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==' \
--header 'Content-Type: text/plain' \
--header 'TossPayments-api-security-mode: ENCRYPTION' \
--data '{JWE로 암호화된 데이터}'
```

### 필수 헤더

| 헤더 | 값 | 설명 |
|------|-----|------|
| `Authorization` | `Basic {base64(secretKey:)}` | API 개별 연동 키 > 시크릿 키 |
| `Content-Type` | `text/plain` | JWE 문자열이므로 text/plain |
| `TossPayments-api-security-mode` | `ENCRYPTION` | 암호화 모드 필수 |

---

## 📤 응답

성공 시 **JWE로 암호화된 Seller 객체**가 돌아옵니다. 복호화 후 확인하세요.

### 복호화된 응답 예시
```json
{
  "version": "2022-11-16",
  "traceId": "123fd1b012345e1fdf0123a012dcee5c",
  "entityType": "seller",
  "entityBody": {
    "id": "seller-1",
    "refSellerId": "my-seller-1",
    "businessType": "INDIVIDUAL_BUSINESS",
    "company": {
      "name": "테스트 상호",
      "representativeName": "김토스",
      "businessRegistrationNumber": "1234567890",
      "email": "toss@sample.com",
      "phone": "01012345678"
    },
    "individual": null,
    "account": {
      "bankCode": "092",
      "accountNumber": "123*****90123",
      "holderName": "김토스"
    },
    "status": "APPROVAL_REQUIRED",
    "metadata": {
      "key1": "value1",
      "key2": "value2"
    }
  }
}
```

---

## 🔄 셀러 상태 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                        셀러 등록                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
      ┌───────────┐   ┌───────────────┐   ┌─────────────────┐
      │  INDIVIDUAL│   │INDIVIDUAL_    │   │CORPORATE_       │
      │  (개인)    │   │BUSINESS       │   │BUSINESS         │
      │           │   │(개인사업자)    │   │(법인사업자)      │
      └─────┬─────┘   └───────┬───────┘   └────────┬────────┘
            │                 │                    │
            ▼                 ▼                    ▼
      ┌─────────────────────────────┐      ┌──────────────────┐
      │     APPROVAL_REQUIRED       │      │ PARTIALLY_       │
      │     (본인인증 필요)          │      │ APPROVED         │
      │  📱 phone으로 문자 발송      │      │ (바로 지급 가능)  │
      └─────────────┬───────────────┘      │ 주 1천만원 미만   │
                    │ 본인인증 완료         └────────┬─────────┘
                    ▼                               │
      ┌─────────────────────────────┐               │
      │     PARTIALLY_APPROVED      │◄──────────────┘
      │     (부분 승인)              │
      │     주 1천만원 미만 지급 가능 │
      └─────────────┬───────────────┘
                    │ 주 1천만원 이상 지급 시도
                    ▼
      ┌─────────────────────────────┐
      │       KYC_REQUIRED          │
      │     (KYC 심사 필요)          │
      │  📧 email로 KYC 안내 발송    │
      │  ⛔ 지급대행 불가능           │
      └─────────────┬───────────────┘
                    │ KYC 심사 통과
                    ▼
      ┌─────────────────────────────┐
      │         APPROVED            │
      │       (완전 승인)            │
      │  ✅ 금액 제한 없이 지급 가능  │
      │  ⏰ 1~3년 후 재심사 필요      │
      └─────────────────────────────┘
```

---

## ⚠️ 셀러 상태별 주의사항

### 1️⃣ 개인 및 개인사업자 셀러
- 등록 직후 `APPROVAL_REQUIRED` 상태
- `phone`으로 등록된 전화번호로 **본인인증 문자** 발송
- 본인인증 완료 후 `PARTIALLY_APPROVED`로 변경
- **주 1천만원 미만** 지급대행 가능

### 2️⃣ 법인사업자 셀러
- 등록 직후 바로 `PARTIALLY_APPROVED` 상태
- **주 1천만원 미만** 바로 지급대행 가능

### 3️⃣ KYC 심사 (주 1천만원 이상)
- 주 1천만원 이상 지급 시도 시 → `KYC_REQUIRED`로 변경
- 셀러 이메일로 **KYC 심사 안내** 발송
- **KYC 심사 전까지 지급대행 불가능**
- KYC 통과 시 → `APPROVED`로 변경 (금액 제한 없음)
- **1~3년 후 재심사 필요** (다시 `KYC_REQUIRED`로 변경)

---

## 🔔 웹훅

셀러의 상태 변경은 `seller.changed` 웹훅 이벤트로 받을 수 있습니다.

```json
{
  "eventType": "seller.changed",
  "sellerId": "seller-1",
  "status": "PARTIALLY_APPROVED"
}
```

---

## 📚 참고 링크

- [토스페이먼츠 셀러 등록 문서](https://docs.tosspayments.com/guides/payouts/seller)
- [ENCRYPTION 보안 가이드](./toss-encryption-security.md)

