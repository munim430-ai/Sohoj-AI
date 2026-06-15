import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-electric/15 bg-electric/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-electric',
        className
      )}
    >
      {children}
    </span>
  )
}
