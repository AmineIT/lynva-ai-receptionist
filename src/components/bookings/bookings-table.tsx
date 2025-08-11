import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatTime, formatPhoneNumber } from '@/lib/utils'
import { Phone, Mail, Eye, Edit, CalendarIcon, Clock, PlusCircle } from 'lucide-react'
import StatusBadge from '@/components/ui/status-badge'
import UAECurrency from '../ui/uae-currency'
import TableFilters, { FilterOption } from '@/components/ui/table-filters'
import TableSort from '@/components/ui/table-sort'
import TablePagination from '@/components/ui/table-pagination'
import { useTableState } from '@/hooks/useTableState'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface BookingsTableProps {
  bookings: any[]
  setShowCreateBookingDialog: (value: boolean) => void
}

export default function BookingsTable({ bookings, setShowCreateBookingDialog }: BookingsTableProps) {
  const tableState = useTableState({
    initialSort: { key: 'appointment_date', direction: 'desc' },
    initialPageSize: 25
  })

  // Filter options configuration
  const filterOptions: FilterOption[] = [
    {
      key: 'customer',
      label: 'Customer',
      type: 'text',
      placeholder: 'Search by customer name...'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'no-show', label: 'No Show' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Appointment Date',
      type: 'dateRange'
    },
    {
      key: 'amountRange',
      label: 'Amount',
      type: 'numberRange',
      min: 0
    }
  ]

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings]

    // Apply search term
    if (tableState.searchTerm) {
      const searchLower = tableState.searchTerm.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.customer_name?.toLowerCase().includes(searchLower) ||
        booking.customer_phone?.includes(searchLower) ||
        booking.customer_email?.toLowerCase().includes(searchLower) ||
        booking.notes?.toLowerCase().includes(searchLower)
      )
    }

    // Apply filters
    Object.entries(tableState.filters).forEach(([key, value]) => {
      if (!value) return

      switch (key) {
        case 'customer':
          filtered = filtered.filter(booking =>
            booking.customer_name?.toLowerCase().includes(value.toLowerCase())
          )
          break
        case 'status':
          filtered = filtered.filter(booking => booking.status === value)
          break
        case 'dateRange':
          if (value.start) {
            filtered = filtered.filter(booking => 
              new Date(booking.appointment_date) >= new Date(value.start)
            )
          }
          if (value.end) {
            filtered = filtered.filter(booking => 
              new Date(booking.appointment_date) <= new Date(value.end)
            )
          }
          break
        case 'amountRange':
          if (value.min) {
            filtered = filtered.filter(booking => 
              (booking.total_amount || 0) >= parseFloat(value.min)
            )
          }
          if (value.max) {
            filtered = filtered.filter(booking => 
              (booking.total_amount || 0) <= parseFloat(value.max)
            )
          }
          break
      }
    })

    // Apply sorting
    if (tableState.sortConfig) {
      filtered.sort((a, b) => {
        const { key, direction } = tableState.sortConfig!
        let aValue, bValue

        switch (key) {
          case 'customer_name':
            aValue = a.customer_name || ''
            bValue = b.customer_name || ''
            break
          case 'appointment_date':
            aValue = new Date(a.appointment_date).getTime()
            bValue = new Date(b.appointment_date).getTime()
            break
          case 'status':
            aValue = a.status || ''
            bValue = b.status || ''
            break
          case 'total_amount':
            aValue = a.total_amount || 0
            bValue = b.total_amount || 0
            break
          case 'duration_minutes':
            aValue = a.duration_minutes || 0
            bValue = b.duration_minutes || 0
            break
          default:
            aValue = a[key]
            bValue = b[key]
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1
        if (aValue > bValue) return direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [bookings, tableState.searchTerm, tableState.filters, tableState.sortConfig])

  // Update total for pagination
  React.useEffect(() => {
    tableState.setTotal(filteredAndSortedBookings.length)
  }, [filteredAndSortedBookings.length, tableState.setTotal])

  // Paginate results
  const paginatedBookings = useMemo(() => {
    const startIndex = (tableState.pagination.page - 1) * tableState.pagination.pageSize
    const endIndex = startIndex + tableState.pagination.pageSize
    return filteredAndSortedBookings.slice(startIndex, endIndex)
  }, [filteredAndSortedBookings, tableState.pagination.page, tableState.pagination.pageSize])
  const [showFilters, setShowFilters] = React.useState(false)

  return (
    <Card className="border pt-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">All Bookings</CardTitle>
              <CardDescription className="text-gray-500 text-xs">
                {filteredAndSortedBookings.length} booking{filteredAndSortedBookings.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary/10 border-primary/20' : ''}
              >
                Filters {tableState.searchTerm || Object.keys(tableState.filters).length > 0 ? `(${(tableState.searchTerm ? 1 : 0) + Object.keys(tableState.filters).length})` : ''}
              </Button>
              <Button onClick={() => setShowCreateBookingDialog(true)} size="sm">
                <PlusCircle className="w-3 h-3 mr-2" />
                <p className="text-xs">Create Booking</p>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Filters Section */}
        <Collapsible open={showFilters}>
          <CollapsibleContent>
            <div className="border-b border-neutral-200 bg-gray-50 p-4">
              <TableFilters
                filters={tableState.filters}
                searchTerm={tableState.searchTerm}
                onFilterChange={tableState.updateFilter}
                onSearchChange={tableState.setSearchTerm}
                onClearFilter={tableState.clearFilter}
                onClearAll={tableState.clearAllFilters}
                filterOptions={filterOptions}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <CardContent>
          {paginatedBookings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <TableSort
                          column="customer_name"
                          sortConfig={tableState.sortConfig}
                          onSort={tableState.setSortConfig}
                        >
                          Customer
                        </TableSort>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>
                        <TableSort
                          column="appointment_date"
                          sortConfig={tableState.sortConfig}
                          onSort={tableState.setSortConfig}
                        >
                          Date & Time
                        </TableSort>
                      </TableHead>
                      <TableHead>
                        <TableSort
                          column="duration_minutes"
                          sortConfig={tableState.sortConfig}
                          onSort={tableState.setSortConfig}
                        >
                          Duration
                        </TableSort>
                      </TableHead>
                      <TableHead>
                        <TableSort
                          column="total_amount"
                          sortConfig={tableState.sortConfig}
                          onSort={tableState.setSortConfig}
                        >
                          Amount
                        </TableSort>
                      </TableHead>
                      <TableHead>
                        <TableSort
                          column="status"
                          sortConfig={tableState.sortConfig}
                          onSort={tableState.setSortConfig}
                        >
                          Status
                        </TableSort>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.map((booking) => (
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
                              <span className="font-medium flex items-center gap-1">
                                <UAECurrency />{booking.total_amount.toFixed(2)}
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <TablePagination
                  pagination={tableState.pagination}
                  onPageChange={tableState.setPage}
                  onPageSizeChange={tableState.setPageSize}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold text-gray-600">No bookings found</h3>
              <p className="text-gray-400 text-xs mb-4">
                {tableState.searchTerm || Object.keys(tableState.filters).length > 0
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your appointment bookings will appear here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
  )
}
