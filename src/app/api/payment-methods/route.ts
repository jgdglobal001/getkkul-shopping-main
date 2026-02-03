export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { db } from '@/lib/db';
import { paymentMethods, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET: 사용자의 등록된 결제 수단 목록 조회
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        // 결제 수단 목록 조회
        const methods = await db
            .select()
            .from(paymentMethods)
            .where(eq(paymentMethods.userId, userId))
            .orderBy(paymentMethods.createdAt);

        return NextResponse.json({ paymentMethods: methods });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment methods' },
            { status: 500 }
        );
    }
}
