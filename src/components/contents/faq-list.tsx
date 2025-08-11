import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle , MessageSquare, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useFaqs } from '@/hooks/useFaqs'
import ConfirmationModal from '@/components/ui/confirmation-modal'

interface FaqListProps {
    setShowCreateFaqDialog: (showCreateFaqDialog: boolean) => void
}

export default function FaqList({ setShowCreateFaqDialog }: FaqListProps) {
    const { faqs, isToggling, isDeleting, deleteFaq, toggleFaqStatus } = useFaqs()
    
    const [confirmAction, setConfirmAction] = useState<{
        type: 'delete' | 'toggle'
        faqId: string
        faqQuestion: string
        isActive?: boolean
    } | null>(null)

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
                        <CardDescription className="text-gray-500 text-xs">Manage your frequently asked questions</CardDescription>
                    </div>
                    <div className="flex items-end justify-end">
                        <Button onClick={() => setShowCreateFaqDialog(true)} size="sm">
                            <PlusCircle className="w-3 h-3 mr-2" />
                            <p className="text-xs">Add FAQ</p>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {faqs.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-sm font-semibold text-gray-600">No FAQs yet</h3>
                        <p className="text-gray-400 text-xs mb-4">Add your first FAQ to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq) => (
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
                )}
            </CardContent>
            
            {/* Toggle Status Confirmation Modal */}
            <ConfirmationModal
                open={confirmAction?.type === 'toggle'}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={confirmAction?.isActive ? 'Deactivate FAQ' : 'Activate FAQ'}
                description={`Are you sure you want to ${confirmAction?.isActive ? 'deactivate' : 'activate'} "${confirmAction?.faqQuestion}"? ${confirmAction?.isActive ? 'This will hide the FAQ from your customers.' : 'This will make the FAQ visible to your customers.'}`}
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
                description={`Are you sure you want to delete "${confirmAction?.faqQuestion}"? This action cannot be undone and the FAQ will be permanently removed.`}
                confirmText="Delete"
                variant="destructive"
                onConfirm={confirmDeleteFAQ}
                isLoading={isDeleting}
            />
        </Card>
    )
}