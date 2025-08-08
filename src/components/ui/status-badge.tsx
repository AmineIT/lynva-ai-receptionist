import React from 'react'
import { Badge } from './badge'
import { CheckCheck, Clock, XCircle, CalendarCheck, BadgeCheck } from 'lucide-react'

export default function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-700 border-green-300">
        <CheckCheck className="w-8 h-8" />
        Confirmed
      </Badge>
    case 'pending':
      return <Badge className="bg-orange-100 text-orange-700 border-orange-300">
        <Clock className="w-8 h-8" />
        Pending
      </Badge>
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-700 border-red-300">
        <XCircle className="w-8 h-8" />
        Cancelled
      </Badge>
    case 'booked':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-300">
        <CalendarCheck className="w-8 h-8" />
        Booked
      </Badge>
    case 'completed':
      return <Badge className="bg-purple-100 text-purple-700 border-purple-300">
        <BadgeCheck className="w-8 h-8" />
        Completed
      </Badge>
  }
}
