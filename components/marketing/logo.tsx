import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  variant = 'full',
  priority = false,
}: {
  className?: string
  variant?: 'full' | 'mark'
  priority?: boolean
}) {
  const src = variant === 'full' ? '/logo-sohojai.png' : '/logo-mark.png'
  const dims =
    variant === 'full'
      ? { width: 841, height: 373 }
      : { width: 301, height: 373 }

  return (
    <Link href="/" aria-label="sohojAI home" className={cn('inline-flex', className)}>
      <Image
        src={src}
        alt="sohojAI"
        width={dims.width}
        height={dims.height}
        priority={priority}
        className="h-full w-auto"
      />
    </Link>
  )
}
