'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Search, Filter, RotateCcw } from 'lucide-react'
import { FilterConfig } from '@/hooks/useTableState'
import { DatePicker } from '@/components/ui/date-picker'

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange'
  placeholder?: string
  options?: { value: string; label: string }[]
  min?: number
  max?: number
}

interface TableFiltersProps {
  filters: FilterConfig
  searchTerm: string
  onFilterChange: (key: string, value: any) => void
  onSearchChange: (term: string) => void
  onClearFilter: (key: string) => void
  onClearAll: () => void
  filterOptions: FilterOption[]
  className?: string
}

export default function TableFilters({
  filters,
  searchTerm,
  onFilterChange,
  onSearchChange,
  onClearFilter,
  onClearAll,
  filterOptions,
  className
}: TableFiltersProps) {
  const activeFiltersCount = Object.keys(filters).length + (searchTerm ? 1 : 0)

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.key]

    switch (option.type) {
      case 'text':
        return (
          <div key={option.key} className="relative">
            <Input
              placeholder={option.placeholder || `Filter by ${option.label.toLowerCase()}...`}
              value={value || ''}
              onChange={(e) => onFilterChange(option.key, e.target.value)}
              className="pr-8"
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilter(option.key)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={option.key} className="relative">
            <Select
              value={value || ''}
              onValueChange={(val) => onFilterChange(option.key, val === 'all' ? '' : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={option.placeholder || `Select ${option.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {option.label}</SelectItem>
                {option.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilter(option.key)}
                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={option.key} className="relative">
            <DatePicker
              name={option.key}
              onChange={(date) => onFilterChange(option.key, date)}
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilter(option.key)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )

      case 'dateRange':
        const dateRange = value || { start: '', end: '' }
        return (
          <div key={option.key} className="flex gap-2">
            <div className="relative flex-1">
              <DatePicker
                name={`${option.key}_start`}
                onChange={(date) => onFilterChange(option.key, {
                  ...dateRange,
                  start: date
                })}
              />
            </div>
            <div className="relative flex-1">
              <DatePicker
                name={`${option.key}_end`}
                onChange={(date) => onFilterChange(option.key, {
                  ...dateRange,
                  end: date
                })}
              />
            </div>
            {(dateRange.start || dateRange.end) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilter(option.key)}
                className="h-9 w-9 p-0 hover:bg-gray-100 shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )

      case 'numberRange':
        const numberRange = value || { min: '', max: '' }
        return (
          <div key={option.key} className="flex gap-2">
            <Input
              type="number"
              placeholder={`Min ${option.label.toLowerCase()}`}
              value={numberRange.min}
              min={option.min}
              max={option.max}
              onChange={(e) => onFilterChange(option.key, {
                ...numberRange,
                min: e.target.value
              })}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder={`Max ${option.label.toLowerCase()}`}
              value={numberRange.max}
              min={option.min}
              max={option.max}
              onChange={(e) => onFilterChange(option.key, {
                ...numberRange,
                max: e.target.value
              })}
              className="flex-1"
            />
            {(numberRange.min || numberRange.max) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilter(option.key)}
                className="h-9 w-9 p-0 hover:bg-gray-100 shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-8"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Controls Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterOptions.map(renderFilterInput)}
      </div>
    </div>
  )
}