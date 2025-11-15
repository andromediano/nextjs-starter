import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  age: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 최소 2자리 이상이어야 합니다.")
    .max(16, "이름은 최대 16자리 이하이어야 합니다."),
  email: z.email("올바른 이메일 주소를 입력하세요."),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, "이름은 최소 2자리 이상이어야 합니다.")
    .max(16, "이름은 최대 16자리 이하이어야 합니다."),
  email: z.email("올바른 이메일 주소를 입력하세요."),
});

export const LoginUserSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력하세요."),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
    .max(32, "비밀번호는 최대 32자리 이하로 입력하세요."),
});

export const SignupUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "이름은 최소 2자리 이상이어야 합니다.")
      .max(16, "이름은 최대 16자리 이하이어야 합니다."),
    email: z.email("올바른 이메일 주소를 입력하세요."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
      .max(32, "비밀번호는 최대 32자리 이하로 입력하세요."),
    passwordConfirm: z
      .string()
      .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
      .max(32, "비밀번호는 최대 32자리 이하로 입력하세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치 하지 않습니다.",
  });
