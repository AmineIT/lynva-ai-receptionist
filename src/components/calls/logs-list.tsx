import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCcw, PhoneIncoming, Clock, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDuration, formatPhoneNumber, formatDate } from '@/lib/utils'
import StatusBadge from '@/components/ui/status-badge'

export default function LogsList({ calls, refetch }: { calls: any[], refetch: () => void }) {
    return (
        <Card className="border pt-0 overflow-hidden h-full shadow-none">
            <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900 text-sm font-semibold">Recent Calls</CardTitle>
                        <CardDescription className="text-gray-500 text-xs">Latest incoming calls and their details</CardDescription>
                    </div>
                    <div className="flex items-end justify-end">
                        <Button onClick={() => refetch()} size="sm">
                            <RefreshCcw className="w-3 h-3 mr-2" />
                            <p className="text-xs">Refresh</p>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {calls.length === 0 ? (
                    <div className="text-center py-12">
                        <PhoneIncoming className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-sm font-semibold text-gray-600">No call logs yet</h3>
                        <p className="text-gray-400 text-xs mb-4">Call logs will appear here once you start receiving calls through Vapi.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {calls.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 border border-muted rounded-lg hover:bg-muted">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <PhoneIncoming className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-muted-foreground">
                                                {log.caller_name || 'Unknown Caller'}
                                            </span>
                                            {log.intent_detected && (
                                                <Badge variant="outline" className='capitalize'>{log.intent_detected}</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <span>{formatPhoneNumber(log.caller_phone || 'No phone')}</span>
                                            <span className="text-muted-foreground/30 text-xs">•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {log.call_duration_seconds ? formatDuration(log.call_duration_seconds) : '0:00'}
                                            </span>
                                            <span className="text-muted-foreground/30 text-xs">•</span>
                                            <span>{formatDate(log.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={log.call_status?.toLowerCase() || 'unknown'} />
                                    {log.transcript && (
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            View Transcript
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
