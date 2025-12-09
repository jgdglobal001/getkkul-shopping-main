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
  title: "鍮꾩쫰?덉뒪 臾몄쓽 - Getkkul-shopping",
  description:
    "寃잕??쇳븨怨??뚰듃?덉떗??留븐쑝?몄슂 - ?꾨ℓ, ???二쇰Ц, 鍮꾩쫰?덉뒪 湲고쉶瑜??먯깋?대낫?몄슂",
};

export default function InquiryPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            臾몄쓽?섍린
          </Title>
          <p className="text-light-text text-lg">
            寃잕??쇳븨怨쇱쓽 ?뚰듃?덉떗 湲고쉶? 鍮꾩쫰?덉뒪 ?붾（?섏쓣 ?먯깋?대낫?몄슂
          </p>
        </div>

        {/* Business Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ?꾨ℓ 二쇰Ц
            </h3>
            <p className="text-light-text">
              ???援щℓ 諛??꾨ℓ 二쇰Ц??????밸퀎 媛寃? ?뚮ℓ?낆껜 諛??ы뙋留ㅼ옄?먭쾶 ?꾨꼍?⑸땲??
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              B2B ?뚰듃?덉떗
            </h3>
            <p className="text-light-text">
              ????뚰듃???ㅽ듃?뚰겕??李몄뿬?섍퀬 ?ш큵?곸씤 吏???쒖뒪?쒖쑝濡?鍮꾩쫰?덉뒪瑜??깆옣?쒗궎?몄슂.
            </p>
          </div>

          <div className="bg-light-bg rounded-lg p-6 text-center">
            <div className="bg-theme-color/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTruck className="w-8 h-8 text-theme-color" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              留욎땄???붾（??
            </h3>
            <p className="text-light-text">
              洹?ъ쓽 ?뱀젙 鍮꾩쫰?덉뒪 ?붽뎄??留욎텣 臾쇰쪟 諛?怨듦툒留??붾（??
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Inquiry Types */}
          <div>
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              臾몄쓽 ?좏삎
            </h2>

            <div className="space-y-4">
              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiShoppingCart className="w-5 h-5 text-theme-color" />
                  ???諛??꾨ℓ 二쇰Ц
                </h3>
                <p className="text-light-text text-sm mb-3">
                  ???二쇰Ц???먰븯?쒕굹?? ?밸퀎???꾨ℓ 媛寃⑷낵 ?꾨떞 吏?먯쓣 諛쏆쑝?몄슂.
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>??理쒖냼 二쇰Ц ?섎웾: 50媛??댁긽</li>
                  <li>??????좎씤 媛??/li>
                  <li>???꾨떞 怨꾩젙 愿由ъ옄</li>
                  <li>???좎뿰??寃곗젣 議곌굔</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-theme-color" />
                  ?뚰듃?덉떗 湲고쉶
                </h3>
                <p className="text-light-text text-sm mb-3">
                  寃잕??쇳븨 ?뚰듃?덇? ?섍퀬 ?띠쑝?좉??? ?좊ː?????덈뒗 鍮꾩쫰?덉뒪 ?뚰듃???ㅽ듃?뚰겕??李몄뿬?섏꽭??
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>???ы뙋留??뚰듃?덉떗</li>
                  <li>???쒗쑕 ?꾨줈洹몃옩</li>
                  <li>??釉뚮옖???묒뾽</li>
                  <li>???좏넻 ?뚰듃?덉떗</li>
                </ul>
              </div>

              <div className="bg-theme-white border border-border-color rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5 text-theme-color" />
                  留욎땄???붾（??
                </h3>
                <p className="text-light-text text-sm mb-3">
                  ?뱀젙??寃껋씠 ?꾩슂?섏떊媛?? 怨좎쑀??鍮꾩쫰?덉뒪 ?붽뎄?ы빆??留욎텣 留욎땄???붾（?섏쓣 ?쒓났?⑸땲??
                </p>
                <ul className="text-light-text text-sm space-y-1">
                  <li>???꾨씪?대퉿 ?쇰꺼留?/li>
                  <li>??留욎땄???ъ옣</li>
                  <li>???밸퀎 臾쇰쪟 諛곗튂</li>
                  <li>???뷀꽣?꾨씪?댁쫰 ?듯빀</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
              <FiMessageSquare className="w-6 h-6" />
              臾몄쓽 ?쒖텧
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ?뚯궗紐?*
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="?뚯궗紐낆쓣 ?낅젰?섏꽭??
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ?대떦?먮챸 *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                    placeholder="?대떦???대쫫???낅젰?섏꽭??
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    鍮꾩쫰?덉뒪 ?대찓??*
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
                    ?꾪솕踰덊샇 *
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
                  臾몄쓽 ?좏삎 *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">臾몄쓽 ?좏삎???좏깮?섏꽭??/option>
                  <option value="wholesale">?꾨ℓ 二쇰Ц</option>
                  <option value="partnership">?뚰듃?덉떗 湲고쉶</option>
                  <option value="custom">留욎땄???붾（??/option>
                  <option value="reseller">?ы뙋留??꾨줈洹몃옩</option>
                  <option value="distribution">?좏넻 ?뚰듃?덉떗</option>
                  <option value="other">湲고?</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="estimatedVolume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ?덉긽 ?붽컙 嫄곕옒??
                </label>
                <select
                  id="estimatedVolume"
                  name="estimatedVolume"
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors"
                >
                  <option value="">嫄곕옒??踰붿쐞瑜??좏깮?섏꽭??/option>
                  <option value="50-100">50-100媛?/option>
                  <option value="100-500">100-500媛?/option>
                  <option value="500-1000">500-1000媛?/option>
                  <option value="1000+">1000媛??댁긽</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  臾몄쓽 ?댁슜 *
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border-color rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="鍮꾩쫰?덉뒪 臾몄쓽 ?댁슜, 援ъ껜?곸씤 ?붽뎄?ы빆, ?쇱젙 諛?湲고? 愿???뺣낫瑜??낅젰?댁＜?몄슂..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-color text-theme-white py-3 px-6 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
              >
                臾몄쓽 ?쒖텧
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center bg-sky-color/10 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            ?붽뎄?ы빆???쇱쓽?섍퀬 ?띠쑝?좉???
          </h2>
          <p className="text-light-text mb-6">
            ???鍮꾩쫰?덉뒪 媛쒕컻????꾨꼍???붾（?섏쓣 李얜뒗 ???꾩????쒕┫ 以鍮꾧? ?섏뼱 ?덉뒿?덈떎.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:jgdglobal@kakao.com"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              鍮꾩쫰?덉뒪? ?대찓??
            </a>
            <a
              href="tel:010-7218-2858"
              className="inline-block bg-theme-white text-theme-color border-2 border-theme-color px-6 py-3 rounded-lg hover:bg-theme-color hover:text-theme-white transition-colors duration-200 font-medium"
            >
              ?꾪솕 ?곷떞 ?덉빟
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
