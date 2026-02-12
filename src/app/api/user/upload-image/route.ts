export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

// R2 버킷 타입 정의
interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer | ReadableStream | string | null,
    options?: {
      httpMetadata?: {
        contentType?: string;
        cacheControl?: string;
      };
      customMetadata?: Record<string, string>;
    }
  ): Promise<unknown>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string }): Promise<{ objects: { key: string }[] }>;
}

// Cloudflare 환경 타입
interface CloudflareEnv {
  R2_BUCKET?: R2Bucket;
  R2_PUBLIC_URL?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const email = formData.get("email") as string;

    if (!file || !email) {
      return NextResponse.json(
        { error: "Image file and email are required" },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Cloudflare R2에 이미지 업로드
    const { env } = getRequestContext() as { env: CloudflareEnv };

    // R2 버킷이 바인딩되어 있는지 확인
    if (!env.R2_BUCKET) {
      console.error("R2_BUCKET binding not found");
      return NextResponse.json(
        { error: "Storage service not configured" },
        { status: 503 }
      );
    }

    // 파일명 생성: profiles/{email_hash}_{timestamp}.{ext}
    const emailHash = await hashEmail(email);
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `profiles/${emailHash}_${timestamp}.${ext}`;

    // 기존 이미지 삭제 (같은 이메일 해시로 시작하는 파일들)
    try {
      const existingFiles = await env.R2_BUCKET.list({ prefix: `profiles/${emailHash}_` });
      for (const obj of existingFiles.objects) {
        await env.R2_BUCKET.delete(obj.key);
      }
    } catch (deleteError) {
      console.warn("Failed to delete old images:", deleteError);
      // 삭제 실패해도 업로드는 계속 진행
    }

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();

    // R2에 업로드
    await env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // 1년 캐시
      },
      customMetadata: {
        email: email,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    // 공개 URL 생성
    const publicUrl = env.R2_PUBLIC_URL
      ? `${env.R2_PUBLIC_URL}/${key}`
      : `https://images.getkkul.com/${key}`;

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      key: key,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 이메일을 해시하여 파일명에 사용 (개인정보 보호)
async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
