'use client'

import React from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/lib/auth'

interface UserProfileProviderProps {
  children: React.ReactNode
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { user } = useAuth()
  
  // This hook will automatically create user profile and business if they don't exist (for verified users only)
  const { hasProfile, isCreatingProfile } = useUserProfile()

  // Show loading only for verified users while actively creating the profile
  if (user && user.email_confirmed_at && !hasProfile && isCreatingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-lg font-semibold">Setting up your business profile...</h2>
          <p className="text-muted-foreground">This will only take a moment.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
