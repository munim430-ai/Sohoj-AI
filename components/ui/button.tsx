import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-electric text-white shadow-glow hover:bg-azure hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-white text-navy border border-navy/10 shadow-soft hover:border-electric/30 hover:text-electric hover:-translate-y-0.5',
        ghost: 'bg-transparent text-navy hover:bg-navy/5',
        outline:
          'border border-electric/30 text-electric bg-transparent hover:bg-electric/5',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
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
