'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const bannerImages = [
  '/images/tuny1.avif',
  '/images/tuny2.avif',
  '/images/tuny3.avif',
  '/images/tuny4.avif',
  '/images/tuny5.avif',
];

export default function BannerSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // 첫 번째 이미지만 즉시 로딩
  const containerRef = useRef<HTMLDivElement>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);

    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(newIndex);
      if (newIndex < bannerImages.length - 1) {
        newSet.add(newIndex + 1);
      }
      return newSet;
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Intersection Observer로 컨테이너가 보일 때만 이미지 로딩
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 컨테이너가 보이면 첫 번째와 두 번째 이미지 로딩
            setLoadedImages((prev) => {
              const newSet = new Set(prev);
              newSet.add(0);
              newSet.add(1);
              return newSet;
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div className="mx-auto w-full max-w-md" ref={containerRef}>
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex h-full">
          {bannerImages.map((src, index) => (
            <div className="h-full min-w-full flex-shrink-0" key={index}>
              {loadedImages.has(index) ? (
                <Image
                  src={src}
                  alt={`배너 ${index + 1}`}
                  width={400}
                  height={267}
                  className="h-full w-full object-cover"
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, 400px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwjA"
                  quality={index === 0 ? 90 : 75}
                  unoptimized={false}
                />
              ) : (
                <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-200">
                  <div className="text-sm text-gray-400">로딩 중...</div>
                </div>
              )}
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
