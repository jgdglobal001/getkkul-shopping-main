API & SDK
브랜드페이 API
브랜드페이에서 제공하는 API 엔드포인트(Endpoint)와 객체 정보, 파라미터, 요청 및 응답 예제를 살펴보세요.

목차
사용자 인증

Terms 객체
미동의 약관 조회
약관 동의
AccessToken 객체
Access Token 발급
결제수단

BrandPayMethod 객체
BrandPayCard 객체
BrandPayBankAccount 객체
AccessToken으로 결제수단 조회
SecretKey로 결제수단 조회
카드 결제수단 삭제
계좌 결제수단 삭제
결제

결제 승인
자동결제 실행
결제 취소
회원 관리

회원 탈퇴 처리
프로모션

BrandPayCardPromotion 객체
BrandPayBankPromotion 객체
전체 프로모션 조회
카드 프로모션 조회
계좌 프로모션 조회

원하는 정보를 찾기 어렵나요?
브랜드페이 API를 이용하면 UI를 전부 직접 구현할 수 있습니다.

브랜드페이 API 인증 방식은 브랜드페이 인증에서 더 자세히 설명합니다. API 키 정보와 브랜드페이 방화벽 설정도 확인하세요.

링크 복사사용자 인증
링크 복사Terms 객체
브랜드페이 필수 이용약관 정보를 담고 있는 객체입니다.

링크 복사객체 상세
id integer
약관의 ID입니다.

title string
약관 제목입니다.

version string
약관 버전입니다.

url string
약관 전문이 들어있는 URL입니다.

required boolean
약관의 필수 동의 여부입니다.

agreed boolean
고객의 약관 동의 여부입니다.

링크 복사미동의 약관 조회
GET
/v1/brandpay/terms
customerKey에 해당하는 고객이 브랜드페이 사용 약관에 동의했는지 조회합니다. Basic 인증 방식을 사용합니다.

링크 복사Query 파라미터
customerKey 필수 · string
구매자 ID입니다. 다른 사용자가 이 값을 알게 되면 악의적으로 사용될 수 있습니다. 자동 증가하는 숫자 또는 이메일・전화번호・사용자 아이디와 같이 유추가 가능한 값은 안전하지 않습니다. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 를 최소 1개 이상 포함한 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

* customerKey는 클라이언트 키와 다릅니다. 클라이언트 키는 연동을 위한 기본 키로 브라우저에서 SDK를 연동할 때 '클라이언트'를 식별하며, 토스페이먼츠에서 제공합니다.

scope 필수 · string
약관 항목입니다. REGISTER, ACCOUNT, BILLING, CARD가 있습니다. 최대 2개의 항목을 설정할 수 있습니다. 회원가입 항목, 결제수단 항목의 조합이어야 합니다.

- REGISTER: 브랜드페이 회원가입 약관 목록입니다.

- ACCOUNT: 계좌 결제 약관 목록입니다.

- BILLING: 자동결제 약관 목록입니다.

- CARD: 카드 결제 약관 목록입니다.

링크 복사Response
성공
약관 조회에 성공했다면 각 약관의 동의 여부와 약관 정보를 담은 Terms 객체가 배열로 돌아옵니다.

실패
약관 조회에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

미동의 약관 조회 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request GET \
  --url 'https://api.tosspayments.com/v1/brandpay/terms?customerKey=c6thB674j9vCU4XsvcPk&scope=REGISTER' \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg=='
응답
[
  {
    "id": 1,
    "title": "브랜드페이 서비스 이용약관",
    "version": "1.0",
    "url": "https://pages.tosspayments.com/terms/brandpay/service",
    "required": true,
    "agreed": false
  },
  {
    "id": 2,
    "title": "전자금융거래 기본약관",
    "version": "1.0",
    "url": "https://pages.tosspayments.com/terms/user",
    "required": true,
    "agreed": false
  },
  {
    "id": 3,
    "title": "개인정보 수집 및 이용 동의",
    "version": "1.0",
    "url": "https://pages.tosspayments.com/terms/brandpay/privacy",
    "required": true,
    "agreed": false
  },
  {
    "id": 4,
    "title": "개인정보 제3자 제공 동의",
    "version": "1.0",
    "url": "https://pages.tosspayments.com/terms/brandpay/privacy3",
    "required": true,
    "agreed": false
  }
]
링크 복사약관 동의
POST
/v1/brandpay/terms/agree
동의가 필요한 약관 ID의 배열과 customerKey를 보내서 customerKey에 해당하는 고객의 약관 동의를 진행합니다. Basic 인증 방식을 사용합니다.

* 미동의 약관 조회 API로 동의해야 하는 약관 정보를 확인한 뒤 사용하세요.

링크 복사Request Body 파라미터
customerKey 필수 · string
구매자 ID입니다. 다른 사용자가 이 값을 알게 되면 악의적으로 사용될 수 있습니다. 자동 증가하는 숫자 또는 이메일・전화번호・사용자 아이디와 같이 유추가 가능한 값은 안전하지 않습니다. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 를 최소 1개 이상 포함한 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

* customerKey는 클라이언트 키와 다릅니다. 클라이언트 키는 연동을 위한 기본 키로 브라우저에서 SDK를 연동할 때 '클라이언트'를 식별하며, 토스페이먼츠에서 제공합니다.

scope 필수 · array2022-11-16
약관 항목입니다. REGISTER, ACCOUNT, BILLING, CARD가 있습니다. 최대 2개의 항목을 설정할 수 있습니다. 회원가입 항목, 결제수단 항목의 조합이어야 합니다.

- REGISTER: 브랜드페이 회원가입 약관 목록입니다.

- ACCOUNT: 계좌 결제 약관 목록입니다.

- BILLING: 자동결제 약관 목록입니다.

- CARD: 카드 결제 약관 목록입니다.

termsId array
약관 ID가 담긴 배열입니다.

링크 복사Response
성공
약관 동의에 성공했다면 임시 인증 코드(code)가 돌아옵니다. 이 값을 사용해서 Access Token을 발급받을 수 있습니다.

인증 과정은 브랜드페이 인증 페이지에서 더 자세히 설명합니다.

실패
약관 동의에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

약관 동의 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/terms/agree \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg==' \
  --header 'Content-Type: application/json' \
  --data '{"customerKey":"c6thB674j9vCU4XsvcPk","scope":["REGISTER","CARD"],"termsId":[1,2,3,4,5]}'
