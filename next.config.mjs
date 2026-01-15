import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// 개발 환경에서 Cloudflare 환경 시뮬레이션
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cloudflare Pages 설정
  trailingSlash: false,
  skipTrailingSlashRedirect: true,

  // 이미지 설정 - Cloudflare에서는 기본 이미지 최적화 비활성화
  images: {
    // Cloudflare Pages에서 Next.js 이미지 최적화 비활성화
    // 대신 Cloudflare Images 또는 외부 이미지 서비스 사용 권장
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**", // Cloudflare에서 모든 외부 이미지 허용
      },
    ],
  },

  // Cloudflare Pages 최적화
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Edge Runtime에서 필요한 외부 패키지
  serverExternalPackages: ["@neondatabase/serverless"],
};

export default nextConfig;
