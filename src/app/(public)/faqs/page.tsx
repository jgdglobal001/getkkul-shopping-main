"use client";

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiHelpCircle,
  FiSearch,
} from "react-icons/fi";

// export const metadata: Metadata = {
//   title: "FAQs - Shofy",
//   description: "Frequently Asked Questions - Find answers to common questions about Shofy",
// };

const faqCategories = [
  {
    id: "orders",
    title: "주문 및 배송",
    icon: "📦",
    faqs: [
      {
        question: "배송은 얼마나 걸리나요?",
        answer:
          "일반 배송은 보통 3-7 영업일이 소요됩니다. 빠른 배송은 1-2 영업일 내에 배송됩니다. 배송 시간은 지역과 상품 재고에 따라 달라질 수 있습니다.",
      },
      {
        question: "주문을 추적할 수 있나요?",
        answer:
          "네! 주문이 배송되면 이메일로 추적 번호를 받게 됩니다. 계정에 로그인하여 '주문 내역' 섹션에서 주문 상태를 확인할 수도 있습니다.",
      },
      {
        question: "배송료는 얼마인가요?",
        answer:
          "배송료는 지역, 주문 규모, 배송 방법에 따라 다릅니다. 50,000원 이상 주문 시 무료 배송이 제공됩니다. 정확한 배송료는 결제 시 계산됩니다.",
      },
      {
        question: "주문을 변경하거나 취소할 수 있나요?",
        answer:
          "주문 후 1시간 이내에 주문을 취소하거나 수정할 수 있습니다. 그 이후에는 고객센터에 즉시 연락해주세요. 배송되지 않은 주문이라면 최선을 다해 도와드리겠습니다.",
      },
    ],
  },
  {
    id: "returns",
    title: "반품 및 환불",
    icon: "↩️",
    faqs: [
      {
        question: "반품 정책은 무엇인가요?",
        answer:
          "대부분의 상품에 대해 30일 반품 정책을 제공합니다. 상품은 미사용 상태이고 원래 포장 상태여야 하며 받은 상태와 동일해야 합니다. 맞춤형 상품 등 일부 상품은 반품이 불가능할 수 있습니다.",
      },
      {
        question: "반품을 어떻게 시작하나요?",
        answer:
          "반품을 시작하려면 계정에 로그인하여 '주문 내역'으로 이동한 후 상품 옆의 '반품하기'를 클릭하세요. 지시에 따라 반품 송장을 인쇄하고 인정된 배송 위치에 패키지를 제출하세요.",
      },
      {
        question: "환불은 언제 받나요?",
        answer:
          "반품 상품을 받은 후 3-5 영업일 이내에 환불이 처리됩니다. 환불은 원래 결제 방법으로 입금됩니다. 신용카드 환불의 경우 추가로 1-2 청구 주기가 소요될 수 있습니다.",
      },
      {
        question: "반품 배송료는 누가 내나요?",
        answer:
          "불량품이나 잘못된 상품의 경우 선불 반품 송장을 제공합니다. 기타 반품의 경우 고객이 반품 배송료를 부담하며, 무료 반품 대상 주문은 예외입니다.",
      },
    ],
  },
  {
    id: "account",
    title: "계정 및 결제",
    icon: "👤",
    faqs: [
      {
        question: "계정을 어떻게 만드나요?",
        answer:
          "페이지 상단의 '회원가입'을 클릭하고 이메일 주소를 입력한 후 비밀번호를 설정하세요. 결제 시에도 가입할 수 있습니다. 계정이 있으면 주문을 추적하고, 주소를 저장하고, 특별한 혜택을 받을 수 있습니다.",
      },
      {
        question: "어떤 결제 방법을 사용할 수 있나요?",
        answer:
          "모든 주요 신용카드(Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay를 사용할 수 있습니다. 모든 결제는 암호화된 안전한 연결을 통해 처리됩니다.",
      },
      {
        question: "결제 정보는 안전한가요?",
        answer:
          "네! 업계 표준 SSL 암호화를 사용하며 결제 정보를 서버에 저장하지 않습니다. 모든 거래는 안전한 PCI 준수 결제 처리업체를 통해 처리됩니다.",
      },
      {
        question: "여러 주소를 저장할 수 있나요?",
        answer:
          "네! 계정에 여러 배송 및 청구 주소를 저장할 수 있습니다. 이렇게 하면 향후 주문 시 결제가 더 빠르고 쉬워집니다. 계정 설정에서 언제든지 주소를 추가, 수정 또는 삭제할 수 있습니다.",
      },
    ],
  },
  {
    id: "products",
    title: "상품 및 재고",
    icon: "🛍️",
    faqs: [
      {
        question: "상품은 정품인가요?",
        answer:
          "네! 저희는 인정된 유통업체 및 제조업체에서 직접 공급받은 정품만 판매합니다. 모든 상품은 정품성과 품질을 보장합니다.",
      },
      {
        question: "상품이 재고가 있는지 어떻게 알 수 있나요?",
        answer:
          "각 상품 페이지에 재고 가용성이 표시됩니다. 상품이 품절된 경우 알림을 신청하여 다시 입고될 때 알림을 받을 수 있습니다. 저희는 실시간으로 재고를 업데이트합니다.",
      },
      {
        question: "상품 보증이 있나요?",
        answer:
          "많은 상품에 제조사 보증이 포함되어 있습니다. 보증 정보는 각 상품 페이지에 표시됩니다. 또한 모든 구매에 대해 저희의 만족도 보장을 제공합니다.",
      },
      {
        question: "상품이 할인될 때 알림을 받을 수 있나요?",
        answer:
          "네! 상품을 위시리스트에 추가하고 가격 인하 알림을 활성화할 수 있습니다. 또한 뉴스레터를 구독하여 판매 및 특별 프로모션 업데이트를 받을 수 있습니다.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            자주 묻는 질문
          </Title>
          <p className="text-light-text text-lg mb-8">
            겟꿀쇼핑 이용에 관한 자주 묻는 질문들의 답변을 찾아보세요
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text w-5 h-5" />
            <input
              type="text"
              placeholder="FAQ 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              카테고리
            </h2>
            <div className="space-y-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
                    activeCategory === category.id
                      ? "bg-theme-color text-theme-white"
                      : "bg-light-bg text-gray-700 hover:bg-theme-color/10"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {searchTerm ? (
              /* Search Results */
              <div>
                <h2 className="text-2xl font-semibold text-theme-color mb-6">
                  &ldquo;{searchTerm}&rdquo; 검색 결과
                </h2>
                {filteredCategories.length > 0 ? (
                  <div className="space-y-8">
                    {filteredCategories.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.title}
                        </h3>
                        <div className="space-y-4">
                          {category.faqs.map((faq, index) => {
                            const faqId = `${category.id}-${index}`;
                            const isOpen = openFAQ === faqId;

                            return (
                              <div
                                key={faqId}
                                className="bg-theme-white border border-border-color rounded-lg"
                              >
                                <button
                                  onClick={() => toggleFAQ(faqId)}
                                  className="w-full text-left p-4 flex items-center justify-between hover:bg-light-bg/50 transition-colors duration-200"
                                >
                                  <span className="font-medium text-gray-800 pr-4">
                                    {faq.question}
                                  </span>
                                  {isOpen ? (
                                    <FiChevronDown className="w-5 h-5 text-theme-color flex-shrink-0" />
                                  ) : (
                                    <FiChevronRight className="w-5 h-5 text-theme-color flex-shrink-0" />
                                  )}
                                </button>
                                {isOpen && (
                                  <div className="px-4 pb-4">
                                    <p className="text-light-text leading-relaxed">
                                      {faq.answer}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiHelpCircle className="w-16 h-16 text-light-text mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      검색 결과가 없습니다
                    </h3>
                    <p className="text-light-text">
                      다른 키워드로 검색하거나 위의 카테고리를 둘러보세요.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Category FAQs */
              <div>
                {(() => {
                  const category = faqCategories.find(
                    (cat) => cat.id === activeCategory
                  );
                  if (!category) return null;

                  return (
                    <>
                      <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        {category.title}
                      </h2>
                      <div className="space-y-4">
                        {category.faqs.map((faq, index) => {
                          const faqId = `${category.id}-${index}`;
                          const isOpen = openFAQ === faqId;

                          return (
                            <div
                              key={faqId}
                              className="bg-theme-white border border-border-color rounded-lg"
                            >
                              <button
                                onClick={() => toggleFAQ(faqId)}
                                className="w-full text-left p-4 flex items-center justify-between hover:bg-light-bg/50 transition-colors duration-200"
                              >
                                <span className="font-medium text-gray-800 pr-4">
                                  {faq.question}
                                </span>
                                {isOpen ? (
                                  <FiChevronDown className="w-5 h-5 text-theme-color flex-shrink-0" />
                                ) : (
                                  <FiChevronRight className="w-5 h-5 text-theme-color flex-shrink-0" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-4">
                                  <p className="text-light-text leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            아직 궁금한 점이 있으신가요?
          </h2>
          <p className="text-light-text mb-6">
            찾으시는 답변이 없으신가요? 고객지원팀이 도와드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              고객지원 문의
            </a>
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              이메일 문의
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
