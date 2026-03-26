import { NextResponse } from "next/server";
import {
    buildBrandpayCustomerIdentity,
    getBrandpayCustomerKeyCookieName,
    isBrandpayCustomerKeyVerified,
    normalizeBrandpayReturnPath,
} from "@/lib/tossUtils";

export const runtime = 'edge';

function readCookieValue(cookieHeader: string | null, cookieName: string) {
    if (!cookieHeader) {
        return null;
    }

    const prefix = `${cookieName}=`;

    for (const part of cookieHeader.split(";")) {
        const normalizedPart = part.trim();
        if (!normalizedPart.startsWith(prefix)) {
            continue;
        }

        try {
            return decodeURIComponent(normalizedPart.slice(prefix.length));
        } catch {
            return normalizedPart.slice(prefix.length);
        }
    }

    return null;
}

function appendClearCookieHeader(response: NextResponse, cookieName: string, isSecure: boolean) {
    response.headers.append(
        "Set-Cookie",
        `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax${isSecure ? "; Secure" : ""}`,
    );

    return response;
}

export async function POST(req: Request) {
    const requestUrl = new URL(req.url);
    const isSecure = requestUrl.protocol === "https:";
    let cookieName = getBrandpayCustomerKeyCookieName();

    try {
        const body = await req.json();
        const code = typeof body?.code === "string" ? body.code : null;
        const customerKey = typeof body?.customerKey === "string" ? body.customerKey : null;
        const customerIdentity = buildBrandpayCustomerIdentity(
            typeof body?.customerIdentity === "object" && body.customerIdentity !== null
                ? body.customerIdentity
                : undefined,
        );
        const returnUrl = normalizeBrandpayReturnPath(
            typeof body?.returnUrl === "string" ? body.returnUrl : null,
        );

        cookieName = getBrandpayCustomerKeyCookieName(returnUrl);

        if (!code || !customerKey) {
            return appendClearCookieHeader(
                NextResponse.json({ error: "Missing required parameters" }, { status: 400 }),
                cookieName,
                isSecure,
            );
        }

        const expectedCustomerKey = readCookieValue(req.headers.get("cookie"), cookieName);

        if (!expectedCustomerKey) {
            return appendClearCookieHeader(
                NextResponse.json(
                    { error: "브랜드페이 인증 정보가 만료되었습니다. 원래 화면에서 다시 시도해주세요." },
                    { status: 401 },
                ),
                cookieName,
                isSecure,
            );
        }

        if (!isBrandpayCustomerKeyVerified(expectedCustomerKey, customerKey)) {
            return appendClearCookieHeader(
                NextResponse.json(
                    { error: "브랜드페이 고객 인증 정보가 일치하지 않습니다. 다시 시도해주세요." },
                    { status: 403 },
                ),
                cookieName,
                isSecure,
            );
        }

        const secretKey = process.env.TOSS_WIDGET_SECRET_KEY;
        if (!secretKey) {
            console.error("TOSS_WIDGET_SECRET_KEY is not defined");
            return appendClearCookieHeader(
                NextResponse.json({ error: "Server configuration error" }, { status: 500 }),
                cookieName,
                isSecure,
            );
        }

        const basicToken = btoa(`${secretKey}:`);

        const response = await fetch("https://api.tosspayments.com/v1/brandpay/authorizations/access-token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grantType: "AuthorizationCode",
                code,
                customerKey,
                ...(customerIdentity ? { customerIdentity } : {}),
            }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error("Toss Brandpay Token Error:", data);
            return appendClearCookieHeader(
                NextResponse.json({
                    ...(typeof data === "object" && data ? data : {}),
                    message: data?.message || data?.error?.message || "Access Token 발급에 실패했습니다.",
                }, { status: response.status }),
                cookieName,
                isSecure,
            );
        }

        return appendClearCookieHeader(NextResponse.json(data), cookieName, isSecure);
    } catch (error: any) {
        console.error("Access Token API Error:", error);
        return appendClearCookieHeader(
            NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 }),
            cookieName,
            isSecure,
        );
    }
}
