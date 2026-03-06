"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    title: "Build Faster with Next.js",
    subtitle: "Production-ready UI with Tailwind & modern tools",
    image:
      "https://images.unsplash.com/photo-1565548058654-6ba93b5e3135?w=1200&auto=format&fit=crop&q=60",
    cta: "Get Started",
  },
  {
    id: 2,
    title: "Modern Dashboard Experience",
    subtitle: "Clean UI, scalable architecture",
    image:
      "https://images.unsplash.com/photo-1565548058654-6ba93b5e3135?w=1200&auto=format&fit=crop&q=60",
    cta: "Explore Features",
  },
  {
    id: 3,
    title: "Performance & Security",
    subtitle: "Optimized for real-world applications",
    image:
      "https://images.unsplash.com/photo-1565548058654-6ba93b5e3135?w=1200&auto=format&fit=crop&q=60",
    cta: "Learn More",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden rounded-xl">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{
          clickable: true,
          el: ".hero-pagination",
        }}
        className="h-[320px] md:h-[420px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
              <div className="relative z-10 flex h-full items-center">
                <div className="px-6 md:px-10 max-w-xl text-white">
                  <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="mt-3 text-sm md:text-base text-slate-200">
                    {slide.subtitle}
                  </p>
                  <button className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 transition">
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="hero-pagination absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2" />
    </section>
  );
}
