import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PurchaseWidget from "@/components/PurchaseWidget";
import StateProvider from "@/components/auth/StateProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import Script from "next/script";
import PartnerRefTracker from "@/components/PartnerRefTracker";
import { Suspense } from "react";
import { cookies } from "next/headers";

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* const cookieStore = await cookies();
  const lang = cookieStore.get("i18next")?.value || "ko"; */
  const lang = "ko";

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
    <html lang={lang} suppressHydrationWarning>
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
              <CurrencyProvider>
                <Suspense fallback={null}>
                  <PartnerRefTracker />
                </Suspense>
                {children}
              </CurrencyProvider>
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
