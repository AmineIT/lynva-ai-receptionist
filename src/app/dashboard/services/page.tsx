'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit2, Trash2, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useLayout } from '@/components/ui/layout-context'

interface Service {
  id: string
  name: string
  description?: string
  duration_minutes: number
  price?: number
  currency: string
  is_active: boolean
  category?: string
  practitioner_name?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingService, setIsAddingService] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    currency: 'USD',
    category: 'General',
    practitioner_name: ''
  })
  const { setTitle, setSubtitle } = useLayout()

  useEffect(() => {
    fetchServices();
    setTitle('Services');
    setSubtitle('Manage your business services and pricing');
  }, [])

  const fetchServices = async () => {
    try {
      // Get the first business from the database as default
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .limit(1)
        .single()

      if (businessData) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessData.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setServices(data || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async () => {
    if (!newService.name) return

    try {
      // Get the first business from the database as default
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .limit(1)
        .single()

      if (!businessData) {
        console.error('No business found')
        return
      }

      const { data, error } = await supabase
        .from('services')
        .insert([{
          ...newService,
          business_id: businessData.id,
          is_active: true,
          booking_buffer_minutes: 15,
          max_advance_booking_days: 30
        }])
        .select()

      if (error) throw error
      
      if (data) {
        setServices([...services, data[0]])
        setNewService({
          name: '',
          description: '',
          duration_minutes: 60,
          price: 0,
          currency: 'USD',
          category: 'General',
          practitioner_name: ''
        })
        setIsAddingService(false)
      }
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
      setServices(services.filter(service => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const toggleServiceStatus = async (id: string) => {
    const service = services.find(s => s.id === id)
    if (!service) return

    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', id)

      if (error) throw error
      
      setServices(services.map(s => 
        s.id === id ? { ...s, is_active: !s.is_active } : s
      ))
    } catch (error) {
      console.error('Error updating service:', error)
    }
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
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-end">
        <Button onClick={() => setIsAddingService(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-2xl">{services.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Services</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {services.filter(s => s.is_active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Duration</CardDescription>
            <CardTitle className="text-2xl">
              {services.length > 0 ? Math.round(
                services.reduce((sum, s) => sum + s.duration_minutes, 0) / services.length
              ) : 0} min
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
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
              <Button onClick={handleAddService}>Add Service</Button>
              <Button variant="outline" onClick={() => setIsAddingService(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
          <CardDescription>Manage your available services</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
              <p className="text-gray-500">Add your first service to get started.</p>
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
                        onClick={() => toggleServiceStatus(service.id)}
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