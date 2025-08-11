'use client'

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SortConfig } from '@/hooks/useTableState'
import { cn } from '@/lib/utils'

interface TableSortProps {
  column: string
  children: React.ReactNode
  sortConfig: SortConfig
  onSort: (sortConfig: SortConfig) => void
  className?: string
}

export default function TableSort({ column, children, sortConfig, onSort, className }: TableSortProps) {
  const handleSort = () => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === column) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else {
        // If currently desc, remove sort (set to null)
        onSort(null)
        return
      }
    }
    
    onSort({ key: column, direction })
  }

  const getSortIcon = () => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ArrowUpDown className="w-4 h-4" />
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />
  }

  const isActive = sortConfig && sortConfig.key === column

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSort}
      className={cn(
        'h-auto p-0 font-medium justify-start hover:bg-transparent',
        isActive && 'text-primary',
        className
      )}
    >
      <span>{children}</span>
      {getSortIcon()}
    </Button>
  )
}