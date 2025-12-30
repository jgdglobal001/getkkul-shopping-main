"use client";

export const runtime = 'edge';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { FiCheckCircle, FiShoppingBag, FiUser, FiHeart } from "react-icons/fi";
import Confetti from "react-confetti";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const checkedRef = useRef(false);

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
    // 세션 로딩 완료 후 처리
    if (status === "authenticated" && session?.user && !checkedRef.current) {
      checkedRef.current = true;

      // 방법 1: 세션에서 isNewUser 플래그 확인
      const userIsNewFromSession = (session.user as any).isNewUser === true;

      // 방법 2: sessionStorage에서 회원가입 시도 플래그 확인
      const registerAttempt = sessionStorage.getItem('register_attempt');

      // 방법 3: 이미 환영 페이지를 본 적 있는지 확인
      const alreadyShown = sessionStorage.getItem('welcome_shown');

      console.log('[Welcome] isNewUser from session:', userIsNewFromSession);
      console.log('[Welcome] register_attempt:', registerAttempt);
      console.log('[Welcome] alreadyShown:', alreadyShown);

      if (userIsNewFromSession) {
        // 세션에서 신규 사용자로 확인됨
        sessionStorage.removeItem('register_attempt');
        sessionStorage.setItem('welcome_shown', 'true');
        setIsNewUser(true);
      } else if (registerAttempt && !alreadyShown) {
        // 회원가입 페이지에서 왔고, 아직 환영 페이지 안 봄
        sessionStorage.removeItem('register_attempt');
        sessionStorage.setItem('welcome_shown', 'true');
        setIsNewUser(true);
      } else {
        // 기존 회원이거나 이미 환영 페이지를 본 경우
        console.log('[Welcome] Redirecting to home');
        router.replace("/");
      }
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
            href="/"
            className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🛒 쇼핑 시작하기
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

