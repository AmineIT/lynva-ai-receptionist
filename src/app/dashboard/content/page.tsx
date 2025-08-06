'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLayout } from '@/components/ui/layout-context'
import { useFaqs } from '@/hooks/useFaqs'
import { ContentSkeleton } from '@/components/ui/content-skeleton'

export default function ContentPage() {
  const [isAddingFAQ, setIsAddingFAQ] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null)
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'General'
  })
  const { setTitle, setSubtitle } = useLayout()

  // Use the FAQs hook
  const { 
    faqs, 
    isLoading: loading, 
    error,
    createFaq,
    updateFaq,
    deleteFaq,
    toggleFaqStatus,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling
  } = useFaqs();

  useEffect(() => {
    setTitle('Content Management');
    setSubtitle('Manage FAQ content for your AI receptionist');
  }, []);

  const categories = ['General', 'Booking', 'Services', 'Policy', 'Billing']

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      createFaq(newFAQ)
      setNewFAQ({ question: '', answer: '', category: 'General' })
      setIsAddingFAQ(false)
    }
  }

  const handleDeleteFAQ = (id: string) => {
    deleteFaq(id)
  }

  const handleToggleStatus = (faqId: string) => {
    const faq = faqs.find(f => f.id === faqId)
    if (!faq) return
    toggleFaqStatus({ faqId, isActive: !faq.is_active })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Booking': 'bg-green-100 text-green-800', 
      'Services': 'bg-purple-100 text-purple-800',
      'Policy': 'bg-orange-100 text-orange-800',
      'Billing': 'bg-red-100 text-red-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <ContentSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total FAQs</CardDescription>
            <CardTitle className="text-2xl">{faqs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active FAQs</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {faqs.filter(faq => faq.is_active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-2xl">
              {new Set(faqs.map(faq => faq.category).filter(Boolean)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Add FAQ Form */}
      {isAddingFAQ && (
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
      )}

      {/* FAQ List */}
      <Card className="border pt-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">FAQ Management</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Manage your frequently asked questions</CardDescription>
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={() => setIsAddingFAQ(true)} size="sm">
                <Plus className="w-3 h-3 mr-2" />
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
                <div key={faq.id} className={`p-4 border rounded-lg ${
                  faq.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(faq.category || 'General')}>
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
      </Card>
    </div>
  )
}
