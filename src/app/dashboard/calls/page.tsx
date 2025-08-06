'use client'

import { useState, useEffect } from 'react'
import { Phone, Clock, MessageSquare, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useLayout } from '@/components/ui/layout-context'
import { CallsSkeleton } from '@/components/ui/calls-skeleton'

interface CallLog {
  id: string
  caller_phone?: string
  caller_name?: string
  call_duration_seconds?: number
  call_status?: string
  intent_detected?: string
  transcript?: string
  ai_summary?: string
  created_at: string
}

export default function CallLogsPage() {
  const [ callLogs, setCallLogs ] = useState<CallLog[]>([])
  const [ loading, setLoading ] = useState(true)
  const { setTitle, setSubtitle } = useLayout()

  useEffect(() => {
    fetchCallLogs();
    setTitle('Call Logs');
    setSubtitle('View and manage incoming call records');
  }, [])

  const fetchCallLogs = async () => {
    try {
      // Get the first business from the database as default
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .limit(1)
        .single()

      if (businessData) {
        const { data, error } = await supabase
          .from('call_logs')
          .select('*')
          .eq('business_id', businessData.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setCallLogs(data || [])
      }
    } catch (error) {
      console.error('Error fetching call logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'missed': return 'bg-red-100 text-red-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <CallsSkeleton />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Calls</CardDescription>
            <CardTitle className="text-2xl">{callLogs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {callLogs.filter(log => log.call_status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Missed</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {callLogs.filter(log => log.call_status === 'missed').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Avg Duration</CardDescription>
            <CardTitle className="text-2xl">
              {callLogs.length > 0 ? formatDuration(
                Math.round(callLogs.reduce((sum, log) => sum + (log.call_duration_seconds || 0), 0) / callLogs.length)
              ) : '0:00'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Call Logs List */}
      <Card className="border py-0 overflow-hidden h-full shadow-none">
        <CardHeader className="bg-neutral-100 border-b border-neutral-200 py-4 gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 text-sm font-semibold">Recent Calls</CardTitle>
              <CardDescription className="text-gray-500 text-xs">Latest incoming calls and their details</CardDescription>
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={fetchCallLogs} size="sm">
                <RefreshCcw className="w-3 h-3 mr-2" />
                <p className="text-xs">Refresh</p>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {callLogs.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-6 h-6 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold text-gray-600">No call logs yet</h3>
              <p className="text-gray-400 text-xs mb-4">Call logs will appear here once you start receiving calls through Vapi.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {callLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border border-muted rounded-lg hover:bg-muted">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">
                          {log.caller_name || 'Unknown Caller'}
                        </span>
                        <Badge className={getStatusColor(log.call_status || 'unknown')}>
                          {log.call_status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{log.caller_phone || 'No phone'}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.call_duration_seconds ? formatDuration(log.call_duration_seconds) : '0:00'}
                        </span>
                        <span>{new Date(log.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.intent_detected && (
                      <Badge variant="outline">{log.intent_detected}</Badge>
                    )}
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
    </div>
  )
}