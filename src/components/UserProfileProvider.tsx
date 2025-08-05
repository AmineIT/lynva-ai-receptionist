'use client'

import React from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/lib/auth'

interface UserProfileProviderProps {
  children: React.ReactNode
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  // Load user profile data without automatic redirects
  // Individual pages can enable redirects if needed
  useUserProfile({ enableRedirect: false })

  return <>{children}</>
}
