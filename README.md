# 🛍️ 겟꿀쇼핑 - 대한민국 대표 온라인 쇼핑몰

![겟꿀쇼핑 플랫폼](./public/thumbnail.png)

**Next.js 15**, **TypeScript**, **Neon PostgreSQL**, **NextAuth.js**로 구축된 현대적인 풀스택 한국형 이커머스 플랫폼입니다. 포괄적인 관리자 대시보드, 역할 기반 인증, 반응형 디자인을 특징으로 합니다.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-38B2AC?logo=tailwind-css)
![NextAuth](https://img.shields.io/badge/NextAuth.js-5.0.0-green?logo=auth0)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?logo=prisma)

## 🚀 빠른 시작

**겟꿀쇼핑**을 몇 분 안에 실행하세요:

```bash
# 1. 저장소 클론
git clone https://github.com/jgdglobal001/getkkul-shopping-main.git
cd getkkul-shopping-main

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정 (아래 설정 가이드 참조)
cp .env.example .env
# 인증 정보 입력

# 4. 개발 서버 시작
npm run dev

# 5. 브라우저에서 확인
# 접속: http://localhost:3002
```

## 🌟 라이브 데모

- **프론트엔드**: [겟꿀쇼핑 데모](https://getkkul-shopping.vercel.app) _(배포 후 이용 가능)_
- **관리자 대시보드**: 설정 완료 후 이용 가능

## ✨ 주요 기능

### 🛒 **이커머스 핵심 기능**

- **상품 카탈로그**: 카테고리별 상품 탐색, 검색 및 필터링
- **장바구니**: 상품 추가/제거, 수량 관리, 지속적인 장바구니 유지
- **결제 프로세스**: TossPayments 위젯을 통한 안전한 결제 연동
- **주문 관리**: 주문 추적, 주문 내역, 상태 업데이트
- **찜하기/즐겨찾기**: 나중에 구매할 상품 저장
- **사용자 프로필**: 개인정보, 주소, 환경설정 관리

### 🔐 **인증 및 권한 관리**

- **다중 제공업체 인증**: 카카오, 네이버, 구글 소셜 로그인 via NextAuth.js
- **역할 기반 접근 제어 (RBAC)**:
  - **사용자**: 표준 쇼핑 경험
  - **관리자**: 전체 시스템 접근 및 관리
  - **회계담당자**: 재무 데이터 접근
  - **배송담당자**: 주문 처리 및 배송 관리
  - **포장담당자**: 창고 및 포장 작업
- **세션 관리**: 자동 동기화를 통한 안전한 세션 처리
- **프로필 관리**: 프로필 편집, 아바타 업로드, 비밀번호 변경

### 📊 **관리자 대시보드**

- **분석 및 인사이트**: 매출 추적, 사용자 분석, 판매 차트
- **사용자 관리**: 사용자 조회, 편집, 삭제 및 대량 작업
- **주문 관리**: 주문 처리, 상태 업데이트, 대량 작업
- **상품 관리**: 상품 및 카테고리 추가, 편집, 삭제
- **역할 할당**: 사용자 역할 할당 및 관리
- **시스템 통계**: 주요 지표를 포함한 실시간 대시보드

### 🎨 **디자인 및 사용자 경험**

- **반응형 디자인**: 모바일 우선 접근법, 모든 기기에서 작동
- **현대적인 UI**: 부드러운 애니메이션을 포함한 깔끔하고 전문적인 디자인
- **다크/라이트 모드**: 테마 전환 기능
- **다중 통화**: 환율 변환을 지원하는 다양한 통화 지원
- **한국어 완전 지원**: 완전한 한국어 국제화
- **로딩 상태**: 스켈레톤 로더 및 부드러운 전환
- **토스트 알림**: 사용자 작업에 대한 실시간 피드백

### 🛠️ **기술적 특징**

- **서버 사이드 렌더링 (SSR)**: 빠른 초기 페이지 로드
- **정적 사이트 생성 (SSG)**: 정적 콘텐츠에 대한 최적화된 성능
- **API 라우트**: 모든 작업을 위한 RESTful API 엔드포인트
- **데이터베이스**: 실시간 데이터를 위한 Neon PostgreSQL
- **파일 저장소**: 이미지 및 파일을 위한 클라우드 스토리지
- **상태 관리**: 지속성을 가진 Redux Toolkit
- **폼 처리**: 고급 폼 검증 및 오류 처리
- **SEO 최적화**: 메타 태그, 사이트맵 생성, 구조화된 데이터
- **성능**: 코드 분할, 지연 로딩, 최적화

### 📱 **페이지 및 라우트**

#### **공개 페이지**

- **홈**: 추천 상품, 카테고리, 프로모션 배너
- **상품**: 검색, 필터, 페이지네이션이 포함된 상품 목록
- **상품 상세**: 이미지와 사양이 포함된 상세 상품 보기
- **카테고리**: 카테고리별 상품 탐색
- **회사 소개**: 회사 정보 및 미션
- **연락처**: 연락처 양식 및 회사 세부 정보
- **자주 묻는 질문**: 검색 기능이 있는 FAQ
- **문의하기**: 고객 문의 양식

#### **사용자 페이지**

- **계정 대시보드**: 개인 개요 및 빠른 작업
- **프로필**: 개인정보 편집 및 아바타 업로드
- **주문**: 주문 내역 및 추적
- **주문 상세**: 상세 주문 정보
- **주소**: 배송 및 청구 주소 관리
- **설정**: 계정 환경설정 및 알림
- **장바구니**: 장바구니 관리
- **결제**: 안전한 결제 프로세스
- **찜하기**: 저장된 상품 및 위시리스트

#### **관리자 페이지**

- **관리자 대시보드**: 시스템 개요 및 분석
- **사용자 관리**: 포괄적인 사용자 관리
- **주문 관리**: 주문 처리 및 이행
- **분석**: 상세한 비즈니스 인사이트 및 보고서

#### **역할별 대시보드**

- **회계담당자 대시보드**: 재무 보고서 및 매출 추적
- **배송담당자 대시보드**: 주문 배송 및 물류
- **포장담당자 대시보드**: 창고 및 포장 작업
- **사용자 대시보드**: 표준 사용자 경험

## 🏗️ **기술 스택**

### **프론트엔드**

- **Next.js 15.4.6** - App Router를 포함한 React 프레임워크
- **TypeScript** - 타입 안전 개발
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Framer Motion** - 부드러운 애니메이션 및 전환
- **React Icons** - 포괄적인 아이콘 라이브러리
- **React Hot Toast** - 아름다운 알림

### **백엔드 및 인증**

- **NextAuth.js 5.0** - 완전한 인증 솔루션
- **Neon PostgreSQL** - 클라우드 PostgreSQL 데이터베이스
- **Prisma ORM** - 타입 안전 데이터베이스 ORM
- **카카오 OAuth** - 카카오 소셜 로그인
- **네이버 OAuth** - 네이버 소셜 로그인
- **구글 OAuth** - 구글 소셜 로그인
- **bcryptjs** - 비밀번호 해싱

### **상태 관리**

- **Redux Toolkit** - 예측 가능한 상태 관리
- **Redux Persist** - 세션 간 상태 지속성
- **React Redux** - Redux를 위한 React 바인딩

### **개발 및 빌드 도구**

- **ESLint** - 코드 린팅 및 품질
- **TypeScript** - 정적 타입 검사
- **PostCSS** - CSS 처리
- **Next Sitemap** - 자동 사이트맵 생성
- **i18next** - 국제화 및 다국어 지원

## 📁 **프로젝트 구조**

```
getkkul-shopping/
├── src/
│   ├── app/                           # Next.js 15 App Router
│   │   ├── (public)/                 # 공개 라우트 (인증 불필요)
│   │   │   ├── about/                # 회사 소개 페이지
│   │   │   ├── contact/              # 연락처 페이지
│   │   │   ├── faqs/                 # FAQ 페이지
│   │   │   └── inquiry/              # 고객 문의
│   │   ├── (user)/                   # 보호된 사용자 라우트
│   │   │   ├── account/              # 사용자 계정 관리
│   │   │   │   ├── admin/            # 관리자 대시보드
│   │   │   │   │   ├── products/     # 상품 관리
│   │   │   │   │   ├── users/        # 사용자 관리
│   │   │   │   │   ├── orders/       # 주문 관리
│   │   │   │   │   └── analytics/    # 분석 대시보드
│   │   │   │   ├── addresses/        # 주소 관리
│   │   │   │   ├── notifications/    # 사용자 알림
│   │   │   │   ├── orders/           # 주문 내역
│   │   │   │   ├── payment/          # 결제 수단
│   │   │   │   ├── profile/          # 사용자 프로필
│   │   │   │   └── settings/         # 계정 설정
│   │   │   ├── cart/                 # 장바구니
│   │   │   ├── categories/           # 상품 카테고리
│   │   │   ├── checkout/             # 결제 프로세스
│   │   │   ├── favorite/             # 찜하기/즐겨찾기
│   │   │   ├── offers/               # 특별 할인
│   │   │   └── products/             # 상품 페이지
│   │   ├── api/                      # API 라우트
│   │   │   ├── admin/                # 관리자 API 엔드포인트
│   │   │   ├── auth/                 # 인증 API
│   │   │   ├── orders/               # 주문 API
│   │   │   └── user/                 # 사용자 API
│   │   ├── auth/                     # 인증 페이지
│   │   │   ├── signin/               # 로그인
│   │   │   ├── register/             # 회원가입
│   │   │   └── error/                # 인증 오류
│   │   ├── dashboard/                # 역할별 대시보드
│   │   ├── delivery/                 # 공개 배송 정보
│   │   ├── delivery-dashboard/       # 배송담당자 대시보드
│   │   ├── packer-dashboard/         # 포장담당자 대시보드
│   │   ├── unauthorized/             # 권한 없음 페이지
│   │   ├── user-dashboard/           # 사용자 대시보드
│   │   ├── globals.css               # 전역 스타일
│   │   └── layout.tsx                # 루트 레이아웃
│   ├── components/                   # 재사용 가능한 React 컴포넌트
│   │   ├── account/                  # 계정 관련 컴포넌트
│   │   ├── admin/                    # 관리자 대시보드 컴포넌트
│   │   ├── auth/                     # 인증 컴포넌트
│   │   ├── cart/                     # 장바구니 컴포넌트
│   │   ├── dashboard/                # 대시보드 컴포넌트
│   │   ├── header/                   # 헤더 및 네비게이션
│   │   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── notifications/            # 알림 컴포넌트
│   │   ├── pages/                    # 페이지별 컴포넌트
│   │   ├── products/                 # 상품 관련 컴포넌트
│   │   ├── ui/                       # UI 컴포넌트 (버튼, 카드 등)
│   │   └── [기타 컴포넌트]            # 핵심 앱 컴포넌트
│   ├── assets/                       # 정적 자산 (이미지, 폰트)
│   ├── contexts/                     # React Context 제공자
│   ├── hooks/                        # 커스텀 React 훅
│   ├── lib/                          # 유틸리티 라이브러리
│   │   ├── auth/                     # 인증 유틸리티
│   │   ├── prisma/                   # Prisma 설정
│   │   ├── i18n.ts                   # 국제화 설정
│   │   └── rbac/                     # 역할 기반 접근 제어
│   ├── locales/                      # 다국어 리소스
│   │   ├── ko.json                   # 한국어 번역
│   │   └── ko-extended.json          # 확장 한국어 번역
│   ├── redux/                        # Redux 상태 관리
│   ├── types/                        # TypeScript 타입 정의
│   └── constants/                    # 애플리케이션 상수
├── prisma/                           # Prisma 스키마 및 마이그레이션
│   ├── schema.prisma                 # 데이터베이스 스키마
│   └── migrations/                   # 데이터베이스 마이그레이션
├── public/                           # 정적 공개 자산
│   ├── getkkul-logo-fabicon.png      # 파비콘
│   ├── getkkul-logo-left-right.png   # 메인 로고
│   ├── getkkul-logo-Up-down.png      # 스피닝 로고
│   ├── robots.txt                    # SEO 로봇 파일
│   └── [기타 자산]                   # 이미지, 아이콘 등
├── middleware.ts                     # 라우트 보호 미들웨어
├── auth.ts                          # NextAuth 설정
├── config.ts                        # 앱 설정
├── prisma.config.ts                 # Prisma 클라이언트 설정
├── type.ts                          # 전역 타입 정의
├── next.config.mjs                  # Next.js 설정
├── tailwind.config.ts               # Tailwind CSS 설정
├── tsconfig.json                    # TypeScript 설정
└── package.json                     # 의존성 및 스크립트
```

## 🚀 **완전한 설정 가이드**

### **사전 요구사항**

시작하기 전에 다음이 필요합니다:

- **Node.js 18+** 및 **npm** 설치
- 저장소 클론을 위한 **Git**
- **Neon PostgreSQL** 계정 (무료 티어 이용 가능)
- **Google Cloud Console** 계정 (OAuth용)
- **카카오 개발자** 계정 (카카오 로그인용)
- **네이버 개발자** 계정 (네이버 로그인용)

### **단계별 설치**

#### 1. **저장소 클론**

```bash
git clone https://github.com/jgdglobal001/getkkul-shopping-main.git
cd getkkul-shopping-main
```

#### 2. **의존성 설치**

```bash
npm install
```

#### 3. **환경 설정**

루트 디렉토리에 `.env` 파일을 생성하세요:

```bash
touch .env
```

다음 환경 변수를 추가하세요 (아래 상세 설정 참조):

```env
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-here

# 구글 OAuth (필수)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# 카카오 OAuth (필수)
AUTH_KAKAO_CLIENT_ID=your-kakao-client-id
AUTH_KAKAO_CLIENT_SECRET=your-kakao-client-secret

# 네이버 OAuth (필수)
AUTH_NAVER_CLIENT_ID=your-naver-client-id
AUTH_NAVER_CLIENT_SECRET=your-naver-client-secret

# Neon PostgreSQL 데이터베이스
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"

# TossPayments 설정 (선택사항)
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-client-key
TOSS_SECRET_KEY=your-toss-secret-key
```

#### 4. **데이터베이스 설정**

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev

# Prisma 클라이언트 생성
npx prisma generate
```

#### 5. **개발 서버 시작**

```bash
npm run dev
```

#### 6. **브라우저에서 확인**

[http://localhost:3002](http://localhost:3002)로 이동하세요

---

## 🔑 **환경 변수 인증 정보 설정**

### **� Neon PostgreSQL 설정 (필수)**

#### **1단계: Neon 계정 생성**

1. [Neon Console](https://console.neon.tech/)로 이동
2. **"Sign up"** 클릭하여 계정 생성
3. GitHub 또는 Google 계정으로 로그인
4. 무료 플랜 선택

#### **2단계: 새 프로젝트 생성**

1. Neon 대시보드에서 **"Create Project"** 클릭
2. 프로젝트 이름 입력 (예: `getkkul-shopping`)
3. 지역 선택 (아시아-태평양 권장)
4. PostgreSQL 버전 선택 (최신 버전 권장)
5. **"Create Project"** 클릭

#### **3단계: 연결 문자열 가져오기**

1. 프로젝트 대시보드에서 **"Connection Details"** 확인
2. **"Connection string"** 복사
3. `.env` 파일에 다음과 같이 추가:

```env
# Neon PostgreSQL 연결 문자열
DATABASE_URL="postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

#### **4단계: 데이터베이스 초기화**

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev --name init

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 시드 (선택사항)
npx prisma db seed
```

### **🔐 구글 OAuth 설정 (필수)**

#### **1단계: Google Cloud Console**

1. [Google Cloud Console](https://console.cloud.google.com/)로 이동
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트가 활성화되었는지 확인

#### **2단계: OAuth 동의 화면 구성**

1. **"API 및 서비스"** → **"OAuth 동의 화면"**으로 이동
2. **"외부"** 선택 → **"만들기"** 클릭
3. 필수 필드 입력:
   - 앱 이름: `겟꿀쇼핑`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처: 본인 이메일
4. 모든 단계에서 **"저장 후 계속"** 클릭

#### **3단계: OAuth 인증 정보 생성**

1. **"API 및 서비스"** → **"사용자 인증 정보"**로 이동
2. **"+ 사용자 인증 정보 만들기"** → **"OAuth 2.0 클라이언트 ID"** 클릭
3. 애플리케이션 유형: **"웹 애플리케이션"**
4. 이름: `겟꿀쇼핑 웹 클라이언트`
5. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3002/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
6. **"만들기"** 클릭
7. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사:
   - 클라이언트 ID → `AUTH_GOOGLE_ID`
   - 클라이언트 보안 비밀 → `AUTH_GOOGLE_SECRET`

### **� 카카오 OAuth 설정 (필수)**

#### **1단계: 카카오 개발자 계정 생성**

1. [카카오 개발자](https://developers.kakao.com/)로 이동
2. 카카오 계정으로 로그인
3. **"내 애플리케이션"** → **"애플리케이션 추가하기"** 클릭

#### **2단계: 애플리케이션 설정**

1. 앱 이름: `겟꿀쇼핑`
2. 사업자명: 본인 이름 또는 회사명
3. **"저장"** 클릭
4. 생성된 앱의 **"앱 키"**에서 **REST API 키** 복사 → `AUTH_KAKAO_CLIENT_ID`

#### **3단계: 플랫폼 설정**

1. **"플랫폼"** → **"Web 플랫폼 등록"** 클릭
2. 사이트 도메인: `http://localhost:3002`, `https://yourdomain.com`
3. **"저장"** 클릭

#### **4단계: 카카오 로그인 활성화**

1. **"카카오 로그인"** → **"활성화 설정"** ON
2. **"Redirect URI"** 등록:
   ```
   http://localhost:3002/api/auth/callback/kakao
   https://yourdomain.com/api/auth/callback/kakao
   ```
3. **"보안"** → **"Client Secret"** 생성 → `AUTH_KAKAO_CLIENT_SECRET`

### **🟢 네이버 OAuth 설정 (필수)**

#### **1단계: 네이버 개발자센터**

1. [네이버 개발자센터](https://developers.naver.com/)로 이동
2. 네이버 계정으로 로그인
3. **"Application"** → **"애플리케이션 등록"** 클릭

#### **2단계: 애플리케이션 정보 입력**

1. 애플리케이션 이름: `겟꿀쇼핑`
2. 사용 API: **"네이버 로그인"** 선택
3. 제공 정보: **"이메일 주소"**, **"닉네임"**, **"프로필 사진"** 선택
4. 서비스 URL: `http://localhost:3002`
5. **Callback URL**:
   ```
   http://localhost:3002/api/auth/callback/naver
   https://yourdomain.com/api/auth/callback/naver
   ```

#### **3단계: 인증 정보 복사**

1. **"Client ID"** 복사 → `AUTH_NAVER_CLIENT_ID`
2. **"Client Secret"** 복사 → `AUTH_NAVER_CLIENT_SECRET`

### **🔒 NextAuth 시크릿 생성**

세션 암호화를 위한 안전한 시크릿을 생성하세요:

```bash
# Node.js 사용
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 또는 OpenSSL 사용
openssl rand -base64 32
```

생성된 문자열을 `NEXTAUTH_SECRET`에 복사하세요

### **✅ 설정 확인**

모든 환경 변수를 추가한 후:

1. 개발 서버를 다시 시작하세요:

   ```bash
   npm run dev
   ```

2. 인증 테스트:
   - `http://localhost:3002` 방문
   - "로그인" 클릭
   - 카카오, 네이버, 구글 OAuth 로그인 시도
   - Neon 데이터베이스에서 사용자 데이터 확인

---

## 📋 **사용 가능한 스크립트**

```bash
# 개발
npm run dev          # http://localhost:3002에서 개발 서버 시작
npm run build        # 최적화된 프로덕션 번들 빌드
npm run start        # 프로덕션 서버 시작 (빌드 후)
npm run lint         # 코드 품질을 위한 ESLint 실행
npm run type-check   # TypeScript 타입 검사 실행

# 데이터베이스
npx prisma studio    # Prisma Studio로 데이터베이스 관리
npx prisma migrate   # 데이터베이스 마이그레이션 실행
npx prisma generate  # Prisma 클라이언트 생성

# 유틸리티
npm run postbuild    # 빌드 후 사이트맵 생성
npm run deploy:check # 배포 검사 실행
```

### **개발 워크플로우**

1. **개발 시작**: `npm run dev`
2. **코드 품질 검사**: `npm run lint`
3. **타입 안전성**: `npm run type-check`
4. **프로덕션 빌드**: `npm run build`
5. **프로덕션 테스트**: `npm run start`

## 👑 **관리자 접근 설정**

### **방법 1: 이메일 기반 관리자 (권장)**

인증 로직에서 관리자 이메일을 설정하세요:

1. **관리자 이메일로 회원가입**
2. **`AccountLayout.tsx` 확인** - 다음에게 관리자 접근 권한 부여:
   - `admin@getkkul.com`
   - `role: "admin"`을 가진 사용자

### **방법 2: 역할 기반 관리자**

1. **새 계정 등록**
2. **Neon 데이터베이스** → Prisma Studio로 이동
3. **`users` 테이블에서 사용자 문서** 찾기
4. **필드 추가**: `role: "admin"`
5. **저장 후 애플리케이션 새로고침**

### **관리자 기능**

- **📊 완전한 대시보드**: 실시간 분석 및 통계
- **👥 사용자 관리**: 사용자 조회, 편집, 삭제
- **� 주문 관리**: 주문 처리 및 상태 업데이트
- **�️ 상품 관리**: 상품 추가, 편집, 삭제
- **📈 분석**: 상세한 비즈니스 인사이트

**관리자 URL**: `http://localhost:3002/account/admin`

## 🌟 **주요 기능 하이라이트**

### **고급 인증**

- 다중 OAuth 제공업체 (카카오, 네이버, 구글)
- 역할 기반 대시보드 라우팅
- 세션 동기화
- 안전한 미들웨어 보호

### **포괄적인 관리자 패널**

- 실시간 분석
- 사용자 및 주문에 대한 대량 작업
- 고급 필터링 및 검색
- 내보내기 기능

### **향상된 사용자 경험**

- 스켈레톤 로딩 상태
- 낙관적 UI 업데이트
- 실시간 알림
- 반응형 디자인 패턴

### **성능 최적화**

- Next.js를 통한 이미지 최적화
- 코드 분할 및 지연 로딩
- 가능한 곳에서 정적 생성
- 효율적인 상태 관리

## 🎨 **커스터마이제이션 가이드**

### **브랜딩 및 스타일링**

1. **색상**: 브랜드 색상을 위해 `tailwind.config.ts` 업데이트
2. **로고**: `/public/` 및 `/src/assets/`의 파일 교체
3. **폰트**: `/src/fonts/` 디렉토리 수정
4. **테마**: `globals.css`에서 CSS 변수 커스터마이즈

### **콘텐츠 커스터마이제이션**

1. **홈페이지**: `/src/components/pages/home/`의 컴포넌트 편집
2. **네비게이션**: `/src/components/header/` 업데이트
3. **푸터**: `/src/components/Footer.tsx` 수정
4. **정적 페이지**: `/src/app/(public)/`의 파일 편집

### **기능 확장**

1. **결제 연동**: `/src/lib/`에 TossPayments/KakaoPay 추가
2. **이메일 서비스**: SendGrid, Mailgun 등과 통합
3. **분석**: Google Analytics, Mixpanel 등 추가
4. **검색**: Algolia, Elasticsearch 등 구현

### **API 커스터마이제이션**

1. **엔드포인트**: `/src/app/api/` 라우트 수정
2. **데이터베이스**: Prisma 스키마 확장
3. **인증**: `auth.ts`에서 커스텀 제공업체 추가
4. **미들웨어**: 커스텀 로직을 위해 `/middleware.ts` 업데이트

## 🚀 **배포**

### **Vercel (권장)**

[![Vercel로 배포](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jgdglobal001/getkkul-shopping-main)

1. **GitHub에 푸시**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Vercel에 배포**:

   - [Vercel 대시보드](https://vercel.com/dashboard)로 이동
   - "New Project" 클릭
   - GitHub 저장소 가져오기
   - 환경 변수 추가
   - 배포

3. **환경 업데이트**:
   - `NEXTAUTH_URL`을 Vercel 도메인으로 설정
   - OAuth 리디렉션 URI 업데이트

### **기타 플랫폼**

- **Netlify**: GitHub 연결 후 배포
- **Railway**: 원클릭 배포
- **Digital Ocean**: App Platform
- **AWS**: Amplify Hosting

### **프로덕션용 환경 변수**

프로덕션에서 다음을 업데이트하는 것을 잊지 마세요:

```env
NEXTAUTH_URL=https://your-domain.com
# 구글/카카오/네이버 콘솔에서 OAuth 리디렉션 URI 업데이트
# 프로덕션 Neon 데이터베이스 사용
```

## 📄 **라이선스**

이 프로젝트는 MIT 라이선스 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 **지원 및 도움말**

### **도움 받기**

1. **📖 문서**: 이 README가 필요한 모든 것을 다룹니다
2. **🐛 이슈**: [GitHub 이슈 열기](https://github.com/jgdglobal001/getkkul-shopping-main/issues)
3. **💬 토론**: [GitHub 토론](https://github.com/jgdglobal001/getkkul-shopping-main/discussions)
4. **📧 이메일**: [jgdglobal001@gmail.com](mailto:jgdglobal001@gmail.com)

### **프리미엄 지원**

- **🎯 완전한 관리자 대시보드**: 이미 포함됨
- **🛠️ 커스텀 개발**: 고용 가능
- **📚 교육**: 일대일 설정 지원
- **🔧 유지보수**: 지속적인 지원 패키지

### **커뮤니티**

- **⭐ 이 저장소에 별표**를 주세요 (도움이 되었다면)
- **🍴 포크 및 기여** 개선사항
- **📢 다른 개발자들과 공유**

## 🙏 **감사의 말**

- **Next.js 팀** - 놀라운 React 프레임워크
- **Neon 팀** - 안정적인 PostgreSQL 서비스
- **Tailwind CSS** - 아름다운 유틸리티 우선 CSS
- **NextAuth.js** - 안전한 인증
- **Prisma** - 타입 안전 ORM
- **Vercel** - 원활한 배포 플랫폼
- **오픈 소스 커뮤니티** - 영감과 도구

## 🤝 **기여하기**

기여를 환영합니다! 언제든지 Pull Request를 제출해 주세요.

1. 프로젝트 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 열기

---

**⭐ 도움이 되었다면 이 저장소에 별표를 주세요!**

**❤️ [JGD Global](https://github.com/jgdglobal001)이 한국 개발자 커뮤니티를 위해 제작했습니다**

## � **기능 로드맵**

### ✅ **완료된 기능**

- [x] **이메일 인증** - NextAuth.js 통합
- [x] **비밀번호 재설정** - 보안 재설정 플로우
- [x] **관리자 대시보드** - 완전한 관리 패널
- [x] **주문 관리** - 포괄적인 주문 처리
- [x] **재고 관리** - 상품 재고 추적
- [x] **상품 리뷰** - 사용자 평가 시스템
- [x] **고급 분석** - 비즈니스 인사이트
- [x] **한국어 지원** - 완전한 한국어 국제화
- [x] **다크 모드** - 테마 전환 기능

### 🚧 **개발 예정**

- [ ] **PWA 기능** - 오프라인 지원
- [ ] **실시간 채팅** - 고객 지원
- [ ] **AI 추천** - 개인화된 상품 추천
- [ ] **모바일 앱** - React Native 버전
- [ ] **다중 언어** - 영어, 중국어, 일본어 지원

---

**🚀 겟꿀쇼핑으로 한국형 이커머스의 새로운 표준을 경험하세요!**


