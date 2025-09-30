import React, { useRef } from 'react';
import Autoplay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from '../ui/Carousel';
import { Card, CardContent } from '../ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';

export default function Testimonials() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const carouselOptions = {
    slidesToScroll: 1,
    containScroll: 'trimSnaps' as const,
    align: 'start' as const,
    breakpoints: {
      '(min-width: 768px)': { 
        slidesToScroll: 1,
        align: 'start' as const
      },
      '(min-width: 1024px)': { 
        slidesToScroll: 1,
        align: 'start' as const
      }
    }
  };

  const testimonials = [
    {
      name: "Laura G.",
      avatar: "LG",
      title: "¡Imprescindible!",
      text: "El temario 100% canario es una joya. Ahorré semanas de trabajo adaptando temarios genéricos. Los casos prácticos con IA son como tener un preparador personal 24/7.",
      rating: 5,
    },
    {
      name: "Sofía M.",
      avatar: "SM",
      title: "La mejor inversión",
      text: "Dudé por el precio, pero ha sido la mejor inversión en mi oposición. La claridad del temario y la práctica ilimitada me han dado una seguridad que no tenía.",
      rating: 5,
    },
    {
      name: "Carla P.",
      avatar: "CP",
      title: "Por fin, todo en un sitio",
      text: "Tener el temario, los tests, los casos prácticos y el seguimiento de convocatorias en un solo lugar no tiene precio. La función de descargar en PDF es un plus increíble.",
      rating: 5,
    },
    {
      name: "Elena R.",
      avatar: "ER",
      title: "Un antes y un después",
      text: "La herramienta de búsqueda con IA para encontrar recursos y normativa específica me ha volado la cabeza. Encuentro lo que necesito en segundos, no en horas.",
      rating: 5,
    },
    {
      name: "Mar\u00EDa L.",
      avatar: "ML",
      title: "Recomendación total",
      text: "La plataforma es intuitiva y los casos prácticos son muy realistas. Me siento mucho más preparada para las oposiciones.",
      rating: 5,
    },
    {
      name: "Ana C.",
      avatar: "AC",
      title: "Vale cada euro",
      text: "El seguimiento de convocatorias me mantiene siempre informada. No me pierdo ninguna oportunidad de trabajo.",
      rating: 5,
    }
  ];

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-foreground">Lo que dicen nuestras alumnas</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            El éxito de nuestras opositoras es nuestro mayor orgullo.
          </p>
        </div>
        
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-6xl mx-auto"
          opts={carouselOptions}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 basis-full">
                <div className="p-1">
                  <Card className="h-full mx-1">
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-3">
                      <Avatar className="w-16 h-16 border-2 border-primary">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=a042581f4e29026704d`} />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <div className="flex items-center justify-center">
                          {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                      </div>
                      <blockquote className="text-base font-semibold leading-snug font-headline">&ldquo;{testimonial.title}&rdquo;</blockquote>
                      <p className="text-muted-foreground text-center text-sm leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
