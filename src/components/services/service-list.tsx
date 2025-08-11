import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Users, Clock, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useServices } from '@/hooks/useServices'
import UAECurrency from '../ui/uae-currency'
import ConfirmationModal from '@/components/ui/confirmation-modal'
import TableFilters, { FilterOption } from '@/components/ui/table-filters'
import TableSort from '@/components/ui/table-sort'
import TablePagination from '@/components/ui/table-pagination'
import { useTableState } from '@/hooks/useTableState'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

interface ServiceListProps {
    setShowCreateServiceDialog: (showCreateServiceDialog: boolean) => void
}

export default function ServiceList({ setShowCreateServiceDialog }: ServiceListProps) {
    const { services, isToggling, isDeleting, deleteService, toggleServiceStatus } = useServices()
    
    const tableState = useTableState({
        initialSort: { key: 'name', direction: 'asc' },
        initialPageSize: 12
    })
    
    const [showFilters, setShowFilters] = useState(false)
    
    const [confirmAction, setConfirmAction] = useState<{
        type: 'delete' | 'toggle'
        serviceId: string
        serviceName: string
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
                { value: 'Billing', label: 'Billing' }
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
        },
        {
            key: 'priceRange',
            label: 'Price',
            type: 'numberRange',
            min: 0
        },
        {
            key: 'durationRange',
            label: 'Duration (minutes)',
            type: 'numberRange',
            min: 1
        }
    ]

    // Filter and sort services
    const filteredAndSortedServices = useMemo(() => {
        let filtered = [...services]

        // Apply search term
        if (tableState.searchTerm) {
            const searchLower = tableState.searchTerm.toLowerCase()
            filtered = filtered.filter(service => 
                service.name?.toLowerCase().includes(searchLower) ||
                service.description?.toLowerCase().includes(searchLower) ||
                service.category?.toLowerCase().includes(searchLower) ||
                service.practitioner_name?.toLowerCase().includes(searchLower)
            )
        }

        // Apply filters
        Object.entries(tableState.filters).forEach(([key, value]) => {
            if (!value) return

            switch (key) {
                case 'category':
                    filtered = filtered.filter(service => service.category === value)
                    break
                case 'status': {
                    const isActive = value === 'active'
                    filtered = filtered.filter(service => service.is_active === isActive)
                    break
                }
                case 'priceRange':
                    if (value.min) {
                        filtered = filtered.filter(service => 
                            (service.price || 0) >= parseFloat(value.min)
                        )
                    }
                    if (value.max) {
                        filtered = filtered.filter(service => 
                            (service.price || 0) <= parseFloat(value.max)
                        )
                    }
                    break
                case 'durationRange':
                    if (value.min) {
                        filtered = filtered.filter(service => 
                            (service.duration_minutes || 0) >= parseFloat(value.min)
                        )
                    }
                    if (value.max) {
                        filtered = filtered.filter(service => 
                            (service.duration_minutes || 0) <= parseFloat(value.max)
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
                    case 'name':
                        aValue = a.name || ''
                        bValue = b.name || ''
                        break
                    case 'category':
                        aValue = a.category || ''
                        bValue = b.category || ''
                        break
                    case 'status':
                        aValue = a.is_active ? 'active' : 'inactive'
                        bValue = b.is_active ? 'active' : 'inactive'
                        break
                    case 'price':
                        aValue = a.price || 0
                        bValue = b.price || 0
                        break
                    case 'duration_minutes':
                        aValue = a.duration_minutes || 0
                        bValue = b.duration_minutes || 0
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
    }, [services, tableState.searchTerm, tableState.filters, tableState.sortConfig])

    // Update total when filtered results change
    React.useEffect(() => {
        const newTotal = filteredAndSortedServices.length
        if (newTotal !== tableState.pagination.total) {
            tableState.setTotal(newTotal)
        }
    }, [filteredAndSortedServices.length, tableState.pagination.total, tableState.setTotal])

    // Paginate results
    const paginatedServices = useMemo(() => {
        const startIndex = (tableState.pagination.page - 1) * tableState.pagination.pageSize
        const endIndex = startIndex + tableState.pagination.pageSize
        return filteredAndSortedServices.slice(startIndex, endIndex)
    }, [filteredAndSortedServices, tableState.pagination.page, tableState.pagination.pageSize])

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

    const handleToggleStatus = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId)
        if (!service) return
        setConfirmAction({
            type: 'toggle',
            serviceId,
            serviceName: service.name,
            isActive: service.is_active
        })
    }

    const handleDeleteService = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId)
        if (!service) return
        setConfirmAction({
            type: 'delete',
            serviceId,
            serviceName: service.name
        })
    }

    const confirmToggleStatus = async () => {
        if (confirmAction && confirmAction.type === 'toggle') {
            await toggleServiceStatus({ 
                serviceId: confirmAction.serviceId, 
                isActive: !confirmAction.isActive 
            })
        }
    }

    const confirmDeleteService = async () => {
        if (confirmAction && confirmAction.type === 'delete') {
            await deleteService(confirmAction.serviceId)
        }
    }

    return (
        <Card className="border pt-0 overflow-hidden h-full shadow-none">
            <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900 text-sm font-semibold">Service Management</CardTitle>
                        <CardDescription className="text-gray-500 text-xs">
                            {filteredAndSortedServices.length} service{filteredAndSortedServices.length !== 1 ? 's' : ''} found
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
                        <Button onClick={() => setShowCreateServiceDialog(true)} size="sm">
                            <PlusCircle className="w-3 h-3 mr-2" />
                            <p className="text-xs">Add Service</p>
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
                            column="name"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Name
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
                            column="price"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Price
                        </TableSort>
                        <TableSort
                            column="duration_minutes"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Duration
                        </TableSort>
                        <TableSort
                            column="status"
                            sortConfig={tableState.sortConfig}
                            onSort={tableState.setSortConfig}
                            className="text-sm"
                        >
                            Status
                        </TableSort>
                    </div>
                </div>
            </div>

            <CardContent>
                {paginatedServices.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paginatedServices.map((service) => (
                                <div key={service.id} className={`p-4 border rounded-lg ${service.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                                    }`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={getCategoryColor(service.category || 'General')}>
                                                    {service.category || 'General'}
                                                </Badge>
                                                <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                                    {service.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                            <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                                            {service.description && (
                                                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {service.duration_minutes} min
                                                </span>
                                                {service.price && (
                                                    <span className="flex items-center gap-1">
                                                        <UAECurrency />{service.price.toFixed(2)}
                                                    </span>
                                                )}
                                                {service.practitioner_name && (
                                                    <span>{service.practitioner_name}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleStatus(service.id)}
                                                disabled={isToggling}
                                            >
                                                {service.is_active ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteService(service.id)}
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
                                pageSizeOptions={[6, 12, 24, 48]}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-sm font-semibold text-gray-600">No services found</h3>
                        <p className="text-gray-400 text-xs mb-4">
                            {tableState.searchTerm || Object.keys(tableState.filters).length > 0
                                ? 'Try adjusting your search or filter criteria'
                                : 'Add your first service to get started.'}
                        </p>
                    </div>
                )}
            </CardContent>
            
            {/* Toggle Status Confirmation Modal */}
            <ConfirmationModal
                open={confirmAction?.type === 'toggle'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={confirmAction?.isActive ? 'Deactivate Service' : 'Activate Service'}
                subtitle={`Are you sure you want to ${confirmAction?.isActive ? 'deactivate' : 'activate'} this service?`}
                description={`${confirmAction?.isActive ? 'This will hide the service from your customers and prevent new bookings.' : 'This will make the service available for booking by your customers.'}`}
                confirmText={confirmAction?.isActive ? 'Deactivate' : 'Activate'}
                variant="default"
                onConfirm={confirmToggleStatus}
                isLoading={isToggling}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                open={confirmAction?.type === 'delete'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title="Delete Service"
                subtitle="Are you sure you want to delete this service?"
                description="This action cannot be undone and the service will be permanently removed along with any associated data."
                confirmText="Delete"
                variant="destructive"
                onConfirm={confirmDeleteService}
                isLoading={isDeleting}
            />
        </Card>
    )
}