import React from 'react'
import { Calendar, Phone, DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { DashboardStats } from '@/hooks/useDashboardAnalytics'
import StatCard from '../ui/stat-card'
import UAECurrency from '../ui/uae-currency'

export default function StatsCards({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Today's Bookings"
                icon={<Calendar className="h-4 w-4 text-primary" />}
                cardContent={
                    <>
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
                    </>
                }
            />

            <StatCard
                title="Total Calls"
                icon={<Phone className="h-4 w-4 text-primary" />}
                cardContent={
                    <>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
                        <p className="text-xs text-gray-500">
                            This month
                        </p>
                    </>
                }
            />

            <StatCard
                title="Revenue Today"
                icon={<DollarSign className="h-4 w-4 text-primary" />}
                cardContent={
                    <>
                        <div className="text-2xl font-bold text-gray-900 flex items-center gap-1"><UAECurrency />{stats.totalRevenue}</div>
                        <p className="text-xs text-gray-500">
                            This month
                        </p>
                    </>
                }
            />

            <StatCard
                title="Conversion Rate"
                icon={<TrendingUp className="h-4 w-4 text-green-600" />}
                cardContent={
                    <>
                        <div className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</div>
                        <p className="text-xs text-gray-500">
                            Calls to bookings
                        </p>
                    </>
                }
            />
        </div>
    )
}
