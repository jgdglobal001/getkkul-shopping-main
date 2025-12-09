export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인?�보처리방침 - Getkkul-shopping",
  description: "겟�??�핑 개인?�보처리방침",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            개인?�보처리방침
          </Title>
          <p className="text-light-text text-lg">
            겟�??�핑??개인?�보처리방침???�인?�세??          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-border-color rounded-lg p-6 lg:p-8 space-y-8">
          {/* Privacy Officer */}
          <section className="bg-light-bg rounded-lg p-6 border-l-4 border-theme-color">
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              개인?�보보호책임??            </h2>
            <div className="space-y-2 text-light-text">
              <p><span className="font-semibold text-gray-800">?�름:</span> 백인??/p>
              <p><span className="font-semibold text-gray-800">직책:</span> 개인?�보보호책임??/p>
              <p><span className="font-semibold text-gray-800">?�락�?</span> 010-7218-2858</p>
              <p><span className="font-semibold text-gray-800">?�메??</span> jgdglobal@kakao.com</p>
            </div>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?개인?�보???�집 �??�용
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              겟�??�핑?� ?�음�?같�? 개인?�보�??�집?�니??
            </p>
            <div className="space-y-2 text-light-text">
              <p>???�수?�보: ?�름, ?�메?? ?�화번호, 주소</p>
              <p>???�택?�보: ?�년?�일, ?�별, 관?�사</p>
              <p>???�동?�집?�보: IP주소, 쿠키, ?�속로그</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?개인?�보???�용 목적
            </h2>
            <div className="space-y-2 text-light-text">
              <p>???�원 가??�?관�?/p>
              <p>???�품 �??�비???�공</p>
              <p>??주문 처리 �?배송</p>
              <p>??고객 ?�담 �?문제 ?�결</p>
              <p>??마�???�?광고 (?�의 ??</p>
              <p>???�계 분석 �??�비??개선</p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?개인?�보??보유 �??�용 기간
            </h2>
            <p className="text-light-text leading-relaxed">
              개인?�보???�집 목적 ?�성 ?�까지 보유?�며, ?�용?�의 ?�청 ??즉시 ??��?�니?? ?? 관??법령???�라 보�????�요??경우???�당 기간 ?�안 보�??�니??
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?개인?�보???????�공
            </h2>
            <p className="text-light-text leading-relaxed">
              겟�??�핑?� ?�용?�의 ?�의 ?�이 개인?�보�????�에�??�공?��? ?�습?�다. ?? 배송 ???�비???�공???�해 ?�요??경우 관???�체???�한?�으�??�공?????�습?�다.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?개인?�보??보안
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              겟�??�핑?� 개인?�보 보호�??�해 ?�음�?같�? 조치�?취합?�다:
            </p>
            <div className="space-y-2 text-light-text">
              <p>??SSL ?�호???�신</p>
              <p>???�근 권한 ?�한</p>
              <p>???�기?�인 보안 감시</p>
              <p>??직원 보안 교육</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�??�용?�의 권리
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?�용?�는 ?�음�?같�? 권리�?가집니??
            </p>
            <div className="space-y-2 text-light-text">
              <p>??개인?�보 ?�람 ?�청</p>
              <p>??개인?�보 ?�정 ?�청</p>
              <p>??개인?�보 ??�� ?�청</p>
              <p>??개인?�보 처리 ?��? ?�청</p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?쿠키 �?추적 기술
            </h2>
            <p className="text-light-text leading-relaxed">
              겟�??�핑?� ?�용?�의 ?�의�??�해 쿠키�??�용?�니?? ?�용?�는 브라?��? ?�정???�해 쿠키 ?�용??거�??????�습?�다.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?개인?�보 침해 ?�고
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              개인?�보 침해 관???�고???�음 기�????????�습?�다:
            </p>
            <div className="space-y-2 text-light-text">
              <p>??개인?�보보호?�원?? www.pipc.go.kr</p>
              <p>???�검찰청 ?�이버범죄수?�단: www.spo.go.kr</p>
              <p>??경찰�??�이버안?�과: www.police.go.kr</p>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-border-color pt-6 mt-8">
            <p className="text-sm text-gray-500">
              최종 ?�정?? 2025??11??6??            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