응답
{
    "code": "RnYX2w532omp6gDQgVNeyqAp"
}
링크 복사AccessToken 객체
브랜드페이 API를 사용할 때 필요한 인증 토큰을 담고 있는 객체입니다.

링크 복사객체 상세
accessToken string
사용자에 할당된 Access Token 입니다. customerKey와 연결되어 있는 값으로 고객이 탈퇴하거나 Refresh Token으로 새로 발급받지 않는 한 변하지 않습니다.

tokenType string
브랜드페이 API를 요청할 때 쓰는 인증 방식인 bearer가 고정값으로 돌아옵니다.

refreshToken string
Access Token을 새로 발급 받을 때 사용할 토큰입니다.

expiresIn integer
Access Token의 유효기간을 초 단위로 나타낸 값입니다. Access Token이 만료되면 Access Token 발급 API로 유효기간을 연장하거나 새로 발급받으세요.

링크 복사Access Token 발급
POST
/v1/brandpay/authorizations/access-token
사용자를 식별하는 Access Token을 발급 받을 수 있습니다. Basic 인증 방식을 사용합니다.

링크 복사Request Body 파라미터
customerKey 필수 · string
구매자 ID입니다. 다른 사용자가 이 값을 알게 되면 악의적으로 사용될 수 있습니다. 자동 증가하는 숫자 또는 이메일・전화번호・사용자 아이디와 같이 유추가 가능한 값은 안전하지 않습니다. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 를 최소 1개 이상 포함한 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

* customerKey는 클라이언트 키와 다릅니다. 클라이언트 키는 연동을 위한 기본 키로 브라우저에서 SDK를 연동할 때 '클라이언트'를 식별하며, 토스페이먼츠에서 제공합니다.

grantType 필수 · string
요청 타입입니다. AuthorizationCode, RefreshToken 중 하나입니다.

- AuthorizationCode: 신규 고객이면 Access Token을 처음 발급합니다. 기존 고객이면 Access Token 유효기간을 연장합니다.

- RefreshToken: 기존 고객의 Access Token을 새로 발급합니다. 새로운 Access Token, Refresh Token을 발급합니다.

code string
약관 동의 API의 응답 또는 리다이렉트 URL의 쿼리 파라미터로 돌아온 code를 넣어줍니다. grantType이 AuthorizationCode이면 필수입니다.

refreshToken string
Access Token 발급 API로 돌아온 refreshToken을 넣어줍니다. grantType이 RefreshToken이면 필수입니다.

customerIdentity object
인증에 필요한 고객 정보입니다. 상점에서 가지고 있는 고객 정보를 사용해서 값을 채워주세요. 이 정보를 보내면 휴대폰 본인 인증 과정에서 입력해야 하는 정보가 미리 채워집니다. 상점에 가입한 고객과 브랜드페이 서비스에 가입한 고객이 같은지 인증하고 이 정보와 본인 인증 결과로 받은 고객 정보가 일치하는지 비교합니다.

ci string
고객의 연계 정보(CI) 값입니다.

mobilePhone string
구매자의 휴대폰 번호입니다.

name string
구매자명입니다.

rrn string
고객의 주민번호 앞 7자리(생년월일+성별코드)입니다.

링크 복사Response
성공
Access Token 발급에 성공했다면 AccessToken 객체가 돌아옵니다. 발급된 Access Token을 사용해서 브랜드페이 API에 HTTP 요청을 보낼 수 있습니다.

실패
Access Token 발급에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

Access Token 발급 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/authorizations/access-token \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg==' \
  --header 'Content-Type: application/json' \
  --data '{"grantType":"AuthorizationCode","customerKey":"c6thB674j9vCU4XsvcPk","code":"RnYX2w532omp6gDQgVNeyqAp"}'
응답
{
  "accessToken": "Xy0E4Dv5qpMGjLJoQ1aVZ5449xB1P3w6KYe2RNgOWznZb7Bm",
  "refreshToken": "vG45eDbZnodP9BRQmyarYYdd2mMD2rJ07KzLNkE6AOMwXYWl",
  "tokenType": "bearer",
  "expiresIn": 2592000
}
링크 복사결제수단
결제수단 API로 고객의 브랜드페이 결제수단 정보를 조회하거나 삭제할 수 있습니다.

* 현재 결제수단 등록은 브랜드페이 SDK 메서드로 지원합니다.

링크 복사BrandPayMethod 객체
고객을 특정하는 customerKey에 연결되어 있는 객체로, 해당 고객에게 등록되어 있는 전체 결제수단 정보를 알려줍니다.

고객이 가장 최근에 사용했거나 등록한 결제수단 정보도 제공합니다.

링크 복사객체 상세
isIdentified boolean
본인 인증 후 브랜드페이에 가입되어 있는지입니다.

브랜드페이 SDK로 본인 인증을 했거나, Access Token을 발급받을 때 개인 식별 정보(customerIdentity) 객체의 값을 모두 채워서 인증이 진행하면 true로 설정됩니다.

selectedMethodId string
가장 최근에 등록했거나 사용한 결제수단의 id 값입니다.

* 전체 결제수단의 등록 날짜와 최근 한 달 이내에 사용한 결제수단의 사용일을 비교해 가장 최근에 등록했거나 사용한 결제수단의 id가 내려갑니다. 등록한 결제수단이 없다면 null이 내려갑니다.

cards array
브랜드페이에 고객이 등록한 카드 정보가 배열로 들어옵니다. 아래 BrandPayCard 객체를 참고하세요.

accounts array
브랜드페이에 고객이 등록한 계좌 정보가 배열로 들어옵니다. 아래 BrandPayBankAccount 객체를 참고하세요.

링크 복사BrandPayCard 객체
고객이 결제수단으로 등록한 카드 정보를 담고 있는 객체입니다.

링크 복사객체 상세
id string
결제수단의 아이디입니다.

methodKey string
결제수단을 특정하는 키입니다. 자동결제 API, 결제수단 삭제 API 등 API를 사용할 때 고객이 등록해 둔 결제수단을 특정합니다. 브랜드페이 구매자가 탈퇴하면 methodKey도 더 이상 사용할 수 없습니다. CUSTOMER_STATUS_CHANGED 웹훅으로 탈퇴한 구매자를 확인하세요.

