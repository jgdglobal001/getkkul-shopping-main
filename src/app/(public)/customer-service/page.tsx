import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { FiClock, FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "고객센터 - Getkkul-shopping",
  description: "겟꿀쇼핑 고객센터 - 운영 안내 및 자주 묻는 질문",
};

export default function CustomerServicePage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            고객센터
          </Title>
          <p className="text-light-text text-lg">
            겟꿀쇼핑 고객센터에 오신 것을 환영합니다
          </p>
        </div>

        {/* Operating Hours Section */}
        <section className="bg-light-bg rounded-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
            <FiClock className="w-6 h-6" />
            운영 안내
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiPhone className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">전화 상담</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">번호:</span> 010-7218-2858
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">운영시간:</span>
                <br />
                평일: 09:00 ~ 18:00
                <br />
                토요일: 10:00 ~ 16:00
                <br />
                일요일/공휴일: 휴무
              </p>
            </div>

            {/* Email Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMail className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">이메일 상담</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">이메일:</span>
                <br />
                jgdglobal@kakao.com
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">응답시간:</span>
                <br />
                24시간 이내 답변
              </p>
            </div>

            {/* Chat Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMessageCircle className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">채팅 상담</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">상담 가능:</span>
                <br />
                평일 09:00 ~ 18:00
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">상태:</span>
                <br />
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                  준비 중
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-border-color rounded-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-6">
            자주 묻는 질문
          </h2>
          <p className="text-light-text mb-6">
            자주 묻는 질문을 확인하여 빠르게 문제를 해결하세요.
          </p>
          <Link
            href="/faqs"
            className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
          >
            FAQ 보기
          </Link>
        </section>

        {/* Contact Section */}
        <section className="bg-sky-color/10 rounded-lg p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            추가 문의사항이 있으신가요?
          </h2>
          <p className="text-light-text mb-6">
            위의 연락처로 문의하시거나 문의 양식을 통해 연락주세요.
          </p>
          <Link
            href="/inquiry"
            className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
          >
            문의하기
          </Link>
        </section>
      </div>
    </Container>
  );
}

