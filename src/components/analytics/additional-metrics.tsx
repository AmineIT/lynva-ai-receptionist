import { formatDuration } from '@/lib/utils'
import { AnalyticsData } from '@/hooks/useAnalytics'
import StatCard from '@/components/ui/stat-card'

interface AdditionalMetricsProps {
  analytics: AnalyticsData;
}

export default function AdditionalMetrics({ analytics }: AdditionalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Average Call Duration"
        icon={
          <div className="relative flex items-center justify-center h-4 w-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-violet-100 rounded-full w-4 h-4" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-violet-400 rounded-full w-2 h-2" />
            </div>
          </div>
        }
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900">{formatDuration(analytics.avgCallDuration)}</div>
            <p className="text-sm text-gray-500">Optimal range: 3-5 minutes</p>
          </>
        }
      />

      <StatCard
        title="Peak Hours"
        icon={
          <div className="relative flex items-center justify-center h-4 w-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full w-4 h-4" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-400 rounded-full w-2 h-2" />
            </div>
          </div>
        }
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900">{analytics.peakHours || 'N/A'}</div>
            <p className="text-sm text-gray-500">Highest call volume period</p>
          </>
        }
      />

      <StatCard
        title="Customer Satisfaction"
        icon={
          <div className="relative flex items-center justify-center h-4 w-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-100 rounded-full w-4 h-4" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-400 rounded-full w-2 h-2" />
            </div>
          </div>
        }
        cardContent={
          <>
            <div className="text-2xl font-bold text-gray-900">{analytics.customerSatisfaction}/5</div>
            <p className="text-sm text-gray-500">Based on post-call surveys</p>
          </>
        }
      />
    </div>
  )
}
