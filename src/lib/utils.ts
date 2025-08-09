import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat('en-AE', {
        dateStyle: 'medium',
        timeZone: 'Asia/Dubai',
    }).format(new Date(date));
}

export function formatTime(time: string) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('en-AE', {
        timeStyle: 'short',
        timeZone: 'Asia/Dubai',
    }).format(date);
}

export function formatCurrency(amount: number, currency = 'AED') {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

export function formatPhoneNumber(phone: string) {
    // Simple UAE phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('971')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    if (cleaned.startsWith('0') && cleaned.length === 10) {
        return `+971 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
}

export function generateTimeSlots(startHour = 9, endHour = 17, interval = 60) {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(time);
        }
    }
    return slots;
}

export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
    const phoneRegex = /^(\+971|0)?[1-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
