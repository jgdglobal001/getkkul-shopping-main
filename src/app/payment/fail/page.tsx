export const runtime = 'edge';

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default function PaymentFail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">寃곗젣 ?ㅽ뙣</h1>
        <p className="text-gray-600 mb-4">寃곗젣 泥섎━ 以?臾몄젣媛 諛쒖깮?덉뒿?덈떎.</p>

        <div className="bg-red-50 rounded p-4 mb-6 text-left">
          {errorMessage && (
            <p className="text-sm text-red-600">
              <span className="font-semibold">?ㅻ쪟:</span> {decodeURIComponent(errorMessage)}
            </p>
          )}
          {errorCode && (
            <p className="text-sm text-red-600 mt-2">
              <span className="font-semibold">肄붾뱶:</span> {errorCode}
            </p>
          )}
          {orderId && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">二쇰Ц踰덊샇:</span> {orderId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="block w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-primary-dark transition"
          >
            寃곗젣 ?ㅼ떆 ?쒕룄
          </button>
          <Link
            href="/account/orders"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-300 transition"
          >
            二쇰Ц 紐⑸줉?쇰줈
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          臾몄젣媛 怨꾩냽?섎㈃ 怨좉컼 吏?먰???臾몄쓽?섏꽭??
        </p>
      </div>
    </div>
  );
}