alias string
고객이 직접 설정한 해당 결제수단의 별명입니다.

* 결제수단의 별명 설정 및 변경은 SDK에서 제공하는 결제 관리 UI의 결제수단 관리에서 할 수 있습니다.

cardName string
카드 이름입니다.

cardNumber string
카드 번호입니다.

issuerCode string
카드 발급사 두 자리 코드입니다. 카드사 코드를 참고하세요.

acquirerCode string
카드 매입사 두 자리 코드입니다. 카드사 코드를 참고하세요.

ownerType string
카드의 소유자 타입입니다. 개인, 법인 중 하나입니다.

cardType string
카드 종류입니다. 신용, 체크, 기프트 중 하나입니다.

installmentMinimumAmount integer
issuerCode에 해당하는 카드에서 할부가 가능한 최소 금액 정보입니다. 이 금액과 고객이 결제할 금액을 비교해서 할부 선택 UI를 보여줄지 결정할 수 있습니다.

registeredAt string
결제수단을 등록한 날짜와 시간 정보입니다. yyyy-MM-dd'T'HH:mm:ss±hh:mm ISO 8601 형식입니다. (e.g. 2022-01-01T00:00:00+09:00)

status string
결제수단 활성화 여부를 나타냅니다. 결제수단을 조회할 때는 이 값이 ENABLED인 결제수단만 돌아옵니다. 결제수단을 삭제하면 이 값이 DISABLED로 변경됩니다.

- ENABLED: 결제수단이 등록되어 사용할 수 있는 상태

- DISABLED: 결제수단이 삭제되어 사용할 수 없는 상태

icon string
카드사 아이콘입니다. 예를 들어 icn-bank-square-hyundaicard는 현대카드 아이콘 코드입니다.

icn-bank-square-에 카드사 이름이 조합되어 있습니다.

iconUrl string
카드사 아이콘 이미지 URL입니다. 이 값을 이미지 주소로 사용하면 화면에 카드사 아이콘을 보여줄 수 있습니다.

cardImgUrl string
카드 실물 이미지 URL입니다. 이 값을 이미지 주소로 사용하면 화면에 카드 실물 이미지를 보여줄 수 있습니다.

color object
카드사 아이콘의 색상입니다. 아이콘 이미지와 함께 카드 결제수단 UI를 직접 만들 때 사용할 수 있습니다.

background string
카드사 아이콘의 배경색입니다.

text string
카드사 아이콘의 텍스트 색입니다.

promotions array
카드사 프로모션 정보가 담기는 배열입니다.

type string
프로모션 종류입니다. 아래 네 가지 값 중 하나가 돌아옵니다. 상세 정보는 type 이름과 같은 객체에 들어있습니다.

- CARD_DISCOUNT: 카드 즉시 할인입니다. cardDiscount 객체에 관련 정보가 돌아옵니다.

- CARD_INTEREST_FREE: 카드 무이자 할부입니다. cardInterestFree 객체에 관련 정보가 돌아옵니다.

- CARD_POINT: 카드 포인트 할인입니다. cardPoint 객체에 관련 정보가 돌아옵니다.

cardDiscount nullable · object
카드사의 즉시 할인 정보입니다.

issuerCode string
프로모션을 진행하는 카드 발급사 두 자리 코드입니다. 카드사 코드를 참고하세요.

discountAmount number
할인되는 금액입니다.

minimumPaymentAmount number
카드사 즉시 할인을 적용할 수 있는 최소 결제 금액입니다.

maximumPaymentAmount number
카드사 즉시 할인을 적용할 수 있는 최대 결제 금액입니다.

currency string
통화 정보입니다.

discountCode string
프로모션 코드입니다. 카드사에서 만든 고유한 값으로 결제할 때 함께 넘겨야 하는 값입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-MM-dd 형식입니다. 종료일의 23:59:59까지 행사가 유효합니다.

balance number
남은 프로모션 예산입니다. 값이 '0'이면 즉시 할인을 적용할 수 없습니다.

cardInterestFree nullable · object
카드 무이자 할부 정보입니다.

issuerCode string
프로모션을 진행하는 카드 발급사 두 자리 코드입니다. 카드사 코드를 참고하세요.

minimumPaymentAmount number
무이자 할부를 적용할 수 있는 최소 결제 금액입니다.

currency string
통화 정보입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-MM-dd 형식입니다. 종료일의 23:59:59까지 행사가 유효합니다.

installmentFreeMonths array
카드 무이자 할부를 적용할 수 있는 개월 수 입니다.

cardPoint nullable · object
카드 포인트 정보입니다.

issuerCode string
프로모션을 진행하는 카드 발급사 두 자리 코드입니다. 카드사 코드를 참고하세요.

minimumPaymentAmount number
카드 포인트를 적용할 수 있는 최소 결제 금액입니다.

currency string
통화 정보입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-mm-dd 형태입니다. 종료일의 23:59:59까지 행사가 유효합니다.

링크 복사BrandPayBankAccount 객체
고객이 결제수단으로 등록한 계좌 정보를 담고 있는 객체입니다.

링크 복사객체 상세
id string
결제수단의 ID입니다. SDK를 사용해서 결제할 때 이 값을 사용합니다.

methodKey string
결제수단을 특정하는 키입니다. 자동결제 API, 결제수단 삭제 API 등 API를 사용할 때 고객이 등록해 둔 결제수단을 특정합니다. 브랜드페이 구매자가 탈퇴하면 methodKey도 더 이상 사용할 수 없습니다. CUSTOMER_STATUS_CHANGED 웹훅으로 탈퇴한 구매자를 확인하세요.

accountName string
계좌 이름입니다.

accountNumber string
계좌번호입니다.

alias string
고객이 직접 설정한 해당 결제수단의 별명입니다.

* 결제수단의 별명 설정 및 변경은 SDK에서 제공하는 결제 관리 UI의 결제수단 관리에서 할 수 있습니다.

bankCode string
은행 두 자리 코드입니다. 은행 코드를 참고하세요.

icon string
은행 아이콘입니다. 예를 들어 icn-bank-kb는 KB국민은행 아이콘 코드입니다.

- NORMAL: 정사각형 형태의 은행 아이콘입니다.(96x96)

- SQUARE: 직사각형 형태의 은행 아이콘입니다. (160x256)

