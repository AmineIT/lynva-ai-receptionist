import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils'
import { AnalyticsData } from '@/hooks/useAnalytics'

interface AdditionalMetricsProps {
  analytics: AnalyticsData;
}

export default function AdditionalMetrics({ analytics }: AdditionalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardDescription>Average Call Duration</CardDescription>
          <CardTitle className="text-2xl">{formatDuration(analytics.avgCallDuration)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Optimal range: 3-5 minutes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Peak Hours</CardDescription>
          <CardTitle className="text-2xl">{analytics.peakHours || 'N/A'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Highest call volume period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Customer Satisfaction</CardDescription>
          <CardTitle className="text-2xl">{analytics.customerSatisfaction}/5</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Based on post-call surveys</p>
        </CardContent>
      </Card>
    </div>
  )
}
