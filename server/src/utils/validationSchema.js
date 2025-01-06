import zod from 'zod';

export const SignUpSchema = zod.object({
  username: zod.string().min(3),
  email: zod.string().min(11),
  password: zod.string().min(8),
});

export const loginSchema = zod.object({
  username: zod.string().min(3),
  password: zod.string().min(8),
});

export const courseSchema = zod.object({
  title: zod.string().min(3),
  description: zod.string().min(8),
  imageLink: zod.string(),
  price: zod.number(),
});

export const updateCourseSchema = zod.object({
  title: zod.string().min(3).max(100).optional(),
  description: zod.string().min(10).optional(),
  imageLink: zod.string().url().optional(),
  price: zod.number().min(0).optional(),
  published: zod.boolean().optional(),
});
