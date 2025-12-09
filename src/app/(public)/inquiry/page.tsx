export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import {
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiUsers,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "비즈니스 문의 - Getkkul-shopping",
  description:
    "겟꿀쇼핑과 파트너십을 맺으세요 - 도매, 대량 주문, 비즈니스 기회를 탐색해보세요",
};

export default function InquiryPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            문의하기
          </Title>
          <p className="text-light-text text-lg">
            겟꿀쇼핑과의 파트너십 기회와 비즈니스 솔루션을 탐색해보세요
          </p>
        </div>

        {/* Business Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              도매 주문
            </h3>
            <p className="text-light-text">
              대량 구매 및 도매 주문에 대한 특별 가격. 소매업체 및 재판매자에게 완벽합니다.
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              B2B 파트너십
            </h3>
            <p className="text-light-text">
              저희 파트너 네트워크에 참여하고 포괄적인 지원 시스템으로 비즈니스를 성장시키세요.
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTruck className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              맞춤형 솔루션
            </h3>
            <p className="text-light-text">
              귀사의 특정 비즈니스 요구에 맞춘 물류 및 공급망 솔루션.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inquiry Types */}
          <div>
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              문의 유형
            </h2>

            <div className="space-y-4">
              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5 text-theme-color" />
                  대량 및 도매 주문
                </h3>
                <p className="text-light-text text-sm mb-3">
                  대량 주문을 원하시나요? 특별한 도매 가격과 전담 지원을 받으세요.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>• 최소 주문 수량: 50개 이상</li>
                  <li>• 대량 할인 가능</li>
                  <li>• 전담 계정 관리자</li>
                  <li>• 유연한 결제 조건</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-theme-color" />
                  파트너십 기회
                </h3>
                <p className="text-light-text text-sm mb-3">
                  겟꿀쇼핑 파트너가 되고 싶으신가요? 신뢰할 수 있는 비즈니스 파트너 네트워크에 참여하세요.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>• 재판매 파트너십</li>
                  <li>• 제휴 프로그램</li>
                  <li>• 브랜드 협업</li>
                  <li>• 유통 파트너십</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5 text-theme-color" />
                  맞춤형 솔루션
                </h3>
                <p className="text-light-text text-sm mb-3">
                  특정한 것이 필요하신가요? 고유한 비즈니스 요구사항에 맞춘 맞춤형 솔루션을 제공합니다.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>• 프라이빗 라벨링</li>
                  <li>• 맞춤형 포장</li>
                  <li>• 특별 물류 배치</li>
                  <li>• 엔터프라이즈 통합</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
              <FiMessageSquare className="w-6 h-6" />
              문의 제출
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    회사명 *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="회사명을 입력하세요"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    담당자명 *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="담당자 이름을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    비즈니스 이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="business@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="inquiryType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  문의 유형 *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">문의 유형을 선택하세요</option>
                  <option value="wholesale">도매 주문</option>
                  <option value="partnership">파트너십 기회</option>
                  <option value="custom">맞춤형 솔루션</option>
                  <option value="reseller">재판매 프로그램</option>
                  <option value="distribution">유통 파트너십</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="estimatedVolume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  예상 월간 거래량
                </label>
                <select
                  id="estimatedVolume"
                  name="estimatedVolume"
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">거래량 범위를 선택하세요</option>
                  <option value="50-100">50-100개</option>
                  <option value="100-500">100-500개</option>
                  <option value="500-1000">500-1000개</option>
                  <option value="1000+">1000개 이상</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  문의 내용 *
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="비즈니스 문의 내용, 구체적인 요구사항, 일정 및 기타 관련 정보를 입력해주세요..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-color text-theme-white py-3 px-6 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
              >
                문의 제출
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            요구사항을 논의하고 싶으신가요?
          </h2>
          <p className="text-light-text mb-6">
            저희 비즈니스 개발팀이 완벽한 솔루션을 찾는 데 도움을 드릴 준비가 되어 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              비즈니스팀 이메일
            </a>
            <a
              href="tel:010-7218-2858"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              전화 상담 예약
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
