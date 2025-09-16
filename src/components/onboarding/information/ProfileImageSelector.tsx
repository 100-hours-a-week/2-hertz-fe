'use client';

import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { RegisterUserRequest } from '@/lib/api/onboarding';

const PROFILE_IMAGES = [
  '/images/cat-profile.webp',
  '/images/dog-profile.webp',
  '/images/duck-profile.webp',
  '/images/rabbit-profiile.webp',
  '/images/elephant-profile.webp',
  '/images/penguin-profile.webp',
];

export default function ProfileImageSelector() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegisterUserRequest>();
  const selectedUrl = watch('profileImage');

  const [errorFallback, setErrorFallback] = useState<Record<string, boolean>>({});

  const handleError = (url: string) => {
    setErrorFallback((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <main className="space-y-4 px-2">
      <p className="font-semibold">프로필 이미지를 선택해주세요</p>
      <div className="mx-auto mt-6 grid w-[20rem] grid-cols-3 justify-center gap-5">
        {PROFILE_IMAGES.map((url) => {
          const isSelected = selectedUrl === url;
          const fallback = '/images/default-profile.webp';
          const finalUrl = errorFallback[url] ? fallback : url;

          return (
            <button
              type="button"
              key={url}
              onClick={() => setValue('profileImage', url, { shouldValidate: true })}
              className={`relative aspect-square overflow-hidden rounded-full border-1 transition-all duration-200 ${
                isSelected
                  ? 'ring-0.3 border-[var(--gray-200)] shadow-md ring-[var(--gray-100)]'
                  : 'border-muted hover:ring-muted-foreground/30 hover:ring-1'
              }`}
            >
              <Image
                src={finalUrl}
                alt="프로필 이미지"
                width={100}
                height={100}
                className="h-full w-full object-cover"
                onError={() => handleError(url)}
                draggable={false}
                loading="lazy"
                sizes="(max-width: 768px) 100px, 100px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwjA"
              />

              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full shadow">
                    <FaCheck className="bg-transparent text-2xl text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {errors.profileImage && (
        <p className="mt-4 text-xs font-medium text-[var(--pink)]">
          * {errors.profileImage.message}
        </p>
      )}
    </main>
  );
}
