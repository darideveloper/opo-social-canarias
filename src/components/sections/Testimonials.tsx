import React from "react";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import TestimonialCard from "../ui/TestimonialCard";

type Testimonial = {
  name: string;
  title: string;
  stars: number;
  testimonial: string;
  avatar: string;
};

type TestimonialsProps = {
  items?: Testimonial[];
  className?: string;
  autoplayMs?: number;
  loop?: boolean;
};

const defaultItems: Testimonial[] = [
  {
    name: "María González",
    title: "Excelente plataforma",
    stars: 5,
    testimonial:
      "La experiencia ha sido fantástica. La interfaz es muy clara y el soporte inmejorable.",
    avatar: "/user.svg",
  },
  {
    name: "Juan Pérez",
    title: "Muy recomendable",
    stars: 4,
    testimonial:
      "Me ayudó a organizar mejor mi estudio. Funciona rápido y es muy estable.",
    avatar: "/user.svg",
  },
  {
    name: "Laura Martín",
    title: "Resultados reales",
    stars: 5,
    testimonial:
      "He notado una mejora real en mi productividad desde que empecé a usarlo.",
    avatar: "/user.svg",
  },
];

export default function Testimonials({ items = defaultItems, className, autoplayMs = 5000, loop = true}: TestimonialsProps) {
  return (
    <section className={clsx("container","w-full", "py-12", className)}>
      <div className={clsx("w-full", "mx-auto", "px-4")}>
        <div className={clsx("mb-6", "text-center")}>
          <h2 className={clsx("text-2xl", "font-semibold")}>
            Opiniones de nuestros usuarios
          </h2>
          <p className={clsx("opacity-70", "mt-1")}>Lo que dicen sobre nosotros</p>
        </div>

        <div className={clsx("mx-auto", "max-w-3xl", "w-full")}>
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
  );
}


