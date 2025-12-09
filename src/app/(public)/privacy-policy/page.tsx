import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - Getkkul-shopping",
  description: "겟꿀쇼핑 개인정보처리방침",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            개인정보처리방침
          </Title>
          <p className="text-light-text text-lg">
            겟꿀쇼핑의 개인정보처리방침을 확인하세요
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-border-color rounded-lg p-6 lg:p-8 space-y-8">
          {/* Privacy Officer */}
          <section className="bg-light-bg rounded-lg p-6 border-l-4 border-theme-color">
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              개인정보보호책임자
            </h2>
            <div className="space-y-2 text-light-text">
              <p><span className="font-semibold text-gray-800">이름:</span> 백인희</p>
              <p><span className="font-semibold text-gray-800">직책:</span> 개인정보보호책임자</p>
              <p><span className="font-semibold text-gray-800">연락처:</span> 010-7218-2858</p>
              <p><span className="font-semibold text-gray-800">이메일:</span> jgdglobal@kakao.com</p>
            </div>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제1조 개인정보의 수집 및 이용
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              겟꿀쇼핑은 다음과 같은 개인정보를 수집합니다:
            </p>
            <div className="space-y-2 text-light-text">
              <p>• 필수정보: 이름, 이메일, 전화번호, 주소</p>
              <p>• 선택정보: 생년월일, 성별, 관심사</p>
              <p>• 자동수집정보: IP주소, 쿠키, 접속로그</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제2조 개인정보의 이용 목적
            </h2>
            <div className="space-y-2 text-light-text">
              <p>• 회원 가입 및 관리</p>
              <p>• 상품 및 서비스 제공</p>
              <p>• 주문 처리 및 배송</p>
              <p>• 고객 상담 및 문제 해결</p>
              <p>• 마케팅 및 광고 (동의 시)</p>
              <p>• 통계 분석 및 서비스 개선</p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제3조 개인정보의 보유 및 이용 기간
            </h2>
            <p className="text-light-text leading-relaxed">
              개인정보는 수집 목적 달성 시까지 보유하며, 이용자의 요청 시 즉시 삭제합니다. 단, 관련 법령에 따라 보관이 필요한 경우는 해당 기간 동안 보관합니다.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제4조 개인정보의 제3자 제공
            </h2>
            <p className="text-light-text leading-relaxed">
              겟꿀쇼핑은 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 배송 등 서비스 제공을 위해 필요한 경우 관련 업체에 제한적으로 제공할 수 있습니다.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제5조 개인정보의 보안
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              겟꿀쇼핑은 개인정보 보호를 위해 다음과 같은 조치를 취합니다:
            </p>
            <div className="space-y-2 text-light-text">
              <p>• SSL 암호화 통신</p>
              <p>• 접근 권한 제한</p>
              <p>• 정기적인 보안 감시</p>
              <p>• 직원 보안 교육</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제6조 이용자의 권리
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              이용자는 다음과 같은 권리를 가집니다:
            </p>
            <div className="space-y-2 text-light-text">
              <p>• 개인정보 열람 요청</p>
              <p>• 개인정보 수정 요청</p>
              <p>• 개인정보 삭제 요청</p>
              <p>• 개인정보 처리 정지 요청</p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제7조 쿠키 및 추적 기술
            </h2>
            <p className="text-light-text leading-relaxed">
              겟꿀쇼핑은 이용자의 편의를 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 사용을 거부할 수 있습니다.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제8조 개인정보 침해 신고
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              개인정보 침해 관련 신고는 다음 기관에 할 수 있습니다:
            </p>
            <div className="space-y-2 text-light-text">
              <p>• 개인정보보호위원회: www.pipc.go.kr</p>
              <p>• 대검찰청 사이버범죄수사단: www.spo.go.kr</p>
              <p>• 경찰청 사이버안전과: www.police.go.kr</p>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-border-color pt-6 mt-8">
            <p className="text-sm text-gray-500">
              최종 수정일: 2025년 11월 6일
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

