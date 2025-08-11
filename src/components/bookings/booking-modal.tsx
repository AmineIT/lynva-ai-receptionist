'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useActiveServices } from '@/hooks/useServices'
import { CreateBookingData, useBookings } from '@/hooks/useBookings'
import { createBookingSchema } from '@/lib/validators'
import { DatePicker } from '@/components/ui/date-picker'

interface BookingModalProps {
    showCreateBookingDialog: boolean;
    setShowCreateBookingDialog: (value: boolean) => void;
}

type BookingFormErrors = Partial<Record<keyof CreateBookingData, string>>;

export default function BookingModal({ showCreateBookingDialog, setShowCreateBookingDialog }: BookingModalProps) {
  const { data: activeServices } = useActiveServices();
  const { createBooking, isCreating } = useBookings();
  
  const [ bookingData, setBookingData ] = useState<CreateBookingData>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
    status: 'confirmed'
  });

  const [errors, setErrors] = useState<BookingFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  const handleSelectChange = (name: keyof CreateBookingData, value: string) => {
    setBookingData({ ...bookingData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const validate = () => {
    const result = createBookingSchema.safeParse(bookingData);
    if (!result.success) {
      const fieldErrors: BookingFormErrors = {};
      for (const err of result.error.errors) {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CreateBookingData] = err.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  const handleCreateBooking = async () => {
    if (!validate()) return;
    await createBooking(bookingData);
    setShowCreateBookingDialog(false);
    setBookingData({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      service_id: '',
      appointment_date: '',
      appointment_time: '',
      notes: '',
      status: 'confirmed'
    });
  }

  return (
    <Dialog open={showCreateBookingDialog || isCreating} onOpenChange={setShowCreateBookingDialog}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="border-b border-gray-300 pb-4 space-y-0">
          <DialogTitle className="text-md font-medium">Create Booking</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Create a new booking for a customer
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Customer</Label>
            <Input
              type="text"
              placeholder="Enter customer name"
              name="customer_name"
              value={bookingData.customer_name}
              onChange={handleChange}
              aria-invalid={!!errors.customer_name}
            />
            {errors.customer_name && (
              <span className="text-xs text-red-500">{errors.customer_name}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Phone Number</Label>
            <Input
              type="text"
              placeholder="Enter phone number"
              name="customer_phone"
              value={bookingData.customer_phone}
              onChange={handleChange}
              aria-invalid={!!errors.customer_phone}
            />
            {errors.customer_phone && (
              <span className="text-xs text-red-500">{errors.customer_phone}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              name="customer_email"
              value={bookingData.customer_email}
              onChange={handleChange}
              aria-invalid={!!errors.customer_email}
            />
            {errors.customer_email && (
              <span className="text-xs text-red-500">{errors.customer_email}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Service</Label>
            <Select
              name="service_id"
              value={bookingData.service_id}
              onValueChange={(value) => handleSelectChange('service_id', value)}
            >
              <SelectTrigger aria-invalid={!!errors.service_id}>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {activeServices?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_id && (
              <span className="text-xs text-red-500">{errors.service_id}</span>
            )}
          </div>

          <div className="grid gap-2">
            <DatePicker 
              name="appointment_date" 
              onChange={(date) => handleSelectChange('appointment_date', date)} 
              label="Appointment Date"
            />
            {errors.appointment_date && (
              <span className="text-xs text-red-500">{errors.appointment_date}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Appointment Time</Label>
            <Input
              type="time"
              placeholder="Enter appointment time"
              name="appointment_time"
              value={bookingData.appointment_time}
              onChange={handleChange}
              aria-invalid={!!errors.appointment_time}
            />
            {errors.appointment_time && (
              <span className="text-xs text-red-500">{errors.appointment_time}</span>
            )}
          </div>

          {/* Notes field spans both columns */}
          <div className="md:col-span-2 grid gap-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Enter notes"
              name="notes"
              value={bookingData.notes}
              onChange={handleChange}
              aria-invalid={!!errors.notes}
            />
            {errors.notes && (
              <span className="text-xs text-red-500">{errors.notes}</span>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-gray-300 pt-4">
          <Button onClick={handleCreateBooking} disabled={isCreating}>
            <PlusCircle className="w-4 h-4 mr-1" />
            {isCreating ? 'Creating...' : 'Create Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}