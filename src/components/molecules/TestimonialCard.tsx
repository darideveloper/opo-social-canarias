import { FaStar } from 'react-icons/fa'
import clsx from 'clsx'

interface TestimonialCardType {
  name: string
  title: string
  stars: number
  testimonial: string
  avatar: string
}

const TestimonialCard = ({
  name,
  title,
  stars,
  testimonial,
  avatar,
}: TestimonialCardType) => {
  return (
    <article className={clsx('flex', 'justify-center', 'py-10', 'bg-base-200')}>
      <div className={clsx('card', 'w-full', 'bg-base-100', 'shadow-sm')}>
        <div className={clsx('card-body', 'items-center', 'text-center')}>
          <div className={clsx('avatar')}>
            <div
              className={clsx(
                'w-20',
                'rounded-full',
                'ring',
                'ring-secondary',
                'ring-offset-base-100',
                'ring-offset-2'
              )}
            >
              <img
                src={avatar || '/user.svg'}
                alt={name || 'User'}
              />
            </div>
          </div>

          <h2 className={clsx('card-title', 'mt-2')}>{name}</h2>

          <div className={clsx('flex', 'gap-1', 'text-warning', 'mt-1')}>
            {[...Array(stars)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>

          <h3 className={clsx('font-semibold', 'mt-2')}>{title}</h3>
          <p
            className={clsx(
              'text-sm',
              'opacity-70',
              'mt-2',
              'leading-relaxed',
              'max-w-2xl'
            )}
          >
            {testimonial}
          </p>
        </div>
      </div>
    </article>
  )
}

export default TestimonialCard
