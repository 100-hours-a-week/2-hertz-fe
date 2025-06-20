import {
  AgeGroup,
  Gender,
  Religion,
  Smoking,
  Drinking,
  MBTI,
  Personality,
  PreferredPeople,
  CurrentInterests,
  FavoriteFoods,
  LikedSports,
  Pets,
  SelfDevelopment,
  Hobbies,
} from '@/constants/enum';

const ALL_KEYWORD_MAP = {
  ...prefixEnum('AGE', AgeGroup),
  ...prefixEnum('GENDER', Gender),
  ...prefixEnum('RELIGION', Religion),
  ...prefixEnum('SMOKING', Smoking),
  ...prefixEnum('DRINKING', Drinking),
  ...prefixEnum('MBTI', MBTI),
  ...prefixEnum('PERSONALITY', Personality),
  ...prefixEnum('PREFERRED_PEOPLE', PreferredPeople),
  ...prefixEnum('CURRENT_INTERESTS', CurrentInterests),
  ...prefixEnum('FAVORITE_FOODS', FavoriteFoods),
  ...prefixEnum('LIKED_SPORTS', LikedSports),
  ...prefixEnum('PETS', Pets),
  ...prefixEnum('SELF_DEVELOPMENT', SelfDevelopment),
  ...prefixEnum('HOBBIES', Hobbies),
};

interface KeywordTagProps {
  keywords: string[];
  variant?: 'default' | 'common';
}

// enum 객체의 key 중복을 방지하기 위해 prefix를 붙여 새로운 객체로 변환
function prefixEnum<T extends Record<string, string>>(
  prefix: string,
  obj: T,
): Record<string, string> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[`${prefix}_${key}`] = value;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export default function KeywordTag({ keywords, variant = 'default' }: KeywordTagProps) {
  const isCommon = variant === 'common';

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keywordWithPrefix, i) => {
        const label =
          ALL_KEYWORD_MAP[keywordWithPrefix as keyof typeof ALL_KEYWORD_MAP] || keywordWithPrefix;

        const rawKeyword = keywordWithPrefix.split('_').slice(1).join('_');
        const isPreferredPeople = Object.keys(PreferredPeople).includes(rawKeyword);
        const displayLabel = isPreferredPeople ? `👩🏻‍❤️‍👨🏻 ${label}` : label;

        return (
          <div
            key={i}
            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
              isCommon
                ? 'border-[var(--blue)] bg-[var(--light-blue)] text-[var(--dark-blue)]'
                : 'border-[var(--gray-200)] bg-white text-black'
            }`}
          >
            # {displayLabel}
          </div>
        );
      })}
    </div>
  );
}
