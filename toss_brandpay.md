1. 결제위젯 렌더하기
먼저 주문서 페이지에 결제 UI, 약관 UI를 렌더하고 결제창을 연동할게요. 아래 코드는 주문서 페이지의 예시에요.

클라이언트 쪽에 토스페이먼츠 SDK를 설치하고, 클라이언트 키로 SDK를 초기화하세요. 다음, widgets() 메서드로 결제위젯 인스턴스를 생성하세요. brandpay 파라미터에 개발자센터에 등록한 리다이렉트 URL을 반드시 추가해주세요. 아래 코드에서는 widgets라는 인스턴스를 생성했어요.

주문서 페이지에 결제위젯, 약관 UI 영역을 지정하고, 각 UI를 렌더링하세요. 그럼 이제 결제창을 띄울 준비가 됐어요. widgets.requestPayment() 메서드를 호출하면 결제 요청이 시작되고, 결제창이 열려요. 메서드의 파라미터로 주문번호, successUrl, failUrl 등을 설정하세요. 그리고 주문서의 '결제하기' 버튼에 결제 요청 메서드를 이벤트로 등록해주세요.

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <!-- SDK 추가 -->
    <script src="https://js.tosspayments.com/v2/standard"></script>
  </head>
  <body>
    <!-- 결제 UI -->
    <div id="payment-method"></div>
    <!-- 이용약관 UI -->
    <div id="agreement"></div>
    <!-- 결제하기 버튼 -->
    <button class="button" id="payment-button" style="margin-top: 30px">결제하기</button>
    <script>
      main();
      async function main() {
        const button = document.getElementById("payment-button");
        const coupon = document.getElementById("coupon-box");
        // ------  SDK 초기화 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
        const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
        const tossPayments = TossPayments(clientKey);
        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        const customerKey = "d7pZe-WKMVVRGeM9vPb5g"; // 다른 사용자가 이 값을 탈취하면 악의적인 사용을 할 수 있습니다.
        const widgets = tossPayments.widgets({
          customerKey,
          brandpay:{
            // 개발자센터의 브랜드페이 > 리다이렉트 URL에 아래 URL을 추가하세요.
            redirectUrl: window.location.origin + "/auth"
          }
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({customerKey: TossPayments.ANONYMOUS});
        // ------ 주문의 결제 금액 설정 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
        await widgets.setAmount({
          currency: "KRW",
          value: 50000,
        });
        await Promise.all([
          // ------  결제 UI 렌더링 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          // ------  이용약관 UI 렌더링 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
          widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
        ])
        // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
        // https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
        button.addEventListener("click", async function () {
          // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
          // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
          await widgets.requestPayment({
            orderId: "qAshFgDZtsGZKMnbTatvT", // 고유 주문번호
            orderName: "토스 티셔츠 외 2건",
            successUrl: window.location.origin + "/success", // 결제 요청이 성공하면 리다이렉트되는 URL
            failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
            customerEmail: "customer123@gmail.com",
            customerName: "김토스",
            customerMobilePhone: "01012341234",
          });
        });
      }
    </script>
  </body>
</html>
</body>

2. 리다이렉트 URL로 이동하기
구매자가 카드・계좌 정보를 등록하면, redirectUrl의 쿼리 파라미터로 code, customerKey를 전달해요.

/auth?code={CODE}&customerKey={CUSTOMER_KEY}

1 쿼리 파라미터의 customerKey 값과 결제 요청 시 보낸 customerKey 값이 같은지 반드시 확인하세요

customerKey 는 고객을 특정하는 값으로 다른 사용자가 이 값을 탈취하면 악의적인 사용을 할 수 있습니다. customerKey 의 보안을 강화하기 위해 Access Token을 발급할 때 customerKey 를 비교해서 동일한 고객인지 확인하는 로직을 추가하면 좋습니다.
2 서버에 code 값을 저장하세요

Access Token 발급에 필요한 Authorization Code(임시 인증 코드)입니다.

3. Access Token 발급하기
redirectUrl의 쿼리 파라미터 정보로 브랜드페이 Access Token 발급 API를 호출하세요.

먼저 시크릿 키와 :을 base64로 인코딩해서 Basic 인증 헤더를 아래와 같이 만들어주세요. :을 빠트리지 않도록 주의하세요. 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다. 시크릿 키는 클라이언트, GitHub 등 외부에 노출되면 안 됩니다.

Basic base64("{WIDGET_SECRET_KEY}:")

트러블슈팅 시크릿 키 인코딩 방법

시크릿 키 뒤에 : 을 추가하고 base64로 인코딩합니다. : 을 빠트리지 않도록 주의하세요.
base64('test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMW6:')
        ──────────────────────────────────── ┬
                     secretKey               :
                 발급받은 시크릿 키         콜론
    아래 명령어를 터미널에서 실행하면 인코딩된 값을 얻을 수 있습니다.
 echo -n 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMW6:' | base64
 
 트러블슈팅 UNAUTHORIZED_KEY

오류원인

API 키를 잘못 입력하면 UNAUTHORIZED_KEY 에러가 발생합니다.

해결 방법

클라이언트 키와 매칭된 시크릿 키를 사용하고 있는지 확인하세요. API 키는 토스페이먼츠에 로그인한 뒤에 개발자센터의 API 키 메뉴에서 확인할 수 있어요.

시크릿 키 인코딩을 다시 확인하세요. 시크릿 키 뒤에 : 을 추가하고 base64로 인코딩해서 사용해야 됩니다.

redirectUrl 엔드포인트에서 Access Token 발급 API를 호출해주세요. 인증 헤더에 인코딩한 시크릿 키값을 추가하세요. 요청 본문으로는 쿼리 파라미터로 받은 code, customerKey를 넣어주세요. Access Token 최초 발급에는 grantType을 AuthorizationCode로 설정하세요.

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/authorizations/access-token \
  --header 'Authorization: Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6' \
  --header 'Content-Type: application/json' \
  --data '{"grantType":"AuthorizationCode","customerKey":"d7pZe-WKMVVRGeM9vPb5g","code":"RnYX2w532omp6gDQgVNeyqAp"}'

  const fetch = require('node-fetch');

const url = 'https://api.tosspayments.com/v1/brandpay/authorizations/access-token';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6',
    'Content-Type': 'application/json'
  },
  body: '{"grantType":"AuthorizationCode","customerKey":"d7pZe-WKMVVRGeM9vPb5g","code":"RnYX2w532omp6gDQgVNeyqAp"}'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

그럼 아래와 같이 accessToken, refreshToken이 응답되고, 사용자의 결제 정보가 브랜드페이 등록이 완료됐어요. 만약에 브랜드페이 API로 구매자의 결제수단을 관리하거나 회원 탈퇴 기능을 사용하고 싶다면 토큰 값을 저장하고 사용하세요. 하지만 해당 기능을 SDK 또는 상점관리자를 통해서 사용하고 싶다면 토큰을 저장하지 않아도 돼요.

응답

{
  "accessToken": "Xy0E4Dv5qpMGjLJoQ1aVZ5449xB1P3w6KYe2RNgOWznZb7Bm",
  "refreshToken": "vG45eDbZnodP9BRQmyarYYdd2mMD2rJ07KzLNkE6AOMwXYWl",
  "tokenType": "bearer",
  "expiresIn": 2592000
}

4. 성공・실패 리다이렉트 URL로 이동하기
이제 결제 UI에 구매자가 등록한 결제수단이 보여요. 필수 약관에 동의하고 '결제하기' 버튼을 누르면 브랜드페이 결제창이 열려요. 설정한 비밀번호를 입력해서 결제를 요청해주세요.

링크 복사결제 요청이 성공했어요
결제 요청이 성공하면 successUrl로 이동해요. 해당 URL에 아래 세 가지 쿼리 파라미터가 추가돼요.

/success?paymentType={PAYMENT_TYPE}&orderId={ORDER_ID}&paymentKey={PAYMENT_KEY}&amount={AMOUNT}

쿼리 파라미터의 amount 값과 결제 요청 시 보낸 amount 값이 같은지 반드시 확인하세요

쿼리 파라미터의 amount 값과 setAmount() 의 value 파라미터 값이 같은지 반드시 확인하세요. 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다. 만약 값이 다르다면 결제를 취소하고 구매자에게 알려주세요.

2 서버에 paymentKey, amount, orderId 값을 저장하세요

서버에 paymentKey, amount, orderId 값을 저장하세요. paymentKey 는 토스페이먼츠에서 각 주문에 발급하는 고유 키값이에요. 결제 승인, 취소, 조회 등에 사용되기 때문에 꼭 저장해주세요.

3 paymentType은 'BRANDPAY'입니다

브랜드페이 결제의 paymentType 은 항상 BRANDPAY 입니다. 기타 결제는 모두 NORMAL 입니다.

결제 요청이 실패했어요
만약에 결제 정보가 틀려서 결제 요청이 실패했다면, failUrl로 이동해요. 해당 URL에는 아래 세 가지 쿼리 파라미터가 추가돼요. 에러 코드와 메시지를 확인해서 구매자에게 적절한 안내 메시지를 보여주세요.

/fail?code={ERROR_CODE}&message={ERROR_MESSAGE}&orderId={ORDER_ID}

트러블슈팅 PAY_PROCESS_CANCELED

오류원인

구매자에 의해 결제가 취소되면 PAY_PROCESS_CANCELED 에러가 발생합니다. 결제 과정이 중단된 것이라서 failUrl 로 orderId 가 전달되지 않아요.

오류원인

결제가 실패하면 PAY_PROCESS_ABORTED 에러가 발생합니다.

해결 방법

오류 메시지를 확인하세요. 계약 관련 오류는 토스페이먼츠 고객센터(1544-7772, support@tosspayments.com)로 문의해주세요.

기타 오류는 토스페이먼츠 실시간 기술지원 채널에서 문의해주세요.

트러블슈팅 REJECT_CARD_COMPANY

오류원인

구매자가 입력한 카드 정보에 문제가 있다면 REJECT_CARD_COMPANY 에러가 발생합니다.

해결 방법

오류 메시지를 확인하고 구매자에게 안내를 해주세요.

5. 브랜드페이 결제 승인하기
마지막 단계로 브랜드페이 결제 승인 API을 호출하세요.

브랜드페이 결제 승인 API 헤더에 앞서 인코딩한 결제위젯 시크릿 키값을 추가하세요. 요청 본문 파라미터에는 앞 단계에서 리다이렉트 URL로 받은 paymentKey, orderId, amount를 넣어주세요. 아래 예제 코드에는 내 테스트 결제의 paymentKey 값을 넣어 실행해주세요.

요청

const fetch = require('node-fetch');

const url = 'https://api.tosspayments.com/v1/brandpay/payments/confirm';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6',
    'Content-Type': 'application/json'
  },
  body: '{"paymentKey":"{PAYMENT_KEY}","amount":50000,"customerKey":"RdxXjfds7VUvrx96UIp5H","orderId":"7b5YJQFPoOI2P1pzgQn_M"}'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/payments/confirm \
  --header 'Authorization: Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6' \
  --header 'Content-Type: application/json' \
  --data '{"paymentKey":"{PAYMENT_KEY}","amount":50000,"customerKey":"RdxXjfds7VUvrx96UIp5H","orderId":"7b5YJQFPoOI2P1pzgQn_M"}'

  6. 응답 확인하기
