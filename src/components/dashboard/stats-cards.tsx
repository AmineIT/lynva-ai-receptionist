import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Phone, DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { DashboardStats } from '@/hooks/useDashboardAnalytics'

export default function StatsCards({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Today's Bookings
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.todayBookings}</div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        {stats.bookingsTrend !== 0 && (
                            stats.bookingsTrend > 0 ? (
                                <><ArrowUp className="w-3 h-3 text-green-500" /> +{stats.bookingsTrend}% from yesterday</>
                            ) : (
                                <><ArrowDown className="w-3 h-3 text-red-500" /> {stats.bookingsTrend}% from yesterday</>
                            )
                        )}
                        {stats.bookingsTrend === 0 && 'Same as yesterday'}
                    </p>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Total Calls
                    </CardTitle>
                    <Phone className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
                    <p className="text-xs text-gray-500">
                        This month
                    </p>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Revenue Today
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                    </div>
                    <p className="text-xs text-gray-500">
                        {stats.totalRevenue > 0 ? 'This month' : 'No revenue this month'}
                    </p>
                </CardContent>
            </Card>

            <Card className="border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Conversion Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.conversionRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-500">
                        Calls to bookings
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
