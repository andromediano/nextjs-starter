import Image from "next/image";

import HelloTrpc from "@/components/hello-trpc";

export default async function Home() {
  return (
    <>
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <HelloTrpc />
    </>
  );
}
