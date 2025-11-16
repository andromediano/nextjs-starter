"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export default function HelloTrpc() {
  const trpc = useTRPC();

  // 쿼리 사용
  const usersQuery = useQuery(trpc.user.list.queryOptions());

  // 뮤테이션 사용
  const createUserMutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: () => {
        // 쿼리 무효화
        usersQuery.refetch();
      },
    }),
  );

  if (usersQuery.isLoading) return <div>로딩 중...</div>;
  if (usersQuery.error) return <div>에러 발생</div>;

  return (
    <div>
      <h1>사용자 목록 (Client Component)</h1>
      <ul>
        {usersQuery.data?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          createUserMutation.mutate({
            name: "새 사용자",
            email: "new@example.com",
          })
        }
        disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? "추가 중..." : "사용자 추가"}
      </button>
    </div>
  );
}
