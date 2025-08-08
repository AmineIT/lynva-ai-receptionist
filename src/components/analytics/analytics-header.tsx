import { Button } from '@/components/ui/button'

interface AnalyticsHeaderProps {
  timeRange: string
  setTimeRange: (range: string) => void
}

export default function AnalyticsHeader({ timeRange, setTimeRange }: AnalyticsHeaderProps) {
  return (
    <div className="flex items-end justify-end">
      <div className="flex gap-2">
        <Button 
          variant={timeRange === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('7d')}
        >
          7 Days
        </Button>
        <Button 
          variant={timeRange === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('30d')}
        >
          30 Days
        </Button>
        <Button 
          variant={timeRange === '90d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('90d')}
        >
          90 Days
        </Button>
      </div>
    </div>
  )
}
