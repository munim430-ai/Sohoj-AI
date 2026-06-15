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
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-body text-muted-foreground',
        className
      )}
    >
      {children}
    </span>
  )
}
