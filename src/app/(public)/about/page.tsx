import Container from "@/components/Container";
import Title from "@/components/Title";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 - Getkkul-shopping",
  description:
    "겟꿀쇼핑에 대해 자세히 알아보세요 - 신뢰할 수 있는 대한민국 대표 온라인 쇼핑몰",
};

export default function AboutPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            겟꿀쇼핑 소개
          </Title>
          <p className="text-light-text text-lg">
            최고의 상품을 최저가로! 신뢰할 수 있는 대한민국 대표 온라인 쇼핑몰
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:gap-12">
          {/* Our Story */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              우리의 이야기
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              2024년에 설립된 겟꿀쇼핑은 고객에게 최고의 쇼핑 경험을 제공하는
              대한민국 대표 온라인 쇼핑몰로 성장했습니다.
              저희는 최고 품질의 상품과 뛰어난 쇼핑 경험을 제공하기 위해 노력하고 있습니다.
              온라인 쇼핑이 모든 사람에게 간단하고, 안전하고, 즐거워야 한다고 믿습니다.
            </p>
            <p className="text-light-text leading-relaxed">
              저희의 여정은 간단한 미션으로 시작되었습니다: 품질 있는 상품과 전 세계 고객 사이의 간격을 좁히는 것입니다.
              오늘날 저희는 다양한 카테고리에 걸쳐 다양한 상품으로 수천 명의 만족한 고객을 섬기고 있습니다.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              우리의 미션
            </h2>
            <p className="text-light-text leading-relaxed">
              고객에게 경쟁력 있는 가격으로 고품질 상품에 접근할 수 있도록 제공하면서 뛰어난 고객 서비스를 제공하는 것입니다.
              저희는 기대를 초과하고 고객과 오래 지속되는 관계를 구축하는 완벽한 쇼핑 경험을 만들기 위해 노력합니다.
            </p>
          </section>

          {/* What Sets Us Apart */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              우리를 차별화하는 것
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    품질 보증
                  </h3>
                  <p className="text-light-text text-sm">
                    모든 상품은 최고의 품질 기준을 보장하기 위해 신중하게 선택되고 테스트됩니다.
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
                    빠르고 신뢰할 수 있는 배송으로 상품을 최대한 빨리 받으세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    고객 지원
                  </h3>
                  <p className="text-light-text text-sm">
                    24/7 고객 서비스로 모든 질문이나 우려사항을 도와드립니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    안전한 쇼핑
                  </h3>
                  <p className="text-light-text text-sm">
                    개인정보와 결제 정보를 보호하기 위한 고급 보안 조치.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              우리의 팀
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              겟꿀쇼핑 뒤에는 쇼핑 경험을 개선하기 위해 끊임없이 노력하는 디자이너, 개발자, 고객 서비스 전문가들의 열정적인 팀이 있습니다.
              저희는 혁신, 품질, 고객 만족에 최선을 다하고 있습니다.
            </p>
            <p className="text-light-text leading-relaxed">
              저희의 다양한 팀은 전자상거래, 기술, 물류, 고객 관계 등 다양한 분야의 전문 지식을 모아
              모든 요구사항을 충족하는 포괄적인 쇼핑 플랫폼을 만들고 있습니다.
            </p>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-sky-color/10 rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              쇼핑할 준비가 되셨나요?
            </h2>
            <p className="text-light-text mb-6">
              저희의 다양한 상품을 탐색하고 겟꿀쇼핑의 차이를 경험해보세요.
            </p>
            <Link
              href="/products"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              상품 보기
            </Link>
          </section>
        </div>
      </div>
    </Container>
  );
}
