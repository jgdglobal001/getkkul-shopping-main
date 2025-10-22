import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Layout from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: "Getkkul-shopping - 대한민국 대표 온라인 쇼핑몰",
  description: "최고의 상품을 최저가로! 겟꿀쇼핑에서 스마트한 쇼핑을 경험하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <Header />
      {children}
      <Footer />
    </Layout>
  );
}