iconUrl string
은행 아이콘 이미지 URL입니다. 이 값을 이미지 주소로 사용해서 화면에 은행 아이콘을 보여줄 수 있습니다.

registeredAt string
결제수단을 등록한 날짜와 시간 정보입니다. yyyy-MM-dd'T'HH:mm:ss±hh:mm ISO 8601 형식입니다. (e.g. 2022-01-01T00:00:00+09:00)

status string
결제수단 활성화 여부를 나타냅니다. 결제수단을 조회할 때는 이 값이 ENABLED인 결제수단만 돌아옵니다. 결제수단을 삭제하면 이 값이 DISABLED로 변경됩니다.

- ENABLED: 결제수단이 등록되어 사용할 수 있는 상태

- DISABLED: 결제수단이 삭제되어 사용할 수 없는 상태

color object
은행 아이콘의 색상 정보입니다. 아이콘 이미지와 함께 계좌 결제수단 UI를 직접 만들 때 사용할 수 있습니다.

background string
은행 아이콘의 배경색입니다.

text string
은행 아이콘의 텍스트 색입니다.

promotions array
은행 프로모션 정보입니다.

type string
프로모션 종류입니다. 항상 BANK_DISCOUNT입니다.

bankDiscount nullable · object
계좌 할인 정보입니다.

bankCode string
프로모션을 진행하는 은행 두 자리 코드입니다. 은행 코드를 참고하세요.

discountAmount number
할인 금액입니다.

minimumPaymentAmount number
계좌 할인을 적용할 수 있는 최소 결제 금액입니다.

maximumPaymentAmount number
계좌 할인을 적용할 수 있는 최대 결제 금액입니다.

currency string
통화 정보입니다.

discountCode string
계좌 할인 프로모션 코드입니다. 은행에서 만든 고유한 값으로 결제할 때 함께 넘겨야 하는 값입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-mm-dd 형태입니다. 종료일의 23:59:59까지 행사가 유효합니다.

balance number
남은 프로모션 예산입니다. 값이 '0'이면 즉시 할인을 적용할 수 없습니다.

링크 복사AccessToken으로 결제수단 조회
GET
/v1/brandpay/payments/methods
사용자가 등록한 결제수단을 조회합니다. Bearer 인증 방식을 사용합니다.

* AccessToken이 이미 발급되어 사용자에게 할당되어 있다면 API를 호출했을 때 바로 결제수단을 조회할 수 있습니다.

링크 복사Response
성공
결제수단 조회에 성공했다면 BrandPayMethod 객체가 돌아옵니다.

실패
결제수단 조회에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

요청

Backend
cURL

curl --request GET \
  --url https://api.tosspayments.com/v1/brandpay/payments/methods \
  --header 'Authorization: Bearer Xy0E4Dv5qpMGjLJoQ1aVZ5449xB1P3w6KYe2RNgOWznZb7Bm'
응답
{
  "cards": [
    {
      "id": "m_Zzorzo1AJbaD78l5",
      "alias": "카드 별칭",
      "methodKey": "pa90ZoyegEOALnQvDd2VJ5vKkpRyN3Mj7X41mNW5kzKbwG6J",
      "cardName": "현대비자플래티늄",
      "cardNumber": "43301234****123*",
      "issuerCode": "61",
      "acquirerCode": "31",
      "ownerType": "개인",
      "cardType": "신용",
      "installmentMinimumAmount": 10000,
      "registeredAt": "2022-06-07T18:37:04+09:00",
      "status": "ENABLED",
      "icon": "icn-bank-square-hyundaicard",
      "iconUrl": "https://static.toss.im/icons/png/4x/icn-bank-square-hyundaicard.png",
      "cardImgUrl": "",
      "color": {
        "background": "#3C3C42",
        "text": "#FFFFFF"
      },
      "promotions": [
        {
          "payType": "NORMAL",
          "type": "CARD_INTEREST_FREE",
          "cardDiscount": null,
          "cardInterestFree": {
            "issuerCode": "21",
            "dueDate": "2022-12-31",
            "installmentFreeMonths": [2, 3, 4, 5, 6, 7, 8],
            "currency": "KRW",
            "minimumPaymentAmount": 50000
          },
          "cardPoint": null,
          "bankDiscount": null
        }
      ]
    }
  ],
  "accounts": [
    {
      "id": "b_aPz8LBLadxD6WVy4",
      "methodKey": "b6vdX0wJDpj5mBZ1gQ4YVXe9DYzQparl2KPoqNbMGOkn9EW7y",
      "accountName": "신한은행 계좌",
      "accountNumber": "123***7890",
      "alias": "내 계좌",
      "bankCode": "88",
      "icon": "",
      "iconUrl": "",
      "registeredAt": "2022-06-07T10:00:43.838Z",
      "status": "DISABLED",
      "color": {
        "background": "#F2F4F6",
        "text": "#333D4B"
      },
      "promotions": [
        {
          "payType": "NORMAL",
          "type": "BANK_DISCOUNT",
          "cardDiscount": null,
          "cardInterestFree": null,
          "cardPoint": null,
          "bankDiscount": {
            "bankCode": "92",
            "currency": "KRW",
            "discountAmount": 600,
            "balance": 1000000,
            "discountCode": "12861",
            "dueDate": "2022-07-30",
            "minimumPaymentAmount": 2000,
            "maximumPaymentAmount": 99999999
          }
        }
      ]
    }
  ],
  "isIdentified": true,
  "selectedMethodId": "m_Zzorzo1AJbaD78l5"
}
링크 복사SecretKey로 결제수단 조회
GET
/v1/brandpay/payments/methods/{customerKey}
사용자가 등록한 결제수단을 조회합니다. Basic 인증 방식을 사용합니다.

링크 복사Path 파라미터
customerKey 필수 · string
구매자 ID입니다. 다른 사용자가 이 값을 알게 되면 악의적으로 사용될 수 있습니다. 자동 증가하는 숫자 또는 이메일・전화번호・사용자 아이디와 같이 유추가 가능한 값은 안전하지 않습니다. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 를 최소 1개 이상 포함한 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

* customerKey는 클라이언트 키와 다릅니다. 클라이언트 키는 연동을 위한 기본 키로 브라우저에서 SDK를 연동할 때 '클라이언트'를 식별하며, 토스페이먼츠에서 제공합니다.

링크 복사Response
성공
결제수단 조회에 성공했다면 BrandPayMethod 객체가 돌아옵니다.

