'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Plus, 
  Search,
  Calendar as CalendarIcon, 
  Phone, 
  Mail,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { formatDate, formatTime, formatCurrency, formatPhoneNumber } from '@/lib/utils'
import { useLayout } from '@/components/ui/layout-context'
import { useBookings } from '@/hooks/useBookings'

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { setTitle, setSubtitle } = useLayout();

  // Use the bookings hook with filters
  const { 
    bookings, 
    isLoading: loading, 
    error,
    createBooking,
    updateBooking,
    deleteBooking,
    isCreating,
    isUpdating,
    isDeleting
  } = useBookings({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined
  });

  useEffect(() => {
    setTitle('Bookings');
    setSubtitle('Manage your appointment bookings');
  }, [])

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
          <div className="h-10 bg-gray-100 rounded w-32 animate-pulse" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-end items-end">
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search</Label>
              <div className="relative mt-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-100 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">All Bookings</CardTitle>
              <CardDescription className="text-gray-500">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{booking.customer_name}</div>
                          {booking.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {booking.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{formatPhoneNumber(booking.customer_phone)}</span>
                          </div>
                          {booking.customer_email && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="truncate max-w-xs">{booking.customer_email}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <CalendarIcon className="w-3 h-3 text-gray-400" />
                            <span>{formatDate(booking.appointment_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>{formatTime(booking.appointment_time)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{booking.duration_minutes} min</span>
                      </TableCell>
                      <TableCell>
                        {booking.total_amount ? (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">
                              {formatCurrency(booking.total_amount, booking.currency)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Your appointment bookings will appear here'}
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Booking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}