링크 복사결제 승인이 성공했어요
결제 승인 API의 결과로 HTTP 200 OK와 함께 Payment 객체가 돌아오면 결제가 정상적으로 완료됐어요.

Payment 객체에 구매자가 선택한 결제수단 정보가 있는지 확인하세요. 카드로 결제했다면 아래와 같이 card 필드에 카드 정보를 확인할 수 있어요.

응답으로 받은 Payment 객체가 아래 예시와 다르다면 API 버전을 확인하세요. 개발자센터의 API 키 메뉴에서 설정된 API 버전을 확인하고 변경할 수 있어요. API 버전 업데이트 사항은 릴리즈 노트에서 확인할 수 있습니다

{
  "mId": "tosspayments",
  "version": "2022-11-16",
  "paymentKey": "2vUHmM-TPuS7Y7zlk9mWo",
  "status": "DONE",
  "lastTransactionKey": "iMPstY_UrMFLmNgJ_On4R",
  "orderId": "7b5YJQFPoOI2P1pzgQn_M",
  "orderName": "토스 티셔츠 외 2건",
  "requestedAt": "2022-06-08T15:40:09+09:00",
  "approvedAt": "2022-06-08T15:40:49+09:00",
  "useEscrow": false,
  "cultureExpense": false,
  "card": {
    "issuerCode": "61",
    "acquirerCode": "31",
    "number": "12345678****789*",
    "installmentPlanMonths": 0,
    "isInterestFree": false,
    "interestPayer": null,
    "approveNo": "00000000",
    "useCardPoint": false,
    "cardType": "신용",
    "ownerType": "개인",
    "acquireStatus": "READY",
    "amount": 15000
  },
  "virtualAccount": null,
  "transfer": null,
  "mobilePhone": null,
  "giftCertificate": null,
  "cashReceipt": null,
  "cashReceipts": null,
  "discount": null,
  "cancels": null,
  "secret": null,
  "type": "BRANDPAY",
  "easyPay": null,
  "country": "KR",
  "failure": null,
  "isPartialCancelable": true,
  "receipt": {
    "url": "https://dashboard.tosspayments.com/sales-slip?transactionId=KAgfjGxIqVVXDxOiSW1wUnRWBS1dszn3DKcuhpm7mQlKP0iOdgPCKmwEdYglIHX&ref=PX"
  },
  "checkout": {
    "url": "https://api.tosspayments.com/v1/payments/2vUHmM-TPuS7Y7zlk9mWo/checkout"
  },
  "currency": "KRW",
  "totalAmount": 15000,
  "balanceAmount": 15000,
  "suppliedAmount": 13636,
  "vat": 1364,
  "taxFreeAmount": 0,
  "metadata": null,
  "method": "카드"
}

