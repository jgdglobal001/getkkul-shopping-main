export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";
import { FiClock, FiMail, FiPhone, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ê³ ê°?¼í„° - Getkkul-shopping",
  description: "ê²Ÿê??¼í•‘ ê³ ê°?¼í„° - ?´ì˜ ?ˆë‚´ ë°??ì£¼ ë¬»ëŠ” ì§ˆë¬¸",
};

export default function CustomerServicePage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            ê³ ê°?¼í„°
          </Title>
          <p className="text-light-text text-lg">
            ê²Ÿê??¼í•‘ ê³ ê°?¼í„°???¤ì‹  ê²ƒì„ ?˜ì˜?©ë‹ˆ??          </p>
        </div>

        {/* Operating Hours Section */}
        <section className="bg-light-bg rounded-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-6 flex items-center gap-2">
            <FiClock className="w-6 h-6" />
            ?´ì˜ ?ˆë‚´
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiPhone className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">?„í™” ?ë‹´</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">ë²ˆí˜¸:</span> 010-7218-2858
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">?´ì˜?œê°„:</span>
                <br />
                ?‰ì¼: 09:00 ~ 18:00
                <br />
                ? ìš”?? 10:00 ~ 16:00
                <br />
                ?¼ìš”??ê³µíœ´?? ?´ë¬´
              </p>
            </div>

            {/* Email Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMail className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">?´ë©”???ë‹´</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">?´ë©”??</span>
                <br />
                jgdglobal@kakao.com
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">?‘ë‹µ?œê°„:</span>
                <br />
                24?œê°„ ?´ë‚´ ?µë?
              </p>
            </div>

            {/* Chat Support */}
            <div className="bg-white rounded-lg p-6 border border-border-color">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-theme-color/10 p-3 rounded-lg">
                  <FiMessageCircle className="w-6 h-6 text-theme-color" />
                </div>
                <h3 className="font-semibold text-gray-800">ì±„íŒ… ?ë‹´</h3>
              </div>
              <p className="text-light-text text-sm mb-3">
                <span className="font-semibold text-gray-800">?ë‹´ ê°€??</span>
                <br />
                ?‰ì¼ 09:00 ~ 18:00
              </p>
              <p className="text-light-text text-sm">
                <span className="font-semibold text-gray-800">?íƒœ:</span>
                <br />
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                  ì¤€ë¹?ì¤?                </span>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-border-color rounded-lg p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-6">
            ?ì£¼ ë¬»ëŠ” ì§ˆë¬¸
          </h2>
          <p className="text-light-text mb-6">
            ?ì£¼ ë¬»ëŠ” ì§ˆë¬¸???•ì¸?˜ì—¬ ë¹ ë¥´ê²?ë¬¸ì œë¥??´ê²°?˜ì„¸??
          </p>
          <Link
            href="/faqs"
            className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
          >
            FAQ ë³´ê¸°
          </Link>
        </section>

        {/* Contact Section */}
        <section className="bg-sky-color/10 rounded-lg p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-theme-color mb-4">
            ì¶”ê? ë¬¸ì˜?¬í•­???ˆìœ¼? ê???
          </h2>
          <p className="text-light-text mb-6">
            ?„ì˜ ?°ë½ì²˜ë¡œ ë¬¸ì˜?˜ì‹œê±°ë‚˜ ë¬¸ì˜ ?‘ì‹???µí•´ ?°ë½ì£¼ì„¸??
          </p>
          <Link
            href="/inquiry"
            className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
          >
            ë¬¸ì˜?˜ê¸°
          </Link>
        </section>
      </div>
    </Container>
  );
}

