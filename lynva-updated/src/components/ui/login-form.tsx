'use client'

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, AudioWaveform, Eye, EyeOff } from "lucide-react"
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { EmailVerificationAlert } from '@/components/ui/email-verification-alert'

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');

    const { signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const emailParam = searchParams.get('email');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            await signIn(email, password);
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                <div className="flex items-center justify-center">
                    {/* This will be changed to the logo of Lynva */}
                    <div className="rounded-full bg-primary/10 p-4">
                        <AudioWaveform className="w-6 h-6 text-primary" />
                    </div>
                </div>
                    <CardTitle className="text-xl font-semibold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your business dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Show verification messages */}
                        {message && (
                            <EmailVerificationAlert 
                                variant={message as any} 
                                email={emailParam || undefined}
                            />
                        )}
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-2.5"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="underline underline-offset-4 text-primary">
                                Sign up for free
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
