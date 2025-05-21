"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-2">
        <p>Hello, {session.user?.name || session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Sign In
    </button>
  );
}
