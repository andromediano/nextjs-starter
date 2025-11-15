import { ReactNode } from "react";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

export default async function Layout({ children }: { children: ReactNode }) {
  // 헤더를 통해 세션 가져오기
  const session = await auth.api.getSession({
    headers: await headers(), // Next.js 헤더 사용
  });

  const data = {
    user: {
      name: session?.user.name ?? "",
      email: session?.user.email ?? "",
      avatar: session?.user.image ?? "",
    },
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Input placeholder="Search..." />
          <Separator
            orientation="vertical"
            className="mr-2 ml-2 data-[orientation=vertical]:h-4"
          />
          <ModeToggle />
          <div className="w-12">{session && <NavUser user={data.user} />}</div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
