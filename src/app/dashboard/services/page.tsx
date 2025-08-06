'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit2, Trash2, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLayout } from '@/components/ui/layout-context'
import { useServices } from '@/hooks/useServices'
import { ServicesSkeleton } from '@/components/ui/services-skeleton'

export default function ServicesPage() {
  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    currency: 'AED',
    category: 'General',
    practitioner_name: ''
  })
  const { setTitle, setSubtitle } = useLayout()

  // Use the services hook
  const { 
    services, 
    isLoading: loading, 
    error,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling
  } = useServices();

  useEffect(() => {
    setTitle('Services');
    setSubtitle('Manage your business services and pricing');
  }, [])

  const handleAddService = () => {
    if (!newService.name) return

    createService(newService)
    setNewService({
      name: '',
      description: '',
      duration_minutes: 60,
      price: 0,
      currency: 'AED',
      category: 'General',
      practitioner_name: ''
    })
    setIsAddingService(false)
  }

  const handleDeleteService = (id: string) => {
    deleteService(id)
  }

  const handleToggleStatus = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return
    toggleServiceStatus({ serviceId, isActive: !service.is_active })
  }

  const categories = ['General', 'Consultation', 'Treatment', 'Therapy', 'Wellness']

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Consultation': 'bg-green-100 text-green-800',
      'Treatment': 'bg-purple-100 text-purple-800',
      'Therapy': 'bg-orange-100 text-orange-800',
      'Wellness': 'bg-pink-100 text-pink-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <ServicesSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Add Service Form */}
      {isAddingService && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
            <CardDescription>Create a new service for your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Service Name</label>
                <Input
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  placeholder="Enter service name..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  value={newService.category}
                  onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                placeholder="Enter service description..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                <Input
                  type="number"
                  value={newService.duration_minutes}
                  onChange={(e) => setNewService({...newService, duration_minutes: parseInt(e.target.value) || 60})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price</label>
                <Input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Practitioner</label>
                <Input
                  value={newService.practitioner_name}
                  onChange={(e) => setNewService({...newService, practitioner_name: e.target.value})}
                  placeholder="Practitioner name..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddService} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Add Service'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingService(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <Card className="border py-0 overflow-hidden h-full shadow-none">
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
                <div key={service.id} className={`p-4 border rounded-lg ${
                  service.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
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
    </div>
  )
}