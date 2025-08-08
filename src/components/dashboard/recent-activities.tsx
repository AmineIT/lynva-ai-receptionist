import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatTime } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { Eye, Calendar, Phone, Clock } from 'lucide-react'
import { RecentBooking, RecentCall } from '@/hooks/useDashboardAnalytics'
import Link from 'next/link'
import StatusBadge from '@/components/ui/status-badge'

export default function RecentActivities({ recentBookings, recentCalls }: { recentBookings: RecentBooking[], recentCalls: RecentCall[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border pt-0 overflow-hidden">
          <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-sm font-semibold">Recent Bookings ({recentBookings.length})</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                  Latest appointment requests
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                {recentBookings.length > 0 && (
                  <Link href="/dashboard/bookings">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Link>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{booking.customer_name}</h4>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.appointment_date)} at {formatTime(booking.appointment_time)}
                      </p>
                      <p className="text-xs text-gray-400">{booking.customer_phone}</p>
                    </div>
                    {booking.total_amount && (
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(booking.total_amount)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 text-sm font-semibold">No bookings yet</p>
                <p className="text-gray-400 text-xs">
                  Your bookings will appear here once you start receiving them
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card className="border pt-0 overflow-hidden">
          <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 text-sm font-semibold">Recent Calls ({recentCalls.length})</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                  Latest AI call interactions
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                {recentCalls.length > 0 && (
                  <Link href="/dashboard/calls">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Link>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentCalls.length > 0 ? (
              <div className="space-y-4">
                {recentCalls.slice(0, 3).map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {call.caller_phone || 'Unknown'}
                        </h4>
                        {call.lead_to_booking && (
                          <StatusBadge status="booked" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 capitalize">
                        {call.intent_detected || 'General inquiry'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {call.started_at ? formatDate(call.started_at) : 'Recent'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          {call.call_duration_seconds
                            ? `${Math.floor(call.call_duration_seconds / 60)}:${(call.call_duration_seconds % 60).toString().padStart(2, '0')}`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Phone className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-600 text-sm font-semibold">No calls yet</p>
                <p className="text-gray-400 text-xs">
                  Your AI receptionist will appear here once you start receiving calls
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
