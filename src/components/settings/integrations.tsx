import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar, Phone } from 'lucide-react'

interface IntegrationsProps {
  integrations: {
    googleCalendar: { enabled: boolean; connected: boolean }
    whatsapp: { enabled: boolean; connected: boolean }
    vapi: { enabled: boolean; connected: boolean }
  }
  onSettingChange: (path: string, value: any) => void
}

export default function Integrations({ integrations, onSettingChange }: IntegrationsProps) {
  return (
    <Card className='border pt-0 overflow-hidden h-full shadow-none'>
      <CardHeader className='bg-neutral-100 border-b border-neutral-200 py-4 gap-0'>
        <CardTitle className="text-gray-900 text-sm font-semibold">
          Integrations
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs">Manage third-party service connections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <Label className="font-medium">Google Calendar</Label>
              <p className="text-sm text-gray-500">Sync bookings with Google Calendar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={integrations.googleCalendar.connected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }
            >
              {integrations.googleCalendar.connected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Switch
              checked={integrations.googleCalendar.enabled}
              onCheckedChange={(checked) =>
                onSettingChange('integrations.googleCalendar.enabled', checked)
              }
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Label className="font-medium">WhatsApp Business</Label>
              <p className="text-sm text-gray-500">Send booking confirmations via WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={integrations.whatsapp.connected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }
            >
              {integrations.whatsapp.connected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Switch
              checked={integrations.whatsapp.enabled}
              onCheckedChange={(checked) =>
                onSettingChange('integrations.whatsapp.enabled', checked)
              }
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Label className="font-medium">Vapi AI</Label>
              <p className="text-sm text-gray-500">Voice AI for automated phone calls</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={integrations.vapi.connected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }
            >
              {integrations.vapi.connected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Switch
              checked={integrations.vapi.enabled}
              onCheckedChange={(checked) =>
                onSettingChange('integrations.vapi.enabled', checked)
              }
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
