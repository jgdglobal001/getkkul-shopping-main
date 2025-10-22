"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiClock,
  FiSettings,
  FiBarChart,
  FiShoppingCart,
  FiUserCheck,
  FiActivity,
  FiCalendar,
  FiEye,
  FiEdit,
  FiPlus,
} from "react-icons/fi";
import { useSession } from "next-auth/react";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  monthlyRevenue: number;
}

interface RecentOrder {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 실제 데이터 가져오기
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 통계 데이터와 최근 주문을 병렬로 가져오기
        const [statsResponse, ordersResponse] = await Promise.all([
          fetch("/api/admin/dashboard/stats"),
          fetch("/api/admin/dashboard/recent-orders")
        ]);

        if (!statsResponse.ok || !ordersResponse.ok) {
          throw new Error("데이터를 가져오는 중 오류가 발생했습니다");
        }

        const statsData = await statsResponse.json();
        const ordersData = await ordersResponse.json();

        setStats(statsData);
        setRecentOrders(ordersData);

      } catch (err) {
        console.error("대시보드 데이터 로딩 오류:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '완료': return 'bg-green-100 text-green-800';
      case '배송중': return 'bg-blue-100 text-blue-800';
      case '처리중': return 'bg-yellow-100 text-yellow-800';
      case '취소': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="h-8 bg-blue-400 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-blue-300 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiActivity className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                데이터 로딩 오류
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
            <p className="text-blue-100">
              안녕하세요, {session?.user?.name}님! 오늘도 좋은 하루 되세요.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatDate(new Date().toISOString())}</div>
            <div className="text-blue-100">오늘 {stats.todayOrders}개 주문</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">총 사용자</h3>
            <FiUsers className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalUsers.toLocaleString()}
          </div>
          <p className="text-sm text-green-600 font-medium">+12% 이번 달</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">총 주문</h3>
            <FiShoppingBag className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalOrders.toLocaleString()}
          </div>
          <p className="text-sm text-green-600 font-medium">+8% 이번 달</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">총 매출</h3>
            <FiDollarSign className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-sm text-green-600 font-medium">+15% 이번 달</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">총 상품</h3>
            <FiPackage className="h-8 w-8 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalProducts.toLocaleString()}
          </div>
          <p className="text-sm text-blue-600 font-medium">활성 상품</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">처리 대기</h3>
            <FiClock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {stats.pendingOrders}
          </div>
          <p className="text-sm text-gray-500">처리가 필요한 주문</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">완료된 주문</h3>
            <FiTrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-2">
            {stats.completedOrders}
          </div>
          <p className="text-sm text-gray-500">성공적으로 완료</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">이번 달 매출</h3>
            <FiBarChart className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {formatCurrency(stats.monthlyRevenue)}
          </div>
          <p className="text-sm text-gray-500">월간 수익</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">빠른 작업</h3>
            <FiSettings className="h-6 w-6 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/account/admin/users"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all group"
            >
              <FiUsers className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-blue-900">사용자 관리</div>
              <div className="text-xs text-blue-600 text-center mt-1">
                {stats.totalUsers}명 등록
              </div>
            </Link>

            <Link
              href="/account/admin/orders"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg transition-all group"
            >
              <FiShoppingBag className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-green-900">주문 관리</div>
              <div className="text-xs text-green-600 text-center mt-1">
                {stats.pendingOrders}개 대기중
              </div>
            </Link>

            <Link
              href="/account/admin/products"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all group"
            >
              <FiPackage className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-purple-900">상품 관리</div>
              <div className="text-xs text-purple-600 text-center mt-1">
                {stats.totalProducts}개 상품
              </div>
            </Link>

            <Link
              href="/account/admin/analytics"
              className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all group"
            >
              <FiBarChart className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-medium text-orange-900">분석 보고서</div>
              <div className="text-xs text-orange-600 text-center mt-1">
                실시간 데이터
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">최근 주문</h3>
            <Link
              href="/account/admin/orders"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              전체 보기 <FiEye className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{order.orderId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.customerName} • {formatCurrency(order.amount)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                    <FiEdit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              href="/account/admin/orders"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              새 주문 추가
            </Link>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">시스템 상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <FiActivity className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">데이터베이스</div>
            <div className="text-xs text-green-600 font-medium">정상 작동</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <FiSettings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">API 서버</div>
            <div className="text-xs text-blue-600 font-medium">정상 작동</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <FiUserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">인증 시스템</div>
            <div className="text-xs text-purple-600 font-medium">정상 작동</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <FiCalendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">마지막 업데이트</div>
            <div className="text-xs text-orange-600 font-medium">방금 전</div>
          </div>
        </div>
      </div>
    </div>
  );
}
