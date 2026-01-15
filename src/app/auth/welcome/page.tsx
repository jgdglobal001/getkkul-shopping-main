"use client";

export const runtime = 'edge';

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiCheckCircle, FiShoppingBag, FiUser, FiHeart } from "react-icons/fi";
import Confetti from "react-confetti";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const checkedRef = useRef(false);

  // returnTo 파라미터: 로그인 전 원래 페이지 (파트너 링크 등)
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    // Get window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('[Welcome] status:', status, 'session:', !!session);

    // 로딩 중이면 대기
    if (status === "loading") {
      return;
    }

    // 인증되지 않은 경우 - 로그인 페이지로 리다이렉트
    if (status === "unauthenticated") {
      console.log('[Welcome] Unauthenticated, redirecting to login');
      router.replace("/auth/signin");
      return;
    }

    // 세션이 있고 아직 체크 안 했으면
    if (status === "authenticated" && session?.user && !checkedRef.current) {
      checkedRef.current = true;

      async function checkNewUser() {
        // 방법 1: 세션에서 isNewUser 플래그 확인
        const userIsNewFromSession = (session!.user as any).isNewUser === true;
        console.log('[Welcome] isNewUser from session:', userIsNewFromSession);

        if (userIsNewFromSession) {
          setIsNewUser(true);
          return;
        }

        // 방법 2: API 호출로 createdAt 확인 (2분 이내면 신규)
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const userData = await response.json();
            const createdAt = new Date(userData.createdAt);
            const now = new Date();
            const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;

            console.log('[Welcome] createdAt:', createdAt, 'diffInSeconds:', diffInSeconds);

            // 2분(120초) 이내에 생성된 계정이면 신규 가입자
            if (diffInSeconds < 120) {
              console.log('[Welcome] New user detected by createdAt');
              setIsNewUser(true);
              return;
            }
          }
        } catch (error) {
          console.error('[Welcome] Error fetching profile:', error);
          // 에러 발생시에도 환영 페이지 표시 (신규 가입 직후일 가능성)
          setIsNewUser(true);
          return;
        }

        // 기존 회원이면 returnTo 또는 홈으로 리다이렉트
        const redirectUrl = returnTo || "/";
        console.log('[Welcome] Redirecting to', redirectUrl, '- not a new user');
        router.replace(redirectUrl);
      }

      checkNewUser();
    }
  }, [status, session, router]);

  // Loading state
  if (status === "loading" || isNewUser === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || "고객";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center py-12 px-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={["#FF6B35", "#FFB347", "#FFCC5C", "#FF8C00", "#FFA500"]}
        />
      )}

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500"></div>
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-12 h-12 text-green-500" />
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 회원가입 완료!
        </h1>
        <p className="text-xl text-orange-600 font-semibold mb-4">
          환영합니다, {userName}님!
        </p>
        <p className="text-gray-600 mb-8">
          겟꿀쇼핑의 회원이 되신 것을 진심으로 환영합니다.<br />
          지금 바로 다양한 상품을 만나보세요!
        </p>

        {/* Benefits Section */}
        <div className="bg-orange-50 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-orange-800 mb-3">
            ✨ 회원 혜택
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm">
                <FiShoppingBag className="w-5 h-5 text-orange-500" />
              </div>
              <span>특별 할인</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm">
                <FiHeart className="w-5 h-5 text-pink-500" />
              </div>
              <span>위시리스트</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 shadow-sm">
                <FiUser className="w-5 h-5 text-blue-500" />
              </div>
              <span>주문 관리</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={returnTo || "/"}
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {returnTo ? "🛒 상품으로 돌아가기" : "🛒 쇼핑 시작하기"}
          </Link>
          <Link
            href="/account"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            👤 마이페이지로 이동
          </Link>
        </div>

        {/* Free Shipping Notice */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            🚚 <span className="text-orange-600 font-medium">₩29,000</span> 이상 주문시 무료배송!
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-sm text-gray-400">
        겟꿀쇼핑과 함께 즐거운 쇼핑 되세요! 💛
      </p>
    </div>
  );
}