{
  "mId": "tosspayments",
  "version": "2022-11-16",
  "paymentKey": "2vUHmM-TPuS7Y7zlk9mWo",
  "status": "DONE",
  "lastTransactionKey": "iMPstY_UrMFLmNgJ_On4R",
  "orderId": "7b5YJQFPoOI2P1pzgQn_M",
  "orderName": "토스 티셔츠 외 2건",
  "requestedAt": "2022-06-08T15:40:09+09:00",
  "approvedAt": "2022-06-08T15:40:49+09:00",
  "useEscrow": false,
  "cultureExpense": false,
  "card": {
    "issuerCode": "61",
    "acquirerCode": "31",
    "number": "12345678****789*",
    "installmentPlanMonths": 0,
    "isInterestFree": false,
    "interestPayer": null,
    "approveNo": "00000000",
    "useCardPoint": false,
    "cardType": "신용",
    "ownerType": "개인",
    "acquireStatus": "READY",
    "amount": 15000
  },
  "virtualAccount": null,
  "transfer": null,
  "mobilePhone": null,
  "giftCertificate": null,
  "cashReceipt": null,
  "cashReceipts": null,
  "discount": null,
  "cancels": null,
  "secret": null,
  "type": "BRANDPAY",
  "easyPay": null,
  "country": "KR",
  "failure": null,
  "isPartialCancelable": true,
  "receipt": {
    "url": "https://dashboard.tosspayments.com/sales-slip?transactionId=KAgfjGxIqVVXDxOiSW1wUnRWBS1dszn3DKcuhpm7mQlKP0iOdgPCKmwEdYglIHX&ref=PX"
  },
  "checkout": {
    "url": "https://api.tosspayments.com/v1/payments/2vUHmM-TPuS7Y7zlk9mWo/checkout"
  },
  "currency": "KRW",
  "totalAmount": 15000,
  "balanceAmount": 15000,
  "suppliedAmount": 13636,
  "vat": 1364,
  "taxFreeAmount": 0,
  "metadata": null,
  "method": "카드"
}

