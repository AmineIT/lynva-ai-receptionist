import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useServices } from '@/hooks/useServices'

interface ServiceFormProps {
    setIsAddingService: (isAddingService: boolean) => void
}

export default function ServiceForm({ setIsAddingService }: ServiceFormProps) {
    const { createService, isCreating } = useServices()

    const categories = [ 'General', 'Booking', 'Services', 'Policy', 'Billing' ]

    const [ newService, setNewService ] = useState({
        name: '',
        description: '',
        duration_minutes: 60,
        price: 0,
        practitioner_name: '',
        category: '',
    })

    const handleAddService = () => {
        createService(newService)
        setNewService({ name: '', description: '', duration_minutes: 60, price: 0, practitioner_name: '', category: '' })
        setIsAddingService(false)
    }
    return (
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
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            placeholder="Enter service name..."
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={newService.category}
                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
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
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
                            onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) || 60 })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Price</label>
                        <Input
                            type="number"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Practitioner</label>
                        <Input
                            value={newService.practitioner_name}
                            onChange={(e) => setNewService({ ...newService, practitioner_name: e.target.value })}
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
    )
}