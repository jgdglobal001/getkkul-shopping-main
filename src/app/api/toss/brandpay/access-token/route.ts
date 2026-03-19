import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { code, customerKey } = await req.json();

        if (!code || !customerKey) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // 브랜드페이 단독 발급용(코어) 시크릿 키 사용 필수
        const secretKey = process.env.TOSS_CORE_SECRET_KEY;
        if (!secretKey) {
            console.error("TOSS_CORE_SECRET_KEY is not defined");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const basicToken = Buffer.from(`${secretKey}:`).toString("base64");

        // V2 브랜드페이 SDK여도 액세스 토큰 발급 API는 v1 규격을 사용
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
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Toss Brandpay Token Error:", data);
            return NextResponse.json(data, { status: response.status });
        }

        // 정상 발급 시 토스가 내부적으로 AccessToken을 영구 관리하므로, 별도 보관 로직을 강제하지 않습니다.
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Access Token API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
