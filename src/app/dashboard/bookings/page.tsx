'use client'

import { useEffect, useState } from 'react'
import { useLayout } from '@/components/providers/layout-provider'
import { useBookings } from '@/hooks/useBookings'
import { BookingsSkeleton } from '@/components/bookings/bookings-skeleton'
import BookingsHeader from '@/components/bookings/bookings-header'
import BookingsTable from '@/components/bookings/bookings-table'


export default function BookingsPage() {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ statusFilter, setStatusFilter ] = useState('all');
  const [ showCreateForm, setShowCreateForm ] = useState(false);
  const { setTitle, setSubtitle } = useLayout();

  // Use the bookings hook with filters
  const {
    bookings,
    isLoading,
    error,
    createBooking,
    updateBooking,
    deleteBooking,
    isCreating,
    isUpdating,
    isDeleting,
    status
  } = useBookings({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  useEffect(() => {
    setTitle('Bookings');
    setSubtitle('Manage your appointment bookings');
  }, [])

  if (isLoading || status === 'pending') {
    return (
      <BookingsSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BookingsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {/* Bookings Table */}
      <BookingsTable bookings={bookings} searchTerm={searchTerm} statusFilter={statusFilter} setShowCreateForm={setShowCreateForm} />
    </div>
  )
}