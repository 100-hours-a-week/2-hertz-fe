'use client';

import KeywordTag from '@/components/common/KeywordTag';
import { TuningKeywords, TuningSameInterests, TuningNormalInterests } from '@/lib/api/matching';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface Tag {
  key: string;
  label: string;
}
interface KeywordTagGroupProps {
  keywords: TuningKeywords;
  sameInterests?: TuningSameInterests;
  normalInterests?: TuningNormalInterests;
  nickname: string;
  relationType?: string;
}

export default function KeywordTagGroup({
  keywords,
  sameInterests,
  normalInterests,
  nickname,
  relationType,
}: KeywordTagGroupProps) {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith('/mypage') || pathname.startsWith('/profile');
  const isMyPage = pathname.startsWith('/mypage');
  const isMatchingPage = pathname.startsWith('/matching');
  const shouldBlurKeyword = relationType !== 'MATCHING';

  // 사용자 키워드를 렌더링용 문자열 배열로 변환 ('preferredPeople': 'RELIABLE' → 'PREFERRED_PEOPLE_RELIABLE')
  const keywordList = Object.entries(keywords).map(
    ([category, key]) => `${category.toUpperCase()}_${key}`,
  );

  useEffect(() => {
    console.log('sameInterests', sameInterests);
    console.log('normalInterests', normalInterests);
  });
  const commonInterestList = sameInterests
    ? Object.entries(sameInterests).flatMap(([category, keys]) => {
        const normalizedCategory = normalizeCategory(category);
        return keys.map((key: string) => `${normalizedCategory}_${key}`);
      })
    : [];

  const normalInterestList = normalInterests
    ? Object.entries(normalInterests).flatMap(([category, keys]) => {
        const normalizedCategory = normalizeCategory(category);
        return keys.map((key: string) => `${normalizedCategory}_${key}`);
      })
    : [];

  //  camelCase → SNAKE_CASE 변환 유틸 함수'preferredPeople' → 'PREFERRED_PEOPLE'
  function normalizeCategory(category: string) {
    return category.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
  }

  return (
    <main className="space-y-4 px-4">
      <div className="mb-10 space-y-4">
        <p className="font-semibold">{nickname}님의 키워드에요</p>
        <KeywordTag keywords={keywordList} />
      </div>
      <div className="mb-4 space-y-1.5">
        <p className="font-semibold">
          {isProfilePage ? '선택한 모든 관심사를 보여드릴게요' : '함께 나누는 공통 관심사에요'}
        </p>
      </div>
      {commonInterestList.length > 0 ? (
        <div>
          <KeywordTag keywords={commonInterestList} variant="common" />
        </div>
      ) : !isMyPage ? (
        <p className="items-center justify-center text-sm font-light text-[var(--gray-300)]">
          공통 관심사가 존재하지 않습니다.
        </p>
      ) : (
        []
      )}
      {normalInterestList.length > 0 ? (
        <div className="relative">
          {!isMyPage && shouldBlurKeyword && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="rounded-2xl border border-[var(--gray-400)] bg-white px-4 py-1 text-xs font-semibold text-[var(--gray-400)]">
                매칭 관계가 되면 확인할 수 있어요
              </div>
            </div>
          )}

          <div className={!isMyPage && shouldBlurKeyword ? 'pointer-events-none blur-[3px]' : ''}>
            <KeywordTag keywords={normalInterestList} variant="default" />
          </div>
        </div>
      ) : (
        <p className="items-center justify-center text-sm font-light text-[var(--gray-300)]">
          {!isMatchingPage ? '일반 관심사가 존재하지 않습니다.' : ''}
        </p>
      )}
    </main>
  );
}
