import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
    title: string
    icon: React.ReactNode
    cardContent: React.ReactNode
}

export default function StatCard({ title, icon, cardContent }: StatCardProps) {
    return (
        <div className="border border-violet-200 p-0.5 rounded-2xl overflow-hidden">
            <Card className="border border-violet-200 pt-0 gap-2 pb-3 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-violet-50 border-b border-violet-200 py-3 gap-0">
                    <CardTitle className="text-xs font-medium text-gray-800">
                        {title}
                    </CardTitle>
                    {icon}
                </CardHeader>
                <CardContent className="pt-1">
                    {cardContent}
                </CardContent>
            </Card>
        </div>
    )
}