'use client';

import { Suspense } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import OnboardingInformationWrapper from '@/components/onboarding/information/OnboardingInformationWrapper';

export default function OnboardingInformationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-y-hidden pt-14">
      <Suspense fallback={<ScaleLoader />}>
        <OnboardingInformationWrapper />
      </Suspense>
    </div>
  );
}
