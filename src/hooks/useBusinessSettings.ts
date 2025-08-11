import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'

export interface BusinessSettings {
  name: string
  description: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  website: string
  businessHours: {
    [ key: string ]: { open: string; close: string; isOpen: boolean }
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

export function useBusinessSettings() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  // Get user's business ID
  const { data: userData } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from('users')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })
  
  const businessId = userData?.business_id
  
  // Fetch business info
  const { 
    data: businessData,
    isLoading: isLoadingBusiness
  } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      if (!businessId) return null
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!businessId
  })
  
  // Fetch business settings
  const {
    data: businessSettings,
    isLoading: isLoadingSettings,
    error,
    refetch
  } = useQuery({
    queryKey: ['business-settings', businessId],
    queryFn: async () => {
      if (!businessId) return null
      
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle()
      
      if (error) {
        // If settings don't exist yet, return null (not an error)
        if (error.code === 'PGRST116') return null
        throw error
      }
      
      return data
    },
    enabled: !!businessId
  })
  
  // Combined data
  const settings: BusinessSettings | null = businessData && {
    name: businessData.name || '',
    description: businessData.description || '',
    phone: businessData.phone || '',
    email: businessData.email || '',
    address: businessData.address || '',
    city: businessData.city || '',
    country: businessData.country || '',
    website: businessData.website || '',
    businessHours: businessSettings?.business_hours || {
      monday: { open: '09:00', close: '18:00', isOpen: false },
      tuesday: { open: '09:00', close: '18:00', isOpen: false },
      wednesday: { open: '09:00', close: '18:00', isOpen: false },
      thursday: { open: '09:00', close: '18:00', isOpen: false },
      friday: { open: '09:00', close: '18:00', isOpen: false },
      saturday: { open: '10:00', close: '16:00', isOpen: false },
      sunday: { open: '10:00', close: '16:00', isOpen: false }
    },
    notifications: businessSettings?.notifications || {
      emailBookings: false,
      smsReminders: false,
      callAlerts: false
    },
    integrations: businessSettings?.integrations || {
      googleCalendar: { enabled: false, connected: false },
      whatsapp: { enabled: false, connected: false },
      vapi: { enabled: false, connected: false }
    }
  }
  
  // Update business info mutation
  const updateBusinessInfo = useMutation({
    mutationFn: async (updateData: Partial<BusinessSettings>) => {
      if (!businessId) throw new Error('No business ID found')
      
      const { data, error } = await supabase
        .from('businesses')
        .update({
          name: updateData.name,
          description: updateData.description,
          phone: updateData.phone,
          email: updateData.email,
          address: updateData.address,
          city: updateData.city,
          country: updateData.country,
          website: updateData.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update business information: ${error.message}`)
    }
  })
  
  // Update business settings mutation (upsert)
  const updateBusinessSettings = useMutation({
    mutationFn: async (updateData: Partial<BusinessSettings>) => {
      if (!businessId) throw new Error('No business ID found')
      
      // Extract only the settings-related properties
      const settingsData = {
        business_id: businessId,
        business_hours: updateData.businessHours,
        notifications: updateData.notifications,
        integrations: updateData.integrations,
        updated_at: new Date().toISOString()
      }
      
      // Use upsert operation
      const { data, error } = await supabase
        .from('business_settings')
        .upsert(settingsData, { onConflict: 'business_id' })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings', businessId] })
    },
    onError: (error: any) => {
      toast.error(`Failed to update business settings: ${error.message}`)
    }
  })
  
  // Combined update function
  const updateSettings = async (updatedSettings: Partial<BusinessSettings>) => {
    const businessInfoFields = ['name', 'description', 'phone', 'email', 'address', 'city', 'country', 'timezone', 'website']
    const settingsFields = ['businessHours', 'notifications', 'integrations']
    
    // Extract business info fields
    const businessInfo: Partial<BusinessSettings> = {}
    businessInfoFields.forEach(field => {
      if (field in updatedSettings) {
        businessInfo[field as keyof typeof businessInfo] = updatedSettings[field as keyof typeof updatedSettings] as any
      }
    })
    
    // Extract settings fields
    const settingsInfo: Partial<BusinessSettings> = {}
    settingsFields.forEach(field => {
      if (field in updatedSettings) {
        settingsInfo[field as keyof typeof settingsInfo] = updatedSettings[field as keyof typeof updatedSettings] as any
      }
    })
    
    try {
      const promises = []
      
      if (Object.keys(businessInfo).length > 0) {
        promises.push(updateBusinessInfo.mutateAsync(businessInfo))
      }
      
      if (Object.keys(settingsInfo).length > 0) {
        promises.push(updateBusinessSettings.mutateAsync(settingsInfo))
      }

      const toastPromise = toast.promise(Promise.all(promises), {
        loading: 'Saving changes...',
        success: 'Settings updated successfully!',
        error: 'Failed to update settings'
      })
      
      await Promise.all([...promises, toastPromise])
      return true
    } catch (error) {
      console.error('Error updating settings:', error)
      return false
    }
  }
  
  return {
    settings,
    isLoading: isLoadingBusiness || isLoadingSettings,
    error,
    refetch,
    updateSettings,
    isUpdating: updateBusinessInfo.isPending || updateBusinessSettings.isPending
  }
}