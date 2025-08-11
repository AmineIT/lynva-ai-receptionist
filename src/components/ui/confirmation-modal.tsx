'use client'

import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    subtitle: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    onConfirm: () => void | Promise<void>
    isLoading?: boolean
}

export default function ConfirmationModal({
    open,
    onOpenChange,
    title,
    subtitle,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    onConfirm,
    isLoading = false
}: ConfirmationModalProps) {
    const handleConfirm = async () => {
        await onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open || isLoading} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3 bg-neutral-100 p-4 border-b border-neutral-200 rounded-t-lg">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            variant === 'destructive' 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-left text-base font-medium">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-left text-sm text-gray-600">{subtitle}</DialogDescription>
                        </div>
                    </div>
                    <DialogDescription className="text-left text-sm text-gray-600 p-4">{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 p-4 border-t border-neutral-200">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}