실패
결제수단 조회에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

SecretKey를 이용한 결제수단 조회 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request GET \
  --url https://api.tosspayments.com/v1/brandpay/payments/methods/{customerKey} \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg=='
응답
{
  "cards": [
    {
      "id": "m_Zzorzo1AJbaD78l5",
      "alias": "카드 별칭",
      "methodKey": "pa90ZoyegEOALnQvDd2VJ5vKkpRyN3Mj7X41mNW5kzKbwG6J",
      "cardName": "현대비자플래티늄",
      "cardNumber": "43301234****123*",
      "issuerCode": "61",
      "acquirerCode": "31",
      "ownerType": "개인",
      "cardType": "신용",
      "installmentMinimumAmount": 10000,
      "registeredAt": "2022-06-07T18:37:04+09:00",
      "status": "ENABLED",
      "icon": "icn-bank-square-hyundaicard",
      "iconUrl": "https://static.toss.im/icons/png/4x/icn-bank-square-hyundaicard.png",
      "cardImgUrl": "",
      "color": {
        "background": "#3C3C42",
        "text": "#FFFFFF"
      },
      "promotions": [
        {
          "payType": "NORMAL",
          "type": "CARD_INTEREST_FREE",
          "cardDiscount": null,
          "cardInterestFree": {
            "issuerCode": "21",
            "dueDate": "2022-12-31",
            "installmentFreeMonths": [2, 3, 4, 5, 6, 7, 8],
            "currency": "KRW",
            "minimumPaymentAmount": 50000
          },
          "cardPoint": null,
          "bankDiscount": null
        }
      ]
    }
  ],
  "accounts": [
    {
      "id": "b_aPz8LBLadxD6WVy4",
      "methodKey": "b6vdX0wJDpj5mBZ1gQ4YVXe9DYzQparl2KPoqNbMGOkn9EW7y",
      "accountName": "신한은행 계좌",
      "accountNumber": "123***7890",
      "alias": "내 계좌",
      "bankCode": "88",
      "icon": "",
      "iconUrl": "",
      "registeredAt": "2022-06-07T10:00:43.838Z",
      "status": "DISABLED",
      "color": {
        "background": "#F2F4F6",
        "text": "#333D4B"
      },
      "promotions": [
        {
          "payType": "NORMAL",
          "type": "BANK_DISCOUNT",
          "cardDiscount": null,
          "cardInterestFree": null,
          "cardPoint": null,
          "bankDiscount": {
            "bankCode": "92",
            "currency": "KRW",
            "discountAmount": 600,
            "balance": 1000000,
            "discountCode": "12861",
            "dueDate": "2022-07-30",
            "minimumPaymentAmount": 2000,
            "maximumPaymentAmount": 99999999
          }
        }
      ]
    }
  ],
  "isIdentified": true,
  "selectedMethodId": "m_Zzorzo1AJbaD78l5"
}
링크 복사카드 결제수단 삭제
POST
/v1/brandpay/payments/methods/card/remove
methodKey를 이용해서 결제수단으로 등록되어 있는 카드를 삭제합니다. Bearer 인증 방식을 사용합니다.

링크 복사Request Body 파라미터
methodKey 필수 · string
결제수단을 특정하는 키입니다.

링크 복사Response
성공
카드 결제수단 삭제에 성공했다면 삭제된 BrandPayCard 객체가 돌아옵니다. 돌아온 결제수단의 status 값은 DISABLED입니다.

실패
카드 결제수단 삭제에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/payments/methods/card/remove \
  --header 'Authorization: Bearer Xy0E4Dv5qpMGjLJoQ1aVZ5449xB1P3w6KYe2RNgOWznZb7Bm' \
  --header 'Content-Type: application/json' \
  --data '{"methodKey":"pa90ZoyegEOALnQvDd2VJ5vKkpRyN3Mj7X41mNW5kzKbwG6J"}'
응답
{
  "id": "m_Zzorzo1AJbaD78l5",
  "alias": "카드 별칭",
  "methodKey": "pa90ZoyegEOALnQvDd2VJ5vKkpRyN3Mj7X41mNW5kzKbwG6J",
  "cardName": "현대비자플래티늄",
  "cardNumber": "43301234****123*",
  "issuerCode": "61",
  "acquirerCode": "31",
  "ownerType": "개인",
  "cardType": "신용",
  "installmentMinimumAmount": 10000,
  "registeredAt": "2022-06-07T18:37:04+09:00",
  "status": "DISABLED",
  "icon": "icn-bank-square-hyundaicard",
  "iconUrl": "https://static.toss.im/icons/png/4x/icn-bank-square-hyundaicard.png",
  "cardImgUrl": "",
  "color": {
    "background": "#3C3C42",
    "text": "#FFFFFF"
  },
  "promotions": [
    {
      "payType": "NORMAL",
      "type": "CARD_INTEREST_FREE",
      "cardDiscount": null,
      "cardInterestFree": {
        "issuerCode": "21",
        "dueDate": "2022-12-31",
        "installmentFreeMonths": [2, 3, 4, 5, 6, 7, 8],
        "currency": "KRW",
        "minimumPaymentAmount": 50000
      },
      "cardPoint": null,
      "bankDiscount": null
    }
  ]
}
링크 복사계좌 결제수단 삭제
POST
/v1/brandpay/payments/methods/account/remove
methodKey를 이용해서 결제수단으로 등록되어 있는 계좌를 삭제합니다. 삭제된 계좌 정보를 담은 객체가 돌아옵니다. Bearer 인증 방식을 사용합니다.

링크 복사Request Body 파라미터
methodKey 필수 · string
결제수단을 특정하는 키입니다.

링크 복사Response
성공
계좌 결제수단 삭제에 성공했다면 삭제된 BrandPayBank Account 객체가 돌아옵니다. 돌아온 결제수단의 status 값은 DISABLED입니다.

실패
계좌 결제수단 삭제에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

계좌 결제수단 삭제 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/payments/methods/account/remove \
  --header 'Authorization: Bearer Xy0E4Dv5qpMGjLJoQ1aVZ5449xB1P3w6KYe2RNgOWznZb7Bm' \
  --header 'Content-Type: application/json' \
  --data '{"methodKey":"b6vdX0wJDpj5mBZ1gQ4YVXe9DYzQparl2KPoqNbMGOkn9EW7y"}'
