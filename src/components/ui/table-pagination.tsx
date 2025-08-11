'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { PaginationConfig } from '@/hooks/useTableState'

interface TablePaginationProps {
  pagination: PaginationConfig
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showGoToPage?: boolean
  className?: string
}

const defaultPageSizeOptions = [10, 25, 50, 100]

export default function TablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = defaultPageSizeOptions,
  showPageSizeSelector = true,
  showPageInfo = true,
  showGoToPage = true,
  className
}: TablePaginationProps) {
  const { page, pageSize, total } = pagination
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const [goToPage, setGoToPage] = React.useState('')

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPage)
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber)
      setGoToPage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToPage()
    }
  }

  if (total === 0) {
    return null
  }

  return (
    <div className={`flex items-center justify-between space-x-4 ${className || ''}`}>
      {/* Page Size Selector */}
      {showPageSizeSelector && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      )}

      {/* Page Info */}
      {showPageInfo && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total} results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Go to Page */}
        {showGoToPage && totalPages > 5 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Go to:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-16 h-8"
              placeholder="#"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToPage}
              disabled={!goToPage || parseInt(goToPage) < 1 || parseInt(goToPage) > totalPages}
            >
              Go
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="h-8 w-8 p-0 ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Page Numbers */}
          <div className="flex items-center mx-2">
            {(() => {
              const pages = []
              const showEllipsis = totalPages > 7
              
              if (!showEllipsis) {
                // Show all pages if 7 or fewer
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={page === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(i)}
                      className="h-8 w-8 p-0 mx-0.5"
                    >
                      {i}
                    </Button>
                  )
                }
              } else {
                // Show with ellipsis
                if (page <= 4) {
                  // Near beginning
                  for (let i = 1; i <= 5; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={page === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className="h-8 w-8 p-0 mx-0.5"
                      >
                        {i}
                      </Button>
                    )
                  }
                  pages.push(<span key="ellipsis1" className="mx-1 text-gray-400">...</span>)
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(totalPages)}
                      className="h-8 w-8 p-0 mx-0.5"
                    >
                      {totalPages}
                    </Button>
                  )
                } else if (page >= totalPages - 3) {
                  // Near end
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(1)}
                      className="h-8 w-8 p-0 mx-0.5"
                    >
                      1
                    </Button>
                  )
                  pages.push(<span key="ellipsis1" className="mx-1 text-gray-400">...</span>)
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={page === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className="h-8 w-8 p-0 mx-0.5"
                      >
                        {i}
                      </Button>
                    )
                  }
                } else {
                  // In middle
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(1)}
                      className="h-8 w-8 p-0 mx-0.5"
                    >
                      1
                    </Button>
                  )
                  pages.push(<span key="ellipsis1" className="mx-1 text-gray-400">...</span>)
                  for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={page === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(i)}
                        className="h-8 w-8 p-0 mx-0.5"
                      >
                        {i}
                      </Button>
                    )
                  }
                  pages.push(<span key="ellipsis2" className="mx-1 text-gray-400">...</span>)
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(totalPages)}
                      className="h-8 w-8 p-0 mx-0.5"
                    >
                      {totalPages}
                    </Button>
                  )
                }
              }
              
              return pages
            })()
            }
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="h-8 w-8 p-0 mr-1"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}