import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function getTrustLayerColor(layer: string) {
  const colors = {
    RELIABILITY: 'text-reliability bg-reliability-light',
    TRANSPARENCY: 'text-transparency bg-transparency-light',
    GOVERNANCE: 'text-governance bg-governance-light',
    COMPETENCE: 'text-competence bg-competence-light',
    INTEGRITY: 'text-integrity bg-integrity-light',
  }
  return colors[layer as keyof typeof colors] || 'text-gray-600 bg-gray-100'
}

export function getScoreStatus(score: number) {
  if (score >= 80) return { status: 'Strong', color: 'text-green-600' }
  if (score >= 60) return { status: 'Adequate', color: 'text-yellow-600' }
  if (score >= 40) return { status: 'Weak', color: 'text-orange-600' }
  return { status: 'Critical', color: 'text-red-600' }
}