응답
{
  "id": "b_aPz8LBLadxD6WVy4",
  "methodKey": "b6vdX0wJDpj5mBZ1gQ4YVXe9DYzQparl2KPoqNbMGOkn9EW7y",
  "accountName": "신한은행 계좌",
  "accountNumber": "123***7890",
  "alias": "내 계좌",
  "bankCode": "88",
  "icon": "",
  "iconUrl": "",
  "registeredAt": "2022-06-07T10:00:43.838Z",
  "status": "DISABLED",
  "color": {
    "background": "#F2F4F6",
    "text": "#333D4B"
  },
  "promotions": [
    {
      "payType": "NORMAL",
      "type": "BANK_DISCOUNT",
      "cardDiscount": null,
      "cardInterestFree": null,
      "cardPoint": null,
      "bankDiscount": {
        "bankCode": "92",
        "currency": "KRW",
        "discountAmount": 600,
        "balance": 1000000,
        "discountCode": "12861",
        "dueDate": "2022-07-30",
        "minimumPaymentAmount": 2000,
        "maximumPaymentAmount": 99999999
      }
    }
  ]
}
링크 복사결제
링크 복사결제 승인
POST
/v1/brandpay/payments/confirm
paymentKey에 해당하는 결제를 인증하고 승인합니다. Basic 인증 방식을 사용합니다.

링크 복사Request Body 파라미터
paymentKey 필수 · string
결제의 키값입니다. 최대 길이는 200자입니다. 결제를 식별하는 역할로, 중복되지 않는 고유한 값입니다.

amount 필수 · integer
결제할 금액입니다.

customerKey 필수 · string
구매자 ID입니다. 다른 사용자가 이 값을 알게 되면 악의적으로 사용될 수 있습니다. 자동 증가하는 숫자 또는 이메일・전화번호・사용자 아이디와 같이 유추가 가능한 값은 안전하지 않습니다. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 를 최소 1개 이상 포함한 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

* customerKey는 클라이언트 키와 다릅니다. 클라이언트 키는 연동을 위한 기본 키로 브라우저에서 SDK를 연동할 때 '클라이언트'를 식별하며, 토스페이먼츠에서 제공합니다.

orderId 필수 · string
주문번호입니다. 주문한 결제를 식별합니다. 충분히 무작위한 값을 생성해서 각 주문마다 고유한 값을 넣어주세요. 영문 대소문자, 숫자, 특수문자 -, _로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다.

링크 복사Response
성공
결제 승인에 성공했다면 Payment 객체가 돌아옵니다.

실패
결제 승인에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

결제 승인 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/payments/confirm \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg==' \
  --header 'Content-Type: application/json' \
  --data '{"paymentKey":"5EnNZRJGvaBX7zk2yd8ydw26XvwXkLrx9POLqKQjmAw4b0e1","amount":"10000","customerKey":"c6thB674j9vCU4XsvcPk","orderId":"a4CWyWY5m89PNh7xJwhk1"}'
응답
{
  "mId": "tosspayments",
  "version": "2024-06-01",
  "paymentKey": "lOR1ZwdkQD5GePWvyJnrK1jPbp0qR3gLzN97EoqYA60XKx4a",
  "status": "DONE",
  "transactionKey": "AD441DDE040217780E2F7BFAAEF74566",
  "lastTransactionKey": "AD441DDE040217780E2F7BFAAEF74566",
  "orderId": "eQ2W9gCBN7Xu4l2vEUUC1",
  "orderName": "토스 티셔츠 외 2건",
  "requestedAt": "2022-06-07T17:20:48+09:00",
  "approvedAt": "2022-06-07T17:21:21+09:00",
  "useEscrow": false,
  "cultureExpense": false,
  "card": {
    "issuerCode": "61",
    "acquirerCode": "31",
    "number": "43301234****123*",
    "installmentPlanMonths": 0,
    "isInterestFree": false,
    "interestPayer": null,
    "approveNo": "00000000",
    "useCardPoint": false,
    "cardType": "신용",
    "ownerType": "개인",
    "acquireStatus": "READY",
    "amount": 10000
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
    "url": "https://dashboard.tosspayments.com/sales-slip?transactionId=OX1cpNJJCl0tRRIBUqVS11Lx7er33DzBXIg68Xpie%2B%2BoG3%2Fr8DtjBp0gmBV&ref=PX"
  },
  "currency": "KRW",
  "totalAmount": 10000,
  "balanceAmount": 10000,
  "suppliedAmount": 9091,
  "vat": 909,
  "taxFreeAmount": 0,
  "metadata": null,
  "method": "카드"
}
링크 복사자동결제 실행
POST
/v1/brandpay/payments
등록된 결제수단 중 methodKey에 해당하는 결제수단으로 상점에서 원하는 시점에 자동결제를 실행합니다. Basic 인증 방식을 사용합니다.

브랜드페이 자동결제는 리스크 검토 및 추가 계약 후 사용할 수 있습니다.


링크 복사Request Body 파라미터
customerKey 필수 · string
구매자 ID입니다. 빌링키와 연결됩니다. 다른 사용자가 이 값을 알게 되면 악의적으로 사용될 수 있습니다. 자동 증가하는 숫자 또는 이메일・전화번호・사용자 아이디와 같이 유추가 가능한 값은 안전하지 않습니다. UUID와 같이 충분히 무작위적인 고유 값으로 생성해주세요. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 를 최소 1개 이상 포함한 최소 2자 이상 최대 50자 이하의 문자열이어야 합니다.

* customerKey는 클라이언트 키와 다릅니다. 클라이언트 키는 연동을 위한 기본 키로 브라우저에서 SDK를 연동할 때 '클라이언트'를 식별하며, 토스페이먼츠에서 제공합니다.

methodKey 필수 · string
결제수단을 특정하는 키입니다.

브랜드페이 구매자가 탈퇴하면 methodKey도 더 이상 사용할 수 없습니다. CUSTOMER_STATUS_CHANGED 웹훅으로 탈퇴한 구매자를 확인하세요.

amount 필수 · integer
결제할 금액입니다.

orderId 필수 · string
주문번호입니다. 주문을 구분하는 ID입니다. 충분히 무작위한 값을 생성해서 각 주문마다 고유한 값을 넣어주세요. 영문 대소문자, 숫자, 특수문자 -, _, =로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다.

