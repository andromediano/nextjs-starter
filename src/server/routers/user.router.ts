import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas/user.schema";
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
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      await prisma.user.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ input }) => {
      const { id, email, name } = input;
      await prisma.user.update({
        where: { id },
        data: {
          email,
          name,
        },
      });
    }),
});
