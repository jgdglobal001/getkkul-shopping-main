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
  title: "비즈?�스 문의 - Getkkul-shopping",
  description:
    "겟�??�핑�??�트?�십??맺으?�요 - ?�매, ?�??주문, 비즈?�스 기회�??�색?�보?�요",
};

export default function InquiryPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            문의?�기
          </Title>
          <p className="text-light-text text-lg">
            겟�??�핑과의 ?�트?�십 기회?� 비즈?�스 ?�루?�을 ?�색?�보?�요
          </p>
        </div>

        {/* Business Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ?�매 주문
            </h3>
            <p className="text-light-text">
              ?�??구매 �??�매 주문???�???�별 가�? ?�매?�체 �??�판매자?�게 ?�벽?�니??
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              B2B ?�트?�십
            </h3>
            <p className="text-light-text">
              ?�???�트???�트?�크??참여?�고 ?�괄?�인 지???�스?�으�?비즈?�스�??�장?�키?�요.
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTruck className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              맞춤???�루??
            </h3>
            <p className="text-light-text">
              귀?�의 ?�정 비즈?�스 ?�구??맞춘 물류 �?공급�??�루??
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inquiry Types */}
          <div>
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              문의 ?�형
            </h2>

            <div className="space-y-4">
              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5 text-theme-color" />
                  ?�??�??�매 주문
                </h3>
                <p className="text-light-text text-sm mb-3">
                  ?�??주문???�하?�나?? ?�별???�매 가격과 ?�담 지?�을 받으?�요.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>??최소 주문 ?�량: 50�??�상</li>
                  <li>???�???�인 가??/li>
                  <li>???�담 계정 관리자</li>
                  <li>???�연??결제 조건</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-theme-color" />
                  ?�트?�십 기회
                </h3>
                <p className="text-light-text text-sm mb-3">
                  겟�??�핑 ?�트?��? ?�고 ?�으?��??? ?�뢰?????�는 비즈?�스 ?�트???�트?�크??참여?�세??
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>???�판�??�트?�십</li>
                  <li>???�휴 ?�로그램</li>
                  <li>??브랜???�업</li>
                  <li>???�통 ?�트?�십</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5 text-theme-color" />
                  맞춤???�루??
                </h3>
                <p className="text-light-text text-sm mb-3">
                  ?�정??것이 ?�요?�신가?? 고유??비즈?�스 ?�구?�항??맞춘 맞춤???�루?�을 ?�공?�니??
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>???�라?�빗 ?�벨�?/li>
                  <li>??맞춤???�장</li>
                  <li>???�별 물류 배치</li>
                  <li>???�터?�라?�즈 ?�합</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
              <FiMessageSquare className="w-6 h-6" />
              문의 ?�출
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ?�사�?*
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="?�사명을 ?�력?�세??
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ?�당?�명 *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="?�당???�름???�력?�세??
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    비즈?�스 ?�메??*
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
                    ?�화번호 *
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
                  문의 ?�형 *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">문의 ?�형???�택?�세??/option>
                  <option value="wholesale">?�매 주문</option>
                  <option value="partnership">?�트?�십 기회</option>
                  <option value="custom">맞춤???�루??/option>
                  <option value="reseller">?�판�??�로그램</option>
                  <option value="distribution">?�통 ?�트?�십</option>
                  <option value="other">기�?</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="estimatedVolume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ?�상 ?�간 거래??
                </label>
                <select
                  id="estimatedVolume"
                  name="estimatedVolume"
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">거래??범위�??�택?�세??/option>
                  <option value="50-100">50-100�?/option>
                  <option value="100-500">100-500�?/option>
                  <option value="500-1000">500-1000�?/option>
                  <option value="1000+">1000�??�상</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  문의 ?�용 *
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="비즈?�스 문의 ?�용, 구체?�인 ?�구?�항, ?�정 �?기�? 관???�보�??�력?�주?�요..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-color text-theme-white py-3 px-6 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
              >
                문의 ?�출
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            ?�구?�항???�의?�고 ?�으?��???
          </h2>
          <p className="text-light-text mb-6">
            ?�??비즈?�스 개발?�???�벽???�루?�을 찾는 ???��????�릴 준비�? ?�어 ?�습?�다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              비즈?�스?� ?�메??
            </a>
            <a
              href="tel:010-7218-2858"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              ?�화 ?�담 ?�약
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
