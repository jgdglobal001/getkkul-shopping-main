"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ProductType } from "../../type";
import { FiSend, FiUser, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

interface Question {
  id: string;
  question: string;
  user: {
    name: string;
  };
  createdAt: string;
  isAnswered: boolean;
  answers: Answer[];
}

interface Answer {
  id: string;
  answer: string;
  user: {
    name: string;
  };
  createdAt: string;
}

interface ProductQAProps {
  product: ProductType;
  questions: Question[];
}

const ProductQA = ({ product, questions }: ProductQAProps) => {
  const { data: session } = useSession();
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("로그인이 필요합니다");
      return;
    }

    if (!newQuestion.trim()) {
      toast.error("질문을 입력해주세요");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/product-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          question: newQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error("질문 등록에 실패했습니다");
      }

      const newQ = await response.json();
      setLocalQuestions([newQ, ...localQuestions]);
      setNewQuestion("");
      toast.success("질문이 등록되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6 border-t border-gray-200">
      <h3 className="text-base font-semibold text-gray-900 mb-6">고객 문의</h3>

      {/* 질문 작성 폼 */}
      {session?.user ? (
        <form onSubmit={handleSubmitQuestion} className="mb-8 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="상품에 대해 궁금한 점을 물어봐주세요"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            {submitting ? "등록 중..." : "질문하기"}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-800">
            질문을 하려면 <a href="/login" className="font-semibold hover:underline">로그인</a>이 필요합니다
          </p>
        </div>
      )}

      {/* 질문 목록 */}
      <div className="space-y-4">
        {localQuestions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">아직 질문이 없습니다</p>
        ) : (
          localQuestions.map((q) => (
            <div key={q.id} className="border border-gray-200 rounded-lg p-4">
              {/* 질문 */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{q.user.name}</span>
                    {q.isAnswered && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        답변완료
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FiClock className="w-3 h-3" />
                    {new Date(q.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                <p className="text-gray-700">{q.question}</p>
              </div>

              {/* 답변 */}
              {q.answers.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-theme-color">
                  {q.answers.map((a) => (
                    <div key={a.id} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-theme-color">
                          [답변] {a.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{a.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductQA;

