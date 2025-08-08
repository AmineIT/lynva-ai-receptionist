import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useFaqs } from '@/hooks/useFaqs'

interface FaqFormProps {
    isAddingFAQ: boolean
    setIsAddingFAQ: (isAddingFAQ: boolean) => void
}

export default function FaqForm({ isAddingFAQ, setIsAddingFAQ }: FaqFormProps) {
    const [newFAQ, setNewFAQ] = useState({
        category: '',
        question: '',
        answer: ''
    })

    const [isCreating, setIsCreating] = useState(false)

    const { createFaq } = useFaqs()

    const categories = ['General', 'Booking', 'Services', 'Policy', 'Billing']

    const handleAddFAQ = () => {
        if (newFAQ.question && newFAQ.answer) {
            createFaq(newFAQ)
            setNewFAQ({ question: '', answer: '', category: 'General' })
            setIsAddingFAQ(false)
        }
    }
    
    return (
        <Card>
          <CardHeader>
            <CardTitle>Add New FAQ</CardTitle>
            <CardDescription>Create a new frequently asked question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select 
                value={newFAQ.category}
                onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Question</label>
              <Input
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                placeholder="Enter the question..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Answer</label>
              <Textarea
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                placeholder="Enter the answer..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFAQ} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Add FAQ'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingFAQ(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
    )
}