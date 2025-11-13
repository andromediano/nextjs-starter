"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
//import { UserCreateInputObjectZodSchema } from "@/generated/zod/schemas";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

const UserCreateInputObjectZodSchema = z.object({
  name: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  email: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
});

type UserFormData = z.infer<typeof UserCreateInputObjectZodSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserCreateInputObjectZodSchema),
  });

  const trpc = useTRPC();
  const createUser = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: () => {
        alert("사용자가 성공적으로 등록되었습니다!");
        reset(); // 폼 초기화
      },
      onError: (error) => {
        alert(`오류: ${error.message}`);
      },
    }),
  );

  const onSubmit = (data: UserFormData) => {
    createUser.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? <Spinner /> : ""}
              Update User
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
