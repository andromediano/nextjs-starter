import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // DB 조회 로직
      return {
        id: input.id,
        name: "홍길동",
        email: "hong@example.com",
      };
    }),

  list: publicProcedure.query(async () => {
    // 사용자 목록 조회
    return [
      { id: "1", name: "홍길동", email: "hong@example.com" },
      { id: "2", name: "김철수", email: "kim@example.com" },
    ];
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      // DB에 사용자 생성
      return {
        id: Math.random().toString(),
        ...input,
      };
    }),
});
