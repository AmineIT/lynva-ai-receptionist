'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLayout } from '@/components/ui/layout-context'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isActive: boolean
}

export default function ContentPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'What are your business hours?',
      answer: 'We are open Monday to Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM.',
      category: 'General',
      isActive: true
    },
    {
      id: '2', 
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by calling us directly or through our online booking system.',
      category: 'Booking',
      isActive: true
    },
    {
      id: '3',
      question: 'What is your cancellation policy?',
      answer: 'Please provide at least 24 hours notice for cancellations to avoid any fees.',
      category: 'Policy',
      isActive: true
    }
  ])
  const [isAddingFAQ, setIsAddingFAQ] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null)
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'General'
  })
  const { setTitle, setSubtitle } = useLayout()

  useEffect(() => {
    setTitle('Content Management');
    setSubtitle('Manage FAQ content for your AI receptionist');
  }, []);

  const categories = ['General', 'Booking', 'Services', 'Policy', 'Billing']

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const faq: FAQItem = {
        id: Date.now().toString(),
        question: newFAQ.question,
        answer: newFAQ.answer,
        category: newFAQ.category,
        isActive: true
      }
      setFaqs([...faqs, faq])
      setNewFAQ({ question: '', answer: '', category: 'General' })
      setIsAddingFAQ(false)
    }
  }

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  const toggleFAQStatus = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ))
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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-end">
        <Button onClick={() => setIsAddingFAQ(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total FAQs</CardDescription>
            <CardTitle className="text-2xl">{faqs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active FAQs</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {faqs.filter(faq => faq.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-2xl">
              {new Set(faqs.map(faq => faq.category)).size}
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
              <Button onClick={handleAddFAQ}>Add FAQ</Button>
              <Button variant="outline" onClick={() => setIsAddingFAQ(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Management</CardTitle>
          <CardDescription>Manage your frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent>
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
              <p className="text-gray-500">Add your first FAQ to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className={`p-4 border rounded-lg ${
                  faq.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category}
                        </Badge>
                        <Badge variant={faq.isActive ? 'default' : 'secondary'}>
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFAQStatus(faq.id)}
                      >
                        {faq.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteFAQ(faq.id)}
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