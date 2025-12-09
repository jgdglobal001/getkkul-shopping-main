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
    title: "二쇰Ц 諛?諛곗넚",
    icon: "?벀",
    faqs: [
      {
        question: "諛곗넚? ?쇰쭏??嫄몃━?섏슂?",
        answer:
          "?쇰컲 諛곗넚? 蹂댄넻 3-7 ?곸뾽?쇱씠 ?뚯슂?⑸땲?? 鍮좊Ⅸ 諛곗넚? 1-2 ?곸뾽???댁뿉 諛곗넚?⑸땲?? 諛곗넚 ?쒓컙? 吏??낵 ?곹뭹 ?ш퀬???곕씪 ?щ씪吏????덉뒿?덈떎.",
      },
      {
        question: "二쇰Ц??異붿쟻?????덈굹??",
        answer:
          "?? 二쇰Ц??諛곗넚?섎㈃ ?대찓?쇰줈 異붿쟻 踰덊샇瑜?諛쏄쾶 ?⑸땲?? 怨꾩젙??濡쒓렇?명븯??'二쇰Ц ?댁뿭' ?뱀뀡?먯꽌 二쇰Ц ?곹깭瑜??뺤씤???섎룄 ?덉뒿?덈떎.",
      },
      {
        question: "諛곗넚猷뚮뒗 ?쇰쭏?멸???",
        answer:
          "諛곗넚猷뚮뒗 吏?? 二쇰Ц 洹쒕え, 諛곗넚 諛⑸쾿???곕씪 ?ㅻ쫭?덈떎. 50,000???댁긽 二쇰Ц ??臾대즺 諛곗넚???쒓났?⑸땲?? ?뺥솗??諛곗넚猷뚮뒗 寃곗젣 ??怨꾩궛?⑸땲??",
      },
      {
        question: "二쇰Ц??蹂寃쏀븯嫄곕굹 痍⑥냼?????덈굹??",
        answer:
          "二쇰Ц ??1?쒓컙 ?대궡??二쇰Ц??痍⑥냼?섍굅???섏젙?????덉뒿?덈떎. 洹??댄썑?먮뒗 怨좉컼?쇳꽣??利됱떆 ?곕씫?댁＜?몄슂. 諛곗넚?섏? ?딆? 二쇰Ц?대씪硫?理쒖꽑???ㅽ빐 ?꾩??쒕━寃좎뒿?덈떎.",
      },
    ],
  },
  {
    id: "returns",
    title: "諛섑뭹 諛??섎텋",
    icon: "?⑼툘",
    faqs: [
      {
        question: "諛섑뭹 ?뺤콉? 臾댁뾿?멸???",
        answer:
          "?遺遺꾩쓽 ?곹뭹?????30??諛섑뭹 ?뺤콉???쒓났?⑸땲?? ?곹뭹? 誘몄궗???곹깭?닿퀬 ?먮옒 ?ъ옣 ?곹깭?ъ빞 ?섎ŉ 諛쏆? ?곹깭? ?숈씪?댁빞 ?⑸땲?? 留욎땄???곹뭹 ???쇰? ?곹뭹? 諛섑뭹??遺덇??ν븷 ???덉뒿?덈떎.",
      },
      {
        question: "諛섑뭹???대뼸寃??쒖옉?섎굹??",
        answer:
          "諛섑뭹???쒖옉?섎젮硫?怨꾩젙??濡쒓렇?명븯??'二쇰Ц ?댁뿭'?쇰줈 ?대룞?????곹뭹 ?놁쓽 '諛섑뭹?섍린'瑜??대┃?섏꽭?? 吏?쒖뿉 ?곕씪 諛섑뭹 ?≪옣???몄뇙?섍퀬 ?몄젙??諛곗넚 ?꾩튂???⑦궎吏瑜??쒖텧?섏꽭??",
      },
      {
        question: "?섎텋? ?몄젣 諛쏅굹??",
        answer:
          "諛섑뭹 ?곹뭹??諛쏆? ??3-5 ?곸뾽???대궡???섎텋??泥섎━?⑸땲?? ?섎텋? ?먮옒 寃곗젣 諛⑸쾿?쇰줈 ?낃툑?⑸땲?? ?좎슜移대뱶 ?섎텋??寃쎌슦 異붽?濡?1-2 泥?뎄 二쇨린媛 ?뚯슂?????덉뒿?덈떎.",
      },
      {
        question: "諛섑뭹 諛곗넚猷뚮뒗 ?꾧? ?대굹??",
        answer:
          "遺덈웾?덉씠???섎せ???곹뭹??寃쎌슦 ?좊텋 諛섑뭹 ?≪옣???쒓났?⑸땲?? 湲고? 諛섑뭹??寃쎌슦 怨좉컼??諛섑뭹 諛곗넚猷뚮? 遺?댄븯硫? 臾대즺 諛섑뭹 ???二쇰Ц? ?덉쇅?낅땲??",
      },
    ],
  },
  {
    id: "account",
    title: "怨꾩젙 諛?寃곗젣",
    icon: "?뫀",
    faqs: [
      {
        question: "怨꾩젙???대뼸寃?留뚮뱶?섏슂?",
        answer:
          "?섏씠吏 ?곷떒??'?뚯썝媛?????대┃?섍퀬 ?대찓??二쇱냼瑜??낅젰????鍮꾨?踰덊샇瑜??ㅼ젙?섏꽭?? 寃곗젣 ?쒖뿉??媛?낇븷 ???덉뒿?덈떎. 怨꾩젙???덉쑝硫?二쇰Ц??異붿쟻?섍퀬, 二쇱냼瑜???ν븯怨? ?밸퀎???쒗깮??諛쏆쓣 ???덉뒿?덈떎.",
      },
      {
        question: "?대뼡 寃곗젣 諛⑸쾿???ъ슜?????덈굹??",
        answer:
          "紐⑤뱺 二쇱슂 ?좎슜移대뱶(Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay瑜??ъ슜?????덉뒿?덈떎. 紐⑤뱺 寃곗젣???뷀샇?붾맂 ?덉쟾???곌껐???듯빐 泥섎━?⑸땲??",
      },
      {
        question: "寃곗젣 ?뺣낫???덉쟾?쒓???",
        answer:
          "?? ?낃퀎 ?쒖? SSL ?뷀샇?붾? ?ъ슜?섎ŉ 寃곗젣 ?뺣낫瑜??쒕쾭????ν븯吏 ?딆뒿?덈떎. 紐⑤뱺 嫄곕옒???덉쟾??PCI 以??寃곗젣 泥섎━?낆껜瑜??듯빐 泥섎━?⑸땲??",
      },
      {
        question: "?щ윭 二쇱냼瑜???ν븷 ???덈굹??",
        answer:
          "?? 怨꾩젙???щ윭 諛곗넚 諛?泥?뎄 二쇱냼瑜???ν븷 ???덉뒿?덈떎. ?대젃寃??섎㈃ ?ν썑 二쇰Ц ??寃곗젣媛 ??鍮좊Ⅴ怨??ъ썙吏묐땲?? 怨꾩젙 ?ㅼ젙?먯꽌 ?몄젣?좎? 二쇱냼瑜?異붽?, ?섏젙 ?먮뒗 ??젣?????덉뒿?덈떎.",
      },
    ],
  },
  {
    id: "products",
    title: "?곹뭹 諛??ш퀬",
    icon: "?썚截?,
    faqs: [
      {
        question: "?곹뭹? ?뺥뭹?멸???",
        answer:
          "?? ??щ뒗 ?몄젙???좏넻?낆껜 諛??쒖“?낆껜?먯꽌 吏곸젒 怨듦툒諛쏆? ?뺥뭹留??먮ℓ?⑸땲?? 紐⑤뱺 ?곹뭹? ?뺥뭹?깃낵 ?덉쭏??蹂댁옣?⑸땲??",
      },
      {
        question: "?곹뭹???ш퀬媛 ?덈뒗吏 ?대뼸寃??????덈굹??",
        answer:
          "媛??곹뭹 ?섏씠吏???ш퀬 媛?⑹꽦???쒖떆?⑸땲?? ?곹뭹???덉젅??寃쎌슦 ?뚮┝???좎껌?섏뿬 ?ㅼ떆 ?낃퀬?????뚮┝??諛쏆쓣 ???덉뒿?덈떎. ??щ뒗 ?ㅼ떆媛꾩쑝濡??ш퀬瑜??낅뜲?댄듃?⑸땲??",
      },
      {
        question: "?곹뭹 蹂댁쬆???덈굹??",
        answer:
          "留롮? ?곹뭹???쒖“??蹂댁쬆???ы븿?섏뼱 ?덉뒿?덈떎. 蹂댁쬆 ?뺣낫??媛??곹뭹 ?섏씠吏???쒖떆?⑸땲?? ?먰븳 紐⑤뱺 援щℓ???????ъ쓽 留뚯”??蹂댁옣???쒓났?⑸땲??",
      },
      {
        question: "?곹뭹???좎씤?????뚮┝??諛쏆쓣 ???덈굹??",
        answer:
          "?? ?곹뭹???꾩떆由ъ뒪?몄뿉 異붽??섍퀬 媛寃??명븯 ?뚮┝???쒖꽦?뷀븷 ???덉뒿?덈떎. ?먰븳 ?댁뒪?덊꽣瑜?援щ룆?섏뿬 ?먮ℓ 諛??밸퀎 ?꾨줈紐⑥뀡 ?낅뜲?댄듃瑜?諛쏆쓣 ???덉뒿?덈떎.",
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
            ?먯＜ 臾삳뒗 吏덈Ц
          </Title>
          <p className="text-light-text text-lg mb-8">
            寃잕??쇳븨 ?댁슜??愿???먯＜ 臾삳뒗 吏덈Ц?ㅼ쓽 ?듬???李얠븘蹂댁꽭??
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text w-5 h-5" />
            <input
              type="text"
              placeholder="FAQ 寃??.."
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
              移댄뀒怨좊━
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
                  &ldquo;{searchTerm}&rdquo; 寃??寃곌낵
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
                      寃??寃곌낵媛 ?놁뒿?덈떎
                    </h3>
                    <p className="text-light-text">
                      ?ㅻⅨ ?ㅼ썙?쒕줈 寃?됲븯嫄곕굹 ?꾩쓽 移댄뀒怨좊━瑜??섎윭蹂댁꽭??
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
            ?꾩쭅 沅곴툑???먯씠 ?덉쑝?좉???
          </h2>
          <p className="text-light-text mb-6">
            李얠쑝?쒕뒗 ?듬????놁쑝?좉??? 怨좉컼吏?먰????꾩??쒕━寃좎뒿?덈떎.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              怨좉컼吏??臾몄쓽
            </a>
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              ?대찓??臾몄쓽
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
