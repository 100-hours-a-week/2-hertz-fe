'use client';

import { useEffect, useRef, useState } from 'react';
import InterestStep2 from './InterestStep2';
import InterestStep3 from './InterestStep3';
import InterestStep4 from './InterestStep4';
import KeywordStep1 from './KeywordStep1';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { postRegisterInterest } from '@/lib/api/onboarding';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferenceSchema } from '@/lib/schema/onboardingValidation';

type PreferenceFormData = {
  keywords: {
    mbti: string;
    religion: string;
    smoking: string;
    drinking: string;
  };
  interests: {
    personality: string[];
    preferredPeople: string[];
    currentInterests: string[];
    favoriteFoods: string[];
    likedSports: string[];
    pets: string[];
    selfDevelopment: string[];
    hobbies: string[];
  };
};

interface UserPreferenceFormProps {
  onStepChange: (step: number) => void;
}

export default function UserPreferenceForm({ onStepChange }: UserPreferenceFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const getStepFromQuery = () => {
    const step = parseInt(searchParams.get('step') || '1', 10);
    return isNaN(step) ? 1 : step;
  };

  const [step, setStep] = useState(getStepFromQuery());

  useEffect(() => {
    const stepFromQuery = getStepFromQuery();
    if (stepFromQuery !== step) {
      setStep(stepFromQuery);
      onStepChange?.(stepFromQuery);
    }
  }, [searchParams]);

  const methods = useForm<PreferenceFormData>({
    mode: 'onChange',
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      keywords: {
        mbti: '',
        religion: '',
        smoking: '',
        drinking: '',
      },
      interests: {
        personality: [],
        preferredPeople: [],
        currentInterests: [],
        favoriteFoods: [],
        likedSports: [],
        pets: [],
        selfDevelopment: [],
        hobbies: [],
      },
    },
  });

  useEffect(() => {
    if (!searchParams.get('step')) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('step', '1');
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [searchParams, router, pathname]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const goNextPage = () => {
    const { keywords, interests } = methods.getValues();

    if (step === 1) {
      const { mbti, religion, smoking, drinking } = keywords;
      if (!mbti || !religion || !smoking || !drinking) {
        toast.error('모든 항목을 선택해주세요.');
        return;
      }
    } else if (step === 2) {
      const { personality, preferredPeople } = interests;
      if (personality.length === 0 || preferredPeople.length === 0) {
        toast.error('모든 항목을 선택해주세요.');
        return;
      }
    } else if (step === 3) {
      const { currentInterests, favoriteFoods, likedSports, pets } = interests;
      if (
        currentInterests.length === 0 ||
        favoriteFoods.length === 0 ||
        likedSports.length === 0 ||
        pets.length === 0
      ) {
        toast.error('모든 항목을 선택해주세요.');
        return;
      }
    } else if (step === 4) {
      const { selfDevelopment, hobbies } = interests;
      if (selfDevelopment.length === 0 || hobbies.length === 0) {
        toast.error('모든 항목을 선택해주세요.');
        return;
      }
    }

    const nextStep = step + 1;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('step', String(nextStep));
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const onSubmit = async (data: PreferenceFormData) => {
    if (isSubmit) return;
    setIsSubmit(true);
    try {
      await postRegisterInterest(data);
      toast.success('저장이 완료되었습니다.');
      localStorage.setItem('onboardingStep', 'DONE');
      router.push('/home');
    } catch (error) {
      console.error('제출 오류: ', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <main
        ref={scrollRef}
        className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto px-2 pt-14"
      >
        <div className="flex-grow space-y-4">
          {step === 1 && <KeywordStep1 />}
          {step === 2 && <InterestStep2 />}
          {step === 3 && <InterestStep3 />}
          {step === 4 && <InterestStep4 />}
        </div>

        <div className="mt-4 flex w-full justify-center">
          <Button
            onClick={async () => {
              if (step === 4) {
                const isValid = await methods.trigger();
                if (!isValid) {
                  toast.error('입력하지 않은 항목이 있습니다.');
                  return;
                }
                const values = methods.getValues();
                await onSubmit(values);
              } else {
                goNextPage();
              }
            }}
            type="button"
            className="mb-4 w-full max-w-lg rounded-[8] bg-[var(--gray-400)] px-2 py-3 text-center text-sm font-semibold text-white"
          >
            <p>{step === 4 ? (isSubmit ? '저장 중' : '저장하기') : '다음으로'}</p>
          </Button>
        </div>
      </main>
    </FormProvider>
  );
}
