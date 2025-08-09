import React from 'react'
import StatCard from '@/components/ui/stat-card'
import { formatDuration } from '@/lib/utils'

interface StatsCardsProps {
    calls: any[]
}

export default function StatsCards({ calls }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Total Calls"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-violet-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-violet-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{calls.length}</div>}
            />
            <StatCard
                title="Completed"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-teal-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-teal-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{calls.filter(log => log.call_status === 'completed').length}</div>}
            />
            <StatCard
                title="Missed"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{calls.filter(log => log.call_status === 'missed').length}</div>}
            />
            <StatCard
                title="Avg Duration"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-blue-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-blue-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{calls.length > 0 ? formatDuration(
                    Math.round(calls.reduce((sum, log) => sum + (log.call_duration_seconds || 0), 0) / calls.length)
                ) : '0:00'}</div>}
            />
        </div>
    )
}