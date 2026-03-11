import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function generateId(max = 10_000): string {
	return String(Math.floor(Math.random() * (max + 1)))
}
