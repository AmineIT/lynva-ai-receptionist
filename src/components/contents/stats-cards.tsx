import { useFaqs } from '@/hooks/useFaqs'
import StatCard from '@/components/ui/stat-card'

export default function StatsCards() {
    const { faqs } = useFaqs()
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                title="Total FAQs"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-violet-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-violet-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{faqs.length}</div>}
            />
            <StatCard
                title="Active FAQs"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-teal-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-teal-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{faqs.filter(faq => faq.is_active).length}</div>}
            />
            <StatCard
                title="Categories"
                icon={
                    <div className="relative flex items-center justify-center h-4 w-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-blue-100 rounded-full w-4 h-4" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-blue-400 rounded-full w-2 h-2" />
                        </div>
                    </div>
                }
                cardContent={<div className="text-2xl font-bold text-gray-900">{new Set(faqs.map(faq => faq.category).filter(Boolean)).size}</div>}
            />
        </div>
    )
}