import { z } from 'zod';

export const oneLineIntroSchema = z
  .string()
  .min(10, { message: '최소 10자 이상 작성해주세요.' })
  .max(100, { message: '최대 100자까지만 작성할 수 있어요.' })
  .refine((value) => value.replace(/\s/g, '').length >= 10, {
    message: '최소 10자 이상 작성해주세요.',
  });
