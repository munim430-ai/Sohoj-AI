import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-px active:translate-y-0',
        accent:
          'bg-accent text-accent-foreground hover:bg-accent/90 hover:-translate-y-px active:translate-y-0',
        secondary:
          'bg-background text-foreground border border-border hover:bg-secondary',
        ghost:
          'bg-background text-foreground border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-background/80',
        link: 'bg-transparent text-muted-foreground hover:text-foreground',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-7 text-sm',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
}

export function Button({ className, variant, size, href, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)
  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    )
  }
  return <button className={classes} {...props} />
}

export { buttonVariants }
