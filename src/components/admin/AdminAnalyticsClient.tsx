"use client";

import { useState, useEffect } from "react";
import { AdminCardSkeleton, AdminStatsSkeleton } from "./AdminSkeletons";
import { useTranslation } from "react-i18next";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiCalendar,
  FiBarChart,
} from "react-icons/fi";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>;
}

export default function AdminAnalyticsClient() {
  const { t, i18n } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: '2-digit',
      month: 'short'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.analytics.title')}</h1>
        <AdminStatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCardSkeleton />
          <AdminCardSkeleton />
        </div>
        <AdminCardSkeleton />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.analytics.title')}</h1>
        <div className="text-center py-12">
          <FiBarChart className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-gray-500 mt-4">{t('admin.analytics.no_data')}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t('admin.analytics.total_revenue'),
      value: formatCurrency(analytics.totalRevenue),
      change: analytics.revenueGrowth,
      icon: FiDollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t('admin.analytics.total_orders'),
      value: analytics.totalOrders.toString(),
      change: analytics.ordersGrowth,
      icon: FiShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t('admin.analytics.total_users'),
      value: analytics.totalUsers.toString(),
      change: analytics.usersGrowth,
      icon: FiUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t('admin.analytics.average_order'),
      value: formatCurrency(analytics.averageOrderValue),
      change: 0,
      icon: FiPackage,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('admin.analytics.title')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-2">
                    {stat.change > 0 ? (
                      <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <FiTrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${stat.change > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {stat.change > 0 ? "+" : ""}
                      {stat.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {t('admin.analytics.from_last_month')}
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('admin.analytics.monthly_revenue')}
            </h3>
            <FiCalendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.monthlyRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{formatDate(item.month)}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.revenue /
                          Math.max(
                            ...analytics.monthlyRevenue.map((r) => r.revenue)
                          )) *
                          100
                          }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('admin.analytics.orders_by_status')}
            </h3>
            <FiBarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {analytics.ordersByStatus.map((item, index) => {
              const colors = [
                "bg-yellow-500",
                "bg-blue-500",
                "bg-indigo-500",
                "bg-green-500",
                "bg-red-500",
              ];
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${colors[index % colors.length]
                        }`}
                    />
                    <span className="text-sm text-gray-600 capitalize">
                      {/* Try to translate status if available, fallback to raw status */}
                      {t(`admin.status.${item.status}`, item.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {item.count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('admin.analytics.top_products')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.analytics.product_name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.analytics.sales')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.analytics.revenue')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs" title={product.name}>
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sales} {t('admin.analytics.units_suffix')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {analytics.topProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-4">{t('admin.analytics.no_products')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
