import { z } from 'zod';

export const registerUserSchema = z.object({
  providerId: z.string().nonempty(),
  provider: z.enum(['KAKAO']),
  profileImage: z.string().min(1, { message: '프로필 이미지를 선택해주세요.' }),
  email: z.string().optional(),
  nickname: z.string().min(1, { message: '닉네임을 입력해주세요.' }),
  ageGroup: z.enum(['AGE_20S', 'AGE_30S', 'AGE_40S', 'AGE_50S', 'AGE_60_PLUS'], {
    errorMap: () => ({ message: '나이를 선택해주세요.' }),
  }),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: '성별을 선택해주세요.' }),
  }),
  oneLineIntroduction: z
    .string()
    .min(10, { message: '최소 10자 이상 작성해주세요.' })
    .max(100, { message: '최대 100자까지만 작성할 수 있어요.' })
    .refine((value) => value.replace(/\s/g, '').length >= 10, {
      message: '최소 10자 이상 작성해주세요.',
    }),
  isTest: z.boolean(),
  friendAllowed: z.boolean(),
  coupleAllowed: z.boolean(),
  invitationCode: z
    .number({
      required_error: '초대 코드를 입력해주세요.',
      invalid_type_error: '숫자만 입력 가능합니다.',
    })
    .min(1000, { message: '4자리 숫자 코드를 입력해주세요.' })
    .max(9999, { message: '4자리 숫자 코드를 입력해주세요.' }),
});

export const preferenceSchema = z.object({
  keywords: z.object({
    mbti: z.string().min(1, 'MBTI를 선택해주세요.'),
    religion: z.string().min(1, '종교를 선택해주세요.'),
    smoking: z.string().min(1, '흡연 여부를 선택해주세요.'),
    drinking: z.string().min(1, '음주 여부를 선택해주세요.'),
  }),
  interests: z.object({
    personality: z.array(z.string()).min(1, '성격을 하나 이상 선택해주세요.'),
    preferredPeople: z.array(z.string()).min(1, '선호하는 사람을 하나 이상 선택해주세요.'),
    currentInterests: z.array(z.string()).min(1, '관심사를 하나 이상 선택해주세요.'),
    favoriteFoods: z.array(z.string()).min(1, '좋아하는 음식을 하나 이상 선택해주세요.'),
    likedSports: z.array(z.string()).min(1, '좋아하는 운동을 하나 이상 선택해주세요.'),
    pets: z.array(z.string()).min(1, '선호하는 반려동물을 하나 이상 선택해주세요.'),
    selfDevelopment: z.array(z.string()).min(1, '자기계발 항목을 하나 이상 선택해주세요.'),
    hobbies: z.array(z.string()).min(1, '취미를 하나 이상 선택해주세요.'),
  }),
});
