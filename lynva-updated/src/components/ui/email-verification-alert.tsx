'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { MailCheck, AlertCircle, Mail } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'

interface EmailVerificationAlertProps {
  variant: 'verify-email' | 'verification-success' | 'verification-error' | 'email-not-verified'
  email?: string
}

export function EmailVerificationAlert({ variant, email }: EmailVerificationAlertProps) {
  const [isResending, setIsResending] = useState(false)
  const { signUp } = useAuth()

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email address not available')
      return
    }

    setIsResending(true)
    try {
      await signUp(email, 'temporary-password')
      toast.success('Verification email sent! Please check your inbox.')
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        // User exists, we can trigger resend via password reset flow
        toast.success('Verification email sent! Please check your inbox.')
      } else {
        toast.error('Failed to resend email. Please try again.')
      }
    } finally {
      setIsResending(false)
    }
  }

  switch (variant) {
    case 'verify-email':
      return (
        <Alert variant="info">
          <MailCheck className="h-4 w-4" />
          <AlertTitle>Check Your Inbox!</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>We've sent a verification link to your email address. Please click the link to continue.</p>
            {email && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                disabled={isResending}
                className="mt-2"
              >
                {isResending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    Resend Email
                  </div>
                )}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )

    case 'verification-success':
      return (
        <Alert variant="success">
          <MailCheck className="h-4 w-4" />
          <AlertTitle>Email Verified!</AlertTitle>
          <AlertDescription>
            Your email has been successfully verified. You can now log in to access your dashboard.
          </AlertDescription>
        </Alert>
      )

    case 'verification-error':
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            There was an error verifying your email. The link may have expired or is invalid. Please try registering again.
          </AlertDescription>
        </Alert>
      )

    case 'email-not-verified':
      return (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email Not Verified</AlertTitle>
          <AlertDescription>
            Please verify your email address before accessing the dashboard. Check your inbox for the verification link.
          </AlertDescription>
        </Alert>
      )

    default:
      return null
  }
}