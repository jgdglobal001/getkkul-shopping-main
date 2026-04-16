export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { BsEnvelopeAt, BsTelephone } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export const metadata: Metadata = {
  title: "연락처 - Getkkul-shopping",
  description:
    "겟꿀쇼핑에 문의하세요 - 궁금한 점이나 문제가 있으시면 언제든지 연락주세요",
};

export default function ContactPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            문의하기
          </Title>
          <p className="text-light-text text-lg">
            궁금한 점이 있으시면 언제든지 연락해 주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              연락처 안내
            </h2>
            <p className="text-light-text mb-8">
              상품이나 서비스에 대해 궁금한 점이 있으신가요? 주문 관련 도움이
              필요하신가요? 저희 고객 서비스 팀이 도와드리겠습니다.
            </p>

            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMapPin className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">주소</h3>
                  <p className="text-light-text">
                    인천광역시 연수구 송도과학로 32
                    <br />
                    엠동 2201호 (송도동, 송도테크노파크 IT센터)
                  </p>
                </div>
              </div>

              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiPhone className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">전화번호</h3>
                  <p className="text-light-text">010-7218-2858</p>
                  <p className="text-light-text text-sm">
                    월요일 - 금요일, 오전 9시 - 오후 6시
                  </p>
                </div>
              </div>

              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMail className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">이메일</h3>
                  <p className="text-light-text">jgdglobal@kakao.com</p>
                </div>
              </div>

              <div className="bg-light-bg rounded-lg p-6 flex items-start gap-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiClock className="w-6 h-6 text-theme-color" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    영업시간
                  </h3>
                  <div className="text-light-text text-sm">
                    <p>월요일 - 금요일: 오전 9:00 - 오후 6:00</p>
                    <p>토요일: 오전 10:00 - 오후 4:00</p>
                    <p>일요일: 휴무</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              메시지 보내기
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    성 *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="성을 입력하세요"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  이메일 주소 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  문의 유형 *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">문의 유형을 선택하세요</option>
                  <option value="general">일반 문의</option>
                  <option value="support">기술 지원</option>
                  <option value="orders">주문 관련</option>
                  <option value="returns">반품 및 환불</option>
                  <option value="partnerships">비즈니스 제휴</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  문의 내용 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="문의하실 내용을 입력해 주세요..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-color text-theme-white py-3 px-6 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
              >
                메시지 보내기
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            빠른 도움이 필요하신가요?
          </h2>
          <p className="text-light-text mb-6">
            긴급한 문의는 고객센터 전화 또는 이메일로 직접 연락해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:01072182858"
              className="inline-flex items-center gap-2 bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              <FiPhone className="w-4 h-4" />
              전화 문의
            </a>
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-flex items-center gap-2 bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              <FiMail className="w-4 h-4" />
              이메일 문의
            </a>
          </div>
        </div>
      </div >
    </Container >
  );
}
