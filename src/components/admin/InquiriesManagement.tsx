"use client";

import { useState, useEffect } from "react";
import { FiTrash2, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

interface Answer {
  id: string;
  answer: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Inquiry {
  id: string;
  question: string;
  isAnswered: boolean;
  createdAt: string;
  product: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  answers: Answer[];
}

const InquiriesManagement = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unanswered" | "answered">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/inquiries", window.location.origin);
      if (filter !== "all") {
        url.searchParams.append("isAnswered", filter === "answered" ? "true" : "false");
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("문의 조회 실패");

      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (questionId: string) => {
    const answer = answerText[questionId];
    if (!answer?.trim()) {
      toast.error("답변을 입력해주세요");
      return;
    }

    try {
      setSubmitting({ ...submitting, [questionId]: true });
      const response = await fetch(`/api/admin/inquiries/${questionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer })
      });

      if (!response.ok) throw new Error("답변 작성 실패");

      const newAnswer = await response.json();
      
      // 로컬 상태 업데이트
      setInquiries(
        inquiries.map((inq) =>
          inq.id === questionId
            ? {
                ...inq,
                isAnswered: true,
                answers: [...inq.answers, newAnswer]
              }
            : inq
        )
      );

      setAnswerText({ ...answerText, [questionId]: "" });
      toast.success("답변이 등록되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했습니다");
    } finally {
      setSubmitting({ ...submitting, [questionId]: false });
    }
  };

  const handleDeleteAnswer = async (answerId: string, questionId: string) => {
    if (!confirm("답변을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${answerId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("답변 삭제 실패");

      setInquiries(
        inquiries.map((inq) =>
          inq.id === questionId
            ? {
                ...inq,
                answers: inq.answers.filter((a) => a.id !== answerId)
              }
            : inq
        )
      );

      toast.success("답변이 삭제되었습니다");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "오류가 발생했습니다");
    }
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="flex gap-2">
        {(["all", "unanswered", "answered"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === f
                ? "bg-theme-color text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f === "all" ? "전체" : f === "unanswered" ? "미답변" : "답변완료"}
          </button>
        ))}
      </div>

      {/* 문의 목록 */}
      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === "all" ? "문의가 없습니다" : "해당하는 문의가 없습니다"}
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* 질문 헤더 */}
              <div
                onClick={() =>
                  setExpandedId(expandedId === inquiry.id ? null : inquiry.id)
                }
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {inquiry.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {inquiry.user.email}
                      </span>
                      {inquiry.isAnswered && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          답변완료
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      상품: {inquiry.product.title}
                    </p>
                    <p className="text-gray-700">{inquiry.question}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>

              {/* 확장된 내용 */}
              {expandedId === inquiry.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  {/* 기존 답변 */}
                  {inquiry.answers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">답변</h4>
                      {inquiry.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs font-semibold text-blue-900">
                                {answer.user.name}
                              </p>
                              <p className="text-xs text-blue-700">
                                {new Date(answer.createdAt).toLocaleDateString(
                                  "ko-KR"
                                )}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteAnswer(answer.id, inquiry.id)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gray-700 text-sm">{answer.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 답변 작성 폼 */}
                  {!inquiry.isAnswered && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">답변 작성</h4>
                      <textarea
                        value={answerText[inquiry.id] || ""}
                        onChange={(e) =>
                          setAnswerText({
                            ...answerText,
                            [inquiry.id]: e.target.value
                          })
                        }
                        placeholder="답변을 입력해주세요"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-color focus:border-transparent resize-none"
                      />
                      <button
                        onClick={() => handleSubmitAnswer(inquiry.id)}
                        disabled={submitting[inquiry.id]}
                        className="bg-theme-color text-white px-4 py-2 rounded-lg hover:bg-theme-color/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <FiSend className="w-4 h-4" />
                        {submitting[inquiry.id] ? "등록 중..." : "답변 등록"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InquiriesManagement;

