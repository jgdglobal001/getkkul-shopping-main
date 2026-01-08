import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PurchaseWidget from "@/components/PurchaseWidget";
import StateProvider from "@/components/auth/StateProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.getkkul.com'),
  title: {
    default: "겟꿀쇼핑 getkkul - 대한민국 대표 온라인 쇼핑몰",
    template: "%s | 겟꿀쇼핑 getkkul",
  },
  description: "겟꿀쇼핑 getkkul: 최고의 상품을 최저가로! 대한민국 대표 온라인 쇼핑몰에서 스마트한 쇼핑을 경험하세요. 무료배송, 빠른배송, 안전결제",
  keywords: ["겟꿀쇼핑", "getkkul", "겟꿀", "온라인쇼핑", "쇼핑몰", "최저가", "무료배송", "인터넷쇼핑"],
  authors: [{ name: "겟꿀쇼핑 getkkul" }],
  creator: "겟꿀쇼핑 getkkul",
  publisher: "겟꿀쇼핑 getkkul",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // icons metadata is now handled automatically by src/app/icon.png
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.getkkul.com",
    siteName: "겟꿀쇼핑 getkkul",
    title: "겟꿀쇼핑 getkkul - 대한민국 대표 온라인 쇼핑몰",
    description: "최고의 상품을 최저가로! 겟꿀쇼핑 getkkul에서 스마트한 쇼핑을 경험하세요.",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "겟꿀쇼핑 getkkul",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "겟꿀쇼핑 getkkul - 대한민국 대표 온라인 쇼핑몰",
    description: "최고의 상품을 최저가로! 겟꿀쇼핑 getkkul에서 스마트한 쇼핑을 경험하세요.",
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
    google: "ed4a8c2fc42ae331",
    other: {
      "naver-site-verification": "61b98c7285ab413cf1d86a504bce1328",
    },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "겟꿀쇼핑",
    "alternateName": "getkkul",
    "url": "https://www.getkkul.com",
    "logo": "https://www.getkkul.com/getkkul-logo-fabicon1.png",
    "sameAs": [
      "https://www.instagram.com/getkkul",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-10-0000-0000",
      "contactType": "customer service"
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "겟꿀쇼핑",
    "url": "https://www.getkkul.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.getkkul.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
