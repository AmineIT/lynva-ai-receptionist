import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Phone, Calendar, DollarSign, BarChart3 } from 'lucide-react'
import { AnalyticsData } from '@/hooks/useAnalytics'

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Total Calls
          </CardDescription>
          <CardTitle className="text-2xl">{analytics.totalCalls}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Total Bookings
          </CardDescription>
          <CardTitle className="text-2xl">{analytics.totalBookings}</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Revenue
          </CardDescription>
          <CardTitle className="text-2xl">${analytics.revenue.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">12.3%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Conversion Rate
          </CardDescription>
          <CardTitle className="text-2xl">{analytics.conversionRate}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">3.2%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
