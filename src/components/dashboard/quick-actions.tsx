import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MessageSquare, Activity } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
    return (
        <Card className="border">
            <CardHeader className="gap-0">
                <CardTitle className="text-gray-900 text-sm font-semibold">Quick Actions</CardTitle>
                <CardDescription className="text-gray-500 text-xs">
                    Manage your business operations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild variant="outline" className="h-auto p-4 border-primary/20 hover:bg-primary/5">
                        <Link href="/dashboard/bookings" className="flex flex-col items-center gap-2">
                            <Calendar className="w-8 h-8 text-primary" />
                            <span className="font-medium">New Booking</span>
                            <span className="text-xs text-gray-500">Create appointment manually</span>
                        </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 border-primary/20 hover:bg-primary/5">
                        <Link href="/dashboard/content" className="flex flex-col items-center gap-2">
                            <MessageSquare className="w-8 h-8 text-primary" />
                            <span className="font-medium">Manage FAQs</span>
                            <span className="text-xs text-gray-500">Update AI responses</span>
                        </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 border-primary/20 hover:bg-primary/5">
                        <Link href="/dashboard/settings" className="flex flex-col items-center gap-2">
                            <Activity className="w-8 h-8 text-primary" />
                            <span className="font-medium">Settings</span>
                            <span className="text-xs text-gray-500">Configure your AI</span>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
