"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 파트너 링크에서 전달된 partner_ref를 세션 스토리지에 저장하는 컴포넌트
 * 겟꿀 파트너스에서 생성된 링크로 접속 시 partner_ref, link_id가 URL 파라미터로 전달됨
 */
export default function PartnerRefTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const partnerRef = searchParams.get("partner_ref");
    const linkId = searchParams.get("link_id");

    if (partnerRef) {
      // 세션 스토리지에 저장 (브라우저 세션 동안 유지)
      sessionStorage.setItem("partner_ref", partnerRef);
      console.log("[PartnerRefTracker] partner_ref saved:", partnerRef);

      if (linkId) {
        sessionStorage.setItem("partner_link_id", linkId);
        console.log("[PartnerRefTracker] partner_link_id saved:", linkId);
      }

      // 저장 시간도 기록 (24시간 유효성 체크용)
      sessionStorage.setItem("partner_ref_timestamp", Date.now().toString());
    }
  }, [searchParams]);

  return null; // UI 렌더링 없음
}

/**
 * 세션 스토리지에서 파트너 정보 가져오기
 * 24시간 이내의 파트너 정보만 유효
 */
export function getPartnerInfo(): { partnerRef: string | null; linkId: string | null } {
  if (typeof window === "undefined") {
    return { partnerRef: null, linkId: null };
  }

  const partnerRef = sessionStorage.getItem("partner_ref");
  const linkId = sessionStorage.getItem("partner_link_id");
  const timestamp = sessionStorage.getItem("partner_ref_timestamp");

  // 24시간(86400000ms) 이내인지 확인
  if (partnerRef && timestamp) {
    const savedTime = parseInt(timestamp, 10);
    const now = Date.now();
    const hoursPassed = (now - savedTime) / (1000 * 60 * 60);

    if (hoursPassed > 24) {
      // 24시간 초과 - 무효화
      sessionStorage.removeItem("partner_ref");
      sessionStorage.removeItem("partner_link_id");
      sessionStorage.removeItem("partner_ref_timestamp");
      console.log("[PartnerRefTracker] Partner ref expired (24h)");
      return { partnerRef: null, linkId: null };
    }
  }

  return { partnerRef, linkId };
}

/**
 * 파트너 정보 초기화 (결제 완료 후 호출)
 */
export function clearPartnerInfo(): void {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("partner_ref");
  sessionStorage.removeItem("partner_link_id");
  sessionStorage.removeItem("partner_ref_timestamp");
  console.log("[PartnerRefTracker] Partner info cleared");
}
