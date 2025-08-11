'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import { createServiceSchema, CreateServiceData } from '@/lib/validators'

interface ServiceModalProps {
    showCreateServiceDialog: boolean
    setShowCreateServiceDialog: (value: boolean) => void
}

type ServiceFormErrors = Partial<Record<keyof CreateServiceData, string>>

export default function ServiceModal({ showCreateServiceDialog, setShowCreateServiceDialog }: ServiceModalProps) {
    const { createService, isCreating } = useServices()

    const [serviceData, setServiceData] = useState<CreateServiceData>({
        name: '',
        description: '',
        duration_minutes: 60,
        price: 0,
        currency: 'AED',
        is_active: true,
        booking_buffer_minutes: 15,
        max_advance_booking_days: 30,
        practitioner_name: '',
        category: ''
    })

    const [errors, setErrors] = useState<ServiceFormErrors>({})

    const categories = ['General', 'Booking', 'Services', 'Policy', 'Billing']

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        let parsedValue: string | number = value
        
        if (type === 'number') {
            parsedValue = name === 'duration_minutes' || name === 'booking_buffer_minutes' || name === 'max_advance_booking_days' 
                ? parseInt(value) || 0 
                : parseFloat(value) || 0
        }
        
        setServiceData({ ...serviceData, [name]: parsedValue })
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const handleSelectChange = (name: keyof CreateServiceData, value: string | boolean) => {
        setServiceData({ ...serviceData, [name]: value })
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const validate = () => {
        const result = createServiceSchema.safeParse(serviceData)
        if (!result.success) {
            const fieldErrors: ServiceFormErrors = {}
            for (const err of result.error.errors) {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof CreateServiceData] = err.message
                }
            }
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }

    const handleCreateService = async () => {
        if (!validate()) return
        await createService(serviceData)
        setShowCreateServiceDialog(false)
        setServiceData({
            name: '',
            description: '',
            duration_minutes: 60,
            price: 0,
            currency: 'AED',
            is_active: true,
            booking_buffer_minutes: 15,
            max_advance_booking_days: 30,
            practitioner_name: '',
            category: ''
        })
    }

    return (
        <Dialog open={showCreateServiceDialog || isCreating} onOpenChange={setShowCreateServiceDialog}>
            <DialogContent className="max-w-4xl">
                <DialogHeader className="border-b border-gray-300 pb-4 space-y-0">
                    <DialogTitle className="text-md font-medium">Create Service</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500">
                        Create a new service for your business
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Service Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter service name..."
                            name="name"
                            value={serviceData.name}
                            onChange={handleChange}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <span className="text-xs text-red-500">{errors.name}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select
                            name="category"
                            value={serviceData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                        >
                            <SelectTrigger aria-invalid={!!errors.category}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <span className="text-xs text-red-500">{errors.category}</span>
                        )}
                    </div>

                    <div className="md:col-span-2 grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Enter service description..."
                            name="description"
                            value={serviceData.description}
                            onChange={handleChange}
                            rows={3}
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && (
                            <span className="text-xs text-red-500">{errors.description}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Duration (minutes)</Label>
                        <Input
                            type="number"
                            placeholder="Duration in minutes"
                            name="duration_minutes"
                            value={serviceData.duration_minutes}
                            onChange={handleChange}
                            aria-invalid={!!errors.duration_minutes}
                        />
                        {errors.duration_minutes && (
                            <span className="text-xs text-red-500">{errors.duration_minutes}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Price (AED)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Price in AED"
                            name="price"
                            value={serviceData.price}
                            onChange={handleChange}
                            aria-invalid={!!errors.price}
                        />
                        {errors.price && (
                            <span className="text-xs text-red-500">{errors.price}</span>
                        )}
                    </div>

                    <div className="md:col-span-2 grid gap-2">
                        <Label>Practitioner</Label>
                        <Input
                            type="text"
                            placeholder="Practitioner name..."
                            name="practitioner_name"
                            value={serviceData.practitioner_name}
                            onChange={handleChange}
                            aria-invalid={!!errors.practitioner_name}
                        />
                        {errors.practitioner_name && (
                            <span className="text-xs text-red-500">{errors.practitioner_name}</span>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t border-gray-300 pt-4">
                    <Button onClick={handleCreateService} disabled={isCreating}>
                        <PlusCircle className="w-4 h-4 mr-1" />
                        {isCreating ? 'Creating...' : 'Create Service'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
}