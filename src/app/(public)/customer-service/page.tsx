export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { FiClock, FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "怨좉컼?쇳꽣 - Getkkul-shopping",
  description: "寃잕??쇳븨 怨좉컼?쇳꽣 - ?댁쁺 ?덈궡 諛??먯＜ 臾삳뒗 吏덈Ц",
};

export default function CustomerServicePage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            怨좉컼?쇳꽣
          </Title>
          <p className="text-light-text text-lg">
            寃잕??쇳븨 怨좉컼?쇳꽣???ㅼ떊 寃껋쓣 ?섏쁺?⑸땲??          </p>
        </div>

        {/* Operating Hours Section */}
        <section className="bg-light-bg rounded-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
            <FiClock className="w-6 h-6" />
            ?댁쁺 ?덈궡
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiPhone className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">?꾪솕 ?곷떞</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">踰덊샇:</span> 010-7218-2858
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">?댁쁺?쒓컙:</span>
                <br />
                ?됱씪: 09:00 ~ 18:00
                <br />
                ?좎슂?? 10:00 ~ 16:00
                <br />
                ?쇱슂??怨듯쑕?? ?대Т
              </p>
            </div>

            {/* Email Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMail className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">?대찓???곷떞</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">?대찓??</span>
                <br />
                jgdglobal@kakao.com
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">?묐떟?쒓컙:</span>
                <br />
                24?쒓컙 ?대궡 ?듬?
              </p>
            </div>

            {/* Chat Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMessageCircle className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">梨꾪똿 ?곷떞</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">?곷떞 媛??</span>
                <br />
                ?됱씪 09:00 ~ 18:00
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">?곹깭:</span>
                <br />
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                  以鍮?以?                </span>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-border-color rounded-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-6">
            ?먯＜ 臾삳뒗 吏덈Ц
          </h2>
          <p className="text-light-text mb-6">
            ?먯＜ 臾삳뒗 吏덈Ц???뺤씤?섏뿬 鍮좊Ⅴ寃?臾몄젣瑜??닿껐?섏꽭??
          </p>
          <Link
            href="/faqs"
            className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
          >
            FAQ 蹂닿린
          </Link>
        </section>

        {/* Contact Section */}
        <section className="bg-sky-color/10 rounded-lg p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            異붽? 臾몄쓽?ы빆???덉쑝?좉???
          </h2>
          <p className="text-light-text mb-6">
            ?꾩쓽 ?곕씫泥섎줈 臾몄쓽?섏떆嫄곕굹 臾몄쓽 ?묒떇???듯빐 ?곕씫二쇱꽭??
          </p>
          <Link
            href="/inquiry"
            className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
          >
            臾몄쓽?섍린
          </Link>
        </section>
      </div>
    </Container>
  );
}

