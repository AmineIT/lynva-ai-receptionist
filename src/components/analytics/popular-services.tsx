import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsData } from '@/hooks/useAnalytics'

interface PopularServicesProps {
  analytics: AnalyticsData;
}

export default function PopularServices({ analytics }: PopularServicesProps) {
  return (
    <Card className="border pt-0 overflow-hidden h-full shadow-none">
      <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 text-sm font-semibold">Popular Services</CardTitle>
            <CardDescription className="text-gray-500 text-xs">Most booked services this month</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.popularServices.length > 0 ? analytics.popularServices.map((service, index) => {
            const maxBookings = Math.max(...analytics.popularServices.map(s => s.bookings))
            const percentage = (service.bookings / maxBookings) * 100
            
            return (
              <div key={service.name} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm font-medium text-gray-600">{service.bookings} bookings</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-sm text-center w-full">No services found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
