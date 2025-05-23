"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { AuthButton } from "@/components/shared";
import { ChevronDown, User } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full flex items-center justify-between p-4 border-b shadow-sm fixed top-0 bg-white z-10">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">OfferTracker</span>
      </div>
      <div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-5 w-5" />
                {session.user?.name || "Profile"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/api/auth/signout" className="w-full">
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <AuthButton />
        )}
      </div>
    </header>
  );
};

export default Header;
