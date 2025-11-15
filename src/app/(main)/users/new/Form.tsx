"use client";

import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
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
import { useTRPC } from "@/trpc/client";
import { CreateUserSchema } from "@/schemas/user.schema";

type CreateUserInput = z.infer<typeof CreateUserSchema>;

export default function Form() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const trpc = useTRPC();
  const createUser = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: () => {
        toast("사용자가 성공적으로 등록 되었습니다!");
        form.reset();
      },
      onError: (error) => {
        toast.error(`오류: ${error.message}`);
      },
    }),
  );

  const onSubmit = (data: CreateUserInput) => {
    createUser.mutate(data);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>사용자 등록</CardTitle>
          <CardDescription>
            Help us improve by reporting bugs you encounter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder="Login button not working on mobile"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Provide a concise title for your bug report.
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
                      placeholder="Login button not working on mobile"
                      autoComplete="off"
                    />
                    <FieldDescription>
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
          <Field orientation="horizontal">
            <Button variant={"outline"} asChild>
              <Link href={"/users"}>목록</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              form="create-user-form"
              disabled={createUser.isPending}>
              {createUser.isPending ? <Spinner /> : ""}
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </>
  );
}
