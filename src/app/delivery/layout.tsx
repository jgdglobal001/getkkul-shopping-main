import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "배송 대시보드 - Getkkul-shopping",
  description:
    "배송 관리 대시보드 - 배송 추적 및 업데이트",
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
