export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "?�용?��? - Getkkul-shopping",
  description: "겟�??�핑 ?�용?��?",
};

export default function TermsOfServicePage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            ?�용?��?
          </Title>
          <p className="text-light-text text-lg">
            겟�??�핑 ?�용?��????�인?�세??
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-border-color rounded-lg p-6 lg:p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?목적
            </h2>
            <p className="text-light-text leading-relaxed">
              �??��??� 겟�??�핑(?�하 &quot;?�사&quot;)???�공?�는 ?�자?�거???�비???�하 &quot;?�비??quot;)�??�용?�에 ?�어 ?�사?� ?�용?�의 권리, ?�무 �?책임?�항??규정?�을 목적?�로 ?�니??
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�??�어???�의
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800 mb-1">1. &quot;?�사&quot;</p>
                <p className="text-light-text">
                  ?�자?�거???�업???�위?�는 겟�??�핑???��??�니??
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">2. &quot;?�용??quot;</p>
                <p className="text-light-text">
                  �??��????�의?�여 ?�사가 ?�공?�는 ?�비?��? ?�용?�는 고객???��??�니??
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">3. &quot;?�품&quot;</p>
                <p className="text-light-text">
                  ?�사가 ?�공?�는 모든 물품 �??�역???��??�니??
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�??��????�력 �?변�?
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              �??��??� ?�비???�면??게시?�으로써 ?�력??발생?�니??
            </p>
            <p className="text-light-text leading-relaxed">
              ?�사???�요??경우 �??��???변경할 ???�으�? 변경된 ?��??� ?�비???�면??게시?�으로써 ?�력??발생?�니??
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�??�비???�용 계약
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?�용?��? �??��????�의?�고 ?�원가?�을 ?�료?�면 ?�비???�용 계약???�립?�니??
            </p>
            <p className="text-light-text leading-relaxed">
              ?�사???�용?�의 ?�청???�???�비???�공 가???��?�??�단?�여 ?�낙 ?�는 거절?????�습?�다.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�??�용?�의 ?�무
            </h2>
            <div className="space-y-2 text-light-text">
              <p>1. ?�용?�는 �??��??�서 규정???�항�?기�? ?�사가 ?��??�는 ?�항??준?�해???�니??</p>
              <p>2. ?�용?�는 ?�?�의 개인?�보�??�용?�거??부?�한 방법?�로 ?�비?��? ?�용?????�습?�다.</p>
              <p>3. ?�용?�는 ?�사???�?�권 �?지?�재?�권??침해?????�습?�다.</p>
              <p>4. ?�용?�는 ?�비?��? ?�해 불법?�인 ?�용??게시?�거??배포?????�습?�다.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�??�품 구매 �?결제
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?�용?��? ?�품???�택?�여 구매 ?�청???�면 계약 체결 ?�사�??�시?�는 것으�?봅니??
            </p>
            <p className="text-light-text leading-relaxed">
              ?�사???�용?�의 구매 ?�청???�???�낙 ?�는 거절?????�으�? 결제 ?�료 ??계약???�립?�니??
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?배송 �?반품
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?�사??결제 ?�료 ???�품???�속?�게 배송?�니??
            </p>
            <p className="text-light-text leading-relaxed">
              ?�용?�는 ?�품 ?�령 ??7???�내??반품 ?�청???????�습?�다. ?? ?�품???�자가 ?�는 경우 반품 배송료는 ?�용?��? 부?�합?�다.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?면책조항
            </h2>
            <p className="text-light-text leading-relaxed">
              ?�사??천재지변, ?�쟁, ?�러 ??불�???��?�인 ?�유�??�한 ?�비??중단???�??책임??지지 ?�습?�다.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??�?준거법 �?관??
            </h2>
            <p className="text-light-text leading-relaxed">
              �??��??� ?�?��?�?법률???�라 ?�석?�며, �??��?�?관?�된 분쟁?� ?�?��?�?법원??관?�을 받습?�다.
            </p>
          </section>

          {/* Last Updated */}
          <div className="border-t border-border-color pt-6 mt-8">
            <p className="text-sm text-gray-500">
              최종 ?�정?? 2025??11??6??
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

