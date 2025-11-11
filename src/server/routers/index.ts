import { router } from "@/server/trpc";
import { userRouter } from "./user.router";

export const appRouter = router({
  user: userRouter,
  // 다른 라우터들을 여기에 추가
});

export type AppRouter = typeof appRouter;
