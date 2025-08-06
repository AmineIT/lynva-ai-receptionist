'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, AudioWaveform } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface BusinessSetupModalProps {
  isOpen: boolean
  onComplete: () => void
}

export function BusinessSetupModal({ isOpen, onComplete }: BusinessSetupModalProps) {
  const [businessName, setBusinessName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!businessName.trim()) {
      setError('Please enter your business name')
      return
    }

    if (!user) {
      setError('You must be logged in to complete setup')
      return
    }

    setIsLoading(true)

    try {
      // Create business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([{ 
          name: businessName.trim(),
          description: '',
          country: 'US',
          timezone: 'America/New_York',
          is_active: true,
          subscription_status: 'active'
        }])
        .select()
        .single()

      if (businessError) throw businessError

      // Create or update user profile (use upsert to handle edge cases)
      const { error: userError } = await supabase
        .from('users')
        .upsert([{
          id: user.id,
          email: user.email || '',
          business_id: business.id,
          role: 'owner',
          is_active: true,
          email_verified: true
        }], {
          onConflict: 'id'
        })

      if (userError) throw userError

      // Invalidate user profile cache to refresh the data
      queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] })

      // Success! Call completion callback
      onComplete()
    } catch (error: any) {
      console.error('Business setup error:', error)
      setError(error.message || 'Failed to complete business setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" closeButton={false}>
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <AudioWaveform className="w-6 h-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold">Complete Your Setup</DialogTitle>
          <DialogDescription>
            Let's set up your business profile to get started with your AI receptionist
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="grid gap-3">
            <Label htmlFor="businessName" required>Business Name</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Enter your business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-2.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up your business...
                </div>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
