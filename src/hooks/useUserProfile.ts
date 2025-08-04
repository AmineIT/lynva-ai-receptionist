import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'

interface CreateUserProfileData {
  id: string
  email: string
  full_name?: string
}

interface CreateBusinessData {
  name: string
  email: string
  description?: string
  country?: string
  timezone?: string
}

export function useUserProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [hasAttemptedSetup, setHasAttemptedSetup] = useState(false)

  // Check if user profile exists in custom users table
  const { data: userProfile, isLoading, refetch } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      
      const { data, error } = await supabase
        .from('users')
        .select('*, businesses(*)')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  // Create business for new user
  const createBusiness = useMutation({
    mutationFn: async (businessData: CreateBusinessData) => {
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          name: businessData.name,
          email: businessData.email,
          description: businessData.description || `${businessData.name} - AI Receptionist Business`,
          country: businessData.country || 'UAE',
          timezone: businessData.timezone || 'Asia/Dubai',
          business_hours: {
            monday: { open: '09:00', close: '17:00', is_open: true },
            tuesday: { open: '09:00', close: '17:00', is_open: true },
            wednesday: { open: '09:00', close: '17:00', is_open: true },
            thursday: { open: '09:00', close: '17:00', is_open: true },
            friday: { open: '09:00', close: '17:00', is_open: true },
            saturday: { open: '09:00', close: '14:00', is_open: true },
            sunday: { open: '10:00', close: '16:00', is_open: false }
          },
          subscription_status: 'trial'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  })

  // Create user profile in custom users table
  const createUserProfile = useMutation({
    mutationFn: async ({ userData, businessId }: { userData: CreateUserProfileData, businessId: string }) => {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userData.id,
          business_id: businessId,
          email: userData.email,
          full_name: userData.full_name || userData.email.split('@')[0],
          role: 'owner',
          email_verified: true,
          last_login: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Welcome! Your business profile has been set up.')
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] })
    },
    onError: (error: any) => {
      toast.error(`Setup error: ${error.message}`)
      setHasAttemptedSetup(false) // Allow retry on error
    }
  })

  // Setup user profile function
  const setupUserProfile = useCallback(async () => {
    if (!user || hasAttemptedSetup || userProfile || createBusiness.isPending || createUserProfile.isPending) {
      return
    }

    setHasAttemptedSetup(true)

    try {
      // Extract business name from email domain or use user email
      const emailDomain = user.email?.split('@')[1] || 'business'
      const businessName = emailDomain.includes('.') 
        ? emailDomain.split('.')[0].charAt(0).toUpperCase() + emailDomain.split('.')[0].slice(1)
        : user.email?.split('@')[0] || 'My Business'

      console.log('Setting up new user profile and business...')
      
      // First create the business
      const business = await createBusiness.mutateAsync({
        name: `${businessName} Clinic`,
        email: user.email || '',
        description: `Medical/Wellness Business - ${businessName}`,
        country: 'UAE',
        timezone: 'Asia/Dubai'
      })

      // Then create the user profile linked to the business
      await createUserProfile.mutateAsync({
        userData: {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
        },
        businessId: business.id
      })

    } catch (error) {
      console.error('Error setting up user profile:', error)
      toast.error('Error setting up your profile. Please try again.')
      setHasAttemptedSetup(false) // Allow retry on error
    }
  }, [user, hasAttemptedSetup, userProfile, createBusiness, createUserProfile])

  // Auto-setup user profile when needed
  useEffect(() => {
    if (user && !isLoading && !userProfile && !hasAttemptedSetup) {
      setupUserProfile()
    }
  }, [user, isLoading, userProfile, hasAttemptedSetup, setupUserProfile])

  return {
    userProfile,
    isLoading,
    hasProfile: !!userProfile,
    businessId: userProfile?.business_id,
    isCreatingProfile: createBusiness.isPending || createUserProfile.isPending,
    refetch,
    setupUserProfile
  }
}
