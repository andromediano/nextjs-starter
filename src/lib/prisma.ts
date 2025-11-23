import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";

// 연결 풀 생성 (로컬 Postgres에 최적화: max 20 연결)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 로컬 개발용: 연결 타임아웃 등 추가 설정 가능
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool); // 어댑터 생성

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Prisma for Supabase connection pooler
// See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#pgbouncer
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "info"]
        : ["error"],
    // 로컬 Postgres는 그냥 환경변수로 읽어옵니다.
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
