import { api } from "@/trpc/server";

export default async function Page() {
  const users = await api.user.list();
  return (
    <>
      <h1>사용자 목록 (Server Component)</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </>
  );
}
