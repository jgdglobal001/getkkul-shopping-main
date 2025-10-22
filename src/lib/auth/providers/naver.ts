import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface NaverProfile {
  resultcode: string;
  message: string;
  response: {
    id: string;
    nickname: string;
    name: string;
    email: string;
    gender: string;
    age: string;
    birthday: string;
    profile_image: string;
    birthyear: string;
    mobile: string;
  };
}

export default function Naver<P extends NaverProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: {
      url: "https://nid.naver.com/oauth2.0/authorize",
      params: {
        scope: "name email profile_image",
        response_type: "code",
      },
    },
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: {
      url: "https://openapi.naver.com/v1/nid/me",
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
        id: profile.response.id,
        name: profile.response.name || profile.response.nickname,
        email: profile.response.email || null,
        image: profile.response.profile_image || null,
      };
    },
    style: {
      logo: "/naver-logo.svg",
      logoDark: "/naver-logo.svg",
      bg: "#03C75A",
      text: "#FFFFFF",
      bgDark: "#03C75A",
      textDark: "#FFFFFF",
    },
    options,
  };
}
