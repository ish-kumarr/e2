import React from 'react'
import { Check } from 'lucide-react'

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function VerifiedBadge({ size = 'md', className = '' }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full bg-green-600 ${sizeClasses[size]} ${className}`}
      aria-label="Verified"
    >
      <Check className={`text-white ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
    </span>
  )
}