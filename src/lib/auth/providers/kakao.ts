import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface KakaoProfile {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email?: string;
  };
}

export default function Kakao<P extends KakaoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: {
      url: "https://kauth.kakao.com/oauth/authorize",
      params: {
        scope: "profile_nickname profile_image account_email",
        response_type: "code",
      },
    },
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: {
      url: "https://kapi.kakao.com/v2/user/me",
      async request({ tokens, provider }) {
        const response = await fetch(provider.userinfo?.url as string, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });
        return await response.json();
      },
    },
    profile(profile: P) {
      return {
        id: profile.id.toString(),
        name: profile.kakao_account.profile.nickname || profile.properties.nickname,
        email: profile.kakao_account.email || null,
        image: profile.kakao_account.profile.profile_image_url || profile.properties.profile_image || null,
      };
    },
    style: {
      logo: "/kakao-logo.svg",
      logoDark: "/kakao-logo.svg",
      bg: "#FEE500",
      text: "#000000",
      bgDark: "#FEE500",
      textDark: "#000000",
    },
    options,
  };
}
