import { TrendingUp, TrendingDown, Phone, Calendar, DollarSign, BarChart3 } from 'lucide-react'
import { AnalyticsData } from '@/hooks/useAnalytics'
import UAECurrency from '@/components/ui/uae-currency'
import StatCard from '@/components/ui/stat-card'

interface StatsCardsProps {
  analytics: AnalyticsData;
  callsTrend: {
    percentage: number;
    isPositive: boolean;
  };
  bookingsTrend: {
    percentage: number;
    isPositive: boolean;
  };
}

export default function StatsCards({ analytics, callsTrend, bookingsTrend }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Calls"
        icon={<Phone className="h-4 w-4 text-primary" />}
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900">{analytics.totalCalls}</div>
            <div className="flex items-center gap-2 text-sm">
              {callsTrend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={callsTrend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {callsTrend.percentage.toFixed(1)}%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </>
        }
      />

      <StatCard
        title="Total Bookings"
        icon={<Calendar className="h-4 w-4 text-primary" />}
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</div>
            <div className="flex items-center gap-2 text-sm">
              {bookingsTrend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={bookingsTrend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {bookingsTrend.percentage.toFixed(1)}%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </>
        }
      />

      <StatCard
        title="Revenue"
        icon={<DollarSign className="h-4 w-4 text-primary" />}
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-1"><UAECurrency />{analytics.revenue.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">12.3%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </>
        }
      />

      <StatCard
        title="Conversion Rate"
        icon={<BarChart3 className="h-4 w-4 text-primary" />}
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">3.2%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </>
        }
      />
    </div>
  )
}
