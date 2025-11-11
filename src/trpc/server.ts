import "server-only";

import { headers } from "next/headers";
import { appRouter } from "@/server/routers";
import { createCallerFactory, createTRPCContext } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(async () =>
  createTRPCContext({
    headers: await headers(),
  }),
);
