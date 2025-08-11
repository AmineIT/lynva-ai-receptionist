'use client'

import { useState } from 'react'

export type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
} | null

export type FilterConfig = Record<string, any>

export type PaginationConfig = {
  page: number
  pageSize: number
  total: number
}

export interface UseTableStateProps {
  initialSort?: SortConfig
  initialFilters?: FilterConfig
  initialPageSize?: number
}

export interface TableState {
  sortConfig: SortConfig
  filters: FilterConfig
  pagination: PaginationConfig
  searchTerm: string
}

export interface TableActions {
  setSortConfig: (sort: SortConfig) => void
  setFilters: (filters: FilterConfig) => void
  updateFilter: (key: string, value: any) => void
  clearFilter: (key: string) => void
  clearAllFilters: () => void
  setPagination: (pagination: Partial<PaginationConfig>) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setTotal: (total: number) => void
  setSearchTerm: (term: string) => void
  resetTable: () => void
}

export function useTableState({
  initialSort = null,
  initialFilters = {},
  initialPageSize = 25
}: UseTableStateProps = {}): TableState & TableActions {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort)
  const [filters, setFilters] = useState<FilterConfig>(initialFilters)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [pagination, setPaginationState] = useState<PaginationConfig>({
    page: 1,
    pageSize: initialPageSize,
    total: 0
  })

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    // Reset to page 1 when filters change
    setPaginationState(prev => ({
      ...prev,
      page: 1
    }))
  }

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const { [key]: removed, ...rest } = prev
      return rest
    })
    setPaginationState(prev => ({
      ...prev,
      page: 1
    }))
  }

  const clearAllFilters = () => {
    setFilters({})
    setSearchTerm('')
    setPaginationState(prev => ({
      ...prev,
      page: 1
    }))
  }

  const setPagination = (newPagination: Partial<PaginationConfig>) => {
    setPaginationState(prev => ({
      ...prev,
      ...newPagination
    }))
  }

  const setPage = (page: number) => {
    setPaginationState(prev => ({
      ...prev,
      page
    }))
  }

  const setPageSize = (pageSize: number) => {
    setPaginationState(prev => ({
      ...prev,
      pageSize,
      page: 1 // Reset to first page when changing page size
    }))
  }

  const setTotal = (total: number) => {
    setPaginationState(prev => ({
      ...prev,
      total
    }))
  }

  const resetTable = () => {
    setSortConfig(initialSort)
    setFilters(initialFilters)
    setSearchTerm('')
    setPaginationState({
      page: 1,
      pageSize: initialPageSize,
      total: 0
    })
  }

  return {
    // State
    sortConfig,
    filters,
    pagination,
    searchTerm,
    
    // Actions
    setSortConfig,
    setFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    setPagination,
    setPage,
    setPageSize,
    setTotal,
    setSearchTerm,
    resetTable
  }
}