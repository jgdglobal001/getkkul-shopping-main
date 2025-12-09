export const runtime = 'edge';

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "媛쒖씤?뺣낫泥섎━諛⑹묠 - Getkkul-shopping",
  description: "寃잕??쇳븨 媛쒖씤?뺣낫泥섎━諛⑹묠",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-10 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title className="text-3xl lg:text-4xl font-bold mb-4">
            媛쒖씤?뺣낫泥섎━諛⑹묠
          </Title>
          <p className="text-light-text text-lg">
            寃잕??쇳븨??媛쒖씤?뺣낫泥섎━諛⑹묠???뺤씤?섏꽭??          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-border-color rounded-lg p-6 lg:p-8 space-y-8">
          {/* Privacy Officer */}
          <section className="bg-light-bg rounded-lg p-6 border-l-4 border-theme-color">
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              媛쒖씤?뺣낫蹂댄샇梨낆엫??            </h2>
            <div className="space-y-2 text-light-text">
              <p><span className="font-semibold text-gray-800">?대쫫:</span> 諛깆씤??/p>
              <p><span className="font-semibold text-gray-800">吏곸콉:</span> 媛쒖씤?뺣낫蹂댄샇梨낆엫??/p>
              <p><span className="font-semibold text-gray-800">?곕씫泥?</span> 010-7218-2858</p>
              <p><span className="font-semibold text-gray-800">?대찓??</span> jgdglobal@kakao.com</p>
            </div>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?媛쒖씤?뺣낫???섏쭛 諛??댁슜
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              寃잕??쇳븨? ?ㅼ쓬怨?媛숈? 媛쒖씤?뺣낫瑜??섏쭛?⑸땲??
            </p>
            <div className="space-y-2 text-light-text">
              <p>???꾩닔?뺣낫: ?대쫫, ?대찓?? ?꾪솕踰덊샇, 二쇱냼</p>
              <p>???좏깮?뺣낫: ?앸뀈?붿씪, ?깅퀎, 愿?ъ궗</p>
              <p>???먮룞?섏쭛?뺣낫: IP二쇱냼, 荑좏궎, ?묒냽濡쒓렇</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?媛쒖씤?뺣낫???댁슜 紐⑹쟻
            </h2>
            <div className="space-y-2 text-light-text">
              <p>???뚯썝 媛??諛?愿由?/p>
              <p>???곹뭹 諛??쒕퉬???쒓났</p>
              <p>??二쇰Ц 泥섎━ 諛?諛곗넚</p>
              <p>??怨좉컼 ?곷떞 諛?臾몄젣 ?닿껐</p>
              <p>??留덉???諛?愿묎퀬 (?숈쓽 ??</p>
              <p>???듦퀎 遺꾩꽍 諛??쒕퉬??媛쒖꽑</p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?媛쒖씤?뺣낫??蹂댁쑀 諛??댁슜 湲곌컙
            </h2>
            <p className="text-light-text leading-relaxed">
              媛쒖씤?뺣낫???섏쭛 紐⑹쟻 ?ъ꽦 ?쒓퉴吏 蹂댁쑀?섎ŉ, ?댁슜?먯쓽 ?붿껌 ??利됱떆 ??젣?⑸땲?? ?? 愿??踰뺣졊???곕씪 蹂닿????꾩슂??寃쎌슦???대떦 湲곌컙 ?숈븞 蹂닿??⑸땲??
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?媛쒖씤?뺣낫???????쒓났
            </h2>
            <p className="text-light-text leading-relaxed">
              寃잕??쇳븨? ?댁슜?먯쓽 ?숈쓽 ?놁씠 媛쒖씤?뺣낫瑜????먯뿉寃??쒓났?섏? ?딆뒿?덈떎. ?? 諛곗넚 ???쒕퉬???쒓났???꾪빐 ?꾩슂??寃쎌슦 愿???낆껜???쒗븳?곸쑝濡??쒓났?????덉뒿?덈떎.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?媛쒖씤?뺣낫??蹂댁븞
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              寃잕??쇳븨? 媛쒖씤?뺣낫 蹂댄샇瑜??꾪빐 ?ㅼ쓬怨?媛숈? 議곗튂瑜?痍⑦빀?덈떎:
            </p>
            <div className="space-y-2 text-light-text">
              <p>??SSL ?뷀샇???듭떊</p>
              <p>???묎렐 沅뚰븳 ?쒗븳</p>
              <p>???뺢린?곸씤 蹂댁븞 媛먯떆</p>
              <p>??吏곸썝 蹂댁븞 援먯쑁</p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議??댁슜?먯쓽 沅뚮━
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              ?댁슜?먮뒗 ?ㅼ쓬怨?媛숈? 沅뚮━瑜?媛吏묐땲??
            </p>
            <div className="space-y-2 text-light-text">
              <p>??媛쒖씤?뺣낫 ?대엺 ?붿껌</p>
              <p>??媛쒖씤?뺣낫 ?섏젙 ?붿껌</p>
              <p>??媛쒖씤?뺣낫 ??젣 ?붿껌</p>
              <p>??媛쒖씤?뺣낫 泥섎━ ?뺤? ?붿껌</p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?荑좏궎 諛?異붿쟻 湲곗닠
            </h2>
            <p className="text-light-text leading-relaxed">
              寃잕??쇳븨? ?댁슜?먯쓽 ?몄쓽瑜??꾪빐 荑좏궎瑜??ъ슜?⑸땲?? ?댁슜?먮뒗 釉뚮씪?곗? ?ㅼ젙???듯빐 荑좏궎 ?ъ슜??嫄곕??????덉뒿?덈떎.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-theme-color mb-4">
              ??議?媛쒖씤?뺣낫 移⑦빐 ?좉퀬
            </h2>
            <p className="text-light-text leading-relaxed mb-3">
              媛쒖씤?뺣낫 移⑦빐 愿???좉퀬???ㅼ쓬 湲곌????????덉뒿?덈떎:
            </p>
            <div className="space-y-2 text-light-text">
              <p>??媛쒖씤?뺣낫蹂댄샇?꾩썝?? www.pipc.go.kr</p>
              <p>???寃李곗껌 ?ъ씠踰꾨쾾二꾩닔?щ떒: www.spo.go.kr</p>
              <p>??寃쎌같泥??ъ씠踰꾩븞?꾧낵: www.police.go.kr</p>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-border-color pt-6 mt-8">
            <p className="text-sm text-gray-500">
              理쒖쥌 ?섏젙?? 2025??11??6??            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

