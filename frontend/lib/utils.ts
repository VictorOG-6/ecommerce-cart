import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatToNaira(amount: number): string {
    if (isNaN(amount)) {
        throw new Error('Invalid number provided');
    }

    // Create a new NumberFormat object for Nigerian Naira without decimal places
    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // Format the amount
    return formatter.format(amount);
}

// utils/date.ts
export function toDate(value: unknown): Date | null {
    if (value == null) return null;

    // already a Date
    if (value instanceof Date) return value;

    // numeric string?
    if (typeof value === 'string' && /^\d+$/.test(value)) {
        const n = Number(value);
        // if it looks like seconds (10 digits), convert
        return n > 1e12 ? new Date(n) : new Date(n * 1000);
    }

    // number
    if (typeof value === 'number') {
        return value > 1e12 ? new Date(value) : new Date(value * 1000);
    }

    // fallback for ISO string
    if (typeof value === 'string') {
        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) return new Date(parsed);
    }

    return null;
}