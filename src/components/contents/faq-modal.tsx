'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'
import { useFaqs } from '@/hooks/useFaqs'
import { createFaqSchema, CreateFaqData } from '@/lib/validators'

interface FaqModalProps {
    showCreateFaqDialog: boolean
    setShowCreateFaqDialog: (value: boolean) => void
}

type FaqFormErrors = Partial<Record<keyof CreateFaqData, string>>

export default function FaqModal({ showCreateFaqDialog, setShowCreateFaqDialog }: FaqModalProps) {
    const { createFaq, isCreating } = useFaqs()

    const [faqData, setFaqData] = useState<CreateFaqData>({
        question: '',
        answer: '',
        category: '',
        is_active: true
    })

    const [errors, setErrors] = useState<FaqFormErrors>({})

    const categories = ['General', 'Booking', 'Services', 'Policy', 'Billing', 'Support', 'Location', 'Appointment', 'Pricing']

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFaqData({ ...faqData, [e.target.name]: e.target.value })
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    }

    const handleSelectChange = (name: keyof CreateFaqData, value: string | boolean) => {
        setFaqData({ ...faqData, [name]: value })
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const validate = () => {
        const result = createFaqSchema.safeParse(faqData)
        if (!result.success) {
            const fieldErrors: FaqFormErrors = {}
            for (const err of result.error.errors) {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as keyof CreateFaqData] = err.message
                }
            }
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }

    const handleCreateFaq = async () => {
        if (!validate()) return
        await createFaq(faqData)
        setShowCreateFaqDialog(false)
        setFaqData({
            question: '',
            answer: '',
            category: '',
            is_active: true
        })
    }

    return (
        <Dialog open={showCreateFaqDialog || isCreating} onOpenChange={setShowCreateFaqDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="border-b border-gray-300 pb-4 space-y-0">
                    <DialogTitle className="text-md font-medium">Create FAQ</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500">
                        Create a new frequently asked question
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label required>Category</Label>
                        <Select
                            name="category"
                            value={faqData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                        >
                            <SelectTrigger aria-invalid={!!errors.category}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <span className="text-xs text-red-500">{errors.category}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label required>Question</Label>
                        <Input
                            type="text"
                            placeholder="Enter the question..."
                            name="question"
                            value={faqData.question}
                            onChange={handleChange}
                            aria-invalid={!!errors.question}
                        />
                        {errors.question && (
                            <span className="text-xs text-red-500">{errors.question}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label required>Answer</Label>
                        <Textarea
                            placeholder="Enter the answer..."
                            name="answer"
                            value={faqData.answer}
                            onChange={handleChange}
                            rows={4}
                            aria-invalid={!!errors.answer}
                        />
                        {errors.answer && (
                            <span className="text-xs text-red-500">{errors.answer}</span>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t border-gray-300 pt-4">
                    <Button onClick={handleCreateFaq} disabled={isCreating}>
                        <PlusCircle className="w-4 h-4 mr-1" />
                        {isCreating ? 'Creating...' : 'Create FAQ'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}