결제 승인이 실패했어요
결제 승인에 실패하면 HTTP 4XX 또는 5XX 코드와 에러 객체를 받습니다. 결제 승인의 전체 오류 목록은 에러 코드를 참고하세요. 테스트 환경에서 결제 승인 실패를 재현해보고 싶다면 토스페이먼츠 API 테스트 헤더를 사용해보세요.

실패

{
  "code": "NOT_FOUND_PAYMENT_SESSION",
  "message": "결제 시간이 만료되어 결제 진행 데이터가 존재하지 않습니다."
}

트러블슈팅 NOT_FOUND_PAYMENT_SESSION

오류원인

결제 승인에서 요청에 문제가 있으면 NOT_FOUND_PAYMENT_SESSION 에러가 발생합니다.

해결 방법

결제 요청이 완료된 이후 10분 이내에 결제를 승인해야 됩니다. 10분이 지나면 결제 데이터가 유실되어 승인이 불가합니다.

결제 요청했을 때 돌려받은 paymentKey 와 결제 승인에 사용한 paymentKey 가 같은 값인지 확인하세요.

결제 요청에 사용한 클라이언트 키와 결제 승인에 사용한 시크릿 키가 매칭된 키값인지 확인하세요.

트러블슈팅 REJECT_CARD_COMPANY

오류원인

카드사에서 해당 카드를 거절했을 때 REJECT_CARD_COMPANY 에러가 발생합니다. 원인은 비밀번호 오류, 한도 초과, 포인트 부족 등 다양합니다.

해결 방법

에러 메시지를 확인해서 원인을 파악하고 구매자에게 올바른 안내를 해주세요.

트러블슈팅 FORBIDDEN_REQUEST

오류원인

API 키값 또는 주문번호가 최초 요청한 값과 다르면 FORBIDDEN_REQUEST 가 발생합니다.

해결 방법

결제 요청에 사용한 클라이언트 키와 API 호출에 사용한 시크릿 키가 매칭된 키값인지 확인하세요.

orderId, paymentKey 값이 최초 결제 요청한 값과 같은지 확인하세요.

트러블슈팅 UNAUTHORIZED_KEY

오류원인

API 키를 잘못 입력하면 UNAUTHORIZED_KEY 에러가 발생합니다.

해결 방법

클라이언트 키와 매칭된 시크릿 키를 사용하고 있는지 확인하세요. API 키는 토스페이먼츠에 로그인한 뒤에 개발자센터의 API 키 메뉴에서 확인할 수 있어요.

시크릿 키 인코딩을 다시 확인하세요. 시크릿 키 뒤에 : 을 추가하고 base64로 인코딩해서 사용해야 됩니다.
