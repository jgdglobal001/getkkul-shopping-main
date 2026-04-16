export const runtime = 'edge';

import { ProductType } from "../../../../../type";
import { db, products, productOptions, productVariants, productQuestions, productAnswers, users } from "@/lib/db";
import { eq, and, ne, asc, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

// 동적 렌더링 설정
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const SingleProductPage = async ({ params }: Props) => {
  const { id } = await params;

  // 1. DB에서 상품 정보 조회
  const productResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
  let product: any = productResult[0] || null;

  // 2. 옵션과 variants 조회
  if (product) {
    const [options, variants] = await Promise.all([
      db.select().from(productOptions).where(eq(productOptions.productId, id)).orderBy(asc(productOptions.order)),
      db.select().from(productVariants).where(and(eq(productVariants.productId, id), eq(productVariants.isActive, true))).orderBy(asc(productVariants.createdAt)),
    ]);
    product.options = options;
    product.variants = variants;
  }

  // 3. DB에 없으면 404
  if (!product) {
    notFound();
  }

  // 4. 관련 상품 조회
  const dbRelated = await db
    .select()
    .from(products)
    .where(and(
      eq(products.category, product.category),
      eq(products.isActive, true),
      ne(products.id, product.id)
    ))
    .limit(10);
  const allProducts: ProductType[] = dbRelated as ProductType[];

  // 5. 상품 질문 조회
  let questions: any[] = [];
  {
    const questionsResult = await db
      .select({
        id: productQuestions.id,
        question: productQuestions.question,
        isAnswered: productQuestions.isAnswered,
        createdAt: productQuestions.createdAt,
        userName: users.name,
      })
      .from(productQuestions)
      .leftJoin(users, eq(productQuestions.userId, users.id))
      .where(eq(productQuestions.productId, product.id))
      .orderBy(desc(productQuestions.createdAt));

    questions = await Promise.all(
      questionsResult.map(async (q) => {
        const answersResult = await db
          .select({
            id: productAnswers.id,
            answer: productAnswers.answer,
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
          answers: answersResult.map((a: any) => ({
            ...a,
            user: { name: a.userName },
          })),
        };
      })
    );
  }

  // 데이터 통합 후 클라이언트 컴포넌트로 전달 (안전한 렌더링 목적)
  return (
    <ProductDetailClient
      product={product}
      allProducts={allProducts}
      questions={questions}
    />
  );
};

export default SingleProductPage;
