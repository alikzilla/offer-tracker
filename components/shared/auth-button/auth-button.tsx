"use client";

import { Button } from "@/components/ui";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const AuthButton = () => {
  const { status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <Button onClick={() => signIn("google")} variant={"outline"}>
      <Image src={"/google.png"} alt="google logo" width={20} height={20} />
      <span>Sign In With Google</span>
    </Button>
  );
};

export default AuthButton;
