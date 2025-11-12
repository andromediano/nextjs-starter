import { headers } from "next/headers";
import Image from "next/image";
import HelloTrpc from "@/components/hello-trpc";
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/lib/auth";
import { api } from "@/trpc/server";

export default async function Home() {
  // 헤더를 통해 세션 가져오기
  const session = await auth.api.getSession({
    headers: await headers(), // Next.js 헤더 사용
  });
  const users = await api.user.list();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <ModeToggle />
        {session && (
          <div>
            {session.user.name} <b>로그아웃</b>
          </div>
        )}
        <h1>사용자 목록 (Server Component)</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
        <HelloTrpc />
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
      </main>
    </div>
  );
}
