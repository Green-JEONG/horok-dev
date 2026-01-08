"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import MyPageDrawer from "@/components/mypage/MyPageDrawer";
import Image from "next/image";

export default function HeaderActions() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  console.log("SESSION:", session);
  console.log("STATUS:", status);

  const isLoggedIn = status === "authenticated";
  // const isAdmin = session?.user?.role === "ADMIN";

  if (!isLoggedIn) {
    return (              
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          로그인
        </Button>

        <LoginModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* {isAdmin && (
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">관리자</Link>
        </Button>
      )} */}

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => setOpen(true)}
      >
        <Image src="/alarm.svg" alt="alarm" width={20} height={20} />
      </Button>

      <MyPageDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
