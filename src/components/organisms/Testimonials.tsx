// Libs
import clsx from 'clsx'

// Components
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules'
import TestimonialCard from '../molecules/TestimonialCard'
import H2 from '../atom/H2.tsx'

// Styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Types
type Testimonial = {
  name: string
  title: string
  stars: number
  testimonial: string
  avatar: string
}

type TestimonialsProps = {
  items?: Testimonial[]
  className?: string
  autoplayMs?: number
  loop?: boolean
}

// Data
const defaultItems: Testimonial[] = [
  {
    name: 'María González',
    title: 'Aprobada en Justicia 2024',
    stars: 5,
    testimonial:
      'Después de tres años intentándolo por mi cuenta, esta plataforma marcó la diferencia. Los test personalizados que se adaptan a tus puntos débiles y el sistema de repaso espaciado fueron clave para conseguir mi plaza. No se me olvidaba nada el día del examen.',
    avatar: '/testimonials/maria-gonzalez.webp',
  },
  {
    name: 'Juan Pérez Martínez',
    title: 'Opositor de Hacienda',
    stars: 5,
    testimonial:
      'Llevo 8 meses usándola y ha transformado mi forma de estudiar. Todo está actualizado con la última legislación y los simulacros son muy realistas. Poder estudiar desde el móvil me permite aprovechar cada momento libre. Mis resultados han mejorado un 35%.',
    avatar: '/testimonials/juan-perez-martinez.webp',
  },
  {
    name: 'Laura Martín Ruiz',
    title: 'Preparando Auxiliar Administrativo',
    stars: 4,
    testimonial:
      'Perfecto para compaginar trabajo y estudio. El panel de estadísticas me ayuda a ver qué temas reforzar y los test son muy similares a los reales. Solo le falta añadir más casos prácticos resueltos, pero por lo demás es excelente.',
    avatar: '/testimonials/laura-martin-ruiz.webp',
  },
  {
    name: 'Carlos Rodríguez',
    title: 'Maestro de Educación Primaria',
    stars: 5,
    testimonial:
      'Aprobé el año pasado gracias a esta plataforma. La comunidad de opositores es muy activa y los recursos para preparar la programación didáctica me ahorraron semanas de trabajo. Los tutores realmente saben de lo que hablan. Totalmente recomendable.',
    avatar: '/testimonials/carlos-rodriguez.webp',
  },
  {
    name: 'Ana Sánchez Torres',
    title: 'Opositora de Enfermería',
    stars: 5,
    testimonial:
      'Como madre de dos niños, optimizar el tiempo es crucial. Esta plataforma me permite estudiar en sesiones cortas adaptadas a mi disponibilidad. Los vídeos son concisos y el sistema me recuerda qué repasar. En 5 meses he mejorado muchísimo.',
    avatar: '/testimonials/ana-sanchez-torres.webp',
  },
  {
    name: 'David López García',
    title: 'Administrativo del Estado',
    stars: 4,
    testimonial:
      'Tras suspender por poco, esta herramienta me dio el empujón que necesitaba. Banco enorme de preguntas siempre actualizado y test personalizables por temas. Mi velocidad resolviendo ejercicios ha aumentado considerablemente. Las estadísticas comparativas son muy útiles.',
    avatar: '/testimonials/david-lopez-garcia.webp',
  },
]

export default function Testimonials({
  items = defaultItems,
  className,
  autoplayMs = 5000,
  loop = true,
}: TestimonialsProps) {
  return (
    <section className={clsx('container', 'w-full', 'py-12', className)}>
      <div className={clsx('w-full', 'mx-auto', 'px-4')}>
        <div className={clsx('mb-6', 'text-center')}>
          <H2>
            Opiniones de nuestros usuarios
          </H2>
          <p className={clsx('opacity-70', 'mt-1')}>
            Lo que dicen sobre nosotros
          </p>
        </div>

        <div className={clsx('mx-auto', 'max-w-4xl', 'w-full')}>
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoHeight
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: autoplayMs, disableOnInteraction: false }}
            loop={loop}
            breakpoints={{
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
          >
            {items.map((t, idx) => (
              <SwiperSlide key={`${t.name}-${idx}`}>
                <TestimonialCard
                  name={t.name}
                  title={t.title}
                  stars={t.stars}
                  testimonial={t.testimonial}
                  avatar={t.avatar}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
