import clsx from 'clsx'

type ImageProps = {
  src: string
  alt: string
  className?: string
}

export default function Image({ src, alt, className }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        'object-cover',
        'rounded-2xl',
        'md:max-w-2xl',
        className,
        'shadow-lg'
      )}
    />
  )
}
