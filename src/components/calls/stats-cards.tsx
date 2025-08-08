import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils'

interface StatsCardsProps {
    calls: any[]
}

export default function StatsCards({ calls }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
                <CardHeader>
                    <CardDescription>Total Calls</CardDescription>
                    <CardTitle className="text-2xl">{calls.length}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Completed</CardDescription>
                    <CardTitle className="text-2xl text-green-600">
                        {calls.filter(log => log.call_status === 'completed').length}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Missed</CardDescription>
                    <CardTitle className="text-2xl text-red-600">
                        {calls.filter(log => log.call_status === 'missed').length}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Avg Duration</CardDescription>
                    <CardTitle className="text-2xl">
                        {calls.length > 0 ? formatDuration(
                            Math.round(calls.reduce((sum, log) => sum + (log.call_duration_seconds || 0), 0) / calls.length)
                        ) : '0:00'}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}