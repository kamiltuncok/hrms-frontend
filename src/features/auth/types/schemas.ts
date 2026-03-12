import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerJobSeekerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  identityNumber: z.string().length(11, 'Identity number must be 11 digits'),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const registerEmployerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  webAddress: z.string().url('Invalid website URL'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterJobSeekerValues = z.infer<typeof registerJobSeekerSchema>;
export type RegisterEmployerValues = z.infer<typeof registerEmployerSchema>;
