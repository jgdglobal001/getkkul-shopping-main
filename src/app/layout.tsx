import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Head from "next/head";
import PurchaseWidget from "@/components/PurchaseWidget";
import StateProvider from "@/components/auth/StateProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.getkkul.com'),
  title: {
    default: "겟꿀쇼핑 - 대한민국 대표 온라인 쇼핑몰",
    template: "%s | 겟꿀쇼핑",
  },
  description: "최고의 상품을 최저가로! 겟꿀쇼핑에서 스마트한 쇼핑을 경험하세요. 무료배송, 빠른배송, 안전결제",
  keywords: ["겟꿀쇼핑", "온라인쇼핑", "쇼핑몰", "최저가", "무료배송", "getkkul", "인터넷쇼핑"],
  authors: [{ name: "겟꿀쇼핑" }],
  creator: "겟꿀쇼핑",
  publisher: "겟꿀쇼핑",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/getkkul-logo-fabicon.png",
    shortcut: "/getkkul-logo-fabicon.png",
    apple: "/getkkul-logo-fabicon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.getkkul.com",
    siteName: "겟꿀쇼핑",
    title: "겟꿀쇼핑 - 대한민국 대표 온라인 쇼핑몰",
    description: "최고의 상품을 최저가로! 겟꿀쇼핑에서 스마트한 쇼핑을 경험하세요.",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "겟꿀쇼핑",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "겟꿀쇼핑 - 대한민국 대표 온라인 쇼핑몰",
    description: "최고의 상품을 최저가로! 겟꿀쇼핑에서 스마트한 쇼핑을 경험하세요.",
    images: ["/thumbnail.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ed4a8c2fc42ae331", // 구글 서치콘솔 인증 (기존 파일에서 추출)
    // naver: "네이버서치어드바이저인증코드", // 나중에 추가
  },
  alternates: {
    canonical: "https://www.getkkul.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <I18nProvider>
          <StateProvider>
            <AuthProvider>
              <CurrencyProvider>{children}</CurrencyProvider>
              <PurchaseWidget />
            </AuthProvider>
          </StateProvider>
        </I18nProvider>
        {/* Toss Payments SDK V2 */}
        <Script
          src="https://js.tosspayments.com/v2/standard"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
