'use client'

import { useEffect, useState } from 'react'
import { useLayout } from '@/components/providers/layout-provider'
import { useBusinessSettings } from '@/hooks/useBusinessSettings'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import TabsHeader from '@/components/settings/tabs-header'
import BusinessInfo from '@/components/settings/business-info'
import BusinessHours from '@/components/settings/business-hours'
import Notifications from '@/components/settings/notifications'
import Integrations from '@/components/settings/integrations'

interface BusinessSettings {
  name: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  website: string
  businessHours: {
    [key: string]: { open: string; close: string; isOpen: boolean }
  }
  notifications: {
    emailBookings: boolean
    smsReminders: boolean
    callAlerts: boolean
  }
  integrations: {
    googleCalendar: { enabled: boolean; connected: boolean }
    whatsapp: { enabled: boolean; connected: boolean }
    vapi: { enabled: boolean; connected: boolean }
  }
}

// Default settings to use while loading
const defaultSettings: BusinessSettings = {
  name: '',
  description: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  country: '',
  website: '',
  businessHours: {
    monday: { open: '09:00', close: '18:00', isOpen: true },
    tuesday: { open: '09:00', close: '18:00', isOpen: true },
    wednesday: { open: '09:00', close: '18:00', isOpen: true },
    thursday: { open: '09:00', close: '18:00', isOpen: true },
    friday: { open: '09:00', close: '18:00', isOpen: true },
    saturday: { open: '10:00', close: '16:00', isOpen: true },
    sunday: { open: '10:00', close: '16:00', isOpen: false }
  },
  notifications: {
    emailBookings: true,
    smsReminders: true,
    callAlerts: true
  },
  integrations: {
    googleCalendar: { enabled: false, connected: false },
    whatsapp: { enabled: false, connected: false },
    vapi: { enabled: false, connected: false }
  }
}

export default function SettingsPage() {
  const { setTitle, setSubtitle } = useLayout()
  
  // Use the business settings hook
  const { 
    settings: fetchedSettings, 
    isLoading, 
    error, 
    updateSettings,
    isUpdating
  } = useBusinessSettings()

  // Local state for form values
  const [settings, setSettings] = useState<BusinessSettings>(() => defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Initialize settings when data is loaded
  useEffect(() => {
    if (fetchedSettings && !isLoading && !isInitialized) {
      setSettings(fetchedSettings)
      setIsInitialized(true)
      setHasChanges(false)
    }
  }, [fetchedSettings, isLoading, isInitialized])

  // Reset form after successful save
  useEffect(() => {
    if (!isUpdating && fetchedSettings) {
      const currentSettingsStr = JSON.stringify(settings)
      const fetchedSettingsStr = JSON.stringify(fetchedSettings)
      
      if (currentSettingsStr !== fetchedSettingsStr && !hasChanges) {
        setSettings(fetchedSettings)
      }
    }
  }, [fetchedSettings, isUpdating, hasChanges])

  useEffect(() => {
    setTitle('Settings');
    setSubtitle('Manage your business configuration and preferences');
  }, []);

  const handleSettingChange = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.')
      const newSettings = { ...prev }
      let current: Record<string, any> = newSettings

      // Navigate to the parent object of the field we want to update
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      // Update the value
      const lastKey = keys[keys.length - 1]
      if (current[lastKey] === value) {
        return prev  // No change needed
      }
      current[lastKey] = value

      return newSettings
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    const success = await updateSettings(settings)
    if (success) {
      setHasChanges(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="business-information">
        <TabsHeader hasChanges={hasChanges} isUpdating={isUpdating} onSave={handleSave} />

        <TabsContent value="business-information">
          <BusinessInfo settings={settings} onSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="business-hours">
          <BusinessHours businessHours={settings.businessHours} onSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="notifications">
          <Notifications notifications={settings.notifications} onSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="integrations">
          <Integrations integrations={settings.integrations} onSettingChange={handleSettingChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}