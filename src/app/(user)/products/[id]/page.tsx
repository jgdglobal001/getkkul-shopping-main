export const runtime = 'edge';

import Container from "@/components/Container";
import Image from "next/image";
import { ProductType } from "../../../../../type";
import { getData } from "@/app/(user)/helpers";
import ProductImages from "@/components/ProductImages";
import PriceFormat from "@/components/PriceFormat";
import { FaRegEye } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import ProductPrice from "@/components/ProductPrice";
import ProductQA from "@/components/ProductQA";
import RelatedProducts from "@/components/RelatedProducts";
import ProductRequiredInfo from "@/components/ProductRequiredInfo";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import ProductDetailsInfo from "@/components/ProductDetailsInfo";
import ProductPurchaseSection from "@/components/ProductPurchaseSection";
import { db, products, productOptions, productVariants, productQuestions, productAnswers, users } from "@/lib/db";
import { eq, and, ne, asc, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

// ?숈쟻 ?뚮뜑留??ㅼ젙 (DB 荑쇰━ ?뚮Ц??
export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string;
  };
}

const SingleProductPage = async ({ params }: Props) => {
  const { id } = await params;

  // DB?먯꽌 癒쇱? ?곹뭹 李얘린
  const productResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
  let product: any = productResult[0] || null;

  // ?듭뀡怨?variants 議고쉶
  if (product) {
    const [options, variants] = await Promise.all([
      db.select().from(productOptions).where(eq(productOptions.productId, id)).orderBy(asc(productOptions.order)),
      db.select().from(productVariants).where(and(eq(productVariants.productId, id), eq(productVariants.isActive, true))).orderBy(asc(productVariants.createdAt)),
    ]);
    product.options = options;
    product.variants = variants;
  }

  // DB???놁쑝硫?DummyJSON?먯꽌 李얘린 (紐⑤컮??移댄뀒怨좊━留?
  if (!product) {
    const dummyEndpoint = `https://dummyjson.com/products/${id}`;
    product = await getData(dummyEndpoint);

    // DummyJSON?먯꽌 李얠? ?곹뭹??smartphones 移댄뀒怨좊━媛 ?꾨땲硫?404
    if (!product || product.category !== "smartphones") {
      notFound();
    }
  }

  // 愿???곹뭹 議고쉶 (媛숈? 移댄뀒怨좊━)
  let allProducts: ProductType[] = [];
  if (product.category === "smartphones") {
    // ?붾? 移댄뀒怨좊━硫?DummyJSON?먯꽌 議고쉶
    const dummyData = await getData(`https://dummyjson.com/products/category/smartphones?limit=0`);
    allProducts = dummyData?.products || [];
  } else {
    // DB 移댄뀒怨좊━硫?DB?먯꽌 議고쉶
    const dbRelated = await db
      .select()
      .from(products)
      .where(and(
        eq(products.category, product.category),
        eq(products.isActive, true),
        ne(products.id, product.id)
      ))
      .limit(10);
    allProducts = dbRelated as ProductType[];
  }

  // ?곹뭹 吏덈Ц 議고쉶 (DB ?곹뭹留?- DummyJSON? 吏덈Ц 誘몄???
  let questions: any[] = [];
  if (product.category !== "smartphones") {
    // DB ?곹뭹留?議고쉶
    const questionsResult = await db
      .select({
        id: productQuestions.id,
        content: productQuestions.content,
        isSecret: productQuestions.isSecret,
        createdAt: productQuestions.createdAt,
        userName: users.name,
      })
      .from(productQuestions)
      .leftJoin(users, eq(productQuestions.userId, users.id))
      .where(eq(productQuestions.productId, product.id))
      .orderBy(desc(productQuestions.createdAt));

    // Get answers for each question
    questions = await Promise.all(
      questionsResult.map(async (q) => {
        const answersResult = await db
          .select({
            id: productAnswers.id,
            content: productAnswers.content,
            createdAt: productAnswers.createdAt,
            userName: users.name,
          })
          .from(productAnswers)
          .leftJoin(users, eq(productAnswers.userId, users.id))
          .where(eq(productAnswers.questionId, q.id))
          .orderBy(asc(productAnswers.createdAt));

        return {
          ...q,
          user: { name: q.userName },
          answers: answersResult.map((a) => ({
            ...a,
            user: { name: a.userName },
          })),
        };
      })
    );
  }

  const regularPrice = product?.price;
  const discountedPrice = product?.price - (product?.price * product?.discountPercentage) / 100;

  return (
    <div>
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
        {/* Product Image */}
        <ProductImages thumbnail={product?.thumbnail} images={product?.images} />
        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product?.title}</h2>
          <div className="flex items-center justify-between">
            <ProductPrice
              regularPrice={regularPrice}
              discountedPrice={discountedPrice}
              product={product}
            />

            <div className="flex items-center gap-1">
              <div className="text-base text-light-text flex items-center">
                {Array?.from({ length: 5 })?.map((_, index) => {
                  const filled = index + 1 <= Math.floor(product?.rating);
                  const halfFilled =
                    index + 1 > Math.floor(product?.rating) &&
                    index < Math.ceil(product?.rating);

                  return (
                    <MdStar
                      key={index}
                      className={`${
                        filled
                          ? "text-[#fa8900]"
                          : halfFilled
                          ? "text-[#f7ca00]"
                          : "text-light-text"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-base font-semibold">{`(${product?.rating?.toFixed(
                1
              )} 由щ럭)`}</p>
            </div>
          </div>
          <p className="flex items-center">
            <FaRegEye className="mr-1" />{" "}
            <span className="font-semibold mr-1">250+</span> 紐낆씠 吏湲????곹뭹??蹂닿퀬 ?덉뒿?덈떎
          </p>

          <ProductDetailsInfo product={product} />

          {/* ?듭뀡 ?좏깮 諛?援щℓ 踰꾪듉 */}
          <ProductPurchaseSection
            product={product}
            options={product.options || []}
            variants={product.variants || []}
          />
        </div>

        {/* ?꾩닔 ?쒓린 ?뺣낫 */}
        <div className="col-span-2">
          <ProductRequiredInfo product={product} />
        </div>

        {/* ?곸꽭 ?뺣낫 ??*/}
        <div className="col-span-2">
          <ProductDetailTabs product={product} />
        </div>

        {/* 怨좉컼 臾몄쓽 */}
        <div className="col-span-2">
          <ProductQA product={product} questions={questions} />
        </div>

        {/* Reviews */}
        <div className="p-10 bg-[#f7f7f7] col-span-2 flex items-center flex-wrap gap-10">
          {product?.reviews?.map((item, index) => (
            <div
              key={index.toString()}
              className="bg-white/80 p-5 border border-amazonOrangeDark/50 rounded-md hover:border-amazonOrangeDark hover:bg-white duration-200 flex flex-col gap-1"
            >
              <p className="text-base font-semibold">{item?.comment}</p>
              <div className="text-xs">
                <p className="font-semibold">{item?.reviewerName}</p>
                <p className="">{item?.reviewerEmail}</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {Array?.from({ length: 5 })?.map((_, index) => (
                    <MdStar
                      key={index}
                      className={`${
                        index < item?.rating
                          ? "text-yellow-500"
                          : "text-light-text"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Related Products Section */}
      <Container>
        <RelatedProducts
          products={allProducts}
          currentProductId={product?.id}
          category={product?.category}
        />
      </Container>
    </div>
  );
};

export default SingleProductPage;
