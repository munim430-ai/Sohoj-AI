import Link from 'next/link'

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 4h24a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H16.5L9 36.5a1 1 0 0 1-1.7-.7V30H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z"
        fill="#000000"
      />
      <path
        d="M20 9.5l2.1 5.9a3 3 0 0 0 1.8 1.8l5.9 2.1-5.9 2.1a3 3 0 0 0-1.8 1.8L20 29.1l-2.1-5.9a3 3 0 0 0-1.8-1.8L10.2 19.3l5.9-2.1a3 3 0 0 0 1.8-1.8L20 9.5Z"
        fill="#ffffff"
      />
    </svg>
  )
}

export function Brand({ size = 28 }: { size?: number }) {
  return (
    <Link href="/" className="mk-nav-brand" aria-label="ShahojAI home">
      <BrandMark size={size} />
      <span>
        Shahoj<span className="mk-brand-ai">AI</span>
      </span>
    </Link>
  )
}
