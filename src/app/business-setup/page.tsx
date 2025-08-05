'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, AudioWaveform } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export default function BusinessSetupPage() {
  const [businessName, setBusinessName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

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
      const supabase = createClient()

      // Create business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([{ name: businessName.trim() }])
        .select()
        .single()

      if (businessError) throw businessError

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          business_id: business.id,
        }])

      if (userError) throw userError

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Business setup error:', error)
      setError(error.message || 'Failed to complete business setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <AudioWaveform className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-center">Complete Your Setup</CardTitle>
          <CardDescription className="text-center">
            Let's set up your business profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}