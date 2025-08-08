import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface BusinessHoursProps {
  businessHours: {
    [key: string]: { open: string; close: string; isOpen: boolean }
  }
  onSettingChange: (path: string, value: any) => void
}

export default function BusinessHours({ businessHours, onSettingChange }: BusinessHoursProps) {
  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  return (
    <Card className='border pt-0 overflow-hidden h-full shadow-none'>
      <CardHeader className='bg-neutral-100 border-b border-neutral-200 py-4 gap-0'>
        <CardTitle className="text-gray-900 text-sm font-semibold">
          Business Hours
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs">Set your operating hours for each day of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysOfWeek.map(day => (
            <div key={day.key} className="flex items-center gap-4">
              <div className="w-24">
                <Label className="text-sm font-medium">{day.label}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={businessHours[day.key].isOpen}
                  onCheckedChange={(checked) =>
                    onSettingChange(`businessHours.${day.key}.isOpen`, checked)
                  }
                />
                <Label className="text-sm">Open</Label>
              </div>
              {businessHours[day.key].isOpen && (
                <>
                  <div>
                    <Input
                      type="time"
                      value={businessHours[day.key].open}
                      onChange={(e) =>
                        onSettingChange(`businessHours.${day.key}.open`, e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                  <span className="text-gray-400">to</span>
                  <div>
                    <Input
                      type="time"
                      value={businessHours[day.key].close}
                      onChange={(e) =>
                        onSettingChange(`businessHours.${day.key}.close`, e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
