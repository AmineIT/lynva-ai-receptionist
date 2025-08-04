'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, Book, MessageCircle, Mail, Phone, ExternalLink, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLayout } from '@/components/ui/layout-context'

interface HelpArticle {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  popular: boolean
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { setTitle } = useLayout()

  useEffect(() => {
    setTitle('Help & Support');
  }, []);

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with Lynva AI Receptionist',
      description: 'Learn how to set up your AI receptionist and configure basic settings',
      category: 'Getting Started',
      readTime: '5 min',
      popular: true
    },
    {
      id: '2',
      title: 'Configuring Voice AI Settings',
      description: 'Customize your Vapi voice AI assistant for optimal performance',
      category: 'Voice AI',
      readTime: '8 min',
      popular: true
    },
    {
      id: '3',
      title: 'Managing Bookings and Calendar Integration',
      description: 'Connect Google Calendar and manage appointment bookings',
      category: 'Bookings',
      readTime: '6 min',
      popular: false
    },
    {
      id: '4',
      title: 'Setting Up WhatsApp Notifications',
      description: 'Configure WhatsApp Business API for customer communications',
      category: 'Integrations',
      readTime: '4 min',
      popular: true
    },
    {
      id: '5',
      title: 'Understanding Call Analytics',
      description: 'Learn how to interpret your call logs and analytics data',
      category: 'Analytics',
      readTime: '7 min',
      popular: false
    },
    {
      id: '6',
      title: 'Troubleshooting Common Issues',
      description: 'Solutions to frequently encountered problems',
      category: 'Troubleshooting',
      readTime: '10 min',
      popular: true
    }
  ]

  const categories = ['all', 'Getting Started', 'Voice AI', 'Bookings', 'Integrations', 'Analytics', 'Troubleshooting']

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      'Getting Started': 'bg-green-100 text-green-800',
      'Voice AI': 'bg-purple-100 text-purple-800',
      'Bookings': 'bg-blue-100 text-blue-800',
      'Integrations': 'bg-orange-100 text-orange-800',
      'Analytics': 'bg-cyan-100 text-cyan-800',
      'Troubleshooting': 'bg-red-100 text-red-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers to your questions and get the most out of Lynva</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-500">Chat with our support team</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-500">Send us a detailed message</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone Support</h3>
                <p className="text-sm text-gray-500">Call our support hotline</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </div>

      {/* Popular Articles */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Popular Articles
            </CardTitle>
            <CardDescription>Most viewed help articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helpArticles.filter(article => article.popular).map(article => (
                <div key={article.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-primary hover:text-primary-dark">
                    <span className="text-sm font-medium">Read more</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Help Articles</CardTitle>
          <CardDescription>
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or browse by category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map(article => (
                <div key={article.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      {article.popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-600">{article.description}</p>
                  </div>
                  <div className="ml-4">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
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