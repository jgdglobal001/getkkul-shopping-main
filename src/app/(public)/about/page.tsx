export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "?�사?�개 - Getkkul-shopping",
  description:
    "겟�??�핑???�???�세???�아보세??- ?�뢰?????�는 ?�?��?�??�???�라???�핑�?,
};

export default function AboutPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            겟�??�핑 ?�개
          </Title>
          <p className="text-light-text text-lg">
            최고???�품??최�?가�? ?�뢰?????�는 ?�?��?�??�???�라???�핑�?
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:gap-12">
          {/* Our Story */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?�리???�야�?
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              2024?�에 ?�립??겟�??�핑?� 고객?�게 최고???�핑 경험???�공?�는
              ?�?��?�??�???�라???�핑몰로 ?�장?�습?�다.
              ?�?�는 최고 ?�질???�품�??�어???�핑 경험???�공?�기 ?�해 ?�력?�고 ?�습?�다.
              ?�라???�핑??모든 ?�람?�게 간단?�고, ?�전?�고, 즐거?�야 ?�다�?믿습?�다.
            </p>
            <p className="text-light-text leading-relaxed">
              ?�?�의 ?�정?� 간단??미션?�로 ?�작?�었?�니?? ?�질 ?�는 ?�품�????�계 고객 ?�이??간격??좁히??것입?�다.
              ?�늘???�?�는 ?�양??카테고리??걸쳐 ?�양???�품?�로 ?�천 명의 만족??고객???�기�??�습?�다.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?�리??미션
            </h2>
            <p className="text-light-text leading-relaxed">
              고객?�게 경쟁???�는 가격으�?고품�??�품???�근?????�도�??�공?�면???�어??고객 ?�비?��? ?�공?�는 것입?�다.
              ?�?�는 기�?�?초과?�고 고객�??�래 지?�되??관계�? 구축?�는 ?�벽???�핑 경험??만들�??�해 ?�력?�니??
            </p>
          </section>

          {/* What Sets Us Apart */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              ?�리�?차별?�하??�?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ?�질 보증
                  </h3>
                  <p className="text-light-text text-sm">
                    모든 ?�품?� 최고???�질 기�???보장?�기 ?�해 ?�중?�게 ?�택?�고 ?�스?�됩?�다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    빠른 배송
                  </h3>
                  <p className="text-light-text text-sm">
                    빠르�??�뢰?????�는 배송?�로 ?�품??최�???빨리 받으?�요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    고객 지??
                  </h3>
                  <p className="text-light-text text-sm">
                    24/7 고객 ?�비?�로 모든 질문?�나 ?�려?�항???��??�립?�다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ?�전???�핑
                  </h3>
                  <p className="text-light-text text-sm">
                    개인?�보?� 결제 ?�보�?보호?�기 ?�한 고급 보안 조치.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?�리???�
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              겟�??�핑 ?�에???�핑 경험??개선?�기 ?�해 ?�임?�이 ?�력?�는 ?�자?�너, 개발?? 고객 ?�비???�문가?�의 ?�정?�인 ?�???�습?�다.
              ?�?�는 ?�신, ?�질, 고객 만족??최선???�하�??�습?�다.
            </p>
            <p className="text-light-text leading-relaxed">
              ?�?�의 ?�양???�?� ?�자?�거?? 기술, 물류, 고객 관�????�양??분야???�문 지?�을 모아
              모든 ?�구?�항??충족?�는 ?�괄?�인 ?�핑 ?�랫?�을 만들�??�습?�다.
            </p>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-sky-color/10 rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?�핑??준비�? ?�셨?�요?
            </h2>
            <p className="text-light-text mb-6">
              ?�?�의 ?�양???�품???�색?�고 겟�??�핑??차이�?경험?�보?�요.
            </p>
            <Link
              href="/products"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              ?�품 보기
            </Link>
          </section>
        </div>
      </div>
    </Container>
  );
}