orderName 필수 · string
구매상품입니다. 예를 들면 생수 외 1건 같은 형식입니다. 최소 1글자 이상 100글자 이하여야 합니다.

cardInstallmentPlan integer
신용 카드의 할부 개월 수입니다. 값을 넣으면 해당 할부 개월 수로 결제가 진행됩니다. 2부터 12사이의 값을 사용할 수 있고, 0이 들어가면 할부가 아닌 일시불로 결제됩니다. 결제 금액이 5만원 이상일 때만 할부가 적용됩니다.

cultureExpense 필수 · boolean
문화비(도서, 공연 티켓, 박물관·미술관 입장권 등) 지출 여부입니다. 결제수단이 계좌일 때만 설정하세요.

* 카드 결제는 항상 false로 돌아옵니다. 카드 결제 문화비는 카드사에 문화비 소득공제 전용 가맹점번호를 설정하면 자동으로 처리됩니다.

customerEmail object
구매자의 이메일 주소입니다. 결제 상태가 바뀌면 이메일 주소로 결제내역이 전송됩니다.

discountCode string
즉시 할인 코드(카드사 고유 번호)로 결제할 때 함께 넘겨야 하는 값입니다.

taxFreeAmount 필수 · integer
전체 결제 금액 중 면세 금액입니다. 값이 0으로 돌아왔다면 전체 결제 금액이 과세 대상입니다.

* 일반 상점일 때는 모든 결제 금액이 과세에 해당하기 때문에 0이 돌아옵니다. 면세 상점, 복합 과세 상점일 때만 면세 금액이 돌아옵니다. 더 자세한 내용은 세금 처리하기에서 살펴보세요.

useCardPoint boolean
카드로 결제할 때 설정하는 카드사 포인트 사용 여부입니다. 값을 주지 않거나 값이 false라면 사용자가 카드사 포인트 사용 여부를 결정할 수 있습니다. 이 값을 true로 주면 카드사 포인트 사용이 체크된 상태로 결제창이 열립니다.

* 추가 계약 후 사용할 수 있습니다. 토스페이먼츠 고객센터(1544-7772, support@tosspayments.com)로 문의해주세요.

링크 복사Response
성공
자동결제 실행에 성공했다면 Payment 객체가 돌아옵니다.

실패
자동결제 실행에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

자동결제 실행 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/payments \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg==' \
  --header 'Content-Type: application/json' \
  --data '{"customerKey":"c6thB674j9vCU4XsvcPk","methodKey":"pa90ZoyegEOALnQvDd2VJ5vKkpRyN3Mj7X41mNW5kzKbwG6J","amount":"10000","orderId":"eQ2W9gCBN7Xu4l2vEUUC1","orderName":"토스 티셔츠 외 2건"}'
응답
{
  "mId": "tosspayments",
  "version": "2024-06-01",
  "paymentKey": "lOR1ZwdkQD5GePWvyJnrK1jPbp0qR3gLzN97EoqYA60XKx4a",
  "status": "DONE",
  "transactionKey": "AD441DDE040217780E2F7BFAAEF74566",
  "lastTransactionKey": "AD441DDE040217780E2F7BFAAEF74566",
  "orderId": "eQ2W9gCBN7Xu4l2vEUUC1",
  "orderName": "토스 티셔츠 외 2건",
  "requestedAt": "2022-06-07T17:20:48+09:00",
  "approvedAt": "2022-06-07T17:21:21+09:00",
  "useEscrow": false,
  "cultureExpense": false,
  "card": {
    "issuerCode": "61",
    "acquirerCode": "31",
    "number": "43301234****123*",
    "installmentPlanMonths": 0,
    "isInterestFree": false,
    "interestPayer": null,
    "approveNo": "00000000",
    "useCardPoint": false,
    "cardType": "신용",
    "ownerType": "개인",
    "acquireStatus": "READY",
    "amount": 10000
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
    "url": "https://dashboard.tosspayments.com/sales-slip?transactionId=OX1cpNJJCl0tRRIBUqVS11Lx7er33DzBXIg68Xpie%2B%2BoG3%2Fr8DtjBp0gmBV&ref=PX"
  },
  "currency": "KRW",
  "totalAmount": 10000,
  "balanceAmount": 10000,
  "suppliedAmount": 9091,
  "vat": 909,
  "taxFreeAmount": 0,
  "metadata": null,
  "method": "카드"
}
링크 복사결제 취소
결제 취소 API를 사용하세요.

링크 복사회원 관리
링크 복사회원 탈퇴 처리
POST
/v1/brandpay/customers/remove
회원 탈퇴 즉시 전체 결제수단이 삭제됩니다. Bearer 인증 방식을 사용하기 때문에 특정 고객의 정보를 불러오는 Access Token으로 탈퇴시킬 회원을 특정할 수 있습니다.

링크 복사Response
성공
회원 탈퇴 처리에 성공했다면 삭제된 회원의 고유 ID인 customerKey와 탈퇴 성공 여부를 나타내는 success가 돌아옵니다.

실패
회원 탈퇴 처리에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

회원 탈퇴 처리 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request POST \
  --url https://api.tosspayments.com/v1/brandpay/customers/remove \
  --header 'Authorization: Bearer Xy0E4Dv5qpMGjLJoQ1aVZ5449xB1P3w6KYe2RNgOWznZb7Bm'
응답
{
  "customerKey": "c6thB674j9vCU4XsvcPk",
  "success": true
}
링크 복사프로모션
브랜드페이에서 제공하는 카드·계좌 프로모션 정보를 조회하는 API입니다. 즉시 할인, 무이자 등 다양한 프로모션을 고객에게 제공할 수 있습니다.

링크 복사BrandPayCardPromotion 객체
브랜드페이 카드 프로모션 정보를 담고 있는 객체입니다.

링크 복사객체 상세
discountCards array
카드사의 즉시 할인 정보입니다.

companyCode string
카드 매입사 두 자리 코드입니다. 카드사 코드를 참고하세요. acquirerCode와 같은 값입니다.

discountAmount number
할인 금액입니다.

balance number
남은 프로모션 예산입니다. 값이 '0'이면 즉시 할인을 적용할 수 없습니다.

discountCode string
즉시 할인 코드(카드사 고유 번호)로 결제할 때 함께 넘겨야 하는 값입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-MM-dd 형식입니다. 종료일의 23:59:59까지 행사가 유효합니다.

