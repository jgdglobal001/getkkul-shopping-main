export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { db } from '@/lib/db';
import { paymentMethods, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// DELETE: 빌링키 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ billingKey: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { billingKey } = await params;

        if (!billingKey) {
            return NextResponse.json(
                { error: 'billingKey is required' },
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

        // 해당 결제 수단이 사용자의 것인지 확인
        const existingMethod = await db
            .select()
            .from(paymentMethods)
            .where(
                and(
                    eq(paymentMethods.billingKey, billingKey),
                    eq(paymentMethods.userId, userId)
                )
            )
            .limit(1);

        if (!existingMethod.length) {
            return NextResponse.json(
                { error: 'Payment method not found' },
                { status: 404 }
            );
        }

        // Toss Payments API로 빌링키 삭제 요청
        const secretKey = process.env.TOSS_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json(
                { error: 'Toss secret key not configured' },
                { status: 500 }
            );
        }

        const credentials = Buffer.from(`${secretKey}:`).toString('base64');

        const tossResponse = await fetch(
            `https://api.tosspayments.com/v1/billing/${billingKey}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                },
            }
        );

        // Toss API 삭제 실패해도 DB에서는 삭제 진행 (이미 삭제된 경우 등)
        if (!tossResponse.ok) {
            const errorData = await tossResponse.json().catch(() => ({}));
            console.warn('Toss API delete warning:', errorData);
            // 404인 경우 이미 삭제된 것이므로 계속 진행
            if (tossResponse.status !== 404) {
                console.error('Toss API delete error:', errorData);
            }
        }

        // DB에서 결제 수단 삭제
        await db
            .delete(paymentMethods)
            .where(
                and(
                    eq(paymentMethods.billingKey, billingKey),
                    eq(paymentMethods.userId, userId)
                )
            );

        // 삭제된 카드가 기본 결제 수단이었다면 다른 카드를 기본으로 설정
        if (existingMethod[0].isDefault) {
            const remainingMethods = await db
                .select()
                .from(paymentMethods)
                .where(eq(paymentMethods.userId, userId))
                .orderBy(paymentMethods.createdAt)
                .limit(1);

            if (remainingMethods.length > 0) {
                await db
                    .update(paymentMethods)
                    .set({ isDefault: true })
                    .where(eq(paymentMethods.id, remainingMethods[0].id));
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        return NextResponse.json(
            { error: 'Failed to delete payment method' },
            { status: 500 }
        );
    }
}
