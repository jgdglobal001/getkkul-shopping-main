export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "?뚯궗?뚭컻 - Getkkul-shopping",
  description:
    "寃잕??쇳븨??????먯꽭???뚯븘蹂댁꽭??- ?좊ː?????덈뒗 ??쒕?援?????⑤씪???쇳븨紐?,
};

export default function AboutPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            寃잕??쇳븨 ?뚭컻
          </Title>
          <p className="text-light-text text-lg">
            理쒓퀬???곹뭹??理쒖?媛濡? ?좊ː?????덈뒗 ??쒕?援?????⑤씪???쇳븨紐?
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:gap-12">
          {/* Our Story */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?곕━???댁빞湲?
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              2024?꾩뿉 ?ㅻ┰??寃잕??쇳븨? 怨좉컼?먭쾶 理쒓퀬???쇳븨 寃쏀뿕???쒓났?섎뒗
              ??쒕?援?????⑤씪???쇳븨紐곕줈 ?깆옣?덉뒿?덈떎.
              ??щ뒗 理쒓퀬 ?덉쭏???곹뭹怨??곗뼱???쇳븨 寃쏀뿕???쒓났?섍린 ?꾪빐 ?몃젰?섍퀬 ?덉뒿?덈떎.
              ?⑤씪???쇳븨??紐⑤뱺 ?щ엺?먭쾶 媛꾨떒?섍퀬, ?덉쟾?섍퀬, 利먭굅?뚯빞 ?쒕떎怨?誘우뒿?덈떎.
            </p>
            <p className="text-light-text leading-relaxed">
              ??ъ쓽 ?ъ젙? 媛꾨떒??誘몄뀡?쇰줈 ?쒖옉?섏뿀?듬땲?? ?덉쭏 ?덈뒗 ?곹뭹怨????멸퀎 怨좉컼 ?ъ씠??媛꾧꺽??醫곹엳??寃껋엯?덈떎.
              ?ㅻ뒛????щ뒗 ?ㅼ뼇??移댄뀒怨좊━??嫄몄퀜 ?ㅼ뼇???곹뭹?쇰줈 ?섏쿇 紐낆쓽 留뚯”??怨좉컼???ш린怨??덉뒿?덈떎.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?곕━??誘몄뀡
            </h2>
            <p className="text-light-text leading-relaxed">
              怨좉컼?먭쾶 寃쎌웳???덈뒗 媛寃⑹쑝濡?怨좏뭹吏??곹뭹???묎렐?????덈룄濡??쒓났?섎㈃???곗뼱??怨좉컼 ?쒕퉬?ㅻ? ?쒓났?섎뒗 寃껋엯?덈떎.
              ??щ뒗 湲곕?瑜?珥덇낵?섍퀬 怨좉컼怨??ㅻ옒 吏?띾릺??愿怨꾨? 援ъ텞?섎뒗 ?꾨꼍???쇳븨 寃쏀뿕??留뚮뱾湲??꾪빐 ?몃젰?⑸땲??
            </p>
          </section>

          {/* What Sets Us Apart */}
          <section className="bg-light-bg rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-6">
              ?곕━瑜?李⑤퀎?뷀븯??寃?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ?덉쭏 蹂댁쬆
                  </h3>
                  <p className="text-light-text text-sm">
                    紐⑤뱺 ?곹뭹? 理쒓퀬???덉쭏 湲곗???蹂댁옣?섍린 ?꾪빐 ?좎쨷?섍쾶 ?좏깮?섍퀬 ?뚯뒪?몃맗?덈떎.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    鍮좊Ⅸ 諛곗넚
                  </h3>
                  <p className="text-light-text text-sm">
                    鍮좊Ⅴ怨??좊ː?????덈뒗 諛곗넚?쇰줈 ?곹뭹??理쒕???鍮⑤━ 諛쏆쑝?몄슂.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    怨좉컼 吏??
                  </h3>
                  <p className="text-light-text text-sm">
                    24/7 怨좉컼 ?쒕퉬?ㅻ줈 紐⑤뱺 吏덈Ц?대굹 ?곕젮?ы빆???꾩??쒕┰?덈떎.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-theme-color rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    ?덉쟾???쇳븨
                  </h3>
                  <p className="text-light-text text-sm">
                    媛쒖씤?뺣낫? 寃곗젣 ?뺣낫瑜?蹂댄샇?섍린 ?꾪븳 怨좉툒 蹂댁븞 議곗튂.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="bg-theme-white border border-border-color rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?곕━???
            </h2>
            <p className="text-light-text leading-relaxed mb-4">
              寃잕??쇳븨 ?ㅼ뿉???쇳븨 寃쏀뿕??媛쒖꽑?섍린 ?꾪빐 ?딆엫?놁씠 ?몃젰?섎뒗 ?붿옄?대꼫, 媛쒕컻?? 怨좉컼 ?쒕퉬???꾨Ц媛?ㅼ쓽 ?댁젙?곸씤 ????덉뒿?덈떎.
              ??щ뒗 ?곸떊, ?덉쭏, 怨좉컼 留뚯”??理쒖꽑???ㅽ븯怨??덉뒿?덈떎.
            </p>
            <p className="text-light-text leading-relaxed">
              ??ъ쓽 ?ㅼ뼇???? ?꾩옄?곴굅?? 湲곗닠, 臾쇰쪟, 怨좉컼 愿怨????ㅼ뼇??遺꾩빞???꾨Ц 吏?앹쓣 紐⑥븘
              紐⑤뱺 ?붽뎄?ы빆??異⑹”?섎뒗 ?ш큵?곸씤 ?쇳븨 ?뚮옯?쇱쓣 留뚮뱾怨??덉뒿?덈떎.
            </p>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-sky-color/10 rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-theme-color mb-4">
              ?쇳븨??以鍮꾧? ?섏뀲?섏슂?
            </h2>
            <p className="text-light-text mb-6">
              ??ъ쓽 ?ㅼ뼇???곹뭹???먯깋?섍퀬 寃잕??쇳븨??李⑥씠瑜?寃쏀뿕?대낫?몄슂.
            </p>
            <Link
              href="/products"
              className="inline-block bg-theme-color text-theme-white px-6 py-3 rounded-lg hover:bg-theme-color/90 transition-colors duration-200 font-medium"
            >
              ?곹뭹 蹂닿린
            </Link>
          </section>
        </div>
      </div>
    </Container>
  );
}
