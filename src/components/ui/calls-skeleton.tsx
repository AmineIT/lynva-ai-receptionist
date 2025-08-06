import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card'
import { Skeleton } from './skeleton'

export const CallsSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="border py-0 overflow-hidden h-full shadow-none">
                <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-gray-900 text-sm font-semibold">
                                <Skeleton className="h-2 w-24 bg-white mb-2" />
                            </CardTitle>
                            <CardDescription className="text-gray-500 text-xs">
                                <Skeleton className="h-2 w-48 bg-white" />
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="overflow-x-auto mb-4">
                        <div className="min-w-full">
                            <div className="flex">
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                                <div className="w-1/6 px-2">
                                    <Skeleton className="h-3 w-20 mb-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}