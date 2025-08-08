import React from 'react'
import { useServices } from '@/hooks/useServices'
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'

export default function StatsCards() {
    const { services } = useServices()

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
                <CardHeader>
                    <CardDescription>Total Services</CardDescription>
                    <CardTitle className="text-2xl">{services.length}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Active Services</CardDescription>
                    <CardTitle className="text-2xl text-green-600">
                        {services.filter(s => s.is_active).length}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Avg Duration</CardDescription>
                    <CardTitle className="text-2xl">
                        {services.length > 0 ? Math.round(
                            services.reduce((sum, s) => sum + s.duration_minutes, 0) / services.length
                        ) : 0} min
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Avg Price</CardDescription>
                    <CardTitle className="text-2xl">
                        ${services.length > 0 ? Math.round(
                            services.reduce((sum, s) => sum + (s.price || 0), 0) / services.length
                        ) : 0}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
