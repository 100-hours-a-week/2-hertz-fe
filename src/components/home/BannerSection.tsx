'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const bannerImages = [
  '/images/tuny1.png',
  '/images/tuny2.png',
  '/images/tuny3.png',
  '/images/tuny4.png',
  '/images/tuny5.png',
];

export default function BannerSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex h-full">
          {bannerImages.map((src, index) => (
            <div className="h-full min-w-full flex-shrink-0" key={index}>
              <Image
                src={src}
                alt={`배너 ${index + 1}`}
                width={400}
                height={267}
                className="h-full w-full object-cover"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        {bannerImages.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              selectedIndex === i ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
