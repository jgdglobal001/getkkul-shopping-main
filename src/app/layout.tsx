import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UserSyncProvider } from "@/components/UserSyncProvider";
import Head from "next/head";
import PurchaseWidget from "@/components/PurchaseWidget";
import StateProvider from "@/components/auth/StateProvider";
import I18nProvider from "@/components/providers/I18nProvider";

export const metadata: Metadata = {
  title: "Getkkul-shopping - 대한민국 대표 온라인 쇼핑몰",
  description: "최고의 상품을 최저가로! 겟꿀쇼핑에서 스마트한 쇼핑을 경험하세요.",
  icons: {
    icon: "/getkkul-logo-fabicon.png",
    shortcut: "/getkkul-logo-fabicon.png",
    apple: "/getkkul-logo-fabicon.png",
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
              <UserSyncProvider>
                <CurrencyProvider>{children}</CurrencyProvider>
                <PurchaseWidget />
              </UserSyncProvider>
            </AuthProvider>
          </StateProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
