import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

// Context 타입 정의
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
    // DB 클라이언트, 세션 등을 여기에 추가
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

// 인증이 필요한 프로시저 예시
// export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.session?.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       session: ctx.session,
//     },
//   });
// });
