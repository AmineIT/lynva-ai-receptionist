import { Building, Clock, Mail, Plug, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsHeaderProps {
  hasChanges: boolean
  isUpdating: boolean
  onSave: () => void
}

export default function TabsHeader({ hasChanges, isUpdating, onSave }: TabsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <TabsList className='py-5'>
        <TabsTrigger value="business-information" className='py-4 px-6'>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Business Info
          </div>
        </TabsTrigger>
        <TabsTrigger value="business-hours" className='py-4 px-6'>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Business Hours
          </div>
        </TabsTrigger>
        <TabsTrigger value="notifications" className='py-4 px-6'>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notifications
          </div>
        </TabsTrigger>
        <TabsTrigger value="integrations" className='py-4 px-6'>
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5" />
            Integrations
          </div>
        </TabsTrigger>
      </TabsList>
      {hasChanges && (
        <Button onClick={onSave} disabled={isUpdating} size='sm'>
          {isUpdating ? (
            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
          ) : (
            <Save className="w-3 h-3 mr-2" />
          )}
          <p className="text-xs">{isUpdating ? 'Saving...' : 'Save Changes'}</p>
        </Button>
      )}
    </div>
  )
}
