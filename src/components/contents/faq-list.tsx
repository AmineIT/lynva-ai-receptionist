import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle , MessageSquare, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useFaqs } from '@/hooks/useFaqs'
import ConfirmationModal from '@/components/ui/confirmation-modal'
import TableFilters, { FilterOption } from '@/components/ui/table-filters'
import TableSort from '@/components/ui/table-sort'
import TablePagination from '@/components/ui/table-pagination'
import { useTableState } from '@/hooks/useTableState'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

interface FaqListProps {
    setShowCreateFaqDialog: (showCreateFaqDialog: boolean) => void
}

export default function FaqList({ setShowCreateFaqDialog }: FaqListProps) {
    const { faqs, isToggling, isDeleting, deleteFaq, toggleFaqStatus } = useFaqs()
    
    const tableState = useTableState({
        initialSort: { key: 'question', direction: 'asc' },
        initialPageSize: 10
    })
    
    const [showFilters, setShowFilters] = useState(false)
    
    const [confirmAction, setConfirmAction] = useState<{
        type: 'delete' | 'toggle'
        faqId: string
        faqQuestion: string
        isActive?: boolean
    } | null>(null)

    // Filter options configuration
    const filterOptions: FilterOption[] = [
        {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
                { value: 'General', label: 'General' },
                { value: 'Booking', label: 'Booking' },
                { value: 'Services', label: 'Services' },
                { value: 'Policy', label: 'Policy' },
                { value: 'Billing', label: 'Billing' },
                { value: 'Support', label: 'Support' },
                { value: 'Location', label: 'Location' },
                { value: 'Appointment', label: 'Appointment' },
                { value: 'Pricing', label: 'Pricing' }
            ]
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ]
        }
    ]

    // Filter and sort FAQs
    const filteredAndSortedFaqs = useMemo(() => {
        let filtered = [...faqs]

        // Apply search term
        if (tableState.searchTerm) {
            const searchLower = tableState.searchTerm.toLowerCase()
            filtered = filtered.filter(faq => 
                faq.question?.toLowerCase().includes(searchLower) ||
                faq.answer?.toLowerCase().includes(searchLower) ||
                faq.category?.toLowerCase().includes(searchLower)
            )
        }

        // Apply filters
        Object.entries(tableState.filters).forEach(([key, value]) => {
            if (!value) return

            switch (key) {
                case 'category':
                    filtered = filtered.filter(faq => faq.category === value)
                    break
                case 'status':
                    const isActive = value === 'active'
                    filtered = filtered.filter(faq => faq.is_active === isActive)
                    break
            }
        })

        // Apply sorting
        if (tableState.sortConfig) {
            filtered.sort((a, b) => {
                const { key, direction } = tableState.sortConfig!
                let aValue, bValue

                switch (key) {
                    case 'question':
                        aValue = a.question || ''
                        bValue = b.question || ''
                        break
                    case 'category':
                        aValue = a.category || ''
                        bValue = b.category || ''
                        break
                    case 'status':
                        aValue = a.is_active ? 'active' : 'inactive'
                        bValue = b.is_active ? 'active' : 'inactive'
                        break
                    case 'created_at':
                        aValue = new Date(a.created_at || 0).getTime()
                        bValue = new Date(b.created_at || 0).getTime()
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
    }, [faqs, tableState.searchTerm, tableState.filters, tableState.sortConfig])

    // Update total for pagination
    React.useEffect(() => {
        tableState.setTotal(filteredAndSortedFaqs.length)
    }, [filteredAndSortedFaqs.length, tableState.setTotal])

    // Paginate results
    const paginatedFaqs = useMemo(() => {
        const startIndex = (tableState.pagination.page - 1) * tableState.pagination.pageSize
        const endIndex = startIndex + tableState.pagination.pageSize
        return filteredAndSortedFaqs.slice(startIndex, endIndex)
    }, [filteredAndSortedFaqs, tableState.pagination.page, tableState.pagination.pageSize])

    const getCategoryColor = (category: string) => {
        const colors = {
            'General': 'bg-blue-100 text-blue-800',
            'Booking': 'bg-green-100 text-green-800',
            'Services': 'bg-purple-100 text-purple-800',
            'Policy': 'bg-orange-100 text-orange-800',
            'Billing': 'bg-red-100 text-red-800'
        }
        return colors[ category as keyof typeof colors ] || 'bg-gray-100 text-gray-800'
    }

    const handleToggleStatus = (faqId: string) => {
        const faq = faqs.find(f => f.id === faqId)
        if (!faq) return
        setConfirmAction({
            type: 'toggle',
            faqId,
            faqQuestion: faq.question,
            isActive: faq.is_active
        })
    }

    const handleDeleteFAQ = (faqId: string) => {
        const faq = faqs.find(f => f.id === faqId)
        if (!faq) return
        setConfirmAction({
            type: 'delete',
            faqId,
            faqQuestion: faq.question
        })
    }

    const confirmToggleStatus = async () => {
        if (confirmAction && confirmAction.type === 'toggle') {
            await toggleFaqStatus({ 
                faqId: confirmAction.faqId, 
                isActive: !confirmAction.isActive 
            })
        }
    }

    const confirmDeleteFAQ = async () => {
        if (confirmAction && confirmAction.type === 'delete') {
            await deleteFaq(confirmAction.faqId)
        }
    }

    return (
        <Card className="border pt-0 overflow-hidden h-full shadow-none">
            <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900 text-sm font-semibold">FAQ Management</CardTitle>
                        <CardDescription className="text-gray-500 text-xs">
                            {filteredAndSortedFaqs.length} FAQ{filteredAndSortedFaqs.length !== 1 ? 's' : ''} found
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
                        <Button onClick={() => setShowCreateFaqDialog(true)} size="sm">
                            <PlusCircle className="w-3 h-3 mr-2" />
                            <p className="text-xs">Add FAQ</p>
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

            {/* Sort Controls */}
            <div className="border-b border-gray-200 bg-white px-4 py-2">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                    <div className="flex items-center gap-2">
                        <TableSort
                            column="question"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Question
                        </TableSort>
                        <TableSort
                            column="category"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Category
                        </TableSort>
                        <TableSort
                            column="status"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Status
                        </TableSort>
                        <TableSort
                            column="created_at"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Date Created
                        </TableSort>
                    </div>
                </div>
            </div>

            <CardContent>
                {paginatedFaqs.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {paginatedFaqs.map((faq) => (
                                <div key={faq.id} className={`p-4 border rounded-lg ${faq.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={`capitalize ${getCategoryColor(faq.category || 'General')}`}>
                                                    {faq.category || 'General'}
                                                </Badge>
                                                <Badge variant={faq.is_active ? 'default' : 'secondary'}>
                                                    {faq.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                            <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                                            <p className="text-gray-600 text-sm">{faq.answer}</p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleStatus(faq.id)}
                                                disabled={isToggling}
                                            >
                                                {faq.is_active ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteFAQ(faq.id)}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <TablePagination
                                pagination={tableState.pagination}
                                onPageChange={tableState.setPage}
                                onPageSizeChange={tableState.setPageSize}
                                pageSizeOptions={[5, 10, 25, 50]}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-sm font-semibold text-gray-600">No FAQs found</h3>
                        <p className="text-gray-400 text-xs mb-4">
                            {tableState.searchTerm || Object.keys(tableState.filters).length > 0
                                ? 'Try adjusting your search or filter criteria'
                                : 'Add your first FAQ to get started.'}
                        </p>
                    </div>
                )}
            </CardContent>
            
            {/* Toggle Status Confirmation Modal */}
            <ConfirmationModal
                open={confirmAction?.type === 'toggle'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={confirmAction?.isActive ? 'Deactivate FAQ' : 'Activate FAQ'}
                subtitle={`Are you sure you want to ${confirmAction?.isActive ? 'deactivate' : 'activate'} this FAQ?`}
                description={`${confirmAction?.isActive ? 'This will hide it from your customers.' : 'This will make it visible to your customers.'}`}
                confirmText={confirmAction?.isActive ? 'Deactivate' : 'Activate'}
                variant="default"
                onConfirm={confirmToggleStatus}
                isLoading={isToggling}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                open={confirmAction?.type === 'delete'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title="Delete FAQ"
                subtitle="Are you sure you want to delete this FAQ?"
                description="This action cannot be undone and the FAQ will be permanently removed."
                confirmText="Delete"
                variant="destructive"
                onConfirm={confirmDeleteFAQ}
                isLoading={isDeleting}
            />
        </Card>
    )
}