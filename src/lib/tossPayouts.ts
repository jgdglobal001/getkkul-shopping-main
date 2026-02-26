/**
 * 토스페이먼츠 지급대행 (Payouts) API 유틸리티
 * 
 * 지급대행 API는 JWE 암호화가 필요합니다.
 * - 알고리즘: dir (Direct Encryption)
 * - 암호화: A256GCM
 * - 보안 키: 64자 hex 문자열
 */

import { CompactEncrypt, compactDecrypt } from 'jose';

const uuidv4 = () => crypto.randomUUID();

const TOSS_API_URL = 'https://api.tosspayments.com';

// 보안 키를 바이트 배열로 변환
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// JWE 암호화
async function encryptPayload(payload: object, securityKey: string): Promise<string> {
  const key = hexToBytes(securityKey);
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  
  const now = new Date();
  const iat = now.toISOString().replace('Z', '+09:00'); // 한국 시간대
  const nonce = crypto.randomUUID();
  
  const jwe = await new CompactEncrypt(data)
    .setProtectedHeader({
      alg: 'dir',
      enc: 'A256GCM',
      iat,
      nonce,
    })
    .encrypt(key);
  
  return jwe;
}

// JWE 복호화
async function decryptPayload(encryptedData: string, securityKey: string): Promise<object> {
  const key = hexToBytes(securityKey);
  const { plaintext } = await compactDecrypt(encryptedData, key);
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(plaintext));
}

// 지급대행 요청 인터페이스
export interface PayoutRequest {
  refPayoutId: string;           // 고유 지급 ID
  destination: string;           // 셀러 ID (토스에 등록된)
  scheduleType: 'EXPRESS' | 'SCHEDULED';  // EXPRESS: 당일, SCHEDULED: 예약
  payoutDate?: string;           // SCHEDULED일 경우 지급일 (yyyy-MM-dd)
  amount: {
    currency: 'KRW';
    value: number;
  };
  transactionDescription: string;  // 거래 설명 (입금통장 표시)
  metadata?: Record<string, string>;
}

// 지급대행 응답 인터페이스
export interface PayoutResponse {
  id: string;
  refPayoutId: string;
  destination: string;
  scheduleType: string;
  payoutDate: string;
  amount: {
    currency: string;
    value: number;
  };
  transactionDescription: string;
  requestedAt: string;
  status: 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  error: { code: string; message: string } | null;
  metadata?: Record<string, string>;
}

/**
 * 지급대행 요청
 */
export async function requestPayout(request: PayoutRequest): Promise<PayoutResponse> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  const securityKey = process.env.TOSS_SECURITY_KEY;
  
  if (!secretKey || !securityKey) {
    throw new Error('TOSS_SECRET_KEY or TOSS_SECURITY_KEY not configured');
  }
  
  // JWE 암호화
  const encryptedBody = await encryptPayload(request, securityKey);
  
  const response = await fetch(`${TOSS_API_URL}/v2/payouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'text/plain',
      'TossPayments-api-security-mode': 'ENCRYPTION',
    },
    body: encryptedBody,
  });
  
  const encryptedResponse = await response.text();
  
  if (!response.ok) {
    // 에러 응답도 암호화되어 있을 수 있음
    try {
      const decrypted = await decryptPayload(encryptedResponse, securityKey);
      throw new Error(JSON.stringify(decrypted));
    } catch {
      throw new Error(`Payout request failed: ${encryptedResponse}`);
    }
  }
  
  // 응답 복호화
  const decryptedResponse = await decryptPayload(encryptedResponse, securityKey) as {
    entityBody: { items: PayoutResponse[] };
  };
  
  return decryptedResponse.entityBody.items[0];
}

/**
 * 파트너 커미션 지급 요청 (간편 함수)
 */
export async function payPartnerCommission(
  partnerLinkId: string,
  sellerId: string,
  commissionAmount: number,
  orderId: string
): Promise<PayoutResponse> {
  const refPayoutId = `COMM-${orderId}-${Date.now()}`;
  
  // 다음 영업일 계산 (간단히 내일로 설정, 실제로는 영업일 확인 필요)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const payoutDate = tomorrow.toISOString().split('T')[0];
  
  return requestPayout({
    refPayoutId,
    destination: sellerId,
    scheduleType: 'SCHEDULED',
    payoutDate,
    amount: {
      currency: 'KRW',
      value: Math.floor(commissionAmount), // 정수로 변환
    },
    transactionDescription: '겟꿀 파트너 커미션',
    metadata: {
      partnerLinkId,
      orderId,
    },
  });
}

