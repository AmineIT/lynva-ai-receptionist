"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    name: string
    onChange: (date: string) => void
    label: string
}

export function DatePicker({ name, onChange, label }: DatePickerProps) {
    const [ open, setOpen ] = React.useState(false)
    const [ date, setDate ] = React.useState<Date | undefined>(undefined)

    const disabledDays = {
        before: new Date(),
    }

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor={name} className="px-1">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id={name}
                        className="w-full justify-between font-normal"
                    >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] overflow-hidden p-0" align="start" side="bottom">
                    <Calendar
                        mode="single"
                        selected={date}
                        disabled={disabledDays}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                            onChange(date?.toLocaleDateString() || '')
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
