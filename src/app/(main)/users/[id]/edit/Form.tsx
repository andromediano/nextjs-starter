"use client";

import { useEffect } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Spinner } from "@/components/ui/spinner";
import { UpdateUserSchema } from "@/schemas/user.schema";
import { useTRPC } from "@/trpc/client";

type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export default function Form({ userId }: { userId: string }) {
  const trpc = useTRPC();

  // 사용자 정보 가져오기
  const userQuery = useQuery(trpc.user.getById.queryOptions(userId));

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      id: userId,
      name: "",
      email: "",
    },
  });

  // 사용자 데이터가 로드되면 폼에 채우기
  useEffect(() => {
    if (userQuery.data) {
      form.reset({
        id: userQuery.data.id,
        name: userQuery.data.name || "",
        email: userQuery.data.email,
      });
    }
  }, [userQuery.data, form]);

  const updateUser = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: () => {
        toast("사용자가 성공적으로 수정 되었습니다!");
      },
      onError: (error) => {
        toast.error(`오류: ${error.message}`);
      },
    }),
  );

  const onSubmit = (data: UpdateUserInput) => {
    updateUser.mutate(data);
  };

  if (userQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사용자 수정</CardTitle>
          <CardDescription>사용자 정보를 불러오는 중...</CardDescription>
        </CardHeader>
        <CardContent>
          <Spinner className="size-12" />
        </CardContent>
      </Card>
    );
  }

  if (userQuery.error || !userQuery.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>사용자를 찾을 수 없습니다</CardTitle>
          <CardDescription>
            {userQuery.error
              ? `오류: ${userQuery.error.message}`
              : "요청하신 사용자 정보가 없습니다."}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/users">목록으로 돌아가기</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>사용자 수정</CardTitle>
          <CardDescription>사용자 정보를 수정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="update-user-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder="사용자 이름을 입력하세요"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      사용자의 이름을 입력해주세요.
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
                      placeholder="email@example.com"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      사용자의 이메일 주소를 입력해주세요.
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
          <Field orientation="horizontal">
            <Button variant={"outline"} asChild>
              <Link href={"/users"}>목록</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                form.reset({
                  id: userQuery.data.id,
                  name: userQuery.data.name || "",
                  email: userQuery.data.email,
                })
              }>
              Reset
            </Button>
            <Button
              type="submit"
              form="update-user-form"
              disabled={updateUser.isPending}>
              {updateUser.isPending ? <Spinner /> : ""}
              수정
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
