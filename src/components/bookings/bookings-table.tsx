import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarPlus } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatTime, formatPhoneNumber, formatCurrency } from '@/lib/utils'
import { Phone, Mail, Eye, Edit, Trash2, CalendarIcon, Clock, DollarSign } from 'lucide-react'
import StatusBadge from '@/components/ui/status-badge'

interface BookingsTableProps {
    bookings: any[];
    searchTerm: string;
    statusFilter: string;
    setShowCreateForm: (value: boolean) => void;
}

export default function BookingsTable({ bookings, searchTerm, statusFilter, setShowCreateForm }: BookingsTableProps) {
  return (
    <Card className="border pt-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">All Bookings</CardTitle>
              <CardDescription className="text-gray-500 text-xs">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={() => setShowCreateForm(true)} size="sm">
                <CalendarPlus className="w-3 h-3 mr-2" />
                <p className="text-xs">Create Booking</p>
              </Button>
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
                        <StatusBadge status={booking.status.toLowerCase()} />
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
              <CalendarIcon className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold text-gray-600">No bookings found</h3>
              <p className="text-gray-400 text-xs mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your appointment bookings will appear here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
  )
}
