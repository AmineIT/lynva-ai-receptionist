import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BookingsHeaderProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    statusFilter: string
    setStatusFilter: (value: string) => void
}

export default function BookingsHeader({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: BookingsHeaderProps) {

  return (
    <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div className="flex-1 w-full">
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
        <div className="sm:w-40 w-full">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
  )
}
