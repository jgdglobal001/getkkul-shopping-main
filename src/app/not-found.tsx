import Link from "next/link";
import Container from "@/components/Container";

import QuickNavigation from "@/components/not-found/QuickNavigation";
import PopularCategories from "@/components/not-found/PopularCategories";
import { Metadata } from "next";
import NotFoundClient from "@/components/not-found/NotFoundClient";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | Getkkul-shopping",
  description:
    "찾으시는 페이지가 존재하지 않습니다. 홈페이지로 돌아가거나 상품을 둘러보세요.",
};

export default function GlobalNotFound() {
  return (
    <Container className="py-20">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl">🔍</span>
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-red-400 opacity-20 animate-ping"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            앗! 페이지를 찾을 수 없습니다
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            찾으시는 페이지가 디지털 공간 어딘가로 사라진 것 같네요.
            걱정하지 마세요! 멋진 상품들이 기다리고 있는 곳으로 안내해드릴게요!
          </p>

          {/* Interactive countdown component */}
          <NotFoundClient />
        </div>

        {/* Quick Navigation Grid */}
        <QuickNavigation />

        {/* Popular Categories Section */}
        <PopularCategories className="my-12" />

        {/* Search and Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🔍</span>
              <h3 className="text-lg font-semibold text-blue-900">
                Looking for something specific?
              </h3>
            </div>
            <p className="text-blue-700 mb-4">
              Use our powerful search feature to find exactly what you need.
              Search by product name, category, brand, or keywords.
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <span className="mr-2">🚀</span>
              Try Search Now
            </Link>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">�</span>
              <h3 className="text-lg font-semibold text-green-900">
                Need help?
              </h3>
            </div>
            <p className="text-green-700 mb-4">
              Our customer support team is available 24/7 to assist you. Get
              help with orders, products, or account issues.
            </p>
            <div className="space-y-2">
              <p className="text-green-600 font-medium">📧 support@shofy.com</p>
              <p className="text-green-600 font-medium">� +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
