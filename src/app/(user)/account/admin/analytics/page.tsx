export const runtime = 'edge';

import AdminAnalyticsClient from "@/components/admin/AdminAnalyticsClient";

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <AdminAnalyticsClient />
        </div>
    );
}
