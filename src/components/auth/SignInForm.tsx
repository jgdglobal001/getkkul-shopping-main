"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { SiKakao, SiNaver } from "react-icons/si";
import { toast } from "react-hot-toast";

export default function SignInForm() {
  const router = useRouter();

  const handleOAuthSignIn = async (provider: "google" | "kakao" | "naver") => {
    try {
      // 모든 OAuth 로그인은 /auth/welcome으로 리다이렉트
      // welcome 페이지에서 신규/기존 회원 판단 후 적절히 처리
      await signIn(provider, { callbackUrl: "/auth/welcome" });
    } catch (error) {
      toast.error("소셜 로그인에 실패했습니다");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          소셜 계정으로 로그인
        </h3>
        <p className="text-sm text-gray-600">
          간편하고 안전한 소셜 로그인을 이용해보세요
        </p>
      </div>

      <div className="space-y-3">
        {/* Kakao 로그인 */}
        <button
          onClick={() => handleOAuthSignIn("kakao")}
          className="w-full inline-flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-black hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#FEE500" }}
        >
          <SiKakao className="h-5 w-5" />
          <span className="ml-2">카카오로 로그인</span>
        </button>

        {/* Naver 로그인 */}
        <button
          onClick={() => handleOAuthSignIn("naver")}
          className="w-full inline-flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#03C75A" }}
        >
          <SiNaver className="h-5 w-5" />
          <span className="ml-2">네이버로 로그인</span>
        </button>

        {/* Google 로그인 */}
        <button
          onClick={() => handleOAuthSignIn("google")}
          className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaGoogle className="h-5 w-5 text-red-500" />
          <span className="ml-2">구글로 로그인</span>
        </button>
      </div>

      <div className="text-center mt-6">
        <span className="text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            회원가입
          </Link>
        </span>
      </div>
    </div>
  );
}
