'use client'

import React from 'react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAuth } from '@/lib/auth'

interface UserProfileProviderProps {
  children: React.ReactNode
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  // The useUserProfile hook will handle redirection to business setup if needed
  useUserProfile()

  return <>{children}</>
}
