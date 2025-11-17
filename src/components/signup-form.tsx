"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { SignupUserSchema } from "@/schemas/user.schema";

type SignupUserInput = z.infer<typeof SignupUserSchema>;
const URI_WELCOME = process.env.NEXT_PUBLIC_URI_WELCOME ?? "";
const URI_SIGNIN = process.env.NEXT_PUBLIC_URI_SIGNIN ?? "";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const form = useForm<SignupUserInput>({
    resolver: zodResolver(SignupUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKakaoRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "kakao",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      setError("카카오 로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formdata: SignupUserInput) => {
    setError("");
    setLoading(true);

    try {
      // passwordConfirm을 제외하고 필요한 필드만 전송
      const { error } = await authClient.signUp.email({
        email: formdata.email,
        password: formdata.password,
        name: formdata.name,
      });

      if (error) {
        setError(error.message || "회원가입에 실패했습니다.");
        return;
      }

      router.push(URI_WELCOME);
    } catch (error) {
      console.error(error);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>이름</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="이름을 입력해 주세요"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    타인에게 불쾌감을 주는 이름은 피해주세요.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>이메일</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="이메일을 입력해 주세요"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    로그인 할 때 아이디로 사용 됩니다.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>패스워드</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="패스워드"
                    autoComplete="off"
                  />
                  <FieldDescription className="hidden">
                    Provide a concise title for your bug report.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="passwordConfirm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>패스워드 확인</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="패스워드"
                    autoComplete="off"
                  />
                  <FieldDescription className="hidden">
                    Provide a concise title for your bug report.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="vertical">
          <Button type="submit" form="signup-form">
            {loading ? <Spinner /> : ""}
            회원가입
          </Button>
          <Separator className="my-2" />
          <Button
            variant="outline"
            type="button"
            className="bg-yellow-300"
            onClick={handleKakaoRegister}>
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
            </svg>
            카카오로 가입하기
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <FieldDescription className="text-center">
            이미 가입이 되어 있나요? <Link href={URI_SIGNIN}>로그인</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
