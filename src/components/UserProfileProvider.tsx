'use client'

import React from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'

interface UserProfileProviderProps {
  children: React.ReactNode
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  // Load user profile data without automatic redirects
  // Individual pages can enable redirects if needed
  useUserProfile({ enableRedirect: false })

  return <>{children}</>
}
