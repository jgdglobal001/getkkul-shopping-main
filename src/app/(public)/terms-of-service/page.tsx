import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 - Getkkul-shopping",
  description: "겟꿀쇼핑 이용약관",
};

export default function TermsOfServicePage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            이용약관
          </Title>
          <p className="text-light-text text-lg">
            겟꿀쇼핑 이용약관을 확인하세요
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-border-color rounded-lg p-6 lg:p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제1조 목적
            </h2>
            <p className="text-light-text leading-relaxed">
              본 약관은 겟꿀쇼핑(이하 "회사")이 제공하는 전자상거래 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제2조 용어의 정의
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800 mb-1">1. "회사"</p>
                <p className="text-light-text">
                  전자상거래 사업을 영위하는 겟꿀쇼핑을 의미합니다.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">2. "이용자"</p>
                <p className="text-light-text">
                  본 약관에 동의하여 회사가 제공하는 서비스를 이용하는 고객을 의미합니다.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">3. "상품"</p>
                <p className="text-light-text">
                  회사가 제공하는 모든 물품 및 용역을 의미합니다.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제3조 약관의 효력 및 변경
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              본 약관은 서비스 화면에 게시함으로써 효력을 발생합니다.
            </p>
            <p className="text-light-text leading-relaxed">
              회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에 게시함으로써 효력을 발생합니다.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제4조 서비스 이용 계약
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              이용자가 본 약관에 동의하고 회원가입을 완료하면 서비스 이용 계약이 성립합니다.
            </p>
            <p className="text-light-text leading-relaxed">
              회사는 이용자의 신청에 대해 서비스 제공 가능 여부를 판단하여 승낙 또는 거절할 수 있습니다.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제5조 이용자의 의무
            </h2>
            <div className="space-y-2 text-light-text">
              <p>1. 이용자는 본 약관에서 규정한 사항과 기타 회사가 통지하는 사항을 준수해야 합니다.</p>
              <p>2. 이용자는 타인의 개인정보를 도용하거나 부정한 방법으로 서비스를 이용할 수 없습니다.</p>
              <p>3. 이용자는 회사의 저작권 및 지적재산권을 침해할 수 없습니다.</p>
              <p>4. 이용자는 서비스를 통해 불법적인 내용을 게시하거나 배포할 수 없습니다.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제6조 상품 구매 및 결제
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              이용자가 상품을 선택하여 구매 신청을 하면 계약 체결 의사를 표시하는 것으로 봅니다.
            </p>
            <p className="text-light-text leading-relaxed">
              회사는 이용자의 구매 신청에 대해 승낙 또는 거절할 수 있으며, 결제 완료 시 계약이 성립합니다.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제7조 배송 및 반품
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              회사는 결제 완료 후 상품을 신속하게 배송합니다.
            </p>
            <p className="text-light-text leading-relaxed">
              이용자는 상품 수령 후 7일 이내에 반품 신청을 할 수 있습니다. 단, 상품의 하자가 없는 경우 반품 배송료는 이용자가 부담합니다.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제8조 면책조항
            </h2>
            <p className="text-light-text leading-relaxed">
              회사는 천재지변, 전쟁, 테러 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              제9조 준거법 및 관할
            </h2>
            <p className="text-light-text leading-relaxed">
              본 약관은 대한민국 법률에 따라 해석되며, 본 약관과 관련된 분쟁은 대한민국 법원의 관할을 받습니다.
            </p>
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

