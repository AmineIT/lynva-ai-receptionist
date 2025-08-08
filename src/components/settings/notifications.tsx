import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface NotificationsProps {
  notifications: {
    emailBookings: boolean
    smsReminders: boolean
    callAlerts: boolean
  }
  onSettingChange: (path: string, value: any) => void
}

export default function Notifications({ notifications, onSettingChange }: NotificationsProps) {
  return (
    <Card className='border pt-0 overflow-hidden h-full shadow-none'>
      <CardHeader className='bg-neutral-100 border-b border-neutral-200 py-4 gap-0'>
        <CardTitle className="text-gray-900 text-sm font-semibold">
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs">Configure how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Email Booking Confirmations</Label>
            <p className="text-sm text-gray-500">Receive email when new bookings are made</p>
          </div>
          <Switch
            checked={notifications.emailBookings}
            onCheckedChange={(checked) =>
              onSettingChange('notifications.emailBookings', checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">SMS Reminders</Label>
            <p className="text-sm text-gray-500">Send SMS reminders to customers</p>
          </div>
          <Switch
            checked={notifications.smsReminders}
            onCheckedChange={(checked) =>
              onSettingChange('notifications.smsReminders', checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Call Alerts</Label>
            <p className="text-sm text-gray-500">Get notified when calls are received</p>
          </div>
          <Switch
            checked={notifications.callAlerts}
            onCheckedChange={(checked) =>
              onSettingChange('notifications.callAlerts', checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
