import { z } from "zod";

import { CreateUserSchema, UpdateUserSchema } from "@/schemas/user.schema";
import { router, protectedProcedure } from "@/server/trpc";

export const userRouter = router({
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await ctx.db.user.findFirstOrThrow({
        where: { id: input },
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany();
  }),

  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await ctx.db.user.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const { id, email, name } = input;
      await ctx.db.user.update({
        where: { id },
        data: {
          email,
          name,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: userId }) => {
      await ctx.db.user.delete({
        where: { id: userId },
      });
      return { success: true };
    }),
});
