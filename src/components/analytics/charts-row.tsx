import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnalyticsData } from '@/hooks/useAnalytics'

interface ChartsRowProps {
  analytics: AnalyticsData;
}

export default function ChartsRow({ analytics }: ChartsRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Calls by Day */}
      <Card className="border pt-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">Calls This Week</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Daily call volume distribution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.callsByDay.map((data) => {
              const maxCalls = Math.max(...analytics.callsByDay.map(d => d.calls))
              const percentage = (data.calls / maxCalls) * 100
              
              return (
                <div key={data.day} className="flex items-center gap-3">
                  <div className="w-8 text-sm font-medium text-gray-600">{data.day}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{data.calls}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Booking Status */}
      <Card className="border pt-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">Booking Status</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Current booking distribution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.bookingsByStatus.length > 0 ? analytics.bookingsByStatus.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={status.color}>
                    {status.status}
                  </Badge>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {status.count}
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-500 text-sm text-center w-full">No bookings found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
