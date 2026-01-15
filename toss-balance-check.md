# 토스페이먼츠 정산 잔액 확인 가이드

## 📌 개요

등록한 셀러에게 지급대행을 요청하기 전에, **정산 잔액이 충분한지** 확인해주세요.

### 잔액 종류

| 필드 | 설명 |
|------|------|
| `availableAmount` | 셀러에게 **지급할 수 있는** 정산금 |
| `pendingAmount` | 아직 **지급할 수 없는** 정산금 |

### pendingAmount란?
- 매출이 일어났지만, **토스페이먼츠로부터 아직 정산 받지 않은** 금액
- 토스페이먼츠와 계약한 **정산 주기에 따라** `availableAmount`로 전환됨

---

## 🔐 API 호출

### 엔드포인트
```
GET https://api.tosspayments.com/v2/balances
```

### 필수 헤더

| 헤더 | 값 | 설명 |
|------|-----|------|
| `Authorization` | `Basic {base64(secretKey:)}` | API 개별 연동 키 > 시크릿 키 |

### ⚠️ 암호화 불필요
> **잔액 조회 API는 GET 요청이기 때문에 암호화가 필요하지 않습니다.**
> 지급대행 서비스의 POST 요청만 암호화하면 됩니다.

---

## 📋 요청 예제

### Node.js
```javascript
const fetch = require('node-fetch');

const url = 'https://api.tosspayments.com/v2/balances';
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6'
  }
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

### cURL
```bash
curl --location 'https://api.tosspayments.com/v2/balances' \
--header 'Authorization: Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6'
```

---

## 📤 응답

잔액 조회에 성공하면 **Balance 객체**가 응답됩니다.

### 응답 예시
```json
{
  "version": "2022-11-16",
  "traceId": "087fd7b452385e1fdf8123a123dcee5c",
  "entityType": "balance",
  "entityBody": {
    "pendingAmount": {
      "currency": "KRW",
      "value": 10000.0
    },
    "availableAmount": {
      "currency": "KRW",
      "value": 20000.0
    }
  }
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `version` | string | API 버전 |
| `traceId` | string | 요청 추적 ID |
| `entityType` | string | `balance` |
| `entityBody.pendingAmount.currency` | string | 통화 (현재 `KRW`만 지원) |
| `entityBody.pendingAmount.value` | number | 아직 지급할 수 없는 금액 |
| `entityBody.availableAmount.currency` | string | 통화 (현재 `KRW`만 지원) |
| `entityBody.availableAmount.value` | number | 지급 가능한 금액 |

---

## ❓ FAQ

### Q. 잔액 조회 API도 암호화해야 되나요?
**아니요.** 지급대행 서비스의 POST 요청만 암호화하면 됩니다. 
잔액 조회는 GET 요청이기 때문에 암호화가 필요하지 않아요.

### Q. 정산주기를 바꿀 수 있나요?
토스페이먼츠와 계약 시 정산 주기를 협의할 수 있습니다.

### Q. 테스트 환경에서 잔액 조회를 할 수 있나요?
네, 테스트 시크릿 키를 사용하면 테스트 환경에서 잔액 조회가 가능합니다.

---

## 📚 참고 링크

- [토스페이먼츠 잔액 조회 문서](https://docs.tosspayments.com/guides/payouts/balance)
- [셀러 등록 가이드](./toss-seller-registration.md)
- [ENCRYPTION 보안 가이드](./toss-encryption-security.md)

