import React from 'react'
import { useServices } from '@/hooks/useServices'
import StatCard from '@/components/ui/stat-card'
import UAECurrency from '@/components/ui/uae-currency'

export default function StatsCards() {
    const { services } = useServices()

    const avgDuration = services.length > 0 ? Math.round(
        services.reduce((sum, s) => sum + s.duration_minutes, 0) / services.length
    ) : 0;

    const avgPrice = services.length > 0 ? Math.round(
        services.reduce((sum, s) => sum + (s.price || 0), 0) / services.length
    ) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Total Services"
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
                cardContent={<div className="text-2xl font-bold text-gray-900">{services.length}</div>}
            />
            <StatCard
                title="Active Services"
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
                cardContent={<div className="text-2xl font-bold text-gray-900">{services.filter(s => s.is_active).length}</div>}
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
                cardContent={<div className="text-2xl font-bold text-gray-900">{avgDuration} min</div>}
            />
            <StatCard
                title="Avg Price"
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
                cardContent={<div className="text-2xl font-bold text-gray-900 flex items-center gap-1"><UAECurrency />{avgPrice}</div>}
            />
        </div>
    )
}
