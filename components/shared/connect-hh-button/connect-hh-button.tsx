"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import Image from "next/image";

export function ConnectHHButton() {
  const { data: session } = useSession();

  // if (session?.user?.hhRefreshToken) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signIn("headhunter")}
      className="flex items-center space-x-2"
    >
      <Image src={"/hh.png"} alt="headhunter" width={40} height={40} />
      <span>Connect HeadHunter</span>
    </Button>
  );
}
