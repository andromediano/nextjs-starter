import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { CreateDialog } from "./create-dialog";

export default async function Page() {
  const users = await api.user.list();
  return (
    <>
      <h1>사용자 목록 (Server Component)</h1>
      <Button variant={"outline"} asChild>
        <Link href={"/users/new"}>추가</Link>
      </Button>
      <CreateDialog />
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}/edit`}>{user.name}</Link> -{" "}
            {user.email}
          </li>
        ))}
      </ul>
    </>
  );
}
