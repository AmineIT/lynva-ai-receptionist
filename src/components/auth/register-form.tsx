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
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, AudioWaveform, Eye, EyeOff } from "lucide-react"
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [ terms, setTerms ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState('');

    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!password) {
            setError('Please enter a password');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (!confirmPassword) {
            setError('Please confirm your password');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!isValidEmail(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }
        if (!terms) {
            setError('Please accept the Terms of Service and Privacy Policy');
            return;
        }

        setIsLoading(true);

        try {
            await signUp(email, password);
            router.push('/auth/login');
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
                    <CardTitle className="text-xl font-semibold text-center">Get Started</CardTitle>
                    <CardDescription className="text-center">
                        Create your free business account in minutes
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
                        <div className="flex flex-col gap-5">
                            <div className="grid gap-3">
                                <Label htmlFor="email" required>Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password" required>Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    id="terms" 
                                    className="w-4 h-4 bg-primary/10 border-primary/20" 
                                    checked={terms} 
                                    onCheckedChange={(checked) => setTerms(!!checked)} 
                                />
                                <Label htmlFor="terms" className="text-xs">I agree to the <Link href="/terms" className="underline underline-offset-4 text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-4 text-primary">Privacy Policy</Link>.</Label>
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
                                            Creating account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="underline underline-offset-4 text-primary">
                                Sign in to your account
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
