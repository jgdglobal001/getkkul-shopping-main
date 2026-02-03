export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { db } from '@/lib/db';
import { paymentMethods, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST: authKey로 빌링키 발급 완료
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { authKey, customerKey } = body;

        if (!authKey || !customerKey) {
            return NextResponse.json(
                { error: 'authKey and customerKey are required' },
                { status: 400 }
            );
        }

        // 사용자 ID 조회
        const user = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);

        if (!user.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = user[0].id;

        // Toss Payments API로 빌링키 발급 요청
        const secretKey = process.env.TOSS_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json(
                { error: 'Toss secret key not configured' },
                { status: 500 }
            );
        }

        const credentials = Buffer.from(`${secretKey}:`).toString('base64');

        const tossResponse = await fetch(
            'https://api.tosspayments.com/v1/billing/authorizations/issue',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    authKey,
                    customerKey,
                }),
            }
        );

        if (!tossResponse.ok) {
            const errorData = await tossResponse.json();
            console.error('Toss API error:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to issue billing key' },
                { status: tossResponse.status }
            );
        }

        const billingData = await tossResponse.json();

        // DB에 결제 수단 저장
        const paymentMethodId = `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await db.insert(paymentMethods).values({
            id: paymentMethodId,
            userId,
            billingKey: billingData.billingKey,
            customerKey: billingData.customerKey,
            cardCompany: billingData.card?.issuerCode || null,
            cardNumber: billingData.card?.number || null,
            cardType: billingData.card?.cardType || null,
            ownerType: billingData.card?.ownerType || null,
            issuerCode: billingData.card?.issuerCode || null,
            acquirerCode: billingData.card?.acquirerCode || null,
            authenticatedAt: billingData.authenticatedAt ? new Date(billingData.authenticatedAt) : new Date(),
        });

        // 처음 등록하는 카드라면 기본 결제 수단으로 설정
        const existingMethods = await db
            .select()
            .from(paymentMethods)
            .where(eq(paymentMethods.userId, userId));

        if (existingMethods.length === 1) {
            await db
                .update(paymentMethods)
                .set({ isDefault: true })
                .where(eq(paymentMethods.id, paymentMethodId));
        }

        return NextResponse.json({
            success: true,
            paymentMethod: {
                id: paymentMethodId,
                cardNumber: billingData.card?.number,
                cardType: billingData.card?.cardType,
            },
        });
    } catch (error) {
        console.error('Error issuing billing key:', error);
        return NextResponse.json(
            { error: 'Failed to issue billing key' },
            { status: 500 }
        );
    }
}
