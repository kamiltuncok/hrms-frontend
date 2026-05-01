import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Geçersiz e-posta adresi'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
});

const passwordValidation = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, 
    'Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir');

export const registerJobSeekerSchema = z.object({
  email: z.string().email('Geçersiz e-posta adresi'),
  password: passwordValidation,
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  identityNumber: z.string().length(11, 'TCKN 11 haneli olmalıdır'),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

export const registerEmployerSchema = z.object({
  email: z.string().email('Geçersiz e-posta adresi'),
  password: passwordValidation,
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Şirket adı zorunludur'),
  webAddress: z.string().url('Geçersiz web sitesi adresi'),
  phoneNumber: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});


export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterJobSeekerValues = z.infer<typeof registerJobSeekerSchema>;
export type RegisterEmployerValues = z.infer<typeof registerEmployerSchema>;
