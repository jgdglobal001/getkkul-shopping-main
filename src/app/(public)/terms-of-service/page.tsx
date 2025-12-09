export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "?댁슜?쎄? - Getkkul-shopping",
  description: "寃잕??쇳븨 ?댁슜?쎄?",
};

export default function TermsOfServicePage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            ?댁슜?쎄?
          </Title>
          <p className="text-light-text text-lg">
            寃잕??쇳븨 ?댁슜?쎄????뺤씤?섏꽭??
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-border-color rounded-lg p-6 lg:p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?紐⑹쟻
            </h2>
            <p className="text-light-text leading-relaxed">
              蹂??쎄?? 寃잕??쇳븨(?댄븯 &quot;?뚯궗&quot;)???쒓났?섎뒗 ?꾩옄?곴굅???쒕퉬???댄븯 &quot;?쒕퉬??quot;)瑜??댁슜?⑥뿉 ?덉뼱 ?뚯궗? ?댁슜?먯쓽 沅뚮━, ?섎Т 諛?梨낆엫?ы빆??洹쒖젙?⑥쓣 紐⑹쟻?쇰줈 ?⑸땲??
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議??⑹뼱???뺤쓽
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800 mb-1">1. &quot;?뚯궗&quot;</p>
                <p className="text-light-text">
                  ?꾩옄?곴굅???ъ뾽???곸쐞?섎뒗 寃잕??쇳븨???섎??⑸땲??
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">2. &quot;?댁슜??quot;</p>
                <p className="text-light-text">
                  蹂??쎄????숈쓽?섏뿬 ?뚯궗媛 ?쒓났?섎뒗 ?쒕퉬?ㅻ? ?댁슜?섎뒗 怨좉컼???섎??⑸땲??
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">3. &quot;?곹뭹&quot;</p>
                <p className="text-light-text">
                  ?뚯궗媛 ?쒓났?섎뒗 紐⑤뱺 臾쇳뭹 諛??⑹뿭???섎??⑸땲??
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議??쎄????⑤젰 諛?蹂寃?
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              蹂??쎄?? ?쒕퉬???붾㈃??寃뚯떆?⑥쑝濡쒖뜥 ?⑤젰??諛쒖깮?⑸땲??
            </p>
            <p className="text-light-text leading-relaxed">
              ?뚯궗???꾩슂??寃쎌슦 蹂??쎄???蹂寃쏀븷 ???덉쑝硫? 蹂寃쎈맂 ?쎄?? ?쒕퉬???붾㈃??寃뚯떆?⑥쑝濡쒖뜥 ?⑤젰??諛쒖깮?⑸땲??
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議??쒕퉬???댁슜 怨꾩빟
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?댁슜?먭? 蹂??쎄????숈쓽?섍퀬 ?뚯썝媛?낆쓣 ?꾨즺?섎㈃ ?쒕퉬???댁슜 怨꾩빟???깅┰?⑸땲??
            </p>
            <p className="text-light-text leading-relaxed">
              ?뚯궗???댁슜?먯쓽 ?좎껌??????쒕퉬???쒓났 媛???щ?瑜??먮떒?섏뿬 ?밸굺 ?먮뒗 嫄곗젅?????덉뒿?덈떎.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議??댁슜?먯쓽 ?섎Т
            </h2>
            <div className="space-y-2 text-light-text">
              <p>1. ?댁슜?먮뒗 蹂??쎄??먯꽌 洹쒖젙???ы빆怨?湲고? ?뚯궗媛 ?듭??섎뒗 ?ы빆??以?섑빐???⑸땲??</p>
              <p>2. ?댁슜?먮뒗 ??몄쓽 媛쒖씤?뺣낫瑜??꾩슜?섍굅??遺?뺥븳 諛⑸쾿?쇰줈 ?쒕퉬?ㅻ? ?댁슜?????놁뒿?덈떎.</p>
              <p>3. ?댁슜?먮뒗 ?뚯궗????묎텒 諛?吏?곸옱?곌텒??移⑦빐?????놁뒿?덈떎.</p>
              <p>4. ?댁슜?먮뒗 ?쒕퉬?ㅻ? ?듯빐 遺덈쾿?곸씤 ?댁슜??寃뚯떆?섍굅??諛고룷?????놁뒿?덈떎.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議??곹뭹 援щℓ 諛?寃곗젣
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?댁슜?먭? ?곹뭹???좏깮?섏뿬 援щℓ ?좎껌???섎㈃ 怨꾩빟 泥닿껐 ?섏궗瑜??쒖떆?섎뒗 寃껋쑝濡?遊낅땲??
            </p>
            <p className="text-light-text leading-relaxed">
              ?뚯궗???댁슜?먯쓽 援щℓ ?좎껌??????밸굺 ?먮뒗 嫄곗젅?????덉쑝硫? 寃곗젣 ?꾨즺 ??怨꾩빟???깅┰?⑸땲??
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?諛곗넚 諛?諛섑뭹
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?뚯궗??寃곗젣 ?꾨즺 ???곹뭹???좎냽?섍쾶 諛곗넚?⑸땲??
            </p>
            <p className="text-light-text leading-relaxed">
              ?댁슜?먮뒗 ?곹뭹 ?섎졊 ??7???대궡??諛섑뭹 ?좎껌???????덉뒿?덈떎. ?? ?곹뭹???섏옄媛 ?녿뒗 寃쎌슦 諛섑뭹 諛곗넚猷뚮뒗 ?댁슜?먭? 遺?댄빀?덈떎.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?硫댁콉議고빆
            </h2>
            <p className="text-light-text leading-relaxed">
              ?뚯궗??泥쒖옱吏蹂, ?꾩웳, ?뚮윭 ??遺덇???젰?곸씤 ?ъ쑀濡??명븳 ?쒕퉬??以묐떒?????梨낆엫??吏吏 ?딆뒿?덈떎.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?以嫄곕쾿 諛?愿??
            </h2>
            <p className="text-light-text leading-relaxed">
              蹂??쎄?? ??쒕?援?踰뺣쪧???곕씪 ?댁꽍?섎ŉ, 蹂??쎄?怨?愿?⑤맂 遺꾩웳? ??쒕?援?踰뺤썝??愿?좎쓣 諛쏆뒿?덈떎.
            </p>
          </section>

          {/* Last Updated */}
          <div className="border-t border-border-color pt-6 mt-8">
            <p className="text-sm text-gray-500">
              理쒖쥌 ?섏젙?? 2025??11??6??
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

