import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BusinessSettings } from '@/hooks/useBusinessSettings'

interface BusinessInfoProps {
  settings: BusinessSettings
  onSettingChange: (path: string, value: any) => void
}

export default function BusinessInfo({ settings, onSettingChange }: BusinessInfoProps) {
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]

  return (
    <Card className='border pt-0 overflow-hidden h-full shadow-none'>
      <CardHeader className='bg-neutral-100 border-b border-neutral-200 py-4 gap-0'>
        <CardTitle className="text-gray-900 text-sm font-semibold">
          Business Information
        </CardTitle>
        <CardDescription className="text-gray-500 text-xs">Basic information about your business</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={settings.name}
              onChange={(e) => onSettingChange('name', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={settings.website}
              onChange={(e) => onSettingChange('website', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={settings.description}
            onChange={(e) => onSettingChange('description', e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => onSettingChange('phone', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => onSettingChange('email', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) => onSettingChange('address', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={settings.city}
              onChange={(e) => onSettingChange('city', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => onSettingChange('timezone', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
