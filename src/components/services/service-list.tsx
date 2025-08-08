import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Clock, DollarSign, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useServices } from '@/hooks/useServices'

interface ServiceListProps {
    setIsAddingService: (isAddingService: boolean) => void
}

export default function ServiceList({ setIsAddingService }: ServiceListProps) {
    const { services, isToggling, isDeleting, deleteService, toggleServiceStatus } = useServices()

    const getCategoryColor = (category: string) => {
        const colors = {
            'General': 'bg-blue-100 text-blue-800',
            'Booking': 'bg-green-100 text-green-800',
            'Services': 'bg-purple-100 text-purple-800',
            'Policy': 'bg-orange-100 text-orange-800',
            'Billing': 'bg-red-100 text-red-800'
        }
        return colors[ category as keyof typeof colors ] || 'bg-gray-100 text-gray-800'
    }

    const handleToggleStatus = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId)
        if (!service) return
        toggleServiceStatus({ serviceId, isActive: !service.is_active })
    }

    const handleDeleteService = (serviceId: string) => {
        deleteService(serviceId)
    }

    return (
        <Card className="border pt-0 overflow-hidden h-full shadow-none">
            <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900 text-sm font-semibold">Service Management</CardTitle>
                        <CardDescription className="text-gray-500 text-xs">Manage your available services</CardDescription>
                    </div>
                    <div className="flex items-end justify-end">
                        <Button onClick={() => setIsAddingService(true)} size="sm">
                            <Plus className="w-3 h-3 mr-2" />
                            <p className="text-xs">Add Service</p>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {services.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-sm font-semibold text-gray-600">No services yet</h3>
                        <p className="text-gray-400 text-xs mb-4">Add your first service to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div key={service.id} className={`p-4 border rounded-lg ${service.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                                }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={getCategoryColor(service.category || 'General')}>
                                                {service.category || 'General'}
                                            </Badge>
                                            <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                                        {service.description && (
                                            <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {service.duration_minutes} min
                                            </span>
                                            {service.price && (
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    ${service.price}
                                                </span>
                                            )}
                                            {service.practitioner_name && (
                                                <span>{service.practitioner_name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleStatus(service.id)}
                                            disabled={isToggling}
                                        >
                                            {service.is_active ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteService(service.id)}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}