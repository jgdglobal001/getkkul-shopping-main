"use client";

export const runtime = 'edge';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLoader, FiCheck, FiX } from "react-icons/fi";

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("카드 정보를 등록하는 중입니다...");

    useEffect(() => {
        const processCallback = async () => {
            try {
                const authKey = searchParams.get("authKey");
                const customerKey = searchParams.get("customerKey");
                const code = searchParams.get("code");
                const errorMessage = searchParams.get("message");

                // 실패한 경우
                if (code || errorMessage) {
                    setStatus("error");
                    setMessage(errorMessage || "카드 등록에 실패했습니다.");
                    setTimeout(() => {
                        router.push(`/account/payment?error=${encodeURIComponent(errorMessage || "카드 등록 실패")}`);
                    }, 2000);
                    return;
                }

                // 필수 파라미터 확인
                if (!authKey || !customerKey) {
                    setStatus("error");
                    setMessage("필수 정보가 누락되었습니다.");
                    setTimeout(() => {
                        router.push("/account/payment?error=" + encodeURIComponent("필수 정보가 누락되었습니다."));
                    }, 2000);
                    return;
                }

                // 빌링키 발급 API 호출
                const response = await fetch("/api/payment-methods/issue", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        authKey,
                        customerKey,
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus("success");
                    setMessage("카드가 성공적으로 등록되었습니다!");
                    setTimeout(() => {
                        router.push("/account/payment?success=true");
                    }, 1500);
                } else {
                    setStatus("error");
                    setMessage(data.error || "카드 등록에 실패했습니다.");
                    setTimeout(() => {
                        router.push(`/account/payment?error=${encodeURIComponent(data.error || "카드 등록 실패")}`);
                    }, 2000);
                }
            } catch (error) {
                console.error("Callback processing error:", error);
                setStatus("error");
                setMessage("처리 중 오류가 발생했습니다.");
                setTimeout(() => {
                    router.push("/account/payment?error=" + encodeURIComponent("처리 중 오류가 발생했습니다."));
                }, 2000);
            }
        };

        processCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full mx-4">
                {status === "loading" && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiLoader className="text-3xl text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">처리 중</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <FiCheck className="text-3xl text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">등록 완료</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <FiX className="text-3xl text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">등록 실패</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                <p className="text-sm text-gray-400 mt-4">
                    잠시 후 자동으로 이동합니다...
                </p>
            </div>
        </div>
    );
}
