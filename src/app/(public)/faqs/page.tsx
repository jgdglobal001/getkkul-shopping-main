export const runtime = 'edge';

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
    title: "주문 �?배송",
    icon: "?��",
    faqs: [
      {
        question: "배송?� ?�마??걸리?�요?",
        answer:
          "?�반 배송?� 보통 3-7 ?�업?�이 ?�요?�니?? 빠른 배송?� 1-2 ?�업???�에 배송?�니?? 배송 ?�간?� 지??�� ?�품 ?�고???�라 ?�라�????�습?�다.",
      },
      {
        question: "주문??추적?????�나??",
        answer:
          "?? 주문??배송?�면 ?�메?�로 추적 번호�?받게 ?�니?? 계정??로그?�하??'주문 ?�역' ?�션?�서 주문 ?�태�??�인???�도 ?�습?�다.",
      },
      {
        question: "배송료는 ?�마?��???",
        answer:
          "배송료는 지?? 주문 규모, 배송 방법???�라 ?�릅?�다. 50,000???�상 주문 ??무료 배송???�공?�니?? ?�확??배송료는 결제 ??계산?�니??",
      },
      {
        question: "주문??변경하거나 취소?????�나??",
        answer:
          "주문 ??1?�간 ?�내??주문??취소?�거???�정?????�습?�다. �??�후?�는 고객?�터??즉시 ?�락?�주?�요. 배송?��? ?��? 주문?�라�?최선???�해 ?��??�리겠습?�다.",
      },
    ],
  },
  {
    id: "returns",
    title: "반품 �??�불",
    icon: "?�️",
    faqs: [
      {
        question: "반품 ?�책?� 무엇?��???",
        answer:
          "?�부분의 ?�품???�??30??반품 ?�책???�공?�니?? ?�품?� 미사???�태?�고 ?�래 ?�장 ?�태?�야 ?�며 받�? ?�태?� ?�일?�야 ?�니?? 맞춤???�품 ???��? ?�품?� 반품??불�??�할 ???�습?�다.",
      },
      {
        question: "반품???�떻�??�작?�나??",
        answer:
          "반품???�작?�려�?계정??로그?�하??'주문 ?�역'?�로 ?�동?????�품 ?�의 '반품?�기'�??�릭?�세?? 지?�에 ?�라 반품 ?�장???�쇄?�고 ?�정??배송 ?�치???�키지�??�출?�세??",
      },
      {
        question: "?�불?� ?�제 받나??",
        answer:
          "반품 ?�품??받�? ??3-5 ?�업???�내???�불??처리?�니?? ?�불?� ?�래 결제 방법?�로 ?�금?�니?? ?�용카드 ?�불??경우 추�?�?1-2 �?�� 주기가 ?�요?????�습?�다.",
      },
      {
        question: "반품 배송료는 ?��? ?�나??",
        answer:
          "불량?�이???�못???�품??경우 ?�불 반품 ?�장???�공?�니?? 기�? 반품??경우 고객??반품 배송료�? 부?�하�? 무료 반품 ?�??주문?� ?�외?�니??",
      },
    ],
  },
  {
    id: "account",
    title: "계정 �?결제",
    icon: "?��",
    faqs: [
      {
        question: "계정???�떻�?만드?�요?",
        answer:
          "?�이지 ?�단??'?�원가?????�릭?�고 ?�메??주소�??�력????비�?번호�??�정?�세?? 결제 ?�에??가?�할 ???�습?�다. 계정???�으�?주문??추적?�고, 주소�??�?�하�? ?�별???�택??받을 ???�습?�다.",
      },
      {
        question: "?�떤 결제 방법???�용?????�나??",
        answer:
          "모든 주요 ?�용카드(Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay�??�용?????�습?�다. 모든 결제???�호?�된 ?�전???�결???�해 처리?�니??",
      },
      {
        question: "결제 ?�보???�전?��???",
        answer:
          "?? ?�계 ?��? SSL ?�호?��? ?�용?�며 결제 ?�보�??�버???�?�하지 ?�습?�다. 모든 거래???�전??PCI 준??결제 처리?�체�??�해 처리?�니??",
      },
      {
        question: "?�러 주소�??�?�할 ???�나??",
        answer:
          "?? 계정???�러 배송 �?�?�� 주소�??�?�할 ???�습?�다. ?�렇�??�면 ?�후 주문 ??결제가 ??빠르�??�워집니?? 계정 ?�정?�서 ?�제?��? 주소�?추�?, ?�정 ?�는 ??��?????�습?�다.",
      },
    ],
  },
  {
    id: "products",
    title: "?�품 �??�고",
    icon: "?���?,
    faqs: [
      {
        question: "?�품?� ?�품?��???",
        answer:
          "?? ?�?�는 ?�정???�통?�체 �??�조?�체?�서 직접 공급받�? ?�품�??�매?�니?? 모든 ?�품?� ?�품?�과 ?�질??보장?�니??",
      },
      {
        question: "?�품???�고가 ?�는지 ?�떻�??????�나??",
        answer:
          "�??�품 ?�이지???�고 가?�성???�시?�니?? ?�품???�절??경우 ?�림???�청?�여 ?�시 ?�고?????�림??받을 ???�습?�다. ?�?�는 ?�시간으�??�고�??�데?�트?�니??",
      },
      {
        question: "?�품 보증???�나??",
        answer:
          "많�? ?�품???�조??보증???�함?�어 ?�습?�다. 보증 ?�보??�??�품 ?�이지???�시?�니?? ?�한 모든 구매???�???�?�의 만족??보장???�공?�니??",
      },
      {
        question: "?�품???�인?????�림??받을 ???�나??",
        answer:
          "?? ?�품???�시리스?�에 추�??�고 가�??�하 ?�림???�성?�할 ???�습?�다. ?�한 ?�스?�터�?구독?�여 ?�매 �??�별 ?�로모션 ?�데?�트�?받을 ???�습?�다.",
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
            ?�주 묻는 질문
          </Title>
          <p className="text-light-text text-lg mb-8">
            겟�??�핑 ?�용??관???�주 묻는 질문?�의 ?��???찾아보세??
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text w-5 h-5" />
            <input
              type="text"
              placeholder="FAQ 검??.."
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
                  &ldquo;{searchTerm}&rdquo; 검??결과
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
                      검??결과가 ?�습?�다
                    </h3>
                    <p className="text-light-text">
                      ?�른 ?�워?�로 검?�하거나 ?�의 카테고리�??�러보세??
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
            ?�직 궁금???�이 ?�으?��???
          </h2>
          <p className="text-light-text mb-6">
            찾으?�는 ?��????�으?��??? 고객지?��????��??�리겠습?�다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              고객지??문의
            </a>
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              ?�메??문의
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
