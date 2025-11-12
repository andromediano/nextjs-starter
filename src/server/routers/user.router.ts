import { z } from "zod";
import { UserCreateInputObjectSchema } from "@/generated/zod/schemas";
import { prisma } from "@/lib/prisma";
import { router, publicProcedure } from "@/server/trpc";

export const userRouter = router({
  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma.user.findFirstOrThrow({
      where: { id: input },
    });
  }),

  list: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  }),

  create: publicProcedure
    .input(UserCreateInputObjectSchema)
    .mutation(async ({ input }) => {
      await prisma.user.create({
        data: input,
      });
    }),
});