minimumPaymentAmount number
즉시 할인을 적용할 수 있는 최소 결제 금액입니다.

maximumPaymentAmount number
즉시 할인을 적용할 수 있는 최대 결제 금액입니다.

interestFreeCards array
카드사의 무이자 할부 정보입니다.

companyCode string
카드사 두 자리 코드입니다. 카드사 코드를 참고하세요.

dueDate string
프로모션을 마치는 시점입니다. yyyy-MM-dd 형식입니다. 종료일의 23:59:59까지 행사가 유효합니다.

installmentFreeMonths array
무이자 할부를 적용할 수 있는 개월 수입니다.

minimumPaymentAmount number
무이자 할부를 적용할 수 있는 최소 결제 금액입니다.

pointCards array
카드 포인트 정보입니다.

companyCode string
카드사 두 자리 코드입니다. 카드사 코드를 참고하세요.

minimumPaymentAmount integer
카드 포인트를 적용할 수 있는 최소 결제 금액입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-mm-dd 형태입니다. 종료일의 23:59:59까지 행사가 유효합니다.

링크 복사BrandPayBankPromotion 객체
브랜드페이 계좌 프로모션 정보를 담고 있는 객체입니다.

링크 복사객체 상세
discountBanks array
은행의 즉시 할인 정보입니다.

bankCode string
은행의 두 자리 코드입니다. 은행 코드를 참고하세요.

discountAmount number
할인 금액입니다.

balance number
남은 프로모션 예산입니다. 값이 0이면 즉시 할인을 적용할 수 없습니다.

discountCode string
계좌 즉시 할인 코드입니다. 할인을 적용하려면 결제할 때 함께 넘겨야 하는 값입니다.

dueDate string
프로모션을 마치는 시점입니다. yyyy-MM-dd 형식입니다. 종료일의 23:59:59까지 행사가 유효합니다.

minimumPaymentAmount number
즉시 할인을 적용할 수 있는 최소 결제 금액입니다.

maximumPaymentAmount number
즉시 할인을 적용할 수 있는 최대 결제 금액입니다.

링크 복사전체 프로모션 조회
전체 프로모션 조회 API를 사용합니다.

링크 복사카드 프로모션 조회
GET
/v1/brandpay/promotions/card
카드사별 프로모션을 조회합니다. 즉시 할인, 무이자, 카드 포인트 정보가 내려갑니다. Basic 인증 방식을 사용합니다.

링크 복사Response
성공
카드 프로모션 조회에 성공했다면 BrandpayCardPromotions 객체가 돌아옵니다.

실패
카드 프로모션 조회에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

카드 프로모션 조회 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request GET \
  --url https://api.tosspayments.com/v1/brandpay/promotions/card \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg=='
응답
{
  "discountCards": [
    {
      "companyCode": "71",
      "discountAmount": 500,
      "balance": 1000000,
      "discountCode": "12860",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 1000,
      "maximumPaymentAmount": 99999999
    },
    {
      "companyCode": "31",
      "discountAmount": 600,
      "discountCode": "12861",
      "balance": 1000000,
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 2000,
      "maximumPaymentAmount": 99999999
    },
    {
      "companyCode": "51",
      "discountCode": "12862",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 5000,
      "maximumPaymentAmount": 500000,
      "balance": 1000000,
      "discountAmount": 1000
    },
    {
      "companyCode": "61",
      "discountAmount": 5000,
      "discountCode": "12863",
      "balance": 1000000,
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 10000,
      "maximumPaymentAmount": 888888888
    }
  ],
  "interestFreeCards": [
    {
      "companyCode": "11",
      "dueDate": "2022-06-30",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "31",
      "dueDate": "2022-12-31",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "35",
      "dueDate": "2022-07-31",
      "installmentFreeMonths": [2, 3, 4, 5],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "41",
      "dueDate": "2022-06-30",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "46",
      "dueDate": "2022-12-31",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "71",
      "dueDate": "2022-06-30",
      "installmentFreeMonths": [2, 3, 4],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "21",
      "dueDate": "2022-04-30",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7, 8],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "91",
      "dueDate": "2022-04-30",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7, 8],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "61",
      "dueDate": "2022-04-30",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7],
      "minimumPaymentAmount": 10000
    },
    {
      "companyCode": "51",
      "dueDate": "2022-04-30",
      "installmentFreeMonths": [2, 3, 4, 5, 6],
      "minimumPaymentAmount": 50000
    },
    {
      "companyCode": "33",
      "dueDate": "2022-12-31",
      "installmentFreeMonths": [2, 3, 4, 5, 6, 7],
      "minimumPaymentAmount": 50000
    }
  ],
  "pointCards": [
    {
      "companyCode": "33",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 1000
    },
    {
      "companyCode": "91",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 2000
    },
    {
      "companyCode": "51",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 3000
    },
    {
      "companyCode": "61",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 4000
    },
    {
      "companyCode": "71",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 5000
    }
  ]
}
링크 복사계좌 프로모션 조회
GET
/v1/brandpay/promotions/bank
은행별 혜택을 조회합니다. 즉시 할인 정보가 내려갑니다. Basic 인증 방식을 사용합니다.

링크 복사Response
성공
계좌 프로모션 조회에 성공했다면 BrandpayBankPromotions 객체가 돌아옵니다.

실패
계좌 프로모션 조회에 실패했다면 HTTP 상태 코드와 함께 에러 객체가 돌아옵니다.

계좌 프로모션 조회 API에서 발생할 수 있는 에러를 살펴보세요.

요청

Backend
cURL

curl --request GET \
  --url https://api.tosspayments.com/v1/brandpay/promotions/bank \
  --header 'Authorization: Basic dGVzdF9za195WnFta0tlUDhnSlhQeHprelFQeHJiUVJ4QjlsOg=='
응답
{
  "discountBanks": [
    {
      "bankCode": "20",
      "currency": "KRW",
      "discountAmount": 500,
      "balance": 1000000,
      "discountCode": "12860",
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 1000,
      "maximumPaymentAmount": 99999999
    },
    {
      "bankCode": "92",
      "currency": "KRW",
      "discountAmount": 600,
      "discountCode": "12861",
      "balance": 1000000,
      "dueDate": "2022-04-30",
      "minimumPaymentAmount": 2000,
      "maximumPaymentAmount": 99999999
    }
  ]
}