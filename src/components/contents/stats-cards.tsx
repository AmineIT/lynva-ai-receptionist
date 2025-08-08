import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { useFaqs } from '@/hooks/useFaqs'

export default function StatsCards() {
    const { faqs } = useFaqs()
    
    return (
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